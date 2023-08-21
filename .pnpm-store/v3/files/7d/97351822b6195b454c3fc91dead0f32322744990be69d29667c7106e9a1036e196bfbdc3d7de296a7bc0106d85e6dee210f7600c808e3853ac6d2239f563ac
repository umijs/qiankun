export interface TransformResult {
    content: string;
    meta: Record<string, any>;
}
declare const _default: {
    /**
     * transform markdown to jsx & metas
     * @param raw         raw content
     * @param fileAbsPath source file path
     * @param opts        transform options
     */
    markdown(raw: string, fileAbsPath: string | null, { type, cacheKey, throwError, masterKey, }?: {
        type?: 'jsx' | 'html';
        cacheKey?: string;
        throwError?: boolean;
        masterKey?: string;
    }): TransformResult;
    /**
     * split frontmatters & content for code block
     * @param raw   raw content
     */
    code(raw: string): TransformResult;
};
export default _default;
