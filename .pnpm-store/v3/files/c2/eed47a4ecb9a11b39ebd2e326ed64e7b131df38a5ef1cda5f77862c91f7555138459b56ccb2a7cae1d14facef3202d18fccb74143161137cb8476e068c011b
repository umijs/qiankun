"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.mergeTransformers = void 0;
const transformer_1 = __importDefault(require("./transformer"));
/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */
function getProjectTransformerConfig(pcl) {
    const plugins = pcl.options.plugins;
    if (!plugins)
        return;
    const res = {};
    for (const plugin of plugins) {
        if (plugin.transform === "typescript-transform-paths" && !plugin.after)
            res[plugin.afterDeclarations ? "afterDeclarations" : "before"] = plugin;
    }
    return res;
}
function getTransformers(program, beforeConfig, afterDeclarationsConfig) {
    return Object.assign(Object.assign({}, (beforeConfig && { before: [(0, transformer_1.default)(program, beforeConfig)] })), (afterDeclarationsConfig && { afterDeclarations: [(0, transformer_1.default)(program, afterDeclarationsConfig)] }));
}
function mergeTransformers(baseTransformers, transformers) {
    var _a, _b, _c, _d;
    const res = Object.assign(Object.assign({}, ((baseTransformers.before || transformers.before) && {
        before: [...((_a = transformers.before) !== null && _a !== void 0 ? _a : []), ...((_b = baseTransformers.before) !== null && _b !== void 0 ? _b : [])],
    })), ((baseTransformers.afterDeclarations || transformers.afterDeclarations) && {
        afterDeclarations: [...((_c = transformers.afterDeclarations) !== null && _c !== void 0 ? _c : []), ...((_d = baseTransformers.afterDeclarations) !== null && _d !== void 0 ? _d : [])],
    }));
    const remainingBaseTransformers = Object.assign({}, baseTransformers);
    delete remainingBaseTransformers.before;
    delete remainingBaseTransformers.afterDeclarations;
    return Object.assign(res, remainingBaseTransformers);
}
exports.mergeTransformers = mergeTransformers;
// endregion
/* ****************************************************************************************************************** */
// region: TsNode Registration Utility
/* ****************************************************************************************************************** */
function register() {
    const { tsNodeInstance, tsNode } = register.initialize();
    const transformerConfig = getProjectTransformerConfig(tsNodeInstance.config);
    if (!transformerConfig)
        return;
    const { before: beforeConfig, afterDeclarations: afterDeclarationsConfig } = transformerConfig;
    const registerOptions = Object.assign({}, tsNodeInstance.options);
    if (registerOptions.transformers) {
        if (typeof registerOptions.transformers === "function") {
            let oldTransformersFactory = registerOptions.transformers;
            registerOptions.transformers = (program) => {
                const transformers = getTransformers(program, beforeConfig, afterDeclarationsConfig);
                const baseTransformers = oldTransformersFactory(program);
                return mergeTransformers(baseTransformers, transformers);
            };
        }
        else {
            registerOptions.transformers = mergeTransformers(registerOptions.transformers, getTransformers(undefined, beforeConfig, afterDeclarationsConfig));
        }
    }
    else {
        registerOptions.transformers = getTransformers(undefined, beforeConfig, afterDeclarationsConfig);
    }
    // Re-register with new transformers
    tsNode.register(registerOptions);
    return registerOptions;
}
exports.register = register;
(function (register) {
    function initialize() {
        let tsNode;
        try {
            tsNode = require("ts-node");
        }
        catch (_a) {
            throw new Error(`Cannot resolve ts-node. Make sure ts-node is installed before using typescript-transform-paths/register`);
        }
        const instanceSymbol = tsNode["REGISTER_INSTANCE"];
        let tsNodeInstance = global.process[instanceSymbol];
        if (!tsNodeInstance) {
            tsNode.register(); // Register initially
            tsNodeInstance = global.process[instanceSymbol];
        }
        if (!tsNodeInstance)
            throw new Error(`Could not register ts-node instance!`);
        return { tsNode, instanceSymbol, tsNodeInstance };
    }
    register.initialize = initialize;
})(register = exports.register || (exports.register = {}));
exports.default = register;
// endregion
//# sourceMappingURL=register.js.map