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
  /**
   * Every operation requested through the handle or already entered by single-spa, mapped to
   * whether its failure is a teardown failure that unload must report. Unload drains them all.
   */
  operations: Map<Promise<unknown>, boolean>;
  /**
   * Tail of the public mount and unmount requests, starting with the initial mount. Each request
   * runs once the ones before it settled, so the last request decides the final state.
   */
  lifecycle: Promise<unknown>;
  /** The latest lifecycle request; the initial mount counts as one. */
  lastRequest: 'mount' | 'unmount';
  /**
   * Why the latest mount attempt failed (its load, bootstrap or mount), cleared once a mount
   * succeeds. An unmount with nothing to unmount carries it as the cause.
   */
  failure?: unknown;
  active: boolean;
  done: Deferred<void>;
  /** Tick of the latest unmount requested through the handle, to order draining generations. */
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
  /** Settles with the first instance's bootstrap; later instances share its outcome. */
  bootstrapped: Deferred<void>;
  /** Tick at which the queue last drained, so the most recently idle generation is reused first. */
  idleSince: number;
  stopped: AbortController;
  loading: AbortController;
  config?: Promise<ParcelConfigObjectGetter>;
  dispose?: () => Promise<void>;
  unloading?: Promise<void>;
  /**
   * Instances that may still own work unload has to drain or unmount: queued ones and those with
   * operations in flight. A retired handle drops out and rejoins when it is mounted again, so a
   * generation reused across many containers does not accumulate every handle it ever served.
   */
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

/**
 * Loaded, not being unloaded, no instance mounted, queued or with an operation in flight, and no
 * longer writing to any container.
 */
function isIdle(generation: Generation): boolean {
  return Boolean(
    generation.getter && !generation.unloading && !generation.instances.size && !generation.getter.occupiesContainer,
  );
}

/**
 * Draining: loaded, not being unloaded, its entry no longer streaming, and the last request of
 * every instance it still tracks is an unmount — an instance still mounting counts once it was
 * asked to unmount, since its unmount runs right after that mount. The unmounting predecessor may
 * still hold its mount hold ②; that is fine, since a newcomer targets another container and waits
 * for the predecessor in the generation queue anyway. An open load phase ① is not: the entry is
 * still being written into the old container.
 */
function isDraining(generation: Generation): boolean {
  return Boolean(
    generation.getter &&
    !generation.unloading &&
    !generation.getter.loadPhaseOpen &&
    generation.instances.size &&
    [...generation.instances].every(({ lastRequest }) => lastRequest === 'unmount'),
  );
}

/** The latest unmount request among the instances of a draining generation. */
function drainingSince(generation: Generation): number {
  return Math.max(...[...generation.instances].map(({ unmountRequestedAt }) => unmountRequestedAt ?? 0));
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
  return new QiankunError(`App ${name} has been unloaded; call loadMicroApp to create a new instance`, 'app-unloaded');
}

function notMountedError(name: string, failure: unknown): QiankunError {
  return new QiankunError(
    `App ${name} is not mounted, so there is nothing to unmount`,
    'app-not-mounted',
    failure === undefined ? undefined : { cause: failure },
  );
}

/** Observe internal parcel promises while preserving their rejection for callers. */
function observed<T>(promise: Promise<T>): Promise<T> {
  void promise.catch(() => undefined);
  return promise;
}

function untilStopped<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return observed(withAbortSignal(promise, signal));
}

/** Drop an instance that neither waits for its turn nor has work in flight. */
function retire(instance: Instance, generation: Generation): void {
  if (instance.operations.size || generation.queue.includes(instance)) return;
  generation.instances.delete(instance);
  if (!generation.instances.size) generation.idleSince = ++idleTick;
}

function track<T>(instance: Instance, generation: Generation, operation: Promise<T>, teardown = false): Promise<T> {
  generation.instances.add(instance);
  instance.operations.set(operation, teardown);
  // Registered before any drain awaits the operation, so a settled one is gone by then.
  const settle = () => {
    instance.operations.delete(operation);
    retire(instance, generation);
  };
  void operation.then(settle, settle);
  return operation;
}

/** Put an unmounted instance back in its generation's queue for another mount. */
function rejoin(instance: Instance, generation: Generation): void {
  if (instance.parcel!.getStatus() !== AppOrParcelStatus.NOT_MOUNTED || generation.queue.includes(instance)) return;
  instance.done = new Deferred<void>();
  generation.queue.push(instance);
}

/**
 * Chain a public mount or unmount behind every request made before it. Each one acts on the status
 * its predecessors left, so a mount → unmount → mount sequence ends mounted and an unmount never
 * runs twice.
 */
function request(
  instance: Instance,
  generation: Generation,
  kind: Instance['lastRequest'],
  run: () => Promise<null>,
): Promise<null> {
  instance.lastRequest = kind;
  const operation = instance.lifecycle.then(run, run);
  instance.lifecycle = operation.catch(() => undefined);
  return track(instance, generation, operation, kind === 'unmount');
}

function finish(instance: Instance, generation: Generation): void {
  instance.active = false;
  instance.done.resolve();
  const index = generation.queue.indexOf(instance);
  if (index >= 0) generation.queue.splice(index, 1);
  retire(instance, generation);
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
          instance.operations.clear();
          for (const key of Object.keys(instance.props)) delete instance.props[key];
        }
        generation.instances.clear();
        generation.queue.length = 0;
        generation.config = undefined;
        generation.dispose = undefined;
      }
    }
    if (failure !== undefined) {
      if (failure instanceof Error) throw failure;
      // A non-Error value has no better representation than its own string form.
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      throw new QiankunError(`App ${generation.name} teardown failed: ${String(failure)}`, 'app-teardown-failed');
    }
  })();
  return generation.unloading;
}

