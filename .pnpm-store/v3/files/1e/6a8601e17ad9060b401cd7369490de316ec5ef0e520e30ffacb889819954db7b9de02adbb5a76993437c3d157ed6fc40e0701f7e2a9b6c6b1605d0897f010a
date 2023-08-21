"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
exports.default = (api) => {
    api.addRegularCheckup(({ bundleConfigs, bundlessConfigs, preBundleConfig }) => {
        if (api.pkg.files) {
            const files = api.pkg.files;
            const entities = [];
            const errors = [];
            // dist entities
            bundleConfigs.forEach((c) => entities.push(c.output.path));
            bundlessConfigs.forEach((c) => entities.push(c.output));
            Object.values(preBundleConfig.deps).forEach((c) => entities.push((0, utils_1.winPath)(path_1.default.relative(api.cwd, path_1.default.dirname(c.output)))));
            Object.values(preBundleConfig.dts).forEach((c) => entities.push((0, utils_1.winPath)(path_1.default.relative(api.cwd, path_1.default.basename(c.output)))));
            // TODO: main/module entities
            // TODO: outside import entities (eg: template)
            entities.forEach((output) => {
                if (files.every((f) => !output.startsWith(f))) {
                    errors.push({
                        type: 'error',
                        problem: `The output entity \'${output}\` is not in the \`files\` field of the package.json file, it will not be published`,
                        solution: 'Add it to the `files` field of the package.json file',
                    });
                }
            });
            return errors;
        }
    });
};
