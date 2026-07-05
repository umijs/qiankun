export type BaseLoaderOpts = {
  fetch: typeof window.fetch;
};

/**
 * Cross-package contract between the loader's writable-dom walk and the sandbox's dynamic-append
 * patcher: nodes inserted by the entry html streaming walk are marked with this symbol, so the
 * patched container head/body methods can tell them apart from genuinely dynamic insertions made
 * by app code (which may need on-the-fly transpilation the streamed nodes already received).
 * A registered symbol (Symbol.for), so the contract survives duplicated @qiankunjs/shared
 * instances in a dependency tree.
 */
export const loaderStreamedNode = Symbol.for('qiankun.loaderStreamedNode');

export function markLoaderStreamedNode(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[loaderStreamedNode] = true;
}

export function isLoaderStreamedNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[loaderStreamedNode];
}
