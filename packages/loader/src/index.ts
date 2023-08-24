import type { TransformerOpts } from '@qiankunjs/shared';
import { moduleResolver as defaultModuleResolver, transpileAssets } from '@qiankunjs/shared';
import { Deferred } from './utils';
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
type ImportOpts = {
  decoder?: (chunk: string) => string;
  nodeTransformer?: typeof transpileAssets;
} & TransformerOpts;

/**
 * @param entry
 * @param container
 * @param opts
 */
export async function loadEntry(entry: Entry, container: HTMLElement, opts?: ImportOpts): Promise<void> {
  const {
    fetch = window.fetch,
    nodeTransformer = transpileAssets,
    sandbox,
    moduleResolver = (url: string) => {
      return defaultModuleResolver(url, container, document.head);
    },
  } = opts || {};

  const res = await fetch(entry);
  if (res.body) {
    const loadEntryDeferred = new Deferred<void>();
    const streamFinishedDeferred = new Deferred<void>();

    void res.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(
        new WritableDOMStream(container, null, (clone, node) => {
          const transformedNode = nodeTransformer(clone, entry, {
            fetch,
            sandbox,
            moduleResolver,
            rawNode: (node as unknown) as Node,
          }) as Node;

          const script = (transformedNode as unknown) as HTMLScriptElement;
          /*
           * If the entry script is executed, we can complete the entry process in advance
           * otherwise we need to wait until the last script is executed.
           * Notice that we only support external script as entry script thus we could do resolve the promise after the script is loaded.
           */
          if (script.tagName === 'SCRIPT' && (script.src || script.dataset.src)) {
            script.addEventListener(
              'load',
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              async () => {
                if (script.hasAttribute('entry')) {
                  loadEntryDeferred.resolve();
                } else {
                  await streamFinishedDeferred.promise;

                  const scripts = container.querySelectorAll('script[src]');
                  const lastScript = scripts[scripts.length - 1];

                  if (lastScript === script) {
                    loadEntryDeferred.resolve();
                  }
                }
              },
              { once: true },
            );
          }

          return transformedNode;
        }),
      )
      .then(() => streamFinishedDeferred.resolve());

    return loadEntryDeferred.promise;
  }

  // return {} as any;
}
