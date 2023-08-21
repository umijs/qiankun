"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidPackageFlags = new Set([
    'dev',
    'exact',
    'noSave',
    'bundle',
    'verbose',
]);
exports.ValidProjectInstallFlags = new Set(['dryRun', 'verbose']);
/**
 * Default options for `install` and `installSync`
 */
exports.defaultInstallConfig = {
    /** Installs the passed dependencies as dev dependencies */
    dev: false,
    /** Allows you to "force" package manager if available */
    prefer: null,
    /** Uses the save exact functionality of pkg manager */
    exact: false,
    /** Does not write the dependency to package.json (*only available for npm*) */
    noSave: false,
    /** Saves dependency as bundled dependency (*only available for npm*) */
    bundle: false,
    /** Runs package manager in verbose mode */
    verbose: false,
    /** Installs packages globally */
    global: false,
    /** Passes to execa in which way the I/O should be passed */
    stdio: 'pipe',
    /** Working directory in which to run the package manager */
    cwd: process.cwd(),
};
//# sourceMappingURL=config.js.map