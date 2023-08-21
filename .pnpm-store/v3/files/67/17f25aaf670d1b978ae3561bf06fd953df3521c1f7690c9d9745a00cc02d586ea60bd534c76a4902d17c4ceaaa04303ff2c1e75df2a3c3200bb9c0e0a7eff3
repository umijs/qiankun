interface IModuleResolverOpts {
    basePath: string;
    sourcePath: string;
    extensions?: string[];
    silent?: boolean;
}
/**
 * resolve module path base on umi context (alias)
 */
export declare const getModuleResolvePath: ({ basePath, sourcePath, extensions, silent, }: IModuleResolverOpts) => any;
/**
 * resolve module version
 */
export declare const getModuleResolvePkg: ({ basePath, sourcePath, extensions, }: IModuleResolverOpts) => {
    name: string;
    version: string;
    peerDependencies: any;
};
/**
 * resolve module content
 */
export declare const getModuleResolveContent: ({ basePath, sourcePath, extensions, }: IModuleResolverOpts) => string;
export {};
