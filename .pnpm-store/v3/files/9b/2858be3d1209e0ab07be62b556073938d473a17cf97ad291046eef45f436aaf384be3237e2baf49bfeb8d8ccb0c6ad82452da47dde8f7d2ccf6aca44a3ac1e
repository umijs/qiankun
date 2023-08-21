"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeScriptWorkerConfig = void 0;
const path_1 = __importDefault(require("path"));
function createTypeScriptWorkerConfig(compiler, options) {
    let configFile = typeof options === 'object' ? options.configFile || 'tsconfig.json' : 'tsconfig.json';
    // ensure that `configFile` is an absolute normalized path
    configFile = path_1.default.normalize(path_1.default.isAbsolute(configFile)
        ? configFile
        : path_1.default.resolve(compiler.options.context || process.cwd(), configFile));
    const optionsAsObject = typeof options === 'object' ? options : {};
    const typescriptPath = optionsAsObject.typescriptPath || require.resolve('typescript');
    return Object.assign(Object.assign({ enabled: options !== false, memoryLimit: 2048, build: false, mode: optionsAsObject.build ? 'write-tsbuildinfo' : 'readonly', profile: false }, optionsAsObject), { configFile: configFile, configOverwrite: optionsAsObject.configOverwrite || {}, context: optionsAsObject.context || path_1.default.dirname(configFile), diagnosticOptions: Object.assign({ syntactic: false, semantic: true, declaration: false, global: false }, (optionsAsObject.diagnosticOptions || {})), typescriptPath: typescriptPath });
}
exports.createTypeScriptWorkerConfig = createTypeScriptWorkerConfig;
