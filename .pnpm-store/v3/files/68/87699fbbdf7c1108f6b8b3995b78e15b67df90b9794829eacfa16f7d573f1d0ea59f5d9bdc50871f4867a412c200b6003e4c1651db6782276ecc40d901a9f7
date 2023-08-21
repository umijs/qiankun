/** @module pkg-install */
import { InstallConfig } from '../config';
import { SupportedPackageManagers } from '../types';
/**
 * Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {Promise<boolean>}
 */
export declare function isManagerInstalled(manager: SupportedPackageManagers): Promise<boolean>;
/**
 * SYNC: Checks if a given package manager is currently installed by checking its version
 *
 * @export
 * @param {SupportedPackageManagers} manager
 * @returns {boolean}
 */
export declare function isManagerInstalledSync(manager: SupportedPackageManagers): boolean;
/**
 * Returns the package manager currently active if the program is executed
 * through an npm or yarn script like:
 * ```bash
 * yarn run example
 * npm run example
 * ```
 *
 * @export
 * @returns {(SupportedPackageManagers | null)}
 */
export declare function getCurrentPackageManager(): SupportedPackageManagers | null;
/**
 * Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
export declare function getPackageManagerFromLockfile(config: InstallConfig): Promise<SupportedPackageManagers | null>;
/**
 * SYNC: Checks for the presence of package-lock.json or yarn.lock to determine which package manager is being used
 *
 * @export
 * @param {InstallConfig} config Config specifying current working directory
 * @returns
 */
export declare function getPackageManagerFromLockfileSync(config: InstallConfig): SupportedPackageManagers | null;
