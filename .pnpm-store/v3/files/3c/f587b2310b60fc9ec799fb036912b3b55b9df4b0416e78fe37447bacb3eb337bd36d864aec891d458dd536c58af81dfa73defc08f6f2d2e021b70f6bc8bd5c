"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.resolveModuleName = void 0;
const general_utils_1 = require("./general-utils");
const path = __importStar(require("path"));
const typescript_1 = require("typescript");
const ts_helpers_1 = require("./ts-helpers");
const get_relative_path_1 = require("./get-relative-path");
var IndexType;
(function (IndexType) {
    IndexType[IndexType["NonIndex"] = 0] = "NonIndex";
    IndexType[IndexType["Explicit"] = 1] = "Explicit";
    IndexType[IndexType["Implicit"] = 2] = "Implicit";
    IndexType[IndexType["ImplicitPackage"] = 3] = "ImplicitPackage";
})(IndexType || (IndexType = {}));
// endregion
/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */
function getPathDetail(moduleName, resolvedModule) {
    var _a, _b;
    let resolvedFileName = (_a = resolvedModule.originalPath) !== null && _a !== void 0 ? _a : resolvedModule.resolvedFileName;
    const implicitPackageIndex = (_b = resolvedModule.packageId) === null || _b === void 0 ? void 0 : _b.subModuleName;
    const resolvedDir = implicitPackageIndex
        ? (0, typescript_1.removeSuffix)(resolvedFileName, `/${implicitPackageIndex}`)
        : path.dirname(resolvedFileName);
    const resolvedBaseName = implicitPackageIndex ? void 0 : path.basename(resolvedFileName);
    const resolvedBaseNameNoExtension = resolvedBaseName && (0, typescript_1.removeFileExtension)(resolvedBaseName);
    const resolvedExtName = resolvedBaseName && path.extname(resolvedFileName);
    let baseName = !implicitPackageIndex ? path.basename(moduleName) : void 0;
    let baseNameNoExtension = baseName && (0, typescript_1.removeFileExtension)(baseName);
    let extName = baseName && path.extname(moduleName);
    // Account for possible false extensions. Example scenario:
    //   moduleName = './file.accounting'
    //   resolvedBaseName = 'file.accounting.ts'
    // ('accounting' would be considered the extension)
    if (resolvedBaseNameNoExtension && baseName && resolvedBaseNameNoExtension === baseName) {
        baseNameNoExtension = baseName;
        extName = void 0;
    }
    // prettier-ignore
    const indexType = implicitPackageIndex ? IndexType.ImplicitPackage :
        baseNameNoExtension === 'index' && resolvedBaseNameNoExtension === 'index' ? IndexType.Explicit :
            baseNameNoExtension !== 'index' && resolvedBaseNameNoExtension === 'index' ? IndexType.Implicit :
                IndexType.NonIndex;
    if (indexType === IndexType.Implicit) {
        baseName = void 0;
        baseNameNoExtension = void 0;
        extName = void 0;
    }
    return {
        baseName,
        baseNameNoExtension,
        extName,
        resolvedBaseName,
        resolvedBaseNameNoExtension,
        resolvedExtName,
        resolvedDir,
        indexType,
        implicitPackageIndex,
        resolvedFileName,
    };
}
function getResolvedSourceFile(context, fileName) {
    let res;
    const { program, tsInstance } = context;
    if (program) {
        /* Attempt to directly pull from Program */
        res = program.getSourceFile(fileName);
        if (res)
            return res;
        /* Attempt to find without extension */
        res = program.getSourceFiles().find((s) => (0, typescript_1.removeFileExtension)(s.fileName) === (0, typescript_1.removeFileExtension)(fileName));
        if (res)
            return res;
    }
    /*
     * Create basic synthetic SourceFile for use with compiler API - Applies if SourceFile not found in program due to
     * import being added by another transformer
     */
    return tsInstance.createSourceFile(fileName, ``, tsInstance.ScriptTarget.ESNext, /* setParentNodes */ false);
}
// endregion
/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */
/**
 * Resolve a module name
 */
function resolveModuleName(context, moduleName) {
    const { tsInstance, compilerOptions, sourceFile, config, rootDirs } = context;
    // Attempt to resolve with TS Compiler API
    const { resolvedModule, failedLookupLocations } = tsInstance.resolveModuleName(moduleName, sourceFile.fileName, compilerOptions, tsInstance.sys);
    // Handle non-resolvable module
    if (!resolvedModule) {
        const maybeURL = failedLookupLocations[0];
        if (!(0, general_utils_1.isURL)(maybeURL))
            return void 0;
        return {
            isURL: true,
            resolvedPath: void 0,
            outputPath: maybeURL,
        };
    }
    const resolvedSourceFile = getResolvedSourceFile(context, resolvedModule.resolvedFileName);
    const { indexType, resolvedBaseNameNoExtension, resolvedFileName, implicitPackageIndex, extName, resolvedDir } = getPathDetail(moduleName, resolvedModule);
    /* Determine output filename */
    let outputBaseName = resolvedBaseNameNoExtension !== null && resolvedBaseNameNoExtension !== void 0 ? resolvedBaseNameNoExtension : "";
    if (indexType === IndexType.Implicit)
        outputBaseName = outputBaseName.replace(/(\/index$)|(^index$)/, "");
    if (outputBaseName && extName)
        outputBaseName = `${outputBaseName}${extName}`;
    /* Determine output dir */
    let srcFileOutputDir = (0, ts_helpers_1.getOutputDirForSourceFile)(context, sourceFile);
    let moduleFileOutputDir = implicitPackageIndex ? resolvedDir : (0, ts_helpers_1.getOutputDirForSourceFile)(context, resolvedSourceFile);
    // Handle rootDirs remapping
    if (config.useRootDirs && rootDirs) {
        let fileRootDir = "";
        let moduleRootDir = "";
        for (const rootDir of rootDirs) {
            if ((0, general_utils_1.isBaseDir)(rootDir, moduleFileOutputDir) && rootDir.length > moduleRootDir.length)
                moduleRootDir = rootDir;
            if ((0, general_utils_1.isBaseDir)(rootDir, srcFileOutputDir) && rootDir.length > fileRootDir.length)
                fileRootDir = rootDir;
        }
        /* Remove base dirs to make relative to root */
        if (fileRootDir && moduleRootDir) {
            srcFileOutputDir = (0, get_relative_path_1.getRelativePath)(fileRootDir, srcFileOutputDir);
            moduleFileOutputDir = (0, get_relative_path_1.getRelativePath)(moduleRootDir, moduleFileOutputDir);
        }
    }
    const outputDir = (0, get_relative_path_1.getRelativePath)(srcFileOutputDir, moduleFileOutputDir);
    /* Compose final output path */
    const outputPath = (0, general_utils_1.maybeAddRelativeLocalPrefix)(tsInstance.normalizePath(path.join(outputDir, outputBaseName)));
    return { isURL: false, outputPath, resolvedPath: resolvedFileName };
}
exports.resolveModuleName = resolveModuleName;
// endregion
//# sourceMappingURL=resolve-module-name.js.map