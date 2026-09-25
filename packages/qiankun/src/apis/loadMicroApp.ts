import { AppOrParcelStatus, mountRootParcel, type ParcelConfigObject } from '@qiankunjs/single-spa';
import loadApp, { type ParcelConfigObjectGetter } from '../core/loadApp';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../types';
import { toArray } from '../utils';
import { start, started } from './registerMicroApps';

interface Instance {
  container: HTMLElement;
  parcel?: MicroApp;
  /** Tick at which unmount was requested through the handle, if it was. */
  unmountRequestedAt?: number;
}

/**
 * One evaluated copy of an app: a single loadApp run and the sandbox it created. Its instances
 * (one per loadMicroApp call) take turns mounting it, one container at a time.
 */
interface Generation {
  name: string;
  entry: string;
  /** The container of the most recent instance. */
  container: HTMLElement;
  config: Promise<ParcelConfigObjectGetter>;
  /** Set once the load succeeded. */
  getter?: ParcelConfigObjectGetter;
  /**
   * Instances that are mounted or waiting to mount, in call order. A generation owns one sandbox
   * and one set of lifecycles, so it can only be mounted into one container at a time; the
   * container gate cannot serialize that, since two instances may target different elements.
   */
  queue: Instance[];
  /** Tick at which the queue last drained, so the most recently idle generation is reused first. */
  idleSince: number;
}

/**
 * Generations stay cached until the page goes away, like the XPath-keyed cache before them. Each
 * name keeps at most as many generations as it ever had instances mounted at the same time.
 */
const generations = new Map<string, Generation[]>();
/** Orders idle and draining generations by recency. */
let idleTick = 0;

function evict(generation: Generation): void {
  const list = generations.get(generation.name);
  const index = list?.indexOf(generation) ?? -1;
  if (index >= 0) list!.splice(index, 1);
}

function leaveQueue(generation: Generation, instance: Instance): void {
  const index = generation.queue.indexOf(instance);
  if (index < 0) return;
  generation.queue.splice(index, 1);
  if (!generation.queue.length) generation.idleSince = ++idleTick;
}

/** Loaded, nothing mounted or waiting to mount, and no longer writing to any container. */
function isIdle(generation: Generation): boolean {
  return Boolean(generation.getter && !generation.queue.length && !generation.getter.occupiesContainer);
}

/**
 * Draining: loaded, its entry no longer streaming, and every queued instance already mounted and
 * asked to unmount — nothing waits to mount and no mount is in flight, only teardown remains. The
 * unmounting predecessor may still hold its mount hold ②; that is fine, since a newcomer targets
 * another container and waits for the predecessor in the generation queue anyway. An open load
 * phase ① is not: the entry is still being written into the old container.
 */
function isDraining(generation: Generation): boolean {
  return Boolean(
    generation.getter &&
    !generation.getter.loadPhaseOpen &&
    generation.queue.length &&
    generation.queue.every(({ parcel, unmountRequestedAt }) => {
      const status = parcel?.getStatus();
      return (
        unmountRequestedAt !== undefined &&
        (status === AppOrParcelStatus.MOUNTED || status === AppOrParcelStatus.UNMOUNTING)
      );
    }),
  );
}

/** The latest unmount request among the queued instances of a draining generation. */
function drainingSince(generation: Generation): number {
  return Math.max(...generation.queue.map(({ unmountRequestedAt }) => unmountRequestedAt ?? 0));
}

/**
 * Element identity serializes, the name reuses. A call joins the generation already working on
 * the same element (so it queues behind it instead of racing it), otherwise takes over the most
 * recently idle generation of the same app — a component that renders a fresh element on every
 * mount keeps its warm remount — then the most recently draining one, queueing behind its
 * unmount (a caller that swaps elements unmounts the old one before loading into the new one),
 * and only loads from scratch when every copy is busy elsewhere. A generation that stays mounted
 * or is about to mount is never shared across elements: that would put one sandbox into two
 * containers at once.
 */
