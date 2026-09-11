import { qiankunHeadTagName, type CompartmentLoaderFacade } from '@qiankunjs/sandbox';
import type {
  AssetsTranspilerOpts,
  BaseTranspilerOpts,
  NodeTransformer,
  ScriptTranspilerOpts,
} from '@qiankunjs/shared';
import { Deferred, disposeCompartmentAssets, prepareDeferredQueue, QiankunError } from '@qiankunjs/shared';
import { createTagTransformStream } from './TagTransformStream';
import WritableDOMStream from './writable-dom';

type HTMLEntry = string;
// type ConfigEntry = { html: string; scripts: [], styles: [] };

type Entry = HTMLEntry;

// type EntryInstance<K> = {
//   htmlDocument: Document;
//   prefetch: () => Promise<void>;
//   execute: (executor?: Promise<K>) => Promise<K>;
// };
//
export type LoaderOpts = {
  /** Cancel entry fetching and streaming. Its owner must also dispose the compartment. */
  signal?: AbortSignal;
  streamTransformer?: () => TransformStream<string, string>;
  nodeTransformer?: NodeTransformer;
  /**
   * Notified exactly once when the entry DOM-write phase is over — the html stream fully piped
   * AND its post-stream evaluations (module scripts, classic defer scripts) finished, or the
   * stream errored, or it never started at all. Distinct from the returned promise, which may
   * settle as early as the entry script's onload while the stream is still writing tail nodes;
   * callers gating container occupancy (qiankun's container gate) key their release on this
   * signal, so it must outlast everything that still writes into the container.
   */
  onDOMStreamSettled?: () => void;
} & Omit<BaseTranspilerOpts, 'classicScriptTransformer' | 'compartment' | 'moduleResolver'> & {
    /** Sandbox-owned structural host facade; never depend on its concrete implementation. */
    compartment?: CompartmentLoaderFacade;
  };

const isExternalScript = (script: HTMLScriptElement): boolean => {
  return script.tagName === 'SCRIPT' && !!(script.src || script.dataset.src);
};
const isEntryScript = (script: HTMLScriptElement): boolean => {
  return isExternalScript(script) && script.hasAttribute('entry');
};
const isDeferScript = (script: HTMLScriptElement): boolean => {
  return isExternalScript(script) && script.hasAttribute('defer');
};

/**
 * @param entry
 * @param container
 * @param opts
 */
