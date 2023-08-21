const { promises: fsPromises } = require('fs');
const path = require('path');
const commonPathPrefix = require('common-path-prefix');
const findUp = require('find-up');

/** @type {string | undefined} */
let packageJsonType;

/**
 * Infers the current active module system from loader context and options.
 * @this {import('webpack').loader.LoaderContext}
 * @param {import('webpack').ModuleFilenameHelpers} ModuleFilenameHelpers Webpack's module filename helpers.
 * @param {import('../types').NormalizedLoaderOptions} options The normalized loader options.
 * @return {Promise<'esm' | 'cjs'>} The inferred module system.
 */
async function getModuleSystem(ModuleFilenameHelpers, options) {
  // Check loader options -
  // if `esModule` is set we don't have to do extra guess work.
  switch (typeof options.esModule) {
    case 'boolean': {
      return options.esModule ? 'esm' : 'cjs';
    }
    case 'object': {
      if (
        options.esModule.include &&
        ModuleFilenameHelpers.matchPart(this.resourcePath, options.esModule.include)
      ) {
        return 'esm';
      }
      if (
        options.esModule.exclude &&
        ModuleFilenameHelpers.matchPart(this.resourcePath, options.esModule.exclude)
      ) {
        return 'cjs';
      }

      break;
    }
    default: // Do nothing
  }

  // Check current resource's extension
  if (/\.mjs$/.test(this.resourcePath)) return 'esm';
  if (/\.cjs$/.test(this.resourcePath)) return 'cjs';

  // Load users' `package.json` -
  // We will cache the results in a global variable so it will only be parsed once.
  if (!packageJsonType) {
    try {
      const commonPath = commonPathPrefix([this.rootContext, this.resourcePath], '/');
      const stopPath = path.resolve(commonPath, '..');

      const packageJsonPath = await findUp(
        (dir) => {
          if (dir === stopPath) return findUp.stop;
          return 'package.json';
        },
        { cwd: path.dirname(this.resourcePath) }
      );

      const buffer = await fsPromises.readFile(packageJsonPath, { encoding: 'utf-8' });
      const rawPackageJson = buffer.toString('utf-8');
      ({ type: packageJsonType } = JSON.parse(rawPackageJson));
    } catch (e) {
      // Failed to parse `package.json`, do nothing.
    }
  }

  // Check `package.json` for the `type` field -
  // fallback to use `cjs` for anything ambiguous.
  return packageJsonType === 'module' ? 'esm' : 'cjs';
}

module.exports = getModuleSystem;
