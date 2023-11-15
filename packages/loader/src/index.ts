import type { Sandbox } from '@qiankunjs/sandbox';
import { qiankunHeadTagName } from '@qiankunjs/sandbox';
import type {
  AssetsTranspilerOpts,
  BaseTranspilerOpts,
  NodeTransformer,
  ScriptTranspilerOpts,
} from '@qiankunjs/shared';
import { Deferred, prepareScriptForQueue, QiankunError } from '@qiankunjs/shared';
import { createTagTransformStream } from './TagTransformStream';
import { isUrlHasOwnProtocol } from './utils';
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
export async function loadEntry<T>(entry: Entry, container: HTMLElement, opts: LoaderOpts): Promise<T | void> {
  const { fetch, streamTransformer, sandbox, nodeTransformer } = opts;

  const res = isUrlHasOwnProtocol(entry) ? await fetch(entry) : new Response(entry, { status: 200, statusText: 'OK' });
  if (res.body) {
    let foundEntryScript = false;
    const entryScriptLoadedDeferred = new Deferred<T | void>();
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
    const deferScripts: HTMLScriptElement[] = [];
    const deferScriptDeferredWeakMap = new WeakMap<HTMLScriptElement, Deferred<void>>();

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
        new WritableDOMStream(container, null, (clone, node) => {
          let transformerOpts: AssetsTranspilerOpts = {
            fetch,
            sandbox,
            rawNode: node as unknown as Node,
          };

          let queueScript: (script: HTMLScriptElement) => void;
          const deferScriptMode = isDeferScript(node as unknown as HTMLScriptElement);
          if (deferScriptMode) {
            const { scriptDeferred, prevScriptDeferred, queue } = prepareScriptForQueue(
              deferScripts,
              deferScriptDeferredWeakMap,
            );
            transformerOpts = {
              ...transformerOpts,
              prevScriptTranspiledDeferred: prevScriptDeferred,
              scriptTranspiledDeferred: scriptDeferred,
            } as ScriptTranspilerOpts;
            queueScript = queue;
          }

          const transformedNode = nodeTransformer ? nodeTransformer(clone, entry, transformerOpts) : clone;

          const script = transformedNode as unknown as HTMLScriptElement;

          if (deferScriptMode) {
            queueScript!(script);
          }

          /*
           * If the entry script is executed, we can complete the entry process in advance
           * otherwise we need to wait until the last script is executed.
           * Notice that we only support external script as entry script thus we could do resolve the promise after the script is loaded.
           */
          if (isEntryScript(script)) {
            if (foundEntryScript) {
              throw new QiankunError(
                `You should not set multiply entry script in one entry html, but ${entry} has at least 2 entry scripts`,
              );
            }

            foundEntryScript = true;

            const onScriptComplete = (
              prevListener: typeof HTMLScriptElement.prototype.onload | typeof HTMLScriptElement.prototype.onerror,
              event: Event,
            ) => {
              script.onload = script.onerror = null;

              // In order to avoid the inline script to be executed immediately after the prev onload is executed, resulting in the failure of the sandbox to obtain the latestSetProp, here we must resolve the entryScriptLoadedDeferred firstly
              if (!entryScriptLoadedDeferred.isSettled()) {
                if (event.type === 'load') {
                  onEntryLoaded();
                } else {
                  entryScriptLoadedDeferred.reject(
                    new QiankunError(`entry ${entry} load failed as entry script ${script.src} load failed}`),
                  );
                }
              }

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
      })
      .catch((e) => {
        entryScriptLoadedDeferred.reject(e);
      });

    return entryScriptLoadedDeferred.promise;
  }

  throw new QiankunError(`entry ${entry} response body is empty!`);
}
