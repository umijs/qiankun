import { Deferred, warn } from '@qiankunjs/shared';
import { AppOrParcelStatus, mountRootParcel, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { IdleInstanceCache } from '../core/idleInstanceCache';
import loadApp, { type ParcelConfigObjectGetter } from '../core/loadApp';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../types';
import { toArray } from '../utils';
import { start, started } from './registerMicroApps';

interface Instance {
  container: HTMLElement;
  parcel?: MicroApp;
  finished: Deferred<void>;
  unmountRequestedAt?: number;
  unmounting?: Promise<null>;
}

/** One evaluated copy of an app. Its handles take turns mounting the same sandbox. */
interface Generation {
  name: string;
  entry: string;
  container?: HTMLElement;
  config?: Promise<ParcelConfigObjectGetter>;
  getter?: ParcelConfigObjectGetter;
  queue: Instance[];
  idleSince: number;
  retired: boolean;
}

const generations = new Map<string, Generation[]>();
let idleTick = 0;
const idleCache = new IdleInstanceCache<Generation>(retire);

/** Ready to reuse or dispose: no loading writes, lifecycle work, or container occupancy remain. */
function isIdle(generation: Generation): boolean {
  return Boolean(
    generation.getter &&
    !generation.queue.length &&
    !generation.getter.loadPhaseOpen &&
    !generation.getter.occupiesContainer,
  );
}

function refresh(generation: Generation): void {
  if (!isIdle(generation)) return;
  if (!generation.retired) {
    idleCache.add(generation);
    return;
  }
  const getter = generation.getter!;
  // Inactive handles may retain this tombstone, but never the sandbox or its load-time closures.
  generation.getter = undefined;
  generation.config = undefined;
  generation.container = undefined;
  void Promise.resolve()
    .then(() => getter.dispose())
    .catch((error: unknown) => {
      warn(`failed to dispose cached app ${generation.name}`, error);
    });
}

function retire(generation: Generation): void {
  if (!generation.retired) {
    generation.retired = true;
    idleCache.delete(generation);
    const list = generations.get(generation.name)!;
    list.splice(list.indexOf(generation), 1);
    if (!list.length) generations.delete(generation.name);
  }
  refresh(generation);
}

function leaveQueue(generation: Generation, instance: Instance, failure?: { error: unknown }): void {
  const index = generation.queue.indexOf(instance);
  if (index < 0) return;
  generation.queue.splice(index, 1);
  if (failure) instance.finished.reject(failure.error);
  else instance.finished.resolve();
  if (!generation.queue.length) generation.idleSince = ++idleTick;
  refresh(generation);
}

/** Only completed mounts explicitly asked to unmount may be shared across elements. */
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

function drainingSince(generation: Generation): number {
  return Math.max(...generation.queue.map(({ unmountRequestedAt }) => unmountRequestedAt ?? 0));
}

function findGeneration(name: string, entry: string, container: HTMLElement): Generation | undefined {
  const candidates = (generations.get(name) ?? []).filter((generation) => generation.entry === entry);
  const sameContainer = candidates.find(
    (generation) =>
      generation.container === container || generation.queue.some((instance) => instance.container === container),
  );
  if (sameContainer) return sameContainer;
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
  let mountApp = app;
  let preferred: Generation | undefined;
  let current: MicroApp | undefined;
  let instance: Instance | undefined;
  let status = AppOrParcelStatus.NOT_MOUNTED;
  let supportsUpdate = false;

  function mountCycle(): MicroApp {
    const { name, entry, container, props } = mountApp;
    // Expiration wins over lookup, including the same-element and old-handle fast paths.
    idleCache.prune();
    let generation = preferred && !preferred.retired ? preferred : findGeneration(name, entry, container);
    const cached = Boolean(generation);
    if (!generation) {
      generation = { name, entry, container, queue: [], idleSince: 0, retired: false };
      const created = generation;
      const list = generations.get(name) ?? [];
      list.push(created);
      generations.set(name, list);
      created.config = loadApp(mountApp, configuration, lifeCycles);
      void created.config.then(
        (getter) => {
          created.getter = getter;
          void getter.loadPhaseSettled.then(() => refresh(created));
        },
        () => retire(created),
      );
    }
    const owner = generation;
    preferred = owner;
    // Reserve synchronously, before any await or callback can run an eviction sweep.
    idleCache.delete(owner);
    owner.container = container;
    const cycle: Instance = { container, finished: new Deferred<void>() };
    void cycle.finished.promise.catch(() => undefined);
    owner.queue.push(cycle);
    instance = cycle;

    const loading = async (): Promise<ParcelConfigObject> => {
      const getter = await owner.config!;
      const config = getter(container, mountApp);
      return {
        ...config,
        ...(cached ? { bootstrap: async () => {} } : {}),
        mount: [
          async () => {
            const predecessors = owner.queue.slice(0, owner.queue.indexOf(cycle));
            await Promise.all(predecessors.map((previous) => previous.finished.promise));
          },
          ...toArray(config.mount),
        ],
      };
    };
    const parcel = mountRootParcel(loading, { domElement: document.createElement('div'), ...props });
    current = parcel;
    cycle.parcel = parcel;
    const { loadPromise, bootstrapPromise, mountPromise, unmountPromise } = parcel;
    // Remounts create private parcels. Their phase rejections must be observed even when the
    // caller only awaits mount()/unmount(); the handle's public promises describe its first cycle.
    for (const phase of [loadPromise, bootstrapPromise, unmountPromise]) void phase.catch(() => undefined);
    void loadPromise.then(
      () => {
        if (current === parcel) supportsUpdate = typeof parcel.update === 'function';
      },
      () => undefined,
    );
    void mountPromise.catch((error: unknown) => {
      status = parcel.getStatus();
      // single-spa never unmounts a failed load/bootstrap; a failed mount may run cleanup first.
      retire(owner);
      leaveQueue(owner, cycle, { error });
      if (current === parcel) {
        current = undefined;
        instance = undefined;
      }
    });
    return parcel;
  }

  if (!started) start();
  const first = mountCycle();
  const firstFinished = instance!.finished.promise;
  // Preserve Parcel's one-shot phase promises. Gate successful first unmount on our bookkeeping
  // so awaiting unmountPromise is sufficient before calling mount() again on this handle.
  const promises = {
    loadPromise: first.loadPromise,
    bootstrapPromise: first.bootstrapPromise,
    mountPromise: first.mountPromise,
    unmountPromise: first.unmountPromise.then(() => firstFinished).then(() => null),
  };
  void promises.unmountPromise.catch(() => undefined);

  const update = async (props: ObjectType): Promise<unknown> => {
    const parcel = current;
    if (!parcel?.update) throw new TypeError(`App ${app.name} is not mounted with an update lifecycle`);
    if (instance?.unmountRequestedAt !== undefined) throw new TypeError(`App ${app.name} is unmounting`);
    try {
      const result: unknown = await parcel.update(props);
      mountApp = { ...mountApp, props: props as T };
      return result;
    } catch (error) {
      status = parcel.getStatus();
      if (preferred && instance) {
        retire(preferred);
        leaveQueue(preferred, instance, { error });
      }
      current = undefined;
      instance = undefined;
      throw error;
    }
  };

  return {
    mount() {
      if (current || status !== AppOrParcelStatus.NOT_MOUNTED) {
        return Promise.reject(
          new TypeError(`Cannot mount app ${app.name} in status ${current?.getStatus() ?? status}`),
        );
      }
      return mountCycle().mountPromise;
    },
    unmount() {
      const parcel = current;
      const cycle = instance;
      const owner = preferred;
      if (!parcel || !cycle || !owner) return Promise.reject(new TypeError(`App ${app.name} is not mounted`));
      if (cycle.unmounting) return cycle.unmounting;
      cycle.unmountRequestedAt = ++idleTick;
      cycle.unmounting = parcel.unmount().then(
        (value) => {
          status = AppOrParcelStatus.NOT_MOUNTED;
          if (current === parcel) {
            current = undefined;
            instance = undefined;
          }
          leaveQueue(owner, cycle);
          return value;
        },
        (error: unknown) => {
          status = parcel.getStatus();
          retire(owner);
          leaveQueue(owner, cycle, { error });
          if (current === parcel) {
            current = undefined;
            instance = undefined;
          }
          throw error;
        },
      );
      return cycle.unmounting;
    },
    get update() {
      return supportsUpdate ? update : undefined;
    },
    getStatus() {
      return current?.getStatus() ?? status;
    },
    get loadPromise() {
      return promises.loadPromise;
    },
    get bootstrapPromise() {
      return promises.bootstrapPromise;
    },
    get mountPromise() {
      return promises.mountPromise;
    },
    get unmountPromise() {
      return promises.unmountPromise;
    },
    get _parcel() {
      if (!current) throw new TypeError(`App ${app.name} has no active internal parcel`);
      return current._parcel;
    },
  };
}
