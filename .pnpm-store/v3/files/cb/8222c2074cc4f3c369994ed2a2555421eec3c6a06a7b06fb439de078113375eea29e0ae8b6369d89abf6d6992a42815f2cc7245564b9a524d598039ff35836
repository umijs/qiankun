"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPluginConfig = void 0;
const formatter_1 = require("./formatter");
const infrastructure_logger_1 = require("./infrastructure-logger");
const issue_config_1 = require("./issue/issue-config");
const type_script_worker_config_1 = require("./typescript/type-script-worker-config");
function createPluginConfig(compiler, options = {}) {
    return {
        async: options.async === undefined ? compiler.options.mode === 'development' : options.async,
        typescript: (0, type_script_worker_config_1.createTypeScriptWorkerConfig)(compiler, options.typescript),
        issue: (0, issue_config_1.createIssueConfig)(compiler, options.issue),
        formatter: (0, formatter_1.createFormatterConfig)(options.formatter),
        logger: options.logger === 'webpack-infrastructure'
            ? (() => {
                const { info, error } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
                return {
                    log: info,
                    error,
                };
            })()
            : options.logger || console,
        devServer: options.devServer !== false,
    };
}
exports.createPluginConfig = createPluginConfig;
