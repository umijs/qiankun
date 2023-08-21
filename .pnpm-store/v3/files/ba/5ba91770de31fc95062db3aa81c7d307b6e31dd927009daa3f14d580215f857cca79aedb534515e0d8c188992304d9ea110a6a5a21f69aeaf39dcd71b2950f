"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esbuild_1 = require("@umijs/bundler-utils/compiled/esbuild");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
exports.default = async (fileAbsPath) => {
    const cache = (0, utils_1.getCache)('doctor-parser');
    // format: {path:mtime}
    const cacheKey = [fileAbsPath, fs_1.default.statSync(fileAbsPath).mtimeMs].join(':');
    const cacheRet = cache.getSync(cacheKey, '');
    const ret = { imports: [] };
    if (cacheRet)
        return cacheRet;
    await (0, esbuild_1.build)({
        // do not emit file
        write: false,
        // enable bundle for trigger onResolve hook, but all deps will be externalized
        bundle: true,
        logLevel: 'silent',
        format: 'esm',
        target: 'esnext',
        // esbuild need relative entry path
        entryPoints: [path_1.default.basename(fileAbsPath)],
        absWorkingDir: path_1.default.dirname(fileAbsPath),
        plugins: [
            {
                name: 'plugin-father-doctor',
                setup: (builder) => {
                    builder.onResolve({ filter: /.*/ }, ({ pluginData, ...args }) => {
                        if (args.kind !== 'entry-point') {
                            ret.imports.push(args);
                            return {
                                path: args.path,
                                // make all deps external
                                external: true,
                            };
                        }
                    });
                },
            },
        ],
    });
    cache.set(cacheKey, ret);
    return ret;
};
