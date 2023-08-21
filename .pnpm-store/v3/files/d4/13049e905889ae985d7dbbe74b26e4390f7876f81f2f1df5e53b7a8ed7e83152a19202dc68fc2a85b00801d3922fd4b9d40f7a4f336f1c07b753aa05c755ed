import { StdioOption, SupportedPackageManagers } from './types';
export declare type PackageManagerFlagConfig = {
    /** Installs the passed dependencies as dev dependencies */
    dev: boolean;
    /** Uses the save exact functionality of pkg manager */
    exact: boolean;
    /** Does not write the dependency to package.json (*only available for npm*) */
    noSave: boolean;
    /** Saves dependency as bundled dependency (*only available for npm*) */
    bundle: boolean;
    /** Runs package manager in verbose mode */
    verbose: boolean;
};
export declare type PackageManagerFlag = keyof PackageManagerFlagConfig;
export declare const ValidPackageFlags: Set<string>;
export declare type ProjectInstallFlagConfig = {
    dryRun: boolean;
    verbose: boolean;
};
export declare type ProjectInstallFlag = keyof ProjectInstallFlagConfig;
export declare const ValidProjectInstallFlags: Set<string>;
export declare type GenericInstallConfig = {
    /** Allows you to "force" package manager if available */
    prefer: SupportedPackageManagers | null;
    /** Passes to execa in which way the I/O should be passed */
    stdio: StdioOption | StdioOption[];
    /** Working directory in which to run the package manager */
    cwd: string;
};
/**
 * Available options to modify the behavior of `install` and `installSync`
 */
export declare type InstallConfig = PackageManagerFlagConfig & GenericInstallConfig & {
    /** Installs packages globally */
    global: boolean;
};
export declare type ProjectInstallConfig = GenericInstallConfig & ProjectInstallFlagConfig & {};
/**
 * Default options for `install` and `installSync`
 */
export declare const defaultInstallConfig: InstallConfig;
