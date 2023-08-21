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
Object.defineProperty(exports, "__esModule", { value: true });
exports.didRootFilesChanged = exports.didDependenciesProbablyChanged = exports.didConfigFileChanged = exports.getConfigFilePathFromBuilderProgram = exports.getConfigFilePathFromProgram = exports.getConfigFilePathFromCompilerOptions = exports.invalidateConfig = exports.parseNextConfig = exports.getParsedConfig = exports.getParseConfigIssues = exports.parseConfig = void 0;
const path = __importStar(require("path"));
const forward_slash_1 = require("../../../utils/path/forward-slash");
const diagnostics_1 = require("./diagnostics");
const system_1 = require("./system");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
let parsedConfig;
let parseConfigDiagnostics = [];
// initialize ParseConfigFileHost
const parseConfigFileHost = Object.assign(Object.assign({}, system_1.system), { onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
        parseConfigDiagnostics.push(diagnostic);
    } });
function getUserProvidedConfigOverwrite() {
    return worker_config_1.config.configOverwrite || {};
}
function getImplicitConfigOverwrite() {
    const baseCompilerOptionsOverwrite = {
        skipLibCheck: true,
        sourceMap: false,
        inlineSourceMap: false,
    };
    switch (worker_config_1.config.mode) {
        case 'write-dts':
            return {
                compilerOptions: Object.assign(Object.assign({}, baseCompilerOptionsOverwrite), { declaration: true, emitDeclarationOnly: true, noEmit: false }),
            };
        case 'write-tsbuildinfo':
        case 'write-references':
            return {
                compilerOptions: Object.assign(Object.assign({}, baseCompilerOptionsOverwrite), { declaration: true, emitDeclarationOnly: false, noEmit: false }),
            };
    }
    return {
        compilerOptions: baseCompilerOptionsOverwrite,
    };
}
function applyConfigOverwrite(baseConfig, ...overwriteConfigs) {
    let config = baseConfig;
    for (const overwriteConfig of overwriteConfigs) {
        config = Object.assign(Object.assign(Object.assign({}, (config || {})), (overwriteConfig || {})), { compilerOptions: Object.assign(Object.assign({}, ((config === null || config === void 0 ? void 0 : config.compilerOptions) || {})), ((overwriteConfig === null || overwriteConfig === void 0 ? void 0 : overwriteConfig.compilerOptions) || {})) });
    }
    return config;
}
function parseConfig(configFileName, configFileContext) {
    const configFilePath = (0, forward_slash_1.forwardSlash)(configFileName);
    const { config: baseConfig, error: readConfigError } = typescript_1.typescript.readConfigFile(configFilePath, parseConfigFileHost.readFile);
    const overwrittenConfig = applyConfigOverwrite(baseConfig || {}, getImplicitConfigOverwrite(), getUserProvidedConfigOverwrite());
    const parsedConfigFile = typescript_1.typescript.parseJsonConfigFileContent(overwrittenConfig, parseConfigFileHost, configFileContext);
    return Object.assign(Object.assign({}, parsedConfigFile), { options: Object.assign(Object.assign({}, parsedConfigFile.options), { configFilePath: configFilePath }), errors: readConfigError ? [readConfigError] : parsedConfigFile.errors });
}
exports.parseConfig = parseConfig;
function getParseConfigIssues() {
    const issues = (0, diagnostics_1.createIssuesFromDiagnostics)(parseConfigDiagnostics);
    issues.forEach((issue) => {
        if (!issue.file) {
            issue.file = worker_config_1.config.configFile;
        }
    });
    return issues;
}
exports.getParseConfigIssues = getParseConfigIssues;
function getParsedConfig(force = false) {
    if (!parsedConfig || force) {
        parsedConfig = parseConfig(worker_config_1.config.configFile, worker_config_1.config.context);
        parseConfigDiagnostics = parsedConfig.errors || [];
    }
    return parsedConfig;
}
exports.getParsedConfig = getParsedConfig;
function parseNextConfig() {
    const prevParsedConfig = parsedConfig;
    const nextParsedConfig = getParsedConfig(true);
    return [prevParsedConfig, nextParsedConfig];
}
exports.parseNextConfig = parseNextConfig;
function invalidateConfig() {
    parsedConfig = undefined;
    parseConfigDiagnostics = [];
}
exports.invalidateConfig = invalidateConfig;
function getConfigFilePathFromCompilerOptions(compilerOptions) {
    return compilerOptions.configFilePath;
}
exports.getConfigFilePathFromCompilerOptions = getConfigFilePathFromCompilerOptions;
function getConfigFilePathFromProgram(program) {
    return getConfigFilePathFromCompilerOptions(program.getCompilerOptions());
}
exports.getConfigFilePathFromProgram = getConfigFilePathFromProgram;
function getConfigFilePathFromBuilderProgram(builderProgram) {
    return getConfigFilePathFromCompilerOptions(builderProgram.getProgram().getCompilerOptions());
}
exports.getConfigFilePathFromBuilderProgram = getConfigFilePathFromBuilderProgram;
function didConfigFileChanged({ changedFiles = [], deletedFiles = [] }) {
    return [...changedFiles, ...deletedFiles]
        .map((file) => path.normalize(file))
        .includes(path.normalize(worker_config_1.config.configFile));
}
exports.didConfigFileChanged = didConfigFileChanged;
function didDependenciesProbablyChanged(dependencies, { changedFiles = [], deletedFiles = [] }) {
    const didSomeDependencyHasBeenAdded = changedFiles.some((changeFile) => !dependencies.files.includes(changeFile));
    const didSomeDependencyHasBeenDeleted = deletedFiles.some((deletedFile) => dependencies.files.includes(deletedFile));
    return didSomeDependencyHasBeenAdded || didSomeDependencyHasBeenDeleted;
}
exports.didDependenciesProbablyChanged = didDependenciesProbablyChanged;
function didRootFilesChanged() {
    const [prevConfig, nextConfig] = parseNextConfig();
    return (prevConfig && JSON.stringify(prevConfig.fileNames) !== JSON.stringify(nextConfig.fileNames));
}
exports.didRootFilesChanged = didRootFilesChanged;
