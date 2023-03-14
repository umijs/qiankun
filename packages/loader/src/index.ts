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
  assetsTransformer?: (node: Node, context: string) => Node;
};

/**
 * @param entry
 * @param target
 * @param opts
 * @todo Compatible with browsers that do not support WritableStream/TransformStream
 */
export async function importEntry(entry: Entry, target: HTMLElement, opts?: ImportOpts): Promise<void> {
  const { fetch = window.fetch, assetsTransformer = (node: Node) => node } = opts || {};
  const res = await fetch(entry);

  if (res.body) {
    await res.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(new WritableDOMStream(target, null, (node) => assetsTransformer(node, entry)));
  }
}
