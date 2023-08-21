/// <reference types="node" />
import { INormalizedModules } from "codesandbox-import-util-types";
import FileError from "./file-error";
export interface IUploads {
    [path: string]: Buffer;
}
/**
 * This will take a path and return all parameters that are relevant for the call
 * to the CodeSandbox API fir creating a sandbox
 *
 * @export
 * @param {string} path
 */
export default function parseSandbox(resolvedPath: string): Promise<{
    errors: FileError[];
    uploads: IUploads;
    files: INormalizedModules;
}>;
