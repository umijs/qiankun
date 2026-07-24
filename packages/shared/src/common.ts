export type BaseLoaderOpts = {
  fetch: typeof window.fetch;
};

/**
 * Effect contract between qiankun's processing pipelines and the sandbox's dynamic-append
 * patcher: a node that already went through a qiankun pipeline (the loader's streaming walk, the
 * compartment's internal blob-script evaluation) is marked as transpiled, so the patched
 * container head/body methods pass it through natively instead of routing it through the dynamic
 * transpilation pipeline a second time.
 * A registered symbol (Symbol.for), so the contract survives duplicated @qiankunjs/shared
 * instances in a dependency tree.
 */
export const transpiledNode = Symbol.for('qiankun.transpiledNode');

export function markNodeTranspiled(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[transpiledNode] = true;
}

export function isTranspiledNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[transpiledNode];
}

/**
 * Provenance contract between the loader's writable-dom walk and the sandbox's container
 * protocol: only nodes inserted by the entry html streaming walk carry this mark, so the sandbox
 * can tell whether a container already holds streamed entry content (containsLoaderStreamedNode).
 * Streamed nodes are additionally marked transpiled; internal pipeline nodes (e.g. compartment
 * blob scripts) are only transpiled — the two marks answer different questions and must not be
 * conflated. Registered symbol for the same cross-copy reason as above.
 */
export const loaderStreamedNode = Symbol.for('qiankun.loaderStreamedNode');

export function markLoaderStreamedNode(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[loaderStreamedNode] = true;
}

export function isLoaderStreamedNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[loaderStreamedNode];
}
