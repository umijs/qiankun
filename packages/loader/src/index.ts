import type { Compartment } from '@qiankunjs/sandbox';
import { transpileAssets } from './transpilers';
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
  fetch?: typeof window.fetch;
  decoder?: (chunk: string) => string;
  compartment?: Compartment;
  nodeTransformer?: typeof transpileAssets;
};

/**
 * @param entry
 * @param container
 * @param opts
 */
export async function loadEntry(entry: Entry, container: HTMLElement, opts?: ImportOpts): Promise<void> {
  const { fetch = window.fetch, nodeTransformer = transpileAssets, compartment } = opts || {};

  const res = await fetch(entry);
  if (res.body) {
    const loadEntryDeferred = new Deferred<void>();
    const streamFinishedDeferred = new Deferred<void>();

    res.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(
        new WritableDOMStream(container, null, (node) => {
          const transformedNode = nodeTransformer(node, entry, { fetch, compartment });

          const script = transformedNode as any as HTMLScriptElement;
          if (script.tagName === 'SCRIPT' && (script.src || script.dataset.src)) {
            script.addEventListener(
              'load',
              async () => {
                /*
                 * If the entry script is executed, we can complete the entry process in advance
                 * otherwise we need to wait until the last script is executed.
                 */
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

export * from './transpilers';
