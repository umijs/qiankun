import { AppOrParcelStatus, mountRootParcel, type Parcel, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { Deferred } from '@qiankunjs/shared';
import loadApp, { type ParcelConfigObjectGetter } from '../core/loadApp';
import { QiankunError } from '../error';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../types';
import { toArray, withAbortSignal } from '../utils';
import { start, started } from './registerMicroApps';

interface Instance {
  container: HTMLElement;
  parcel?: Parcel;
  config?: ParcelConfigObject;
  props: ObjectType;
  mountTask?: Promise<void>;
  operation?: Promise<unknown>;
  unmountTask?: Promise<void>;
  updateTask?: Promise<unknown>;
  active: boolean;
  done: Deferred<void>;
  /** Tick at which unmount was requested through the handle, if it was since the last mount. */
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
  /** Set once the load succeeded. */
  getter?: ParcelConfigObjectGetter;
  /** Tick at which the queue last drained, so the most recently idle generation is reused first. */
  idleSince: number;
  stopped: AbortController;
  loading: AbortController;
  config?: Promise<ParcelConfigObjectGetter>;
  dispose?: () => Promise<void>;
  unloading?: Promise<void>;
  instances: Set<Instance>;
  /**
   * Instances that are mounted or waiting to mount, in call order. A generation owns one sandbox
   * and one set of lifecycles, so it can only be mounted into one container at a time; the
   * container gate cannot serialize that, since two instances may target different elements.
   */
  queue: Instance[];
}

/**
 * Generations stay cached until they are unloaded. Each name keeps at most as many generations
 * as it ever had instances mounted at the same time.
 */
const generations = new Map<string, Generation[]>();
/** Orders idle and draining generations by recency. */
let idleTick = 0;

function evict(generation: Generation): void {
  const list = generations.get(generation.name);
  const index = list?.indexOf(generation) ?? -1;
  if (index >= 0) list!.splice(index, 1);
}

/** Loaded, nothing mounted or waiting to mount, and no longer writing to any container. */
function isIdle(generation: Generation): boolean {
  return Boolean(
    generation.getter && !generation.unloading && !generation.queue.length && !generation.getter.occupiesContainer,
  );
}

/**
 * Draining: loaded, not being unloaded, its entry no longer streaming, and every queued instance
 * mounted and asked to unmount — nothing waits to mount and no mount is in flight, only teardown
 * remains. The unmounting predecessor may still hold its mount hold ②; that is fine, since a
 * newcomer targets another container and waits for the predecessor in the generation queue
 * anyway. An open load phase ① is not: the entry is still being written into the old container.
 */
function isDraining(generation: Generation): boolean {
  return Boolean(
    generation.getter &&
    !generation.unloading &&
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

function unloadedError(name: string): QiankunError {
  return new QiankunError(`App ${name} has been unloaded; call loadMicroApp to create a new instance`);
}

/** Observe internal parcel promises while preserving their rejection for callers. */
function observed<T>(promise: Promise<T>): Promise<T> {
  void promise.catch(() => undefined);
  return promise;
}

function untilStopped<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return observed(withAbortSignal(promise, signal));
}

function finish(instance: Instance, generation: Generation): void {
  instance.active = false;
  instance.done.resolve();
  const index = generation.queue.indexOf(instance);
  if (index < 0) return;
  generation.queue.splice(index, 1);
  if (!generation.queue.length) generation.idleSince = ++idleTick;
}

async function invoke(hooks: ParcelConfigObject['mount'] | undefined, props: ObjectType): Promise<void> {
  if (hooks) {
    for (const hook of toArray(hooks)) await hook(props as Parameters<typeof hook>[0]);
  }
}

function unloadGeneration(generation: Generation): Promise<void> {
  if (generation.unloading) return generation.unloading;
  evict(generation);
  generation.stopped.abort(unloadedError(generation.name));
  generation.unloading = (async () => {
    let failure: unknown;
    try {
      for (const instance of generation.instances) {
        const parcel = instance.parcel;
        if (!parcel) continue;
        if (instance.updateTask) await instance.updateTask.catch(() => undefined);
        if (instance.mountTask) {
          // The chain may still be waiting at loadApp's container gate or HTML replay.
          // Abort those waits before draining a started mount and its failure cleanup.
          generation.loading.abort(generation.stopped.signal.reason);
          await instance.operation?.catch(() => undefined);
        }
        if (instance.unmountTask) {
          await instance.unmountTask.catch((error: unknown) => {
            failure ??= error;
          });
        } else if (parcel.getStatus() === AppOrParcelStatus.MOUNTED) {
          try {
            await parcel.unmount();
          } catch (error) {
            failure ??= error;
          }
        } else if (!instance.active) {
          // A cancelled queued parcel completes its no-op mount, then removes itself from
          // single-spa's root parcel registry. Do not wait for its mountPromise here.
          void parcel.mountPromise.then(() => parcel.unmount()).catch(() => undefined);
        }
      }
    } finally {
      generation.loading.abort(generation.stopped.signal.reason);
      try {
        await generation.dispose?.();
      } catch (error) {
        failure ??= error;
      } finally {
        for (const instance of generation.instances) {
          finish(instance, generation);
          instance.config = undefined;
          instance.parcel = undefined;
          instance.operation = undefined;
          for (const key of Object.keys(instance.props)) delete instance.props[key];
        }
        generation.instances.clear();
        generation.queue.length = 0;
        generation.config = undefined;
        generation.dispose = undefined;
      }
    }
    if (failure !== undefined) throw failure instanceof Error ? failure : new QiankunError('App teardown failed');
  })();
  return generation.unloading;
}

/** Permanently unload one manual application's entire name/container generation. */
export function unloadMicroApp(name: string, container: HTMLElement): Promise<void> {
  const generation = generations.get(name)?.find((candidate) => candidate.container === container);
  return generation ? unloadGeneration(generation) : Promise.resolve();
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
    const owner: Generation = {
      name,
      entry,
      container,
      idleSince: 0,
      stopped: new AbortController(),
      loading: new AbortController(),
      instances: new Set(),
      queue: [],
    };
    generation = owner;
    let list = generations.get(name);
    if (!list) {
      list = [];
      generations.set(name, list);
    }
    list.push(owner);
    owner.config = observed(
      loadApp(app, configuration, lifeCycles, {
        signal: owner.loading.signal,
        onDispose: (dispose) => {
          owner.dispose = dispose;
        },
      }).then(
        (getter) => {
          owner.getter = getter;
          return getter;
        },
        (error: unknown) => {
          // A failed load leaves nothing to reuse, so the same name can retry from scratch.
          evict(owner);
          throw error;
        },
      ),
    );
  }
  generation.container = container;
  if (!started) start();
  return createHandle(generation, container, { domElement: document.createElement('div'), ...props }, cached);
}

function createHandle(generation: Generation, container: HTMLElement, props: ObjectType, cached: boolean): MicroApp {
  const instance: Instance = { container, props, active: false, done: new Deferred<void>() };
  generation.instances.add(instance);
  generation.queue.push(instance);
  const { signal } = generation.stopped;
  const parcel = mountRootParcel(async () => {
    const getter = await untilStopped(generation.config!, signal);
    signal.throwIfAborted();
    instance.config = getter(container);
    return {
      name: generation.name,
      bootstrap: async (hookProps) => {
        if (!cached && !signal.aborted) await invoke(instance.config?.bootstrap, hookProps);
      },
      mount: async (hookProps) => {
        try {
          // Cached getters share an adoptable load hold. Serialize same-generation mounts
          // before entering loadApp, including remounts through previously retained handles.
          const predecessors = generation.queue.slice(0, generation.queue.indexOf(instance));
          await untilStopped(Promise.all(predecessors.map((previous) => previous.done.promise)), signal);
        } catch {
          if (!signal.aborted) throw new QiankunError(`App ${generation.name} failed waiting for its container`);
        }
        if (signal.aborted) return;
        instance.active = true;
        instance.mountTask = invoke(instance.config?.mount, hookProps);
        try {
          await instance.mountTask;
        } finally {
          instance.mountTask = undefined;
        }
      },
      unmount: async (hookProps) => {
        instance.unmountTask = instance.active ? invoke(instance.config?.unmount, hookProps) : Promise.resolve();
        try {
          await instance.unmountTask;
        } finally {
          instance.unmountTask = undefined;
          finish(instance, generation);
        }
      },
      ...(instance.config.update
        ? {
            update: async (hookProps: ObjectType) => {
              signal.throwIfAborted();
              await invoke(instance.config?.update, hookProps);
            },
          }
        : {}),
    };
  }, props);
  instance.parcel = parcel;
  instance.operation = parcel.mountPromise;
  // Failed initial loads and mounts must not leave a predecessor in the queue forever.
  void parcel.mountPromise.catch(() => finish(instance, generation));
  // A generation whose lifecycles never bootstrapped cannot be reused: a cached instance skips
  // bootstrap. Load failures reject here as well and are already evicted above.
  if (!cached) void parcel.bootstrapPromise.catch(() => evict(generation));
  void observed(parcel.loadPromise);
  void observed(parcel.bootstrapPromise);
  void observed(parcel.unmountPromise);
  return {
    get _parcel() {
      if (!instance.parcel) throw unloadedError(generation.name);
      return instance.parcel._parcel;
    },
    getStatus: () => (signal.aborted ? AppOrParcelStatus.NOT_LOADED : instance.parcel!.getStatus()),
    loadPromise: untilStopped(parcel.loadPromise, signal),
    bootstrapPromise: untilStopped(parcel.bootstrapPromise, signal),
    mountPromise: untilStopped(parcel.mountPromise, signal),
    unmountPromise: observed(parcel.unmountPromise),
    mount: async () => {
      signal.throwIfAborted();
      if (instance.parcel!.getStatus() === AppOrParcelStatus.NOT_MOUNTED) {
        instance.done = new Deferred<void>();
        instance.unmountRequestedAt = undefined;
        generation.queue.push(instance);
      }
      const operation = instance.parcel!.mount();
      instance.operation = operation;
      return operation;
    },
    unmount: () => {
      if (signal.aborted) return Promise.resolve(null);
      // Recorded synchronously: single-spa only flips the status to UNMOUNTING a few ticks
      // later, and a caller swapping elements loads into the new one right after that.
      instance.unmountRequestedAt = ++idleTick;
      return instance.parcel!.unmount();
    },
    get update() {
      return instance.parcel?.update
        ? (nextProps: ObjectType) => {
            if (signal.aborted) return Promise.reject(unloadedError(generation.name));
            const operation: Promise<unknown> = instance.parcel!.update!(nextProps);
            instance.updateTask = operation;
            void operation
              .finally(() => {
                if (instance.updateTask === operation) instance.updateTask = undefined;
              })
              .catch(() => undefined);
            return operation;
          }
        : undefined;
    },
    unload: () => unloadGeneration(generation),
  };
}
