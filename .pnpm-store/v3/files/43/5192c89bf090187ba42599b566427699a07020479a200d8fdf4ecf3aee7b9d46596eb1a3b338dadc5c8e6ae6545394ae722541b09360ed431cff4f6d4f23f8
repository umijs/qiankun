"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfigProviders = exports.BundlessConfigProvider = exports.BundleConfigProvider = exports.normalizeUserConfig = exports.convertAliasByTsconfigPaths = void 0;
const utils_1 = require("@umijs/utils");
const minimatch_1 = require("minimatch");
const path_1 = __importDefault(require("path"));
const tsconfig_paths_1 = require("tsconfig-paths");
const MappingEntry = __importStar(require("tsconfig-paths/lib/mapping-entry"));
const types_1 = require("../types");
const utils_2 = require("../utils");
/**
 * generate bundle filename by package name
 */
function getAutoBundleFilename(pkgName) {
    return pkgName ? pkgName.replace(/^@[^/]+\//, '') : 'index';
}
/**
 *
 * convert alias from tsconfig paths
 * @export
 * @param {string} cwd
 */
function convertAliasByTsconfigPaths(cwd) {
    const config = (0, tsconfig_paths_1.loadConfig)(cwd);
    const bundle = {};
    const bundless = {};
    if (config.resultType === 'success') {
        const { absoluteBaseUrl, paths } = config;
        let absolutePaths = MappingEntry.getAbsoluteMappingEntries(absoluteBaseUrl, paths, true);
        absolutePaths.forEach((entry) => {
            if (entry.pattern === '*')
                return;
            const [physicalPathPattern] = entry.paths;
            const name = entry.pattern.replace(/\/\*$/, '');
            const target = (0, utils_1.winPath)(physicalPathPattern).replace(/\/\*$/, '');
            bundle[name] = target;
            // for bundless, only convert paths which within cwd
            if (target.startsWith(`${(0, utils_1.winPath)(cwd)}/`)) {
                bundless[name] = target;
            }
        });
    }
    return { bundle, bundless };
}
exports.convertAliasByTsconfigPaths = convertAliasByTsconfigPaths;
/**
 * normalize user config to bundler configs
 * @param userConfig  config from user
 */
function normalizeUserConfig(userConfig, pkg) {
    const configs = [];
    const { umd, esm, cjs, ...baseConfig } = userConfig;
    // normalize umd config
    if (umd) {
        const entryConfig = umd.entry;
        const output = typeof umd.output === 'object' ? umd.output : { path: umd.output };
        const bundleConfig = {
            type: types_1.IFatherBuildTypes.BUNDLE,
            bundler: 'webpack',
            ...baseConfig,
            // override base configs from umd config
            ...umd,
            // generate default output
            output: {
                // default to generate filename from package name
                filename: output.filename || `${getAutoBundleFilename(pkg.name)}.min.js`,
                // default to output dist
                path: output.path || 'dist/umd',
            },
        };
        if (typeof entryConfig === 'object') {
            // extract multiple entries to single configs
            Object.keys(entryConfig).forEach((entry) => {
                const outputConfig = entryConfig[entry].output;
                const entryOutput = typeof outputConfig === 'object'
                    ? outputConfig
                    : { path: outputConfig };
                configs.push({
                    ...bundleConfig,
                    // override all configs from entry config
                    ...entryConfig[entry],
                    entry,
                    // override output
                    output: {
                        filename: entryOutput.filename || `${path_1.default.parse(entry).name}.min.js`,
                        path: entryOutput.path || bundleConfig.output.path,
                    },
                });
            });
        }
        else {
            // generate single entry to single config
            configs.push({
                ...bundleConfig,
                // default to bundle src/index
                entry: entryConfig || 'src/index',
            });
        }
    }
    // normalize esm config
    Object.entries({
        ...(esm ? { esm } : {}),
        ...(cjs ? { cjs } : {}),
    }).forEach(([formatName, formatConfig]) => {
        const { overrides = {}, ...esmBaseConfig } = formatConfig;
        const defaultPlatform = formatName === 'esm'
            ? types_1.IFatherPlatformTypes.BROWSER
            : types_1.IFatherPlatformTypes.NODE;
        const bundlessConfig = {
            type: types_1.IFatherBuildTypes.BUNDLESS,
            format: formatName,
            platform: userConfig.platform || defaultPlatform,
            ...baseConfig,
            ...esmBaseConfig,
        };
        // generate config for input
        const rootConfig = {
            // default to transform src
            input: 'src',
            // default to output to dist
            output: `dist/${formatName}`,
            // default to use auto transformer
            transformer: bundlessConfig.platform === types_1.IFatherPlatformTypes.NODE
                ? types_1.IFatherJSTransformerTypes.ESBUILD
                : types_1.IFatherJSTransformerTypes.BABEL,
            ...bundlessConfig,
            // transform overrides inputs to ignores
            ignores: Object.keys(overrides)
                .map((i) => `${i}/**`)
                .concat(bundlessConfig.ignores || []),
        };
        configs.push(rootConfig);
        // generate config for overrides
        Object.keys(overrides).forEach((oInput) => {
            const overridePlatform = overrides[oInput].platform || bundlessConfig.platform;
            // validate override input
            if (!oInput.startsWith(`${rootConfig.input}/`)) {
                throw new Error(`Override input ${oInput} must be a subpath of ${formatName}.input!`);
            }
            configs.push({
                // default to use auto transformer
                transformer: overridePlatform === types_1.IFatherPlatformTypes.NODE
                    ? types_1.IFatherJSTransformerTypes.ESBUILD
                    : types_1.IFatherJSTransformerTypes.BABEL,
                // default to output relative root config
                output: `${rootConfig.output}/${(0, utils_1.winPath)(path_1.default.relative(rootConfig.input, oInput))}`,
                ...bundlessConfig,
                // override all configs for different input
                ...overrides[oInput],
                // specific different input
                input: oInput,
                // transform another child overrides to ignores
                // for support to transform src/a and src/a/child with different configs
                ignores: Object.keys(overrides)
                    .filter((i) => i.startsWith(oInput) && i !== oInput)
                    .map((i) => `${i}/**`)
                    .concat(bundlessConfig.ignores || []),
            });
        });
    });
    return configs;
}
exports.normalizeUserConfig = normalizeUserConfig;
class Minimatcher {
    constructor(pattern, ignores = []) {
        this.ignoreMatchers = [];
        this.matcher = new minimatch_1.Minimatch(`${pattern}/**`);
        ignores.forEach((i) => {
            this.ignoreMatchers.push(new minimatch_1.Minimatch(i, { dot: true }));
            // see also: https://github.com/isaacs/node-glob/blob/main/common.js#L37
            if (i.slice(-3) === '/**') {
                this.ignoreMatchers.push(new minimatch_1.Minimatch(i.replace(/(\/\*\*)+$/, ''), { dot: true }));
            }
        });
    }
    match(filePath) {
        let flag = false;
        // check input match
        if (this.matcher.match(filePath)) {
            flag = true;
            for (const m of this.ignoreMatchers) {
                // mark flag false if filePath match ignore matcher
                if (m.match(filePath)) {
                    flag = false;
                    // stop check if current ignore glob not start with "!"
                    // but for the negate glob, we should continue to find other negate glob which exclude current filePath
                    if (!m.negate)
                        break;
                }
                else if (m.negate) {
                    // stop check and mark flag true, if some negate glob exclude current filePath
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }
}
class ConfigProvider {
    constructor(pkg) {
        this.pkg = pkg;
    }
    onConfigChange() {
        // not implemented
    }
}
class BundleConfigProvider extends ConfigProvider {
    constructor(configs, pkg) {
        super(pkg);
        this.type = types_1.IFatherBuildTypes.BUNDLE;
        this.configs = [];
        this.configs = configs;
    }
}
exports.BundleConfigProvider = BundleConfigProvider;
class BundlessConfigProvider extends ConfigProvider {
    constructor(configs, pkg) {
        super(pkg);
        this.type = types_1.IFatherBuildTypes.BUNDLESS;
        this.configs = [];
        this.input = '';
        this.output = '';
        this.matchers = [];
        this.configs = configs;
        this.input = configs[0].input;
        this.output = configs[0].output;
        configs.forEach((config) => {
            this.matchers.push(new Minimatcher(config.input, config.ignores));
        });
    }
    // TODO 这里匹配有问题，会先匹配到全局的，例如 src/async 会被 src/** 匹配到
    getConfigForFile(filePath) {
        return this.configs[this.matchers.findIndex((m) => m.match(filePath))];
    }
}
exports.BundlessConfigProvider = BundlessConfigProvider;
function createConfigProviders(userConfig, pkg, cwd) {
    const providers = { bundless: {} };
    const configs = normalizeUserConfig(userConfig, pkg);
    // convert alias from tsconfig paths
    const aliasFromPaths = convertAliasByTsconfigPaths(cwd);
    utils_2.logger.debug('Convert alias from tsconfig.json:', aliasFromPaths);
    const { bundle, bundless } = configs.reduce((r, config) => {
        if (config.type === types_1.IFatherBuildTypes.BUNDLE) {
            config.alias = { ...aliasFromPaths.bundle, ...config.alias };
            r.bundle.push(config);
        }
        else if (config.type === types_1.IFatherBuildTypes.BUNDLESS) {
            config.alias = { ...aliasFromPaths.bundless, ...config.alias };
            // Handling file suffixes only bundless mode needs to be handled
            for (let target in config.alias) {
                // If the file suffix is js remove the suffix
                const aPath = config.alias[target];
                config.alias[target] = aPath.replace(/\.(t|j)sx?$/, '');
            }
            r.bundless[config.format].push(config);
        }
        return r;
    }, { bundle: [], bundless: { esm: [], cjs: [] } });
    if (bundle.length) {
        providers.bundle = new BundleConfigProvider(bundle, pkg);
    }
    if (bundless.cjs.length) {
        providers.bundless.cjs = new BundlessConfigProvider(bundless.cjs, pkg);
    }
    if (bundless.esm.length) {
        providers.bundless.esm = new BundlessConfigProvider(bundless.esm, pkg);
    }
    return providers;
}
exports.createConfigProviders = createConfigProviders;
