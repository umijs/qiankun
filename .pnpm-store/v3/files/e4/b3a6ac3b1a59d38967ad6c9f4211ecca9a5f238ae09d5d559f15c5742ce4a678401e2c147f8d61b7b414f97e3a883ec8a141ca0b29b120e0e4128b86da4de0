"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/bundler-utils/compiled/babel/core");
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const types_1 = require("../../../../types");
const utils_2 = require("../../../utils");
/**
 * parse for stringify define value, use to babel-plugin-transform-define
 */
function getParsedDefine(define) {
    return Object.entries(define).reduce((result, [name, value]) => ({
        ...result,
        [name]: JSON.parse(value),
    }), {});
}
/**
 * babel transformer
 */
const babelTransformer = function (content) {
    var _a, _b;
    const { extraBabelPlugins = [], extraBabelPresets = [], define, alias: oAlias = {}, } = this.config;
    // TODO: correct optional in umi types and replace any here
    const presetOpts = {
        presetEnv: {
            targets: (0, utils_2.getBundlessTargets)(this.config),
            modules: this.config.format === types_1.IFatherBundlessTypes.ESM ? false : 'auto',
        },
        presetReact: (0, utils_2.getBabelPresetReactOpts)(this.pkg, path_1.default.dirname(this.paths.fileAbsPath)),
        presetTypeScript: {},
        pluginStyledComponents: (0, utils_2.getBabelStyledComponentsOpts)(this.pkg),
    };
    // transform alias to relative path for babel-plugin-module-resolver
    const alias = Object.entries(oAlias).reduce((result, [name, target]) => {
        if (path_1.default.isAbsolute(target)) {
            result[name] = (0, utils_1.winPath)(path_1.default.relative(this.paths.cwd, target));
            result[name] = (0, utils_2.ensureRelativePath)(result[name]);
        }
        else {
            result[name] = target;
        }
        return result;
    }, {});
    if ((_a = this.pkg.dependencies) === null || _a === void 0 ? void 0 : _a['@babel/runtime']) {
        presetOpts.pluginTransformRuntime = {
            absoluteRuntime: false,
            // still use legacy esm helpers, to avoid double imports of runtime helpers
            // from webpack 4 bundlers, such as Umi 3, antd-tools & etc.
            useESModules: this.config.format === types_1.IFatherBundlessTypes.ESM ? true : false,
            version: (_b = this.pkg.dependencies) === null || _b === void 0 ? void 0 : _b['@babel/runtime'],
        };
    }
    const { code, map } = (0, core_1.transform)(content, {
        filename: this.paths.fileAbsPath,
        cwd: this.paths.cwd,
        babelrc: false,
        configFile: false,
        sourceMaps: this.config.sourcemap,
        sourceFileName: this.config.sourcemap
            ? path_1.default.relative(path_1.default.dirname(this.paths.itemDistAbsPath), this.paths.fileAbsPath)
            : undefined,
        presets: [
            [require.resolve('@umijs/babel-preset-umi'), presetOpts],
            ...extraBabelPresets,
        ],
        plugins: [
            [
                require.resolve('babel-plugin-module-resolver'),
                {
                    alias: alias,
                    cwd: this.paths.cwd,
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.json'],
                },
            ],
            ...(define
                ? [
                    [
                        require.resolve('babel-plugin-transform-define'),
                        getParsedDefine(define),
                    ],
                ]
                : []),
            ...extraBabelPlugins,
        ],
    });
    if (map) {
        return [
            (0, utils_2.addSourceMappingUrl)(code, this.paths.itemDistAbsPath),
            JSON.stringify(map),
        ];
    }
    return [code];
};
exports.default = babelTransformer;
