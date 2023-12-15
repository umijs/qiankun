import { Deferred, waitUntilSettled } from '../utils';

export function prepareDeferredQueue(deferredQueue: Array<Deferred<void>>): {
  deferred: Deferred<void>;
  prevDeferred?: Deferred<void>;
  queue: () => void;
} {
  const queueLength = deferredQueue.length;
  const prevDeferred = queueLength ? deferredQueue[deferredQueue.length - 1] : undefined;
  const deferred = new Deferred<void>();

  return {
    deferred,
    prevDeferred,
    queue: () => {
      deferredQueue.push(deferred);
      // clear the memory regardless the script loaded or failed
      void waitUntilSettled(deferred.promise).then(() => {
        const scriptIndex = deferredQueue.indexOf(deferred);
        deferredQueue.splice(scriptIndex, 1);
      });
    },
  };
}
