import type { IDumiElmNode } from '..';
import type { IPreviewerComponentProps } from '../../../theme';
type KnownKeys<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
type OmitFromKnownKeys<T, K extends keyof T> = KnownKeys<T> extends infer U ? keyof U extends keyof T ? Pick<T, Exclude<keyof U, K>> & Pick<T, Exclude<keyof T, keyof KnownKeys<T>>> : never : never;
interface ITransformerPreviewerProps extends OmitFromKnownKeys<IPreviewerComponentProps, 'sources'> {
    sources: Record<string, {
        /**
         * absolute path for current file
         */
        path: string;
        /**
         * demo source code, only for code block demo in md
         */
        content?: string;
        /**
         * import statement for current file
         */
        import?: string;
        /**
         * legacy jsx entry file
         * @deprecated
         */
        jsx?: string;
        /**
         * legacy tsx entry file
         * @deprecated
         */
        tsx?: string;
    }>;
}
export type IPreviewerTransformerResult = {
    /**
     * render component props;
     */
    rendererProps?: Record<string, any>;
    /**
     * previewer component props
     */
    previewerProps: Partial<ITransformerPreviewerProps>;
};
export type IPreviewerTransformer = {
    /**
     * transformer type
     * @note  'builtin' means builtin transformer
     */
    type: string;
    /**
     * previewer component file path of current transformer
     * @note  builtin transformer has not this field
     */
    component?: string;
    /**
     * transformer function
     */
    fn: (opts: {
        /**
         * attributes from code HTML tag
         */
        attrs: {
            src: string;
            [key: string]: any;
        };
        /**
         * current markdown file path
         */
        mdAbsPath: string;
        /**
         * mdast node
         */
        node: IDumiElmNode;
    }) => IPreviewerTransformerResult;
};
declare const _default: {
    type: string;
    fn: (opts: {
        /**
         * attributes from code HTML tag
         */
        attrs: {
            [key: string]: any;
            src: string;
        };
        /**
         * current markdown file path
         */
        mdAbsPath: string;
        /**
         * mdast node
         */
        node: IDumiElmNode;
    }) => IPreviewerTransformerResult;
};
export default _default;
