"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builder_1 = __importDefault(require("../builder"));
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.default = (api) => {
    api.registerCommand({
        name: constants_1.DEV_COMMAND,
        description: 'start incremental build in watch mode',
        async fn() {
            const buildWatcher = await (0, builder_1.default)({
                userConfig: api.config,
                cwd: api.cwd,
                pkg: api.pkg,
                watch: true,
            });
            // handle config change
            const closeConfigWatcher = api.service.configManager.watch({
                schemas: api.service.configSchemas,
                onChangeTypes: api.service.configOnChanges,
                async onChange() {
                    utils_1.logger.wait('Config changed, restarting build...');
                    // close watchers
                    buildWatcher.close();
                    closeConfigWatcher();
                    // notify cli.ts to restart
                    process.emit('message', { type: 'RESTART' }, constants_1.DEV_COMMAND);
                },
            });
        },
    });
};
