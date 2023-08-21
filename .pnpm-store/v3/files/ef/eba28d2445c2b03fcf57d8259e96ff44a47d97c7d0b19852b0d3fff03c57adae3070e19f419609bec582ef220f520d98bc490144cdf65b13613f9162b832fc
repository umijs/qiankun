"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esbuild_1 = require("@umijs/bundler-utils/compiled/esbuild");
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const utils_2 = require("../../../utils");
/**
 * create a replacer for transform alias path to relative path
 */
function createAliasReplacer(opts) {
    const alias = opts.alias || {};
    return function replacer(context, request) {
        let absReq = '';
        for (const rule in alias) {
            // replace prefix
            if (request.startsWith(`${rule}/`)) {
                absReq = path_1.default.join(alias[rule], request.slice(rule.length + 1));
                break;
            }
            // replace full path
            if (request === rule) {
                absReq = alias[rule];
                break;
            }
        }
        // transform to relative path
        if (absReq) {
            const rltReq = (0, utils_1.winPath)(path_1.default.relative(context, absReq));
            return rltReq.startsWith('..') ? rltReq : `./${rltReq}`;
        }
        return request;
    };
}
/**
 * esbuild transformer
 */
const esbuildTransformer = async function () {
    const replacer = createAliasReplacer({ alias: this.config.alias });
    let { outputFiles } = await (0, esbuild_1.build)({
        // do not emit file
        write: false,
        // enable bundle for trigger onResolve hook, but all deps will be externalized
        bundle: true,
        // write false will not write file to file system，but sourcemap need this to get sources
        outdir: path_1.default.relative(this.paths.cwd, path_1.default.dirname(this.paths.itemDistAbsPath)),
        sourcemap: this.config.sourcemap && 'linked',
        logLevel: 'silent',
        format: this.config.format,
        define: this.config.define,
        platform: this.config.platform,
        target: (0, utils_2.getBundlessTargets)(this.config),
        charset: 'utf8',
        // esbuild need relative entry path
        entryPoints: [path_1.default.relative(this.paths.cwd, this.paths.fileAbsPath)],
        absWorkingDir: this.paths.cwd,
        plugins: [
            {
                name: 'plugin-father-alias',
                setup: (builder) => {
                    builder.onResolve({ filter: /.*/ }, (args) => {
                        if (args.kind === 'entry-point') {
                            // skip entry point
                            return { path: path_1.default.join(args.resolveDir, args.path) };
                        }
                        else if (args.path.startsWith('.')) {
                            // skip relative module
                            return { path: args.path, external: true };
                        }
                        // try to replace alias to relative path
                        return {
                            path: replacer(args.resolveDir, args.path),
                            external: true,
                        };
                    });
                },
            },
        ],
    });
    if (outputFiles.length === 2) {
        const [map, result] = outputFiles;
        return [result.text, map.text];
    }
    return [outputFiles[0].text];
};
exports.default = esbuildTransformer;
