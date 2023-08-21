"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/core");
const utils_1 = require("../../utils");
const fs_1 = require("fs");
const path_1 = require("path");
const utils_2 = require("./utils");
exports.default = (api) => {
    api.describe({
        key: 'generator:jest',
    });
    api.registerGenerator({
        key: 'jest',
        name: 'Enable Jest',
        description: 'Setup Jest Configuration',
        type: core_1.GeneratorType.enable,
        checkEnable: () => {
            return (!(0, fs_1.existsSync)((0, path_1.join)(api.paths.cwd, 'jest.config.ts')) &&
                !(0, fs_1.existsSync)((0, path_1.join)(api.paths.cwd, 'jest.config.js')));
        },
        disabledDescription: 'Jest has already enabled. You can remove jest.config.{ts,js}, then run this again to re-setup.',
        fn: async () => {
            const h = new utils_2.GeneratorHelper(api);
            const res = await (0, utils_2.promptsExitWhenCancel)({
                type: 'confirm',
                name: 'useRTL',
                message: 'Will you use @testing-library/react for UI testing?',
                initial: true,
            });
            const basicDeps = {
                jest: '^27',
                '@types/jest': '^27',
                // we use `jest.config.ts` so jest needs ts and ts-node
                typescript: '^4',
                'ts-node': '^10',
                '@umijs/test': '^4',
            };
            const deps = res.useRTL
                ? {
                    ...basicDeps,
                    '@testing-library/react': '^13',
                    '@testing-library/jest-dom': '^5.16.4',
                    '@types/testing-library__jest-dom': '^5.14.5',
                }
                : basicDeps;
            h.addDevDeps(deps);
            h.addScript('test', 'jest');
            if (res.useRTL) {
                (0, fs_1.writeFileSync)((0, path_1.join)(api.cwd, 'jest-setup.ts'), `import '@testing-library/jest-dom';
          `.trimStart());
                utils_1.logger.quietExpect.info('Write jest-setup.ts');
            }
            const collectCoverageFrom = ['src/**/*.{ts,js,tsx,jsx}'];
            const hasDumi = Object.keys(api.pkg.devDependencies || {}).includes('dumi');
            if (hasDumi) {
                collectCoverageFrom.push('!src/.umi/**', '!src/.umi-test/**', '!src/.umi-production/**');
            }
            (0, fs_1.writeFileSync)((0, path_1.join)(api.cwd, 'jest.config.ts'), `
import { Config, createConfig } from '@umijs/test';

export default {
  ...createConfig(),${res.useRTL
                ? `
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],`
                : ''}
  collectCoverageFrom: [${collectCoverageFrom.map((v) => `'${v}'`).join(', ')}],
} as Config.InitialOptions;
`.trimStart());
            utils_1.logger.quietExpect.info('Write jest.config.ts');
            h.installDeps();
        },
    });
};
