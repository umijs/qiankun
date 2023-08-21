"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tapErrorToLogMessage = void 0;
const chalk_1 = __importDefault(require("chalk"));
const plugin_hooks_1 = require("../plugin-hooks");
const rpc_1 = require("../rpc");
const abort_error_1 = require("../utils/async/abort-error");
function tapErrorToLogMessage(compiler, config) {
    const hooks = (0, plugin_hooks_1.getPluginHooks)(compiler);
    hooks.error.tap('ForkTsCheckerWebpackPlugin', (error) => {
        if (error instanceof abort_error_1.AbortError) {
            return;
        }
        config.logger.error(String(error));
        if (error instanceof rpc_1.RpcExitError) {
            if (error.signal === 'SIGINT') {
                config.logger.error(chalk_1.default.red('Issues checking service interrupted - If running in a docker container, this may be caused ' +
                    "by the container running out of memory. If so, try increasing the container's memory limit " +
                    'or lowering the `memoryLimit` value in the ForkTsCheckerWebpackPlugin configuration.'));
            }
            else {
                config.logger.error(chalk_1.default.red('Issues checking service aborted - probably out of memory. ' +
                    'Check the `memoryLimit` option in the ForkTsCheckerWebpackPlugin configuration.\n' +
                    "If increasing the memory doesn't solve the issue, it's most probably a bug in the TypeScript."));
            }
        }
    });
}
exports.tapErrorToLogMessage = tapErrorToLogMessage;
