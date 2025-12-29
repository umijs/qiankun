import type { Sandbox } from '@qiankunjs/sandbox';
import { qiankunHeadTagName } from '@qiankunjs/sandbox';
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
} & Omit<BaseTranspilerOpts, 'moduleResolver'> & { sandbox?: Sandbox };

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
  const { fetch, streamTransformer, sandbox, nodeTransformer } = opts;

  const entryUrl = typeof entry === 'string' ? entry : entry.url;
  const res = typeof entry === 'string' ? await fetch(entry) : entry.res;
  if (res.body) {
    let foundEntryScript = false;
    const entryScriptLoadedDeferred = new Deferred<T | undefined>();
    const onEntryLoaded = () => {
      // the latest set prop is the entry script exposed global variable
      if (sandbox?.latestSetProp) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        entryScriptLoadedDeferred.resolve(sandbox.globalThis[sandbox.latestSetProp as number] as T);
      } else {
        // TODO support non sandbox mode?
        entryScriptLoadedDeferred.resolve({} as T);
      }
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
        createTagTransformStream(
          [
            { tag: '<head>', alt: `<${qiankunHeadTagName}>` },
            { tag: '</head>', alt: `</${qiankunHeadTagName}>` },
            // TODO support body replacement
            // { tag: 'body', alt: 'qiankun-body' },
          ],
          // { head: true },
          {},
        ),
      )
      .pipeTo(
        new WritableDOMStream(container, null, (clone) => {
          let transformerOpts: AssetsTranspilerOpts = {
            fetch,
            sandbox,
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
                      `Entry ${entryUrl} load failed as entry script ${script.dataset.src || script.src} load failed}`,
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
        // while the entry html stream is finished but there is no entry script found
        // we could use the latest set prop in sandbox to resolve the entry promise as fallback
        if (!foundEntryScript) {
          onEntryLoaded();
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
