export type BaseLoaderOpts = {
  fetch: typeof window.fetch;
};

/**
 * Effect contract between qiankun's processing pipelines and the sandbox's dynamic-append
 * patcher: a node inserted by a qiankun-owned pipeline (the loader's entry streaming pipeline,
 * the compartment's internal blob-script evaluation) is marked for native passthrough, so the
 * patched container head/body methods let it through untouched instead of routing it into the
 * dynamic transpilation pipeline. The mark is stamped by the pipeline that owns the insertion —
 * never by the transpiler, which also serves the dynamic pipeline whose output must NOT carry it.
 * A registered symbol (Symbol.for), so the contract survives duplicated @qiankunjs/shared
 * instances in a dependency tree.
 */
export const nativePassthroughNode = Symbol.for('qiankun.nativePassthroughNode');

export function markNodeForNativePassthrough(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[nativePassthroughNode] = true;
}

export function isNativePassthroughNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[nativePassthroughNode];
}

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
