import { AppOrParcelStatus, mountRootParcel, type Parcel, type ParcelConfigObject } from '@qiankunjs/single-spa';
import { Deferred } from '@qiankunjs/shared';
import loadApp, { type ParcelConfigObjectGetter } from '../core/loadApp';
import { QiankunError } from '../error';
import { type AppConfiguration, type LifeCycles, type LoadableApp, type MicroApp, type ObjectType } from '../types';
import { toArray, withAbortSignal } from '../utils';
import { start, started } from './registerMicroApps';

interface Instance {
  parcel?: Parcel;
  config?: ParcelConfigObject;
  props: ObjectType;
  /**
   * Every operation requested through the handle or already entered by single-spa, mapped to
   * whether its failure is a teardown failure that unload must report. Unload drains them all.
   */
  operations: Map<Promise<unknown>, boolean>;
  /** The public mount in flight, so a repeated request joins it instead of queueing twice. */
  mounting?: Promise<null>;
  active: boolean;
  done: Deferred<void>;
}

interface Generation {
  name: string;
  stopped: AbortController;
  loading: AbortController;
  config?: Promise<ParcelConfigObjectGetter>;
  dispose?: () => Promise<void>;
  unloading?: Promise<void>;
  instances: Set<Instance>;
  queue: Instance[];
  evict: () => void;
}

const generations = new WeakMap<HTMLElement, Map<string, Generation>>();

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

function track<T>(instance: Instance, operation: Promise<T>, teardown = false): Promise<T> {
  instance.operations.set(operation, teardown);
  // Registered before any drain awaits the operation, so a settled one is gone by then.
  const settle = () => instance.operations.delete(operation);
  void operation.then(settle, settle);
  return operation;
}

function finish(instance: Instance, generation: Generation): void {
  instance.active = false;
  instance.done.resolve();
  const index = generation.queue.indexOf(instance);
  if (index >= 0) generation.queue.splice(index, 1);
}

async function invoke(hooks: ParcelConfigObject['mount'] | undefined, props: ObjectType): Promise<void> {
  if (hooks) {
    for (const hook of toArray(hooks)) await hook(props as Parameters<typeof hook>[0]);
  }
}

function unloadGeneration(generation: Generation): Promise<void> {
  if (generation.unloading) return generation.unloading;
  generation.evict();
  generation.evict = () => {};
  generation.stopped.abort(unloadedError(generation.name));
  // Framework waits (container gate, entry streaming, HTML replay) cancel right away. Entered
  // application lifecycles cannot be pre-empted, so they are drained below instead.
  generation.loading.abort(generation.stopped.signal.reason);
  generation.unloading = (async () => {
    let failure: unknown;
    try {
      for (const instance of generation.instances) {
        const parcel = instance.parcel;
        if (!parcel) continue;
        // An entered bootstrap, a same-tick public unmount, or a retired handle's remount still
        // owns the sandbox and container. Teardown starts only after all of them settle; queued
        // siblings settle promptly because their predecessor waits observe the stopped signal.
        while (instance.operations.size) {
          const pending = [...instance.operations];
          const results = await Promise.allSettled(pending.map(([operation]) => operation));
          results.forEach((result, index) => {
            if (result.status === 'rejected' && pending[index][1]) failure ??= result.reason;
          });
        }
        // A cancelled mount resolves as a no-op MOUNTED parcel; unmount it so single-spa drops
        // it from the root parcel registry.
        if (parcel.getStatus() === AppOrParcelStatus.MOUNTED) {
          try {
            await parcel.unmount();
          } catch (error) {
            failure ??= error;
          }
        }
      }
    } finally {
      try {
        await generation.dispose?.();
      } catch (error) {
        failure ??= error;
      } finally {
        for (const instance of generation.instances) {
          finish(instance, generation);
          instance.config = undefined;
          instance.parcel = undefined;
          instance.mounting = undefined;
          instance.operations.clear();
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
  const generation = generations.get(container)?.get(name);
  return generation ? unloadGeneration(generation) : Promise.resolve();
}

export function loadMicroApp<T extends ObjectType>(
  app: LoadableApp<T>,
  configuration?: AppConfiguration,
  lifeCycles?: LifeCycles<T>,
): MicroApp {
  const { props, name, container } = app;
  let byName = generations.get(container);
  if (!byName) {
    byName = new Map();
    generations.set(container, byName);
  }
  let generation = byName.get(name);
  const cached = Boolean(generation);
  if (!generation) {
    const owner: Generation = {
      name,
      stopped: new AbortController(),
      loading: new AbortController(),
      instances: new Set(),
      queue: [],
      evict: () => {
        if (byName.get(name) === owner) byName.delete(name);
      },
    };
    generation = owner;
    byName.set(name, owner);
    owner.config = observed(
      loadApp(app, configuration, lifeCycles, {
        signal: owner.loading.signal,
        onDispose: (dispose) => {
          owner.dispose = dispose;
        },
      }).catch((error: unknown) => {
        owner.evict();
        throw error;
      }),
    );
  }
  if (!started) start();
  return createHandle(generation, container, { domElement: document.createElement('div'), ...props }, cached);
}

function createHandle(generation: Generation, container: HTMLElement, props: ObjectType, cached: boolean): MicroApp {
  const instance: Instance = { props, operations: new Map(), active: false, done: new Deferred<void>() };
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
        // Cached getters share an adoptable load hold. Serialize same-generation mounts before
        // entering loadApp, including remounts through previously retained handles. `done` only
        // resolves, so this wait can end early solely through unload.
        const predecessors = generation.queue.slice(0, generation.queue.indexOf(instance));
        await untilStopped(Promise.all(predecessors.map((previous) => previous.done.promise)), signal).catch(
          () => undefined,
        );
        if (signal.aborted) return;
        instance.active = true;
        await invoke(instance.config?.mount, hookProps);
      },
      unmount: async (hookProps) => {
        try {
          if (instance.active) await invoke(instance.config?.unmount, hookProps);
        } finally {
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
  // The initial chain covers an entered bootstrap, which unload must wait for as well.
  void track(instance, parcel.mountPromise);
  // Failed initial loads and mounts must not leave a predecessor in the queue forever.
  void parcel.mountPromise.catch(() => finish(instance, generation));
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
      if (instance.mounting) return instance.mounting;
      if (instance.parcel!.getStatus() === AppOrParcelStatus.NOT_MOUNTED && !generation.queue.includes(instance)) {
        instance.done = new Deferred<void>();
        generation.queue.push(instance);
      }
      const operation = track(instance, instance.parcel!.mount());
      instance.mounting = operation;
      const settle = () => {
        if (instance.mounting === operation) instance.mounting = undefined;
      };
      void operation.then(settle, settle);
      return operation;
    },
    unmount: () => (signal.aborted ? Promise.resolve(null) : track(instance, instance.parcel!.unmount(), true)),
    get update() {
      return instance.parcel?.update
        ? (nextProps: ObjectType) => {
            if (signal.aborted) return Promise.reject(unloadedError(generation.name));
            return observed(track(instance, instance.parcel!.update!(nextProps)));
          }
        : undefined;
    },
    unload: () => unloadGeneration(generation),
  };
}