export async function loadEntry<T>(
  entry: Entry | { url: string; res: Response },
  container: HTMLElement,
  opts: LoaderOpts,
): Promise<T | undefined> {
  const { fetch, streamTransformer, compartment, nodeTransformer, onDOMStreamSettled, signal } = opts;
  const classicScriptTransformer = compartment
    ? (source: string, sourceURL?: string) => compartment.transformClassicScript(source, sourceURL)
    : undefined;

  let domStreamSettledNotified = false;
  let stopDOMWrites: (() => void) | undefined;
  const aborted = new Deferred<never>();
  // Abort may happen after the entry lifecycle promise already resolved, while HTML tails stream.
  void aborted.promise.catch(() => undefined);
  const abortable = <V>(promise: Promise<V>): Promise<V> =>
    signal ? Promise.race([promise, aborted.promise]) : promise;
  const notifyDOMStreamSettled = () => {
    if (domStreamSettledNotified) return;
    domStreamSettledNotified = true;
    signal?.removeEventListener('abort', onAbort);
    stopDOMWrites = undefined;
    onDOMStreamSettled?.();
  };
  const onAbort = () => {
    try {
      stopDOMWrites?.();
    } finally {
      // Stop asynchronous asset continuations before signaling settlement. The caller owns the
      // compartment: its controller must free plugins/patchers before revoking that membrane.
      try {
        disposeCompartmentAssets(compartment ?? fetch);
      } catch {
        // Preserve the cancellation reason; the owner also tears down its sandbox controller.
      }
      aborted.reject(signal?.reason);
      notifyDOMStreamSettled();
    }
  };
  signal?.addEventListener('abort', onAbort, { once: true });

  const entryUrl = typeof entry === 'string' ? entry : entry.url;
  let res: Response;
  try {
    if (signal?.aborted) {
      if (typeof entry !== 'string') void entry.res.body?.cancel(signal.reason).catch(() => undefined);
      onAbort();
      signal.throwIfAborted();
    }
    if (typeof entry === 'string') {
      const fetching = signal ? fetch(entry, { signal }) : fetch(entry);
      // A custom fetch can ignore the signal. Its eventual body must still be cancelled,
      // although the public load promise has already rejected by then.
      void fetching.then(
        (response) => {
          if (signal?.aborted) void response.body?.cancel(signal.reason).catch(() => undefined);
        },
        () => undefined,
      );
      res = await abortable(fetching);
    } else {
      res = entry.res;
    }
    signal?.throwIfAborted();
  } catch (e) {
    // the stream never started, but the DOM-write phase is over all the same
    notifyDOMStreamSettled();
    throw e;
  }

  if (res.body) {
    let foundEntryScript = false;
    let foundEsmEntryScript = false;
    const entryScriptLoadedDeferred = new Deferred<T | undefined>();
    const onEntryLoaded = () => {
      if (signal?.aborted) return;
      // the latest set prop is the entry script exposed global variable
      if (compartment?.latestSetProp) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        entryScriptLoadedDeferred.resolve(compartment.globalThis[compartment.latestSetProp as number] as T);
      } else {
        // TODO support non sandbox mode?
        entryScriptLoadedDeferred.resolve({} as T);
      }
    };

    // defer scripts must wait until the entry HTML loaded
    const deferQueue: Array<Deferred<void>> = [];
    const { deferred: entryHTMLLoadedDeferred, queue: queueEntryHTMLDeferred } = prepareDeferredQueue(deferQueue);
    queueEntryHTMLDeferred();

    // classic defer scripts evaluate after the stream ends — their completion is part of the
    // DOM-write phase the settle signal guards (collected in the walk callback below)
    const deferScriptExecutions: Array<Promise<void>> = [];
    const pendingAssets = new Set<HTMLScriptElement | HTMLLinkElement>();
    const finishDeferExecutions = new Set<() => void>();

    let readableStream: ReadableStream<string>;
    try {
      readableStream = res.body.pipeThrough(new TextDecoderStream(), { signal });

      if (streamTransformer) {
        readableStream = readableStream.pipeThrough(streamTransformer(), { signal });
      }
    } catch (e) {
      // wiring the stream failed synchronously (a throwing streamTransformer factory, a locked
      // body from a custom fetch) — the DOM-write phase is over without ever starting
      notifyDOMStreamSettled();
      throw e;
    }

    void readableStream
      .pipeThrough(
        createTagTransformStream([
          { tag: '<head>', alt: `<${qiankunHeadTagName}>` },
          { tag: '</head>', alt: `</${qiankunHeadTagName}>` },
          // TODO support body replacement
          // { tag: 'body', alt: 'qiankun-body' },
        ]),
        { signal },
      )
      .pipeTo(
        createAbortableDOMStream(container, (clone) => {
          signal?.throwIfAborted();
          if (clone.nodeName === 'SCRIPT' || clone.nodeName === 'LINK') {
            pendingAssets.add(clone as unknown as HTMLScriptElement | HTMLLinkElement);
          }
          /*
           * Every element the walk is about to insert flows through this callback (writable-dom
           * itself stays free of downstream knowledge) and gets routed through the caller-provided
           * transformer. A sandbox-provided transformer marks its own output for native
           * passthrough there — the loader itself carries no sandbox semantics.
           */
          let transformerOpts: AssetsTranspilerOpts = {
            classicScriptTransformer,
            compartment,
            fetch,
          };

          let queueDeferScript: () => void = () => {};
          const deferScriptMode = isDeferScript(clone as unknown as HTMLScriptElement);
          if (deferScriptMode) {
            const { deferred, prevDeferred, queue } = prepareDeferredQueue(deferQueue);
            transformerOpts = {
              ...transformerOpts,
              scriptTranspiledDeferred: deferred,
              prevScriptTranspiledDeferred: prevDeferred,
            } as ScriptTranspilerOpts;
            queueDeferScript = queue;
          }

          const transformedNode = nodeTransformer ? nodeTransformer(clone, transformerOpts) : clone;
          signal?.throwIfAborted();

          const script = transformedNode as unknown as HTMLScriptElement;

          // the script have no src attribute after transpile, indicating that the script needs to wait for the src to be filled
          if (deferScriptMode && !script.hasAttribute('src')) {
            queueDeferScript();
          }

          // A classic defer script evaluates after the stream ends, so its load/error event is
          // the tail of the DOM-write phase (module/importmap scripts are engine-neutralized —
          // they never fire load and their evaluation is awaited via importDocumentModules).
          if (deferScriptMode && script.dataset.esm !== 'true' && !script.type.includes('importmap')) {
            deferScriptExecutions.push(
              new Promise<void>((resolve) => {
                const settleExecution = () => {
                  script.removeEventListener('load', settleExecution);
                  script.removeEventListener('error', settleExecution);
                  finishDeferExecutions.delete(settleExecution);
                  resolve();
                };
                finishDeferExecutions.add(settleExecution);
                script.addEventListener('load', settleExecution);
                script.addEventListener('error', settleExecution);
              }),
            );
          }

          /*
           * If the entry script is executed, we can complete the entry process in advance
           * otherwise we need to wait until the last script is executed.
           * Notice that we only support external script as entry script thus we could do resolve the promise after the script is loaded.
           */
          if (isEntryScript(script)) {
            if (foundEntryScript) {
              throw new QiankunError(
                `You should not include more than 1 entry scripts in a single HTML entry ${entryUrl} !`,
              );
            }

            foundEntryScript = true;

            // ESM entry scripts stay inert (no src is ever set), their completion signal is the
            // engine entry namespace promise rather than the script element onload
            if (compartment && script.dataset.esm === 'true') {
              foundEsmEntryScript = true;
              return transformedNode;
            }

            const onScriptComplete = (
              prevListener: typeof HTMLScriptElement.prototype.onload | typeof HTMLScriptElement.prototype.onerror,
              event: Event,
            ) => {
              script.onload = script.onerror = null;
              if (signal?.aborted) return;

              // entryScriptLoadedDeferred not resolved or rejected yet
              if (!entryScriptLoadedDeferred.isSettled()) {
                if (event.type === 'load') {
                  onEntryLoaded();
                } else {
                  entryScriptLoadedDeferred.reject(
                    new QiankunError(
                      `Entry ${entryUrl} load failed as entry script ${script.dataset.src || script.src} execution failed`,
                    ),
                  );
                }
              }

              /*
               In order to avoid the inline script to be executed immediately after the prev onload is executed, resulting in the failure of the sandbox to obtain the latestSetProp
               here we must resolve the entryScriptLoadedDeferred firstly and then execute the prevListener
               */
              prevListener?.call(script, event);
            };

            script.onload = onScriptComplete.bind(null, script.onload);
            script.onerror = onScriptComplete.bind(null, script.onerror) as typeof HTMLScriptElement.prototype.onerror;
          }

          return transformedNode;
        }),
        { signal },
      )
      .then(async () => {
        signal?.throwIfAborted();
        // module scripts execute after the entry HTML finishes streaming (mirroring their native
        // deferred semantics), in document order, driven by the engine
        const namespacePromise = abortable(compartment?.importDocumentModules() ?? Promise.resolve(undefined));

        // while the entry html stream is finished but there is no entry script found
        // we could use the latest set prop in sandbox to resolve the entry promise as fallback
        if (!foundEntryScript) {
          namespacePromise.then(
            (namespace) => {
              if (signal?.aborted) return;
              if (namespace !== undefined) {
                entryScriptLoadedDeferred.resolve(namespace as T);
              } else {
                onEntryLoaded();
              }
            },
            (error) => entryScriptLoadedDeferred.reject(error),
          );
        } else if (foundEsmEntryScript) {
          /*
           * ESM entry branch (ESM sandbox RFC §7): module scripts never write to window, so instead of the
           * latestSetProp mechanism the lifecycles are taken from the entry module namespace resolved by the
           * engine, and any module graph error (sync throw or TLA rejection) is plumbed back to the deferred
           * so it reaches loadApp / single-spa addErrorHandler instead of vanishing as an unhandledrejection.
           * (Deferred settles are first-wins, so the capabilities can be passed as plain callbacks.)
           */
          (namespacePromise as Promise<T | undefined>).then(
            entryScriptLoadedDeferred.resolve,
            entryScriptLoadedDeferred.reject,
          );
        } else {
          // Classic entry drives the lifecycle deferred, but stray module scripts may coexist
          // with it — observe their graph failures so they surface as a console error instead
          // of an unhandledrejection (see the ESM entry branch comment above).
          namespacePromise.catch((error: unknown) => {
            if (!signal?.aborted) {
              console.error(`[qiankun] module scripts of entry ${entryUrl} failed to execute`, error);
            }
          });
        }

        entryHTMLLoadedDeferred.resolve();

        // The DOM-write phase does not end with the last streamed byte: the module evaluation
        // above and the classic defer scripts (unblocked by the resolve right before) both run
        // after it and may still write into the container — dynamic style injection included.
        // The settle signal keys occupancy release, so it must outlast them, or a gated
        // successor would interleave with the tail writes.
        await abortable(namespacePromise.catch(() => undefined));
        await abortable(Promise.allSettled(deferScriptExecutions));
      })
      .catch((e) => {
        entryScriptLoadedDeferred.reject(e);
        entryHTMLLoadedDeferred.reject(e);
      })
      .finally(notifyDOMStreamSettled);

    return abortable(entryScriptLoadedDeferred.promise);

    function createAbortableDOMStream(
      target: HTMLElement,
      transform: <N extends Node>(node: N) => N,
    ): WritableStream<string> {
      // Use the fork's existing sink API. Its close waits for blocking assets; wrapping that
      // promise lets cancellation settle even if a script never dispatches load or error.
      const sink = WritableDOMStream(target, null, transform);
      stopDOMWrites = () => {
        for (const asset of pendingAssets) {
          asset.onload = asset.onerror = null;
          asset.remove();
          if (asset.tagName === 'SCRIPT') {
            asset.setAttribute('type', 'text/plain');
            asset.removeAttribute('src');
          }
        }
        pendingAssets.clear();
        for (const finish of finishDeferExecutions) finish();
        sink.abort(new DOMException('Entry loading aborted', 'AbortError'));
      };
      return new WritableStream<string>({
        write(chunk) {
          signal?.throwIfAborted();
          sink.write(chunk);
        },
        close: () => abortable(sink.close()),
        abort: () => stopDOMWrites?.(),
      });
    }
  }

  notifyDOMStreamSettled();
  throw new QiankunError(`The response body of entry ${entryUrl} is empty!`);
}