function findGeneration(name: string, entry: string, container: HTMLElement): Generation | undefined {
  const candidates = (generations.get(name) ?? []).filter((generation) => generation.entry === entry);
  const sameContainer = candidates.find(
    (generation) =>
      generation.container === container || generation.queue.some((instance) => instance.container === container),
  );
  if (sameContainer) return sameContainer;
  // An idle generation mounts right away, so every idle one comes before any draining one.
  return [
    ...candidates.filter(isIdle).sort((a, b) => b.idleSince - a.idleSince),
    ...candidates.filter(isDraining).sort((a, b) => drainingSince(b) - drainingSince(a)),
  ][0];
}

export function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp {
  const { props, name, entry, container } = app;

  let generation = findGeneration(name, entry, container);
  const cached = Boolean(generation);
  if (!generation) {
    const created: Generation = {
      name,
      entry,
      container,
      config: loadApp(app, configuration, lifeCycles),
      queue: [],
      idleSince: 0,
    };
    created.config.then(
      (getter) => {
        created.getter = getter;
      },
      // A failed load leaves nothing to reuse, so the same name can retry from scratch.
      () => evict(created),
    );
    generation = created;
    let list = generations.get(name);
    if (!list) {
      list = [];
      generations.set(name, list);
    }
    list.push(created);
  }
  generation.container = container;
  const owner = generation;

  const instance: Instance = { container };
  const wrapParcelConfigForRemount = (config: ParcelConfigObject): ParcelConfigObject => ({
    ...config,
    // Instances of one generation share one sandbox, so they must mount one after another. The
    // container gate only serializes a single element, and a cached getter can still adopt its
    // original load hold while the entry stream is open, so wait for the predecessors here.
    mount: [
      async () => {
        const predecessors = owner.queue.slice(0, owner.queue.indexOf(instance));
        await Promise.all(
          predecessors
            .filter(
              ({ parcel }) =>
                parcel &&
                parcel.getStatus() !== AppOrParcelStatus.LOAD_ERROR &&
                parcel.getStatus() !== AppOrParcelStatus.SKIP_BECAUSE_BROKEN,
            )
            .map(({ parcel }) => parcel!.unmountPromise),
        );
      },
      ...toArray(config.mount),
    ],
    // A cached micro app has already bootstrapped.
    bootstrap: () => Promise.resolve(),
  });

  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const getter = await owner.config;
    return cached ? wrapParcelConfigForRemount(getter(container)) : getter(container);
  };

  if (!started) {
    // We need to invoke start method of single-spa as the popstate event should be dispatched while the main app calling pushState/replaceState automatically,
    // but in single-spa it will check the start status before it dispatch popstate
    // see https://github.com/single-spa/single-spa/blob/f28b5963be1484583a072c8145ac0b5a28d91235/src/navigation/navigation-events.js#L101
    // ref https://github.com/umijs/qiankun/pull/1071
    start();
  }

  owner.queue.push(instance);
  const mountedApp = mountRootParcel(memorizedLoadingFn, {
    domElement: document.createElement('div'),
    ...props,
  });
  instance.parcel = mountedApp;
  // Recorded synchronously: single-spa only flips the status to UNMOUNTING a few ticks later, and
  // a caller swapping elements loads into the new one right after asking the old to unmount.
  const unmountParcel = mountedApp.unmount.bind(mountedApp);
  mountedApp.unmount = () => {
    instance.unmountRequestedAt = ++idleTick;
    return unmountParcel();
  };

  // A generation whose lifecycles never bootstrapped cannot be reused: a cached instance skips
  // bootstrap. Load failures reject here as well and are already evicted above.
  if (!cached) mountedApp.bootstrapPromise.catch(() => evict(owner));

  const cleanup = () => leaveQueue(owner, instance);

  // A source/bootstrap/mount failure never enters single-spa's unmount lifecycle. It must still
  // leave this generation's queue, or a later instance would wait for it forever.
  mountedApp.mountPromise.catch(cleanup);
  mountedApp.unmountPromise.then(cleanup).catch(cleanup);

  return mountedApp;
}
