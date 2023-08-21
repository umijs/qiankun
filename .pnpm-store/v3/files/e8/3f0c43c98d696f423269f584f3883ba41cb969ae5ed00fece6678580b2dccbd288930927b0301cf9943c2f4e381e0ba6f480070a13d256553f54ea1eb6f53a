import type { Transformer } from 'unified';
import type { Node } from 'unist';
interface IDumiVFileData {
    /**
     * markdown file path base cwd
     */
    filePath?: string;
    /**
     * markdown file updated time in git history, fallback to file updated time
     */
    updatedTime?: number;
    /**
     * the related component name of markdown file
     */
    componentName?: string;
    /**
     * page title
     */
    title?: string;
    /**
     * component keywords
     */
    keywords?: string[];
    /**
     * mark component deprecated
     */
    deprecated?: true;
    /**
     * component uuid (for HiTu)
     */
    uuid?: string;
    /**
     * slug list in markdown file
     */
    slugs?: {
        depth: number;
        value: string;
        heading: string;
    }[];
}
declare module 'unist' {
    interface Node {
        [key: string]: unknown;
    }
}
export interface IDumiElmNode extends Node {
    properties: {
        id?: string;
        href?: string;
        [key: string]: any;
    };
    tagName: string;
    children?: IDumiElmNode[];
}
export type IDumiUnifiedTransformer = (node: Parameters<Transformer>[0], vFile: Parameters<Transformer>[1] & {
    data: IDumiVFileData;
}, next?: Parameters<Transformer>[2]) => ReturnType<Transformer>;
declare const _default: (source: string, fileAbsPath: string, type: 'jsx' | 'html', masterKey?: string) => import("vfile").VFile;
export default _default;
