export type BaseLoaderOpts = {
  fetch: typeof window.fetch;
};

/**
 * Provenance contract between the loader's entry streaming pipeline and the sandbox's container
 * protocol: only nodes inserted by the entry html streaming pipeline carry this mark, so the
 * sandbox can tell whether a container already holds streamed entry content
 * (containsLoaderStreamedNode). Streamed nodes additionally carry the passthrough effect mark;
 * internal pipeline nodes (e.g. compartment blob scripts) only carry the effect mark — the two
 * marks answer different questions and must not be conflated. Registered symbol for the same
 * cross-copy reason as above.
 */
export const loaderStreamedNode = Symbol.for('qiankun.loaderStreamedNode');

export function markLoaderStreamedNode(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[loaderStreamedNode] = true;
}

export function isLoaderStreamedNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[loaderStreamedNode];
}
