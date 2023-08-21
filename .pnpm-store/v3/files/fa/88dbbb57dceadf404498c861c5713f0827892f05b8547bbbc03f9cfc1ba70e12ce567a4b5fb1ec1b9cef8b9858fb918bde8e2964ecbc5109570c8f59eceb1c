/**
 * @description
 * - `'javascript'`: try to match the file with extname `.{ts(x)|js(x)}`
 * - `'css'`: try to match the file with extname `.{less|sass|scss|stylus|css}`
 */
declare type FileType = 'javascript' | 'css';
interface IGetFileOpts {
    base: string;
    type: FileType;
    fileNameWithoutExt: string;
}
/**
 * Try to match the exact extname of the file in a specific directory.
 * @returns
 * - matched: `{ path: string; filename: string }`
 * - otherwise: `null`
 */
export default function getFile(opts: IGetFileOpts): {
    path: string;
    filename: string;
} | null;
export {};
