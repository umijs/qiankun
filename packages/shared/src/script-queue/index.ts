import { Deferred, waitUntilSettled } from '@qiankunjs/shared';

export function prepareScriptForQueue(
  scriptQueue: HTMLScriptElement[],
  scriptDeferredWeakMap: WeakMap<HTMLScriptElement, Deferred<void>>,
): { scriptDeferred: Deferred<void>; prevScriptDeferred?: Deferred<void>; queue: (script: HTMLScriptElement) => void } {
  const queueLength = scriptQueue.length;
  const prevScript = queueLength ? scriptQueue[scriptQueue.length - 1] : undefined;
  const prevScriptDeferred = prevScript ? scriptDeferredWeakMap.get(prevScript) : undefined;
  const scriptDeferred = new Deferred<void>();

  return {
    scriptDeferred,
    prevScriptDeferred,
    queue: (script: HTMLScriptElement) => {
      // the script have no src attribute, indicating that the script needs to wait for the src to be filled
      if (!script.hasAttribute('src')) {
        scriptQueue.push(script);
        scriptDeferredWeakMap.set(script, scriptDeferred);

        // clear the memory regardless the script loaded or failed
        void waitUntilSettled(scriptDeferred.promise).then(() => {
          const scriptIndex = scriptQueue.indexOf(script);
          scriptQueue.splice(scriptIndex, 1);
          scriptDeferredWeakMap.delete(script);
        });
      }
    },
  };
}
