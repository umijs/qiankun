"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForkTsCheckerWebpackPlugin = void 0;
const path = __importStar(require("path"));
const cosmiconfig_1 = require("cosmiconfig");
const deepmerge_1 = __importDefault(require("deepmerge"));
const schema_utils_1 = require("schema-utils");
const tap_after_compile_to_add_dependencies_1 = require("./hooks/tap-after-compile-to-add-dependencies");
const tap_after_environment_to_patch_watching_1 = require("./hooks/tap-after-environment-to-patch-watching");
const tap_error_to_log_message_1 = require("./hooks/tap-error-to-log-message");
const tap_start_to_run_workers_1 = require("./hooks/tap-start-to-run-workers");
const tap_stop_to_terminate_workers_1 = require("./hooks/tap-stop-to-terminate-workers");
const plugin_config_1 = require("./plugin-config");
const plugin_hooks_1 = require("./plugin-hooks");
const plugin_options_json_1 = __importDefault(require("./plugin-options.json"));
const plugin_pools_1 = require("./plugin-pools");
const plugin_state_1 = require("./plugin-state");
const rpc_1 = require("./rpc");
const type_script_support_1 = require("./typescript/type-script-support");
class ForkTsCheckerWebpackPlugin {
    constructor(options = {}) {
        const explorerSync = (0, cosmiconfig_1.cosmiconfigSync)('fork-ts-checker');
        const { config: externalOptions } = explorerSync.search() || {};
        // first validate options directly passed to the constructor
        const config = { name: 'ForkTsCheckerWebpackPlugin' };
        (0, schema_utils_1.validate)(plugin_options_json_1.default, options, config);
        this.options = (0, deepmerge_1.default)(externalOptions || {}, options || {});
        // then validate merged options
        (0, schema_utils_1.validate)(plugin_options_json_1.default, this.options, config);
    }
    static getCompilerHooks(compiler) {
        return (0, plugin_hooks_1.getPluginHooks)(compiler);
    }
    apply(compiler) {
        const config = (0, plugin_config_1.createPluginConfig)(compiler, this.options);
        const state = (0, plugin_state_1.createPluginState)();
        (0, type_script_support_1.assertTypeScriptSupport)(config.typescript);
        const getIssuesWorker = (0, rpc_1.createRpcWorker)(path.resolve(__dirname, './typescript/worker/get-issues-worker.js'), config.typescript, config.typescript.memoryLimit);
        const getDependenciesWorker = (0, rpc_1.createRpcWorker)(path.resolve(__dirname, './typescript/worker/get-dependencies-worker.js'), config.typescript);
        (0, tap_after_environment_to_patch_watching_1.tapAfterEnvironmentToPatchWatching)(compiler, state);
        (0, tap_start_to_run_workers_1.tapStartToRunWorkers)(compiler, getIssuesWorker, getDependenciesWorker, config, state);
        (0, tap_after_compile_to_add_dependencies_1.tapAfterCompileToAddDependencies)(compiler, config, state);
        (0, tap_stop_to_terminate_workers_1.tapStopToTerminateWorkers)(compiler, getIssuesWorker, getDependenciesWorker, state);
        (0, tap_error_to_log_message_1.tapErrorToLogMessage)(compiler, config);
    }
}
exports.ForkTsCheckerWebpackPlugin = ForkTsCheckerWebpackPlugin;
/**
 * Current version of the plugin
 */
ForkTsCheckerWebpackPlugin.version = '8.0.0'; // will be replaced by the @semantic-release/exec
/**
 * Default pools for the plugin concurrency limit
 */
ForkTsCheckerWebpackPlugin.issuesPool = plugin_pools_1.issuesPool;
ForkTsCheckerWebpackPlugin.dependenciesPool = plugin_pools_1.dependenciesPool;
/**
 * @deprecated Use ForkTsCheckerWebpackPlugin.issuesPool instead
 */
ForkTsCheckerWebpackPlugin.pool = plugin_pools_1.issuesPool;
