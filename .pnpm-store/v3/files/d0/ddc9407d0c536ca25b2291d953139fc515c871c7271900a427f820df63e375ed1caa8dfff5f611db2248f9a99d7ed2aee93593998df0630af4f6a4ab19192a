"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("@umijs/utils");
const schema_1 = require("./schema");
/**
 * parse extends option for config
 */
function parseExtendsConfig(opts) {
    let { config } = opts;
    const { api, resolvePaths = api.service.configManager.files.map((f) => path_1.default.dirname(f)), } = opts;
    if (config.extends) {
        let absExtendsPath = '';
        const ConfigManager = api.service.configManager.constructor;
        // try to resolve extends path
        resolvePaths.some((dir) => {
            try {
                absExtendsPath = utils_1.resolve.sync(config.extends, {
                    basedir: dir,
                    extensions: ['.js', '.ts'],
                });
                return true;
            }
            catch { }
        });
        if (!absExtendsPath) {
            throw new Error(`Cannot find extends config file: ${config.extends}`);
        }
        else if (api.service.configManager.files.includes(absExtendsPath)) {
            throw new Error(`Cannot extends config circularly for file: ${absExtendsPath}`);
        }
        // load extends config
        const { config: extendsConfig, files: extendsFiles } = ConfigManager.getUserConfig({ configFiles: [absExtendsPath] });
        ConfigManager.validateConfig({
            config: extendsConfig,
            schemas: api.service.configSchemas,
        });
        // try to parse nested extends config
        const nestedConfig = parseExtendsConfig({
            config: extendsConfig,
            resolvePaths: [path_1.default.dirname(absExtendsPath)],
            api,
        });
        // merge extends config & save related files
        config = (0, utils_1.deepmerge)(nestedConfig, config);
        api.service.configManager.files.push(...extendsFiles);
    }
    return config;
}
exports.default = (api) => {
    const configDefaults = {};
    const schemas = (0, schema_1.getSchemas)();
    for (const key of Object.keys(schemas)) {
        const config = {
            schema: schemas[key] || ((joi) => joi.any()),
        };
        if (key in configDefaults) {
            config.default = configDefaults[key];
        }
        api.registerPlugins([
            {
                id: `virtual: config-${key}`,
                key: key,
                config,
            },
        ]);
    }
    // support extends config
    api.modifyConfig((config) => parseExtendsConfig({ config, api }));
};
