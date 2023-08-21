"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addLoader = void 0;
const fs_1 = __importDefault(require("fs"));
const loader_runner_1 = require("loader-runner");
const utils_1 = require("../../../utils");
const dts_1 = require("../dts");
const loaders = [];
/**
 * add loader
 * @param item  loader item
 */
function addLoader(item) {
    // only support simple test type currently, because the webpack condition is too complex
    // refer: https://github.com/webpack/webpack/blob/0f6c78cca174a73184fdc0d9c9c2bd376b48557c/lib/rules/RuleSetCompiler.js#L211
    if (!['string', 'function'].includes(typeof item.test) &&
        !(item.test instanceof RegExp)) {
        throw new Error(`Unsupported loader test in \`${item.id}\`, only string, function and regular expression are available.`);
    }
    loaders.push(item);
}
exports.addLoader = addLoader;
/**
 * loader module base on webpack loader-runner
 */
exports.default = async (fileAbsPath, opts) => {
    var _a;
    const cache = (0, utils_1.getCache)('bundless-loader');
    // format: {path:mtime:config:pkgDeps}
    const cacheKey = [
        fileAbsPath,
        fs_1.default.statSync(fileAbsPath).mtimeMs,
        JSON.stringify(opts.config),
        // use for babel opts generator in src/builder/utils.ts
        JSON.stringify(Object.assign({}, opts.pkg.dependencies, opts.pkg.peerDependencies)),
    ].join(':');
    const cacheRet = await cache.get(cacheKey, '');
    // use cache first
    if (cacheRet)
        return Promise.resolve({
            ...cacheRet,
            options: {
                ...cacheRet.options,
                // FIXME: shit code for avoid invalid declaration value when tsconfig changed
                declaration: /\.tsx?$/.test(fileAbsPath)
                    ? (_a = (0, dts_1.getTsconfig)(opts.cwd)) === null || _a === void 0 ? void 0 : _a.options.declaration
                    : false,
            },
        });
    // get matched loader by test
    const matched = loaders.find((item) => {
        switch (typeof item.test) {
            case 'string':
                return fileAbsPath.startsWith(item.test);
            case 'function':
                return item.test(fileAbsPath);
            default:
                // assume it is RegExp instance
                return item.test.test(fileAbsPath);
        }
    });
    if (matched) {
        // run matched loader
        return new Promise((resolve, reject) => {
            let outputOpts = {};
            (0, loader_runner_1.runLoaders)({
                resource: fileAbsPath,
                loaders: [{ loader: matched.loader, options: matched.options }],
                context: {
                    cwd: opts.cwd,
                    config: opts.config,
                    pkg: opts.pkg,
                    itemDistAbsPath: opts.itemDistAbsPath,
                    setOutputOptions(opts) {
                        outputOpts = opts;
                    },
                },
                readResource: fs_1.default.readFile.bind(fs_1.default),
            }, (err, { result }) => {
                if (err) {
                    reject(err);
                }
                else if (result) {
                    // FIXME: handle buffer type?
                    const ret = {
                        content: result[0],
                        options: outputOpts,
                    };
                    // save cache then resolve
                    cache.set(cacheKey, ret);
                    resolve(ret);
                }
                else {
                    resolve(void 0);
                }
            });
        });
    }
};
