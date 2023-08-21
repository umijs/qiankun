"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const api_extractor_1 = require("@microsoft/api-extractor");
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const utils_2 = require("../utils");
const DEFAULT_OUTPUT_DIR = './compiled';
/**
 * get dts rollup config
 */
function getDtsConfig(opts) {
    return {
        pkg: require(opts.pkgPath),
        output: opts.outputPath,
        // generate prepare config for @microsoft/api-extractor
        _maePrepareConfig: {
            configObject: {
                mainEntryPointFilePath: opts.dtsPath,
                projectFolder: path_1.default.dirname(opts.pkgPath),
                // enable dts rollup feature
                dtsRollup: {
                    enabled: true,
                    publicTrimmedFilePath: opts.outputPath,
                },
                // configure ts compiler
                compiler: {
                    overrideTsconfig: {
                        compilerOptions: {
                            target: 'es5',
                            module: 'commonjs',
                            moduleResolution: 'node',
                            strict: true,
                            skipLibCheck: true,
                        },
                        include: [opts.dtsPath],
                    },
                },
                // configure logger
                messages: {
                    extractorMessageReporting: {
                        // only log error by default
                        default: { logLevel: 'error' },
                        // omit release tag checking
                        'ae-missing-release-tag': { logLevel: 'none' },
                    },
                },
            },
            configObjectFullPath: undefined,
            packageJsonFullPath: opts.pkgPath,
        },
        // after externals ready, generate final extractor config below
        maeConfig: undefined,
        externals: undefined,
    };
}
/**
 * get relative externals for specific pre-bundle pkg from other pre-bundle deps
 * @note  for example, "compiled/a" can be externalized in "compiled/b" as "../a"
 */
function getRltExternalsFromDeps(depExternals, current) {
    return Object.entries(depExternals).reduce((r, [dep, target]) => {
        // skip self
        if (dep !== current.name) {
            // transform dep externals path to relative path
            r[dep] = (0, utils_1.winPath)(path_1.default.relative(path_1.default.dirname(current.output), path_1.default.dirname(target)));
        }
        return r;
    }, {});
}
function getConfig(opts) {
    // external project dependencies by default
    const pkgExternals = Object.keys(Object.assign({}, opts.pkg.dependencies, opts.pkg.peerDependencies)).reduce((r, dep) => ({ ...r, [dep]: dep }), {});
    const depExternals = {};
    const dtsDepExternals = {};
    const config = { deps: {}, dts: {} };
    const { output, deps = [], extraExternals = {}, extraDtsDeps = [], } = opts.userConfig;
    // process deps config
    Object.entries(deps).forEach(([dep, depConfig]) => {
        var _a;
        // handle array deps
        let depName = Array.isArray(deps) ? deps[parseInt(dep)] : dep;
        depConfig = Array.isArray(deps) ? {} : depConfig;
        const depPath = (0, utils_2.isBuiltInModule)(depName) ? `${depName}/` : depName;
        const depEntryPath = require.resolve(depPath, { paths: [opts.cwd] });
        const depPkgPath = (0, utils_2.getDepPkgPath)(depName, opts.cwd);
        const depTypeInfo = depConfig.dts !== false ? (0, utils_2.getDtsInfoForPkgPath)(depPkgPath) : null;
        const depPkg = require(depPkgPath);
        depName = (0, utils_2.getDepPkgName)(depName, depPkg);
        // generate bundle config
        config.deps[depEntryPath] = {
            nccConfig: {
                minify: (_a = depConfig.minify) !== null && _a !== void 0 ? _a : true,
                target: 'es5',
                quiet: true,
                externals: {},
            },
            pkg: depPkg,
            output: path_1.default.resolve(opts.cwd, `${output || DEFAULT_OUTPUT_DIR}/${depName}/index.js`),
        };
        // generate api-extractor config
        if (depTypeInfo) {
            const outputFilePath = config.deps[depEntryPath].output.replace('.js', '.d.ts');
            config.dts[depTypeInfo.dtsPath] = getDtsConfig({
                cwd: opts.cwd,
                pkgPath: depPkgPath,
                dtsPath: depTypeInfo.dtsPath,
                outputPath: outputFilePath,
            });
        }
        // prepare deps externals
        depExternals[depName] = config.deps[depEntryPath].output;
    });
    // process extraDtsDeps config
    extraDtsDeps.forEach((pkg) => {
        const depTypeInfo = (0, utils_2.getDtsInfoForPkgPath)((0, utils_2.getDepPkgPath)(pkg, opts.cwd));
        if (depTypeInfo) {
            config.dts[depTypeInfo.dtsPath] = getDtsConfig({
                cwd: opts.cwd,
                pkgPath: depTypeInfo.pkgPath,
                dtsPath: depTypeInfo.dtsPath,
                outputPath: path_1.default.resolve(opts.cwd, `${DEFAULT_OUTPUT_DIR}/${pkg}/index.d.ts`),
            });
            dtsDepExternals[pkg] = config.dts[depTypeInfo.dtsPath].output;
        }
    });
    // process externals for deps
    Object.values(config.deps).forEach((depConfig) => {
        const rltDepExternals = getRltExternalsFromDeps(depExternals, {
            name: depConfig.pkg.name,
            output: depConfig.output,
        });
        depConfig.nccConfig.externals = {
            ...pkgExternals,
            ...rltDepExternals,
            ...extraExternals,
        };
    });
    // process externals for dts
    Object.values(config.dts).forEach((dtsConfig) => {
        const rltDepExternals = getRltExternalsFromDeps({
            ...depExternals,
            ...dtsDepExternals,
        }, {
            name: dtsConfig.pkg.name,
            output: dtsConfig.output,
        });
        // always skip bundle external pkgs
        const nestedDeps = (0, utils_2.getNestedTypeDepsForPkg)(dtsConfig.pkg.name, opts.cwd, {
            ...pkgExternals,
            ...depExternals,
            ...dtsDepExternals,
            ...extraExternals,
        });
        dtsConfig._maePrepareConfig.configObject.bundledPackages =
            Object.keys(nestedDeps);
        // prepare externals config
        dtsConfig.externals = {
            ...pkgExternals,
            ...rltDepExternals,
            ...extraExternals,
        };
        // generate the final extract config
        dtsConfig.maeConfig = api_extractor_1.ExtractorConfig.prepare(dtsConfig._maePrepareConfig);
    });
    return config;
}
exports.getConfig = getConfig;
