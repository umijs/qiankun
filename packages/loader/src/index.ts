import { defaultTransformer } from './transformer';
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
  nodeTransformer?: (node: Node) => Node;
};

/**
 * @param entry
 * @param target
 * @param opts
 */
// Todo Compatible with browsers that do not support WritableStream/TransformStream
export async function loadEntry(entry: Entry, target: HTMLElement, opts?: ImportOpts): Promise<void> {
  const { fetch = window.fetch, nodeTransformer = defaultTransformer } = opts || {};

  const res = await fetch(entry);
  if (res.body) {
    await res.body
      .pipeThrough(new TextDecoderStream())
      .pipeTo(new WritableDOMStream(target, null, (node) => nodeTransformer(node, entry)));
  }
}
