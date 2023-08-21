"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/core");
const utils_1 = require("../../utils");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = require("fs");
const path_1 = require("path");
const utils_2 = require("./utils");
exports.default = (api) => {
    api.describe({
        key: 'generator:eslint',
    });
    api.registerGenerator({
        key: 'eslint',
        name: 'Enable ESLint',
        description: 'Setup ESLint Configuration',
        type: core_1.GeneratorType.enable,
        checkEnable: () => {
            return (fast_glob_1.default.sync('.eslintrc?(.js)', {
                cwd: api.paths.cwd,
            }).length === 0);
        },
        disabledDescription: 'ESLint has already enabled. You can remove .eslintrc, then run this again to re-setup.',
        fn: async () => {
            const h = new utils_2.GeneratorHelper(api);
            const deps = {
                '@umijs/lint': '^4',
                eslint: '^8.23.0',
            };
            h.addDevDeps(deps);
            h.addScript('lint:es', 'eslint "{src,test}/**/*.{js,jsx,ts,tsx}"');
            (0, fs_1.writeFileSync)((0, path_1.join)(api.cwd, '.eslintrc.js'), `
module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
};
`.trimStart());
            utils_1.logger.quietExpect.info('Write .eslintrc.js');
            h.installDeps();
        },
    });
};
