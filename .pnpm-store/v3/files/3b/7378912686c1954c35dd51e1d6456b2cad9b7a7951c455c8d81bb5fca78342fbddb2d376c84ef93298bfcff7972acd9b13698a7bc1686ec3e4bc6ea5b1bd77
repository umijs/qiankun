/** @module pkg-install */
import execa from 'execa';
import { InstallConfig, PackageManagerFlag } from './config';
import { PackageList, Packages } from './types';
export declare type InstallResult = execa.ExecaReturns & {
    ignoredFlags: PackageManagerFlag[];
};
/**
 * Installs a passed set of packages using either npm or yarn. Depending on:
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<InstallResult>}
 */
export declare function install(packages: Packages, options?: Partial<InstallConfig>): Promise<InstallResult>;
/**
 * SYNC VERSION. Installs a passed set of packages using either npm or yarn. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Packages} packages List or object of packages to be installed
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {InstallResult}
 */
export declare function installSync(packages: PackageList, options?: Partial<InstallConfig>): InstallResult;
/**
 * Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {Promise<execa.ExecaReturns>}
 */
export declare function projectInstall(options?: Partial<InstallConfig>): Promise<execa.ExecaReturns>;
/**
 * SYNC VERSION. Runs `npm install` or `yarn install` for the project. Depending on:
 *
 * 1) If you specify a preferred package manager
 * 2) If the program is currently running in an npm or yarn script (using npm run or yarn run)
 * 3) If there is a yarn.lock or package-lock.json available
 * 4) What package manager is available
 *
 * @export
 * @param {Partial<InstallConfig>} [options={}] Options to modify behavior
 * @returns {execa.ExecaReturns}
 */
export declare function projectInstallSync(options?: Partial<InstallConfig>): execa.ExecaReturns;
