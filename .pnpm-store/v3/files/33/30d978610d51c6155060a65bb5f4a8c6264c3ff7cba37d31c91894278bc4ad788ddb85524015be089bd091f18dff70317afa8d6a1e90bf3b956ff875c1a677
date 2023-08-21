"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const enhanced_resolve_1 = __importDefault(require("enhanced-resolve"));
const case_sensitive_paths_webpack_plugin_1 = __importDefault(require("@umijs/case-sensitive-paths-webpack-plugin"));
const utils_1 = require("@umijs/utils");
exports.default = (api) => {
    const checker = new case_sensitive_paths_webpack_plugin_1.default();
    let resolver;
    let aliasKeys;
    // set fs for checker
    checker.fs = fs_1.default;
    api.addImportsCheckup(async ({ file, imports, mergedAlias }) => {
        var _a;
        const errors = [];
        resolver !== null && resolver !== void 0 ? resolver : (resolver = enhanced_resolve_1.default.create.sync({
            // handle source extensions
            extensions: ['.ts', '.js', '.tsx', '.jsx', '.json', '.node'],
            mainFields: ['module', 'main', 'browser'],
            // keep path clear in cnpm/pnpm project
            symlinks: false,
            alias: mergedAlias,
        }));
        aliasKeys !== null && aliasKeys !== void 0 ? aliasKeys : (aliasKeys = Object.keys(mergedAlias));
        for (const i of imports) {
            let res = false;
            // try to resolve import to absolute file path
            try {
                res = resolver(i.resolveDir, i.path);
            }
            catch {
                /* skip if module not found */
            }
            // check case sensitive
            if (res) {
                // why ignore next?
                // because coverage will run on linux, and linux is case-sensitive
                /* istanbul ignore next -- @preserve */
                try {
                    checker.context =
                        // for npm package, use package root path as context, to avoid check node_modules/*
                        ((_a = res.match(/^.+node_modules[\/](?:@[^\/]+[\/])?[^\/]+/)) === null || _a === void 0 ? void 0 : _a[0]) ||
                            // for local file, use cwd as context
                            api.cwd;
                    await checker.checkFileExistsWithCase(res);
                }
                catch (e) {
                    errors.push({
                        type: 'error',
                        problem: `${e.message
                            .replace(/\[.+?\] /, '')
                            .replace(/`.+?`/, `\`${i.path}\``)}
          ${utils_1.chalk.gray(`at ${file}`)}`,
                        solution: 'Make sure that import path and filesystem path are exactly the same',
                    });
                }
            }
        }
        return errors;
    });
};
