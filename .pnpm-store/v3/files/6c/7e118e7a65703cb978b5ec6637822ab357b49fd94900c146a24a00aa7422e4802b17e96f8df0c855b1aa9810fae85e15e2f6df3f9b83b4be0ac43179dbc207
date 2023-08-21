"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitDtsIfNeeded = void 0;
const config_1 = require("./config");
const worker_config_1 = require("./worker-config");
function emitDtsIfNeeded(program) {
    const parsedConfig = (0, config_1.getParsedConfig)();
    if (worker_config_1.config.mode === 'write-dts' && parsedConfig.options.declaration) {
        // emit .d.ts files only
        program.emit(undefined, undefined, undefined, true);
    }
}
exports.emitDtsIfNeeded = emitDtsIfNeeded;
