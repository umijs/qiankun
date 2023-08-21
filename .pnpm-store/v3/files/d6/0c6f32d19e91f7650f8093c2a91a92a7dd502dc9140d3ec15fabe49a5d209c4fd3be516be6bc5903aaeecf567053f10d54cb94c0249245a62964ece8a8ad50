"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptsExitWhenCancel = exports.GeneratorHelper = void 0;
const utils_1 = require("@umijs/utils");
const fs_1 = require("fs");
const utils_2 = require("../../utils");
class GeneratorHelper {
    constructor(api) {
        this.api = api;
    }
    addDevDeps(deps) {
        const { api } = this;
        api.pkg.devDependencies = {
            ...api.pkg.devDependencies,
            ...deps,
        };
        (0, fs_1.writeFileSync)(api.pkgPath, JSON.stringify(api.pkg, null, 2));
        utils_2.logger.quietExpect.info('Write package.json');
    }
    addScript(name, cmd) {
        const { api } = this;
        this.addScriptToPkg(name, cmd);
        (0, fs_1.writeFileSync)(api.pkgPath, JSON.stringify(api.pkg, null, 2));
        utils_2.logger.quietExpect.info('Update package.json for scripts');
    }
    addScriptToPkg(name, cmd) {
        var _a;
        const { api } = this;
        const pkgScriptsName = (_a = api.pkg.scripts) === null || _a === void 0 ? void 0 : _a[name];
        if (pkgScriptsName && pkgScriptsName !== cmd) {
            utils_2.logger.warn(`scripts.${name} = "${pkgScriptsName}" already exists, will be overwritten with "${cmd}"!`);
        }
        api.pkg.scripts = {
            ...api.pkg.scripts,
            [name]: cmd,
        };
    }
    installDeps() {
        const { api } = this;
        const npmClient = (0, utils_1.getNpmClient)({ cwd: api.cwd });
        (0, utils_1.installWithNpmClient)({
            npmClient,
        });
        utils_2.logger.quietExpect.info(`Install dependencies with ${npmClient}`);
    }
}
exports.GeneratorHelper = GeneratorHelper;
function promptsExitWhenCancel(questions, options) {
    return (0, utils_1.prompts)(questions, {
        ...options,
        onCancel: () => {
            process.exit(1);
        },
    });
}
exports.promptsExitWhenCancel = promptsExitWhenCancel;
