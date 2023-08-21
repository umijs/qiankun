interface IModuleResolverOpts {
    basePath: string;
    sourcePath: string;
    extensions?: string[];
    silent?: boolean;
}
/**
 * get package root path if it is a local package
 * @param pkg   package name
 */
export declare const getHostPkgPath: (pkg: string) => string;
/**
 * resolve module path base on umi context (alias)
 */
export declare const getModuleResolvePath: ({ basePath, sourcePath, extensions, silent, }: IModuleResolverOpts) => any;
/**
 * get package info by modulePath
 */
export declare const getPackageInfo: (modulePath: string) => {
    name: string;
    version: string;
    peerDependencies: any;
};
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
/**
 * resolve host module version
 */
export declare const getHostModuleResolvePkg: (requireStr: string) => {
    name: string;
    version: string;
    peerDependencies: any;
};
export {};
