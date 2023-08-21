"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/core");
const utils_1 = require("@umijs/utils");
const child_process_1 = require("child_process");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = require("fs");
const path_1 = require("path");
const utils_2 = require("./utils");
const utils_3 = require("../../utils");
exports.default = (api) => {
    api.describe({
        key: 'generator:commitlint',
    });
    api.registerGenerator({
        key: 'commitlint',
        name: 'Enable Commitlint',
        description: 'Setup Commitlint Configuration',
        type: core_1.GeneratorType.enable,
        checkEnable: () => {
            const pkg = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(api.paths.cwd, 'package.json'), 'utf-8'));
            return (['.commitlintrc?(.*)', 'commitlint.config.*'].every((pattern) => fast_glob_1.default.sync(pattern, {
                cwd: api.paths.cwd,
            }).length === 0) && !pkg['commitlint']);
        },
        disabledDescription: 'Commitlint has already enabled. You can remove commitlint config, then run this again to re-setup.',
        fn: async () => {
            const inGit = (0, fs_1.existsSync)((0, path_1.join)(api.paths.cwd, '.git'));
            if (!inGit) {
                utils_3.logger.warn('Only available for git project, exit');
                return;
            }
            const h = new utils_2.GeneratorHelper(api);
            const deps = {
                '@commitlint/cli': '^17.1.2',
                '@commitlint/config-conventional': '^17.1.0',
                husky: '^8.0.1',
            };
            h.addDevDeps(deps);
            h.addScript('prepare', 'husky install');
            api.pkg['commitlint'] = {
                extends: ['@commitlint/config-conventional'],
            };
            (0, fs_1.writeFileSync)(api.pkgPath, JSON.stringify(api.pkg, null, 2));
            utils_3.logger.quietExpect.info('Update package.json for commitlint');
            h.installDeps();
            const npmClient = (0, utils_1.getNpmClient)({ cwd: api.cwd });
            (0, child_process_1.execSync)(`${npmClient} husky add .husky/commit-msg '${npmClient} commitlint --edit $1'`);
            utils_3.logger.quietExpect.info('Create a hook for commitlint');
        },
    });
};
