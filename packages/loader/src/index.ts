import { qiankunHeadTagName } from '@qiankunjs/sandbox';
import type { BaseTranspilerOpts } from '@qiankunjs/shared';
import { moduleResolver as defaultModuleResolver, QiankunError, transpileAssets } from '@qiankunjs/shared';
import { TagTransformStream } from './TagTransformStream';
import { Deferred, isUrlHasOwnProtocol } from './utils';
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
export type ImportOpts = {
  decoder?: (chunk: string) => string;
  nodeTransformer?: typeof transpileAssets;
} & BaseTranspilerOpts;

/**
 * @param entry
 * @param container
 * @param opts
 */
export async function loadEntry<T>(entry: Entry, container: HTMLElement, opts: ImportOpts): Promise<T | void> {
  const {
    fetch,
    nodeTransformer = transpileAssets,
    sandbox,
    moduleResolver = (url: string) => {
      return defaultModuleResolver(url, container, document.head);
    },
  } = opts;

  const res = isUrlHasOwnProtocol(entry) ? await fetch(entry) : new Response(entry);
  if (res.body) {
    let noExternalScript = true;
    const entryScriptLoadedDeferred = new Deferred<T | void>();
    const entryDocumentLoadedDeferred = new Deferred<void>();

    void res.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(
        new TagTransformStream(
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
          const transformedNode = nodeTransformer(clone, entry, {
            fetch,
            sandbox,
            moduleResolver,
            rawNode: node as unknown as Node,
          });

          const script = transformedNode as unknown as HTMLScriptElement;
          /*
           * If the entry script is executed, we can complete the entry process in advance
           * otherwise we need to wait until the last script is executed.
           * Notice that we only support external script as entry script thus we could do resolve the promise after the script is loaded.
           */
          if (script.tagName === 'SCRIPT' && (script.src || script.dataset.src)) {
            noExternalScript = false;

            const isEntryScript = async () => {
              if (script.hasAttribute('entry')) return true;

              await entryDocumentLoadedDeferred.promise;

              const scripts = container.querySelectorAll('script[src]');
              const lastScript = scripts[scripts.length - 1];
              return lastScript === script;
            };

            script.addEventListener(
              'load',
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              async () => {
                if (await isEntryScript()) {
                  // the latest set prop is the entry script exposed global variable
                  if (sandbox?.latestSetProp) {
                    entryScriptLoadedDeferred.resolve(sandbox.globalThis[sandbox.latestSetProp as number] as T);
                  } else {
                    // TODO support non sandbox mode?
                    entryScriptLoadedDeferred.resolve({} as T);
                  }
                }
              },
              { once: true },
            );
            script.addEventListener(
              'error',
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              async (evt) => {
                if (await isEntryScript()) {
                  entryScriptLoadedDeferred.reject(
                    new QiankunError(`entry ${entry} loading failed as entry script trigger error -> ${evt.message}`),
                  );
                }
              },
              { once: true },
            );
          }

          return transformedNode;
        }),
      )
      .then(() => {
        entryDocumentLoadedDeferred.resolve();

        if (noExternalScript) {
          entryScriptLoadedDeferred.resolve();
        }
      });

    return entryScriptLoadedDeferred.promise;
  }

  throw new QiankunError(`entry ${entry} response body is empty!`);
}
