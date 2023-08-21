"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAbsPathWithRelativePath = void 0;
const utils_1 = require("@umijs/utils");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const types_1 = require("../../../../types");
const utils_2 = require("../../../utils");
const isTs = (p) => p.endsWith('.ts') || p.endsWith('.tsx');
const isDirectory = (path) => {
    try {
        return (0, fs_1.lstatSync)(path).isDirectory();
    }
    catch {
        return false;
    }
};
/**
 * transform alias to relative path for swc paths
 * @param opts
 * @returns {Record<string, string[]>} alias
 */
const getSWCAlias = (opts) => {
    const { fileAbsPath, alias = {}, cwd } = opts;
    return Object.entries(alias).reduce((result, [name, target]) => {
        if (path_1.default.isAbsolute(target)) {
            const isDirAlias = isDirectory(target);
            let relativePath = (0, utils_1.winPath)(isDirAlias
                ? path_1.default.relative(cwd, target)
                : path_1.default.relative(path_1.default.dirname(fileAbsPath), target));
            relativePath = (0, utils_2.ensureRelativePath)(relativePath);
            // suffix * for dir alias
            const aliasName = isDirAlias ? `${name}/*` : name;
            const aliasPath = isDirAlias ? `${relativePath}/*` : relativePath;
            // fit path omit index
            // eg: ./test/index.ts => ./test
            if (isDirAlias) {
                result[name] = [relativePath];
            }
            result[aliasName] = [aliasPath];
        }
        else {
            result[name] = [target];
        }
        return result;
    }, {});
};
const getModuleType = (type) => {
    if (type === types_1.IFatherBundlessTypes.CJS) {
        return 'commonjs';
    }
    return 'es6';
};
/**
 * replace absolute path with relative path
 */
const replaceAbsPathWithRelativePath = (opts) => {
    const cwd = (0, utils_1.winPath)(opts.cwd);
    const fileAbsPath = (0, utils_1.winPath)(opts.fileAbsPath);
    const pathRegex = new RegExp('(\'|")((\\1|.)*?)\\1', 'g');
    const replacer = (oText, quote, target) => {
        if (!target.startsWith(cwd)) {
            return oText;
        }
        let relativePath = (0, utils_1.winPath)(path_1.default.relative(path_1.default.dirname(fileAbsPath), target));
        relativePath = (0, utils_2.ensureRelativePath)(relativePath);
        return `${quote}${relativePath}${quote}`;
    };
    return opts.content.replace(pathRegex, replacer);
};
exports.replaceAbsPathWithRelativePath = replaceAbsPathWithRelativePath;
/**
 * swc transformer
 */
const swcTransformer = async function (content) {
    // swc will install on demand, so should import dynamic
    const { transform } = require('@swc/core');
    const { alias: oAlias = {} } = this.config;
    const isTSFile = isTs(this.paths.fileAbsPath);
    const isJSXFile = this.paths.fileAbsPath.endsWith('x');
    // transform alias to relative path for swc paths
    const alias = getSWCAlias({
        fileAbsPath: this.paths.fileAbsPath,
        alias: oAlias,
        cwd: this.paths.cwd,
    });
    let { code, map } = await transform(content, {
        cwd: this.paths.cwd,
        filename: this.paths.fileAbsPath,
        sourceFileName: this.config.sourcemap
            ? (0, utils_1.winPath)(path_1.default.relative(path_1.default.dirname(this.paths.itemDistAbsPath), this.paths.fileAbsPath))
            : undefined,
        sourceMaps: this.config.sourcemap,
        env: {
            targets: (0, utils_2.getBundlessTargets)(this.config),
        },
        jsc: {
            baseUrl: this.paths.cwd,
            paths: alias,
            parser: {
                syntax: isTSFile ? 'typescript' : 'ecmascript',
                ...(isTSFile && isJSXFile ? { tsx: true } : {}),
                ...(!isTSFile && isJSXFile ? { jsx: true } : {}),
            },
            transform: {
                react: (0, utils_2.getSWCTransformReactOpts)(this.pkg, path_1.default.dirname(this.paths.fileAbsPath)),
            },
        },
        module: {
            type: getModuleType(this.config.format),
        },
    });
    // fix: https://github.com/swc-project/swc/issues/5165
    // remove this when swc fixes it.
    if (process.platform === 'win32') {
        code = (0, exports.replaceAbsPathWithRelativePath)({
            content: code,
            cwd: this.paths.cwd,
            fileAbsPath: this.paths.fileAbsPath,
        });
    }
    if (map) {
        return [(0, utils_2.addSourceMappingUrl)(code, this.paths.itemDistAbsPath), map];
    }
    return [code];
};
exports.default = swcTransformer;
