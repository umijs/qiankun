import { qiankunHeadTagName, type CompartmentLoaderFacade } from '@qiankunjs/sandbox';
import type {
  AssetsTranspilerOpts,
  BaseTranspilerOpts,
  NodeTransformer,
  ScriptTranspilerOpts,
} from '@qiankunjs/shared';
import { Deferred, prepareDeferredQueue, QiankunError } from '@qiankunjs/shared';
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
  streamTransformer?: () => TransformStream<string, string>;
  nodeTransformer?: NodeTransformer;
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
  const { fetch, streamTransformer, compartment, nodeTransformer } = opts;
  const classicScriptTransformer = compartment
    ? (source: string, sourceURL?: string) => compartment.transformClassicScript(source, sourceURL)
    : undefined;

  const entryUrl = typeof entry === 'string' ? entry : entry.url;
  const res = typeof entry === 'string' ? await fetch(entry) : entry.res;
  if (res.body) {
    let foundEntryScript = false;
    let foundEsmEntryScript = false;
    const entryScriptLoadedDeferred = new Deferred<T | undefined>();
    const onEntryLoaded = () => {
      // the latest set prop is the entry script exposed global variable
      if (compartment?.latestSetProp) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        entryScriptLoadedDeferred.resolve(compartment.globalThis[compartment.latestSetProp as number] as T);
      } else {
        // TODO support non sandbox mode?
        entryScriptLoadedDeferred.resolve({} as T);
      }
    };
    /*
     * ESM entry branch (ESM sandbox RFC §7): module scripts never write to window, so instead of the
     * latestSetProp mechanism the lifecycles are taken from the entry module namespace resolved by the
     * engine, and any module graph error (sync throw or TLA rejection) is plumbed back to the deferred
     * so it reaches loadApp / single-spa addErrorHandler instead of vanishing as an unhandledrejection.
     */
    const onEsmEntry = (namespacePromise: Promise<Record<string, unknown> | undefined>) => {
      namespacePromise.then(
        (ns) => {
          if (!entryScriptLoadedDeferred.isSettled()) {
            entryScriptLoadedDeferred.resolve(ns as T);
          }
        },
        (e) => {
          if (!entryScriptLoadedDeferred.isSettled()) {
            entryScriptLoadedDeferred.reject(e);
          }
        },
      );
    };

    // defer scripts must wait until the entry HTML loaded
    const deferQueue: Array<Deferred<void>> = [];
    const { deferred: entryHTMLLoadedDeferred, queue: queueEntryHTMLDeferred } = prepareDeferredQueue(deferQueue);
    queueEntryHTMLDeferred();

    let readableStream = res.body.pipeThrough(new TextDecoderStream());

    if (streamTransformer) {
      readableStream = readableStream.pipeThrough(streamTransformer());
    }

    void readableStream
      .pipeThrough(
        createTagTransformStream([
          { tag: '<head>', alt: `<${qiankunHeadTagName}>` },
          { tag: '</head>', alt: `</${qiankunHeadTagName}>` },
          // TODO support body replacement
          // { tag: 'body', alt: 'qiankun-body' },
        ]),
      )
      .pipeTo(
        new WritableDOMStream(container, null, (clone) => {
          let transformerOpts: AssetsTranspilerOpts = {
            classicScriptTransformer,
            compartment,
            fetch,
          };

          let queueDeferScript: () => void;
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

          const script = transformedNode as unknown as HTMLScriptElement;

          // the script have no src attribute after transpile, indicating that the script needs to wait for the src to be filled
          if (deferScriptMode && !script.hasAttribute('src')) {
            queueDeferScript!();
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
      )
      .then(() => {
        // module scripts execute after the entry HTML finishes streaming (mirroring their native
        // deferred semantics), in document order, driven by the engine
        const namespacePromise = compartment?.importDocumentModules() ?? Promise.resolve(undefined);

        // while the entry html stream is finished but there is no entry script found
        // we could use the latest set prop in sandbox to resolve the entry promise as fallback
        if (!foundEntryScript) {
          namespacePromise.then(
            (namespace) => {
              if (namespace !== undefined) {
                entryScriptLoadedDeferred.resolve(namespace as T);
              } else {
                onEntryLoaded();
              }
            },
            (error) => entryScriptLoadedDeferred.reject(error),
          );
        } else if (foundEsmEntryScript) {
          onEsmEntry(namespacePromise);
        } else {
          // Classic entry drives the lifecycle deferred, but stray module scripts may coexist
          // with it — observe their graph failures so they surface as a console error instead
          // of an unhandledrejection (see the ESM entry branch comment above).
          namespacePromise.catch((error: unknown) => {
            console.error(`[qiankun] module scripts of entry ${entryUrl} failed to execute`, error);
          });
        }

        entryHTMLLoadedDeferred.resolve();
      })
      .catch((e) => {
        entryScriptLoadedDeferred.reject(e);
        entryHTMLLoadedDeferred.reject(e);
      });

    return entryScriptLoadedDeferred.promise;
  }

  throw new QiankunError(`The response body of entry ${entryUrl} is empty!`);
}
