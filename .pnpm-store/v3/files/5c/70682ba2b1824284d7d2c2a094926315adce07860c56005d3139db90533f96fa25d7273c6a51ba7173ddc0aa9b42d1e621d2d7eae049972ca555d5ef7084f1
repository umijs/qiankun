"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapAfterEnvironmentToPatchWatching = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
const inclusive_node_watch_file_system_1 = require("../watch/inclusive-node-watch-file-system");
function tapAfterEnvironmentToPatchWatching(compiler, state) {
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    compiler.hooks.afterEnvironment.tap('ForkTsCheckerWebpackPlugin', () => {
        const watchFileSystem = compiler.watchFileSystem;
        if (watchFileSystem) {
            debug("Overwriting webpack's watch file system.");
            // wrap original watch file system
            compiler.watchFileSystem = new inclusive_node_watch_file_system_1.InclusiveNodeWatchFileSystem(
            // we use some internals here
            watchFileSystem, compiler, state);
        }
        else {
            debug('No watch file system found - plugin may not work correctly.');
        }
    });
}
exports.tapAfterEnvironmentToPatchWatching = tapAfterEnvironmentToPatchWatching;