/**
 * Permanently unload every instance of a manually loaded app, mounted or idle. Resolves once all
 * of them are torn down; rejects with the first teardown failure after every unload settled.
 */
export async function unloadMicroApp(name: string): Promise<void> {
  const results = await Promise.allSettled((generations.get(name) ?? []).slice().map(unloadGeneration));
  const failure = results.find((result) => result.status === 'rejected');
  if (failure) throw failure.reason;
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
      bootstrapped: new Deferred<void>(),
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
    // Observed here: without queued siblings nobody else waits for a failed bootstrap.
    void owner.bootstrapped.promise.catch(() => undefined);
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
  const instance: Instance = {
    container,
    props,
    operations: new Map(),
    lifecycle: Promise.resolve(),
    lastRequest: 'mount',
    active: false,
    done: new Deferred<void>(),
  };
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
        if (signal.aborted) return;
        if (cached) {
          await untilStopped(generation.bootstrapped.promise, signal).catch((error: unknown) => {
            if (!signal.aborted) throw error;
          });
          return;
        }
        try {
          await invoke(instance.config?.bootstrap, hookProps);
          generation.bootstrapped.resolve();
        } catch (error) {
          // A generation that never bootstrapped can neither mount nor be reused: fail the
          // siblings queued on it, and dispose of it now since no unload can reach it later.
          generation.bootstrapped.reject(error);
          evict(generation);
          void generation.dispose?.().catch(() => undefined);
          throw error;
        }
      },
      mount: async (hookProps) => {
        // Instances of one generation share one sandbox and one set of lifecycles, so they mount
        // one at a time whichever container they target, remounts through retained handles
        // included; the container gate only serializes a single element. `done` only resolves,
        // so this wait can end early solely through unload.
        const predecessors = generation.queue.slice(0, generation.queue.indexOf(instance));
        await untilStopped(Promise.all(predecessors.map((previous) => previous.done.promise)), signal).catch(
          () => undefined,
        );
        if (signal.aborted) return;
        instance.active = true;
        try {
          await invoke(instance.config?.mount, hookProps);
          instance.failure = undefined;
        } catch (error) {
          // Unload cancels the framework waits inside the mount chain. Resolve as a no-op mount
          // instead of failing: unload unmounts the MOUNTED parcel right after, which clears the
          // container and releases its hold, and single-spa does not report the cancellation as
          // an application error.
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- unload aborts it meanwhile
          if (signal.aborted) return;
          instance.failure = error;
          throw error;
        }
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
  instance.lifecycle = parcel.mountPromise;
  // The initial chain covers an entered bootstrap, which unload must wait for as well.
  void track(instance, generation, parcel.mountPromise);
  // Failed initial loads and mounts must not leave a predecessor in the queue forever.
  void parcel.mountPromise.catch((error: unknown) => {
    instance.failure = error;
    finish(instance, generation);
  });
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
    // Every request that cannot do what it was asked rejects, so a caller always learns about it.
    mount: async () => {
      if (signal.aborted) throw unloadedError(generation.name);
      // Queued right away so the turn follows call order; an unmount still ahead of this request
      // takes the instance out again, and it rejoins once that unmount is done.
      rejoin(instance, generation);
      return request(instance, generation, 'mount', async () => {
        if (signal.aborted) throw unloadedError(generation.name);
        if (instance.parcel!.getStatus() === AppOrParcelStatus.MOUNTED) {
          throw new QiankunError(`App ${generation.name} is already mounted`, 'app-already-mounted');
        }
        rejoin(instance, generation);
        await instance.parcel!.mount();
        // A remount that unload cancelled, or that failed: single-spa reports the failure to its
        // error handlers and resolves, so it is surfaced here as well.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- unload aborts it meanwhile
        if (signal.aborted) throw unloadedError(generation.name);
        if (instance.parcel!.getStatus() !== AppOrParcelStatus.MOUNTED) throw instance.failure;
        return null;
      });
    },
    // Accepted while a mount is still in flight: it is recorded right away and runs once that mount
    // settles. A request that unload overtakes is carried out by unload; one that finds nothing
    // mounted rejects, with the failed mount as the cause when that is the reason.
    unmount: () => {
      if (signal.aborted) return Promise.reject(unloadedError(generation.name));
      instance.unmountRequestedAt = ++idleTick;
      let handedToUnload = false;
      const operation = request(instance, generation, 'unmount', async () => {
        if (signal.aborted) {
          handedToUnload = true;
          return null;
        }
        if (instance.parcel!.getStatus() !== AppOrParcelStatus.MOUNTED) {
          throw notMountedError(generation.name, instance.failure);
        }
        return instance.parcel!.unmount();
      });
      return operation.then((result) => (handedToUnload ? generation.unloading!.then(() => null) : result));
    },
    get update() {
      return instance.parcel?.update
        ? (nextProps: ObjectType) => {
            if (signal.aborted) return Promise.reject(unloadedError(generation.name));
            return observed(track(instance, generation, instance.parcel!.update!(nextProps)));
          }
        : undefined;
    },
    unload: () => unloadGeneration(generation),
  };
}
