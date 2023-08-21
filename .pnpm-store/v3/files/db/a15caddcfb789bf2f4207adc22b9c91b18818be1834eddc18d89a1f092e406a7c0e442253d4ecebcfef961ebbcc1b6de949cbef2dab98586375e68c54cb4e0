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
exports.getTsBuildInfoEmitPath = exports.emitTsBuildInfoIfNeeded = exports.invalidateTsBuildInfo = void 0;
const path = __importStar(require("path"));
const config_1 = require("./config");
const system_1 = require("./system");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
function invalidateTsBuildInfo() {
    const parsedConfig = (0, config_1.getParsedConfig)();
    // try to remove outdated .tsbuildinfo file for incremental mode
    if (typeof typescript_1.typescript.getTsBuildInfoEmitOutputFilePath === 'function' &&
        worker_config_1.config.mode !== 'readonly' &&
        parsedConfig.options.incremental) {
        const tsBuildInfoPath = typescript_1.typescript.getTsBuildInfoEmitOutputFilePath(parsedConfig.options);
        if (tsBuildInfoPath) {
            try {
                system_1.system.deleteFile(tsBuildInfoPath);
            }
            catch (error) {
                // silent
            }
        }
    }
}
exports.invalidateTsBuildInfo = invalidateTsBuildInfo;
function emitTsBuildInfoIfNeeded(builderProgram) {
    const parsedConfig = (0, config_1.getParsedConfig)();
    if (worker_config_1.config.mode !== 'readonly' && parsedConfig && isIncrementalEnabled(parsedConfig.options)) {
        const program = builderProgram.getProgram();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof program.emitBuildInfo === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            program.emitBuildInfo();
        }
    }
}
exports.emitTsBuildInfoIfNeeded = emitTsBuildInfoIfNeeded;
function getTsBuildInfoEmitPath(compilerOptions) {
    if (typeof typescript_1.typescript.getTsBuildInfoEmitOutputFilePath === 'function') {
        return typescript_1.typescript.getTsBuildInfoEmitOutputFilePath(compilerOptions);
    }
    const removeJsonExtension = (filePath) => filePath.endsWith('.json') ? filePath.slice(0, -'.json'.length) : filePath;
    // based on the implementation from typescript
    const configFile = compilerOptions.configFilePath;
    if (!isIncrementalEnabled(compilerOptions)) {
        return undefined;
    }
    if (compilerOptions.tsBuildInfoFile) {
        return compilerOptions.tsBuildInfoFile;
    }
    const outPath = compilerOptions.outFile || compilerOptions.out;
    let buildInfoExtensionLess;
    if (outPath) {
        buildInfoExtensionLess = removeJsonExtension(outPath);
    }
    else {
        if (!configFile) {
            return undefined;
        }
        const configFileExtensionLess = removeJsonExtension(configFile);
        buildInfoExtensionLess = compilerOptions.outDir
            ? compilerOptions.rootDir
                ? path.resolve(compilerOptions.outDir, path.relative(compilerOptions.rootDir, configFileExtensionLess))
                : path.resolve(compilerOptions.outDir, path.basename(configFileExtensionLess))
            : configFileExtensionLess;
    }
    return buildInfoExtensionLess + '.tsbuildinfo';
}
exports.getTsBuildInfoEmitPath = getTsBuildInfoEmitPath;
function isIncrementalEnabled(compilerOptions) {
    return Boolean((compilerOptions.incremental || compilerOptions.composite) && !compilerOptions.outFile);
}
