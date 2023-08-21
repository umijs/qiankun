"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../types");
exports.default = (api) => {
    api.addRegularCheckup(({ bundlessConfigs }) => {
        var _a;
        if (bundlessConfigs.find((c) => c.transformer === types_1.IFatherJSTransformerTypes.BABEL &&
            c.platform === types_1.IFatherPlatformTypes.BROWSER) &&
            !((_a = api.pkg.dependencies) === null || _a === void 0 ? void 0 : _a['@babel/runtime'])) {
            return {
                type: 'warn',
                problem: '@babel/runtime is not installed, the inline runtime helpers will increase dist file size',
                solution: 'Declare @babel/runtime as a dependency in the package.json file',
            };
        }
    });
};
