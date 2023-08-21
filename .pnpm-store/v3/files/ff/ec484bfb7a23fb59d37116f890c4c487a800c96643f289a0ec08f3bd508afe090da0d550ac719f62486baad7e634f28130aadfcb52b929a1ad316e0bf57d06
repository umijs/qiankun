"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/core");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_1 = require("./utils");
const utils_2 = require("../../utils");
exports.default = (api) => {
    api.describe({
        key: 'generator:stylelint',
    });
    api.registerGenerator({
        key: 'stylelint',
        name: 'Enable Stylelint',
        description: 'Setup Stylelint Configuration',
        type: core_1.GeneratorType.enable,
        checkEnable: () => {
            return (!(0, fs_1.existsSync)((0, path_1.join)(api.paths.cwd, '.stylelintrc')) &&
                !(0, fs_1.existsSync)((0, path_1.join)(api.paths.cwd, 'stylelint.config.js')));
        },
        disabledDescription: 'Stylelint has already enabled. You can remove .stylelintrc/stylelint.config.js, then run this again to re-setup.',
        fn: async () => {
            const h = new utils_1.GeneratorHelper(api);
            const deps = {
                '@umijs/lint': '^4',
                stylelint: '^14.11.0',
            };
            h.addDevDeps(deps);
            h.addScript('lint:css', 'stylelint "{src,test}/**/*.{css,less}"');
            (0, fs_1.writeFileSync)((0, path_1.join)(api.cwd, '.stylelintrc'), `
{
  "extends": "@umijs/lint/dist/config/stylelint"
}
`.trimStart());
            utils_2.logger.quietExpect.info('Write .stylelintrc');
            h.installDeps();
        },
    });
};
