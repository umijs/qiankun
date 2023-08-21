"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTsNodeRegistrationProperties = exports.createSyntheticEmitHost = exports.isModulePathsMatch = exports.getOutputDirForSourceFile = void 0;
const path_1 = __importDefault(require("path"));
/* ****************************************************************************************************************** */
// region: TS Helpers
/* ****************************************************************************************************************** */
/**
 * Determine output file path for source file
 */
function getOutputDirForSourceFile(context, sourceFile) {
    const { tsInstance, emitHost, outputFileNamesCache, compilerOptions, tsInstance: { getOwnEmitOutputFilePath, getOutputExtension }, } = context;
    if (outputFileNamesCache.has(sourceFile))
        return outputFileNamesCache.get(sourceFile);
    // Note: In project references, resolved path is different from path. In that case, our output path is already
    // determined in resolvedPath
    const outputPath = sourceFile.path && sourceFile.resolvedPath && sourceFile.path !== sourceFile.resolvedPath
        ? sourceFile.resolvedPath
        : getOwnEmitOutputFilePath(sourceFile.fileName, emitHost, getOutputExtension(sourceFile.fileName, compilerOptions));
    if (!outputPath)
        throw new Error(`Could not resolve output path for ${sourceFile.fileName}. Please report a GH issue at: ` +
            `https://github.com/LeDDGroup/typescript-transform-paths/issues`);
    const res = path_1.default.dirname(outputPath);
    outputFileNamesCache.set(sourceFile, res);
    return tsInstance.normalizePath(res);
}
exports.getOutputDirForSourceFile = getOutputDirForSourceFile;
/**
 * Determine if moduleName matches config in paths
 */
function isModulePathsMatch(context, moduleName) {
    const { pathsPatterns, tsInstance: { matchPatternOrExact }, } = context;
    return !!(pathsPatterns && matchPatternOrExact(pathsPatterns, moduleName));
}
exports.isModulePathsMatch = isModulePathsMatch;
/**
 * Create barebones EmitHost (for no-Program transform)
 */
function createSyntheticEmitHost(compilerOptions, tsInstance, getCanonicalFileName, fileNames) {
    return {
        getCompilerOptions: () => compilerOptions,
        getCurrentDirectory: tsInstance.sys.getCurrentDirectory,
        getCommonSourceDirectory: () => tsInstance.getCommonSourceDirectoryOfConfig({ options: compilerOptions, fileNames: fileNames }, !tsInstance.sys.useCaseSensitiveFileNames),
        getCanonicalFileName,
    };
}
exports.createSyntheticEmitHost = createSyntheticEmitHost;
/**
 * Get ts-node register info
 */
function getTsNodeRegistrationProperties(tsInstance) {
    var _a;
    let tsNodeSymbol;
    try {
        tsNodeSymbol = (_a = require("ts-node")) === null || _a === void 0 ? void 0 : _a["REGISTER_INSTANCE"];
    }
    catch (_b) {
        return undefined;
    }
    if (!global.process[tsNodeSymbol])
        return undefined;
    const { config, options } = global.process[tsNodeSymbol];
    const { configFilePath } = config.options;
    const pcl = configFilePath
        ? tsInstance.getParsedCommandLineOfConfigFile(configFilePath, {}, tsInstance.sys)
        : void 0;
    const fileNames = (pcl === null || pcl === void 0 ? void 0 : pcl.fileNames) || config.fileNames;
    const compilerOptions = Object.assign({}, config.options, options.compilerOptions, { outDir: pcl === null || pcl === void 0 ? void 0 : pcl.options.outDir });
    return { compilerOptions, fileNames, tsNodeOptions: options };
}
exports.getTsNodeRegistrationProperties = getTsNodeRegistrationProperties;
// endregion
//# sourceMappingURL=ts-helpers.js.map