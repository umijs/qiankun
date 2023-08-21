"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = require("path");
const utils_2 = require("../../commands/generators/utils");
const types_1 = require("../../types");
const utils_3 = require("../../utils");
exports.default = (api) => {
    api.onStart(() => {
        const hasSwcConfig = Object.entries(api.userConfig).some(([_, conf]) => {
            return (conf === null || conf === void 0 ? void 0 : conf.transformer) === types_1.IFatherJSTransformerTypes.SWC;
        });
        let swcInstalled = false;
        try {
            utils_1.resolve.sync('@swc/core', { basedir: api.cwd });
            swcInstalled = true;
        }
        catch { }
        if (hasSwcConfig && !swcInstalled) {
            utils_3.logger.info('Since swc is used, install @swc/core on demand.');
            const h = new utils_2.GeneratorHelper(api);
            h.addDevDeps({
                '@swc/core': require((0, path_1.join)(__dirname, '../../../package.json'))
                    .devDependencies['@swc/core'],
            });
            // should install all dependencies
            const ORIGIN_NODE_ENV = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';
            h.installDeps();
            process.env.NODE_ENV = ORIGIN_NODE_ENV;
        }
    });
};
