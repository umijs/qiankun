/**
 * Effect contract between the sandbox's own processing pipelines and its dynamic-append patcher:
 * a node produced by a sandbox-owned pipeline (the streaming node transformer handed to the entry
 * loader, the compartment's internal blob-script evaluation) is marked for native passthrough, so
 * the patched container head/body methods let it through untouched instead of routing it into the
 * dynamic transpilation pipeline again.
 *
 * The mark is stamped by the pipeline that owns the node — never by the dynamic pipeline, whose
 * output must NOT carry it: an app re-inserting an already-transpiled node must re-enter the
 * pipeline for ledger bookkeeping (see getOverwrittenAppendChildOrInsertBefore).
 *
 * A registered symbol (Symbol.for) rather than a module-scoped WeakSet: duplicated qiankun copies
 * in one realm must honor each other's marks — e.g. after a failed unmount leaves one copy's
 * instance-method patches on a container (SKIP_BECAUSE_BROKEN, see the container occupancy gate
 * RFC), another copy's streamed nodes may land on them and must still pass through.
 */
export const nativePassthroughNode = Symbol.for('qiankun.nativePassthroughNode');

export function markNodeForNativePassthrough(node: Node): void {
  (node as unknown as Record<symbol, unknown>)[nativePassthroughNode] = true;
}

export function isNativePassthroughNode(node: Node): boolean {
  return !!(node as unknown as Record<symbol, unknown>)[nativePassthroughNode];
}
