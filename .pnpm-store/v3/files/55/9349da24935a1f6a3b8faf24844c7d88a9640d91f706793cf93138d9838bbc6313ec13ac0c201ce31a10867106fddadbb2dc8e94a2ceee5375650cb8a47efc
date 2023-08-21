"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../constants");
const utils_2 = require("../../utils");
const utils_3 = require("../utils");
const bundler = (0, utils_1.importLazy)(path_1.default.dirname(require.resolve('@umijs/bundler-webpack/package.json')));
const { CSSMinifier, JSMinifier, } = (0, utils_1.importLazy)(require.resolve('@umijs/bundler-webpack/dist/types'));
async function bundless(opts) {
    const enableCache = process.env.FATHER_CACHE !== 'none';
    const closeHandlers = [];
    for (let i = 0; i < opts.configProvider.configs.length; i += 1) {
        const config = opts.configProvider.configs[i];
        const { plugins: extraPostCSSPlugins, ...postcssLoader } = config.postcssOptions || {};
        // workaround for combine continuous onBuildComplete log in watch mode
        const logStatus = utils_1.lodash.debounce(() => utils_2.logger.info(`Bundle from ${utils_1.chalk.yellow(config.entry)} to ${utils_1.chalk.yellow(path_1.default.join(config.output.path, config.output.filename))}`), 100, { leading: true, trailing: false });
        // log for normal build
        !opts.watch && logStatus();
        await bundler.build({
            cwd: opts.cwd,
            watch: opts.watch,
            config: {
                alias: config.alias,
                autoprefixer: config.autoprefixer,
                chainWebpack: config.chainWebpack,
                define: config.define,
                devtool: config.sourcemap && 'source-map',
                externals: config.externals,
                outputPath: config.output.path,
                // postcss config
                extraPostCSSPlugins,
                postcssLoader,
                ...(config.extractCSS !== false ? {} : { styleLoader: {} }),
                // less config
                theme: config.theme,
                // compatible with IE11 by default
                targets: (0, utils_3.getBundleTargets)(config),
                jsMinifier: JSMinifier.terser,
                cssMinifier: CSSMinifier.cssnano,
                extraBabelIncludes: [/node_modules/],
            },
            entry: {
                [path_1.default.parse(config.output.filename).name]: path_1.default.join(opts.cwd, config.entry),
            },
            babelPreset: [
                require.resolve('@umijs/babel-preset-umi'),
                {
                    presetEnv: {
                        targets: (0, utils_3.getBundleTargets)(config),
                    },
                    presetReact: (0, utils_3.getBabelPresetReactOpts)(opts.configProvider.pkg, opts.cwd),
                    presetTypeScript: {},
                    pluginTransformRuntime: {},
                    pluginLockCoreJS: {},
                    pluginDynamicImportNode: false,
                    pluginStyledComponents: (0, utils_3.getBabelStyledComponentsOpts)(opts.configProvider.pkg),
                },
            ],
            beforeBabelPlugins: [require.resolve('babel-plugin-dynamic-import-node')],
            extraBabelPresets: config.extraBabelPresets,
            extraBabelPlugins: config.extraBabelPlugins,
            // configure library related options
            chainWebpack(memo) {
                memo.output.libraryTarget('umd');
                if (config === null || config === void 0 ? void 0 : config.name) {
                    memo.output.library(config.name);
                }
                // modify webpack target
                if (config.platform === 'node') {
                    memo.target('node');
                }
                if (enableCache) {
                    // use father version as cache version
                    memo.merge({
                        cache: { version: require('../../../package.json').version },
                    });
                }
                // also bundle svg as asset, because father force disable svgr
                const imgRule = memo.module.rule('asset').oneOf('image');
                imgRule.test(new RegExp(imgRule.get('test').source.replace(/(\|png)/, '$1|svg')));
                // disable progress bar
                memo.plugins.delete('progress-plugin');
                // auto bump analyze port
                /* istanbul ignore if -- @preserve */
                if (process.env.ANALYZE) {
                    memo.plugin('webpack-bundle-analyzer').tap((args) => {
                        args[0].analyzerPort += i;
                        return args;
                    });
                }
                return memo;
            },
            // enable webpack persistent cache
            ...(enableCache
                ? {
                    cache: {
                        buildDependencies: opts.buildDependencies,
                        cacheDirectory: path_1.default.join(opts.cwd, constants_1.CACHE_PATH, 'bundle-webpack'),
                    },
                }
                : {}),
            // collect close handlers for watch mode
            ...(opts.watch
                ? {
                    onBuildComplete({ isFirstCompile, close }) {
                        if (isFirstCompile)
                            closeHandlers.push(close);
                        // log for watch mode
                        else
                            logStatus();
                    },
                }
                : {}),
            disableCopy: true,
        });
    }
    // return watching closer for watch mode
    if (opts.watch) {
        return {
            close() {
                return Promise.all(closeHandlers.map((handler) => new Promise((resolve) => handler(resolve))));
            },
        };
    }
}
exports.default = bundless;
