"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@umijs/core");
const utils_1 = require("@umijs/utils");
const utils_2 = require("./utils");
const utils_3 = require("../../utils");
exports.default = (api) => {
    api.describe({
        key: 'generator:lint',
    });
    api.registerGenerator({
        key: 'lint',
        name: 'Enable Lint',
        description: 'Setup Lint Configuration',
        type: core_1.GeneratorType.generate,
        fn: async () => {
            const h = new utils_2.GeneratorHelper(api);
            const generators = ['eslint', 'stylelint'];
            let allEnable = true;
            for (const type of generators) {
                const generator = api.service.generators[type];
                const enable = await generator.checkEnable();
                if (enable) {
                    await generator.fn();
                }
                else {
                    allEnable = false;
                    utils_3.logger.quietExpect.warn(generator.disabledDescription);
                }
            }
            if (allEnable) {
                const npmClient = (0, utils_1.getNpmClient)({ cwd: api.cwd });
                h.addScript('lint', `${npmClient} run lint:es && ${npmClient} run lint:css`);
            }
        },
    });
};
