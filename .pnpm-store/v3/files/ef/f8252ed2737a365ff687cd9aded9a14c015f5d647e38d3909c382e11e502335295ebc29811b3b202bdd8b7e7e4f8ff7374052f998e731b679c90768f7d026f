"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const bundle_1 = __importDefault(require("./bundle"));
const bundless_1 = __importDefault(require("./bundless"));
const config_1 = require("./config");
const utils_2 = require("../utils");
function getProviderOutputs(providers) {
    var _a, _b, _c;
    const set = new Set();
    [
        (_a = providers.bundle) === null || _a === void 0 ? void 0 : _a.configs,
        (_b = providers.bundless.esm) === null || _b === void 0 ? void 0 : _b.configs,
        (_c = providers.bundless.cjs) === null || _c === void 0 ? void 0 : _c.configs,
    ].forEach((configs) => {
        configs === null || configs === void 0 ? void 0 : configs.forEach((config) => {
            set.add(typeof config.output === 'string' ? config.output : config.output.path);
        });
    });
    return Array.from(set);
}
async function builder(opts) {
    const configProviders = (0, config_1.createConfigProviders)(opts.userConfig, opts.pkg, opts.cwd);
    const outputs = getProviderOutputs(configProviders);
    const watchers = [];
    if (opts.clean !== false) {
        // clean output directories
        utils_2.logger.quietExpect.info('Clean output directories');
        outputs.forEach((output) => {
            utils_1.rimraf.sync(path_1.default.join(opts.cwd, output));
        });
    }
    if (configProviders.bundle) {
        const watcher = await (0, bundle_1.default)({
            cwd: opts.cwd,
            configProvider: configProviders.bundle,
            buildDependencies: opts.buildDependencies,
            watch: opts.watch,
        });
        opts.watch && watchers.push(watcher);
    }
    if (configProviders.bundless.esm) {
        const watcher = await (0, bundless_1.default)({
            cwd: opts.cwd,
            configProvider: configProviders.bundless.esm,
            watch: opts.watch,
        });
        opts.watch && watchers.push(watcher);
    }
    if (configProviders.bundless.cjs) {
        const watcher = await (0, bundless_1.default)({
            cwd: opts.cwd,
            configProvider: configProviders.bundless.cjs,
            watch: opts.watch,
        });
        opts.watch && watchers.push(watcher);
    }
    if (opts.watch) {
        return {
            async close() {
                await Promise.all(watchers.map((watcher) => watcher.close()));
            },
        };
    }
}
exports.default = builder;
