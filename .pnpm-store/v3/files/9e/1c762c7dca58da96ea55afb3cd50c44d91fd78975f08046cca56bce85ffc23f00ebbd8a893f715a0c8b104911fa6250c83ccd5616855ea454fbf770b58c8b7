/**
 * This file and its contents are due to an issue in TypeScript (affecting *at least* up to 4.1) which causes type
 * elision to break during emit for nodes which have been transformed. Specifically, if the 'original' property is set,
 * elision functionality no longer works.
 *
 * This results in module specifiers for types being output in import/export declarations in the compiled *JS files*
 *
 * The logic herein compensates for that issue by recreating type elision separately so that the transformer can update
 * the clause with the properly elided information
 *
 * Issues:
 * @see https://github.com/microsoft/TypeScript/issues/40603
 * @see https://github.com/microsoft/TypeScript/issues/31446
 *
 * @example
 * // a.ts
 * export type A = string
 * export const B = 2
 *
 * // b.ts
 * import { A, B } from './b'
 * export { A } from './b'
 *
 * // Expected output for b.js
 * import { B } from './b'
 *
 * // Actual output for b.js
 * import { A, B } from './b'
 * export { A } from './b'
 */
import { ImportOrExportDeclaration, VisitorContext } from "../types";
import { ExportDeclaration, ImportDeclaration } from "typescript";
/**
 * Get import / export clause for node (replicates TS elision behaviour for js files)
 * See notes in get-import-export-clause.ts header for why this is necessary
 *
 * @returns import or export clause or undefined if it entire declaration should be elided
 */
export declare function elideImportOrExportClause<T extends ImportOrExportDeclaration>(context: VisitorContext, node: T): (T extends ImportDeclaration ? ImportDeclaration["importClause"] : ExportDeclaration["exportClause"]) | undefined;
