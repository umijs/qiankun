import { PackageManagerFlag } from './config';
/** @module pkg-install */
export declare type PackageMap = {
    [packageName: string]: string | undefined;
};
export declare type PackageList = string[];
export declare type Packages = PackageMap | PackageList;
export declare type SupportedPackageManagers = 'yarn' | 'npm';
/**
 * What to do with I/O. This is passed to `execa`
 */
export declare type StdioOption = 'pipe' | 'ignore' | 'inherit';
export declare type ConstructArgumentsResult = {
    args: string[];
    ignoredFlags: PackageManagerFlag[];
};
