"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nxTransformerPlugin = void 0;
const transformer_1 = __importDefault(require("../transformer"));
/* ****************************************************************************************************************** *
 * Locals
 * ****************************************************************************************************************** */
const voidTransformer = () => (s) => s;
/* ****************************************************************************************************************** *
 * Transformer
 * ****************************************************************************************************************** */
exports.nxTransformerPlugin = {
    before: (pluginConfig, program) => (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.afterDeclarations) ? voidTransformer : (0, transformer_1.default)(program, Object.assign({}, pluginConfig)),
    afterDeclarations: (pluginConfig, program) => !(pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.afterDeclarations) ? voidTransformer : (0, transformer_1.default)(program, Object.assign({}, pluginConfig)),
};
//# sourceMappingURL=nx-transformer-plugin.js.map