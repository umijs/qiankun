import type * as webpack from 'webpack';
interface FilesChange {
    changedFiles?: string[];
    deletedFiles?: string[];
}
declare function getFilesChange(compiler: webpack.Compiler): FilesChange;
declare function consumeFilesChange(compiler: webpack.Compiler): FilesChange;
declare function updateFilesChange(compiler: webpack.Compiler, change: FilesChange): void;
declare function clearFilesChange(compiler: webpack.Compiler): void;
/**
 * Computes aggregated files change based on the subsequent files changes.
 *
 * @param changes List of subsequent files changes
 * @returns Files change that represents all subsequent changes as a one event
 */
declare function aggregateFilesChanges(changes: FilesChange[]): FilesChange;
export { FilesChange, getFilesChange, consumeFilesChange, updateFilesChange, clearFilesChange, aggregateFilesChanges, };
