import { logger as umiLogger } from '@umijs/utils';
import Cache from 'file-system-cache';
import { IApi } from './types';
declare const caches: Record<string, ReturnType<typeof Cache>>;
/**
 * get file-system cache for specific namespace
 */
export declare function getCache(ns: string): (typeof caches)['0'];
/**
 * get valid type field value from package.json
 */
export declare function getTypeFromPkgJson(pkg: IApi['pkg']): string | undefined;
/**
 * restore xxx for @types/xxx
 */
export declare function getPkgNameFromTypesOrg(name: string): string;
/**
 * get @types/xxx for xxx
 */
export declare function getPkgNameWithTypesOrg(name: string): string;
/**
 * get d.ts file path and package path for NPM package.json path
 */
export declare function getDtsInfoForPkgPath(pkgPath: string): {
    pkgPath: string;
    dtsPath: string;
} | null;
/**
 * Determine if it is a native module
 */
export declare const isBuiltInModule: (pkgName: string) => boolean;
/**
 * get package.json path for specific NPM package
 * @see https://github.com/nodejs/node/issues/33460
 */
export declare function getDepPkgPath(dep: string, cwd: string): string;
/**
 * get all nested type dependencies for specific NPM package
 */
export declare function getNestedTypeDepsForPkg(name: string, cwd: string, externals: Record<string, string>, deps?: Record<string, string>): Record<string, string>;
/**
 * wrap umi logger for quiet & timestamp
 */
type IUmiLogger = typeof umiLogger;
type IFatherLogger = IUmiLogger & {
    quietOnly: IUmiLogger;
    quietExpect: IUmiLogger;
    setQuiet: (quiet: boolean) => void;
    _quiet: boolean;
};
export declare const logger: Omit<IFatherLogger, '_quiet'>;
export declare function isFilePath(path: string): boolean;
export declare function getPkgNameFromPath(p: string): string | undefined;
export declare const getDepPkgName: (name: string, packageJson: {
    name: string;
}) => string;
export {};
