"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const types_1 = require("./types");
const visitor_1 = require("./visitor");
const harmony_1 = require("./harmony");
const minimatch_1 = require("minimatch");
const ts_helpers_1 = require("./utils/ts-helpers");
/* ****************************************************************************************************************** */
// region: Helpers
/* ****************************************************************************************************************** */
function getTsProperties(args) {
    var _a, _b;
    let tsInstance;
    let fileNames;
    let compilerOptions;
    let runMode;
    let tsNodeState;
    const { 0: program, 2: extras, 3: manualTransformOptions } = args;
    tsInstance = (_a = extras === null || extras === void 0 ? void 0 : extras.ts) !== null && _a !== void 0 ? _a : typescript_1.default;
    if (program)
        compilerOptions = program.getCompilerOptions();
    const tsNodeProps = (0, ts_helpers_1.getTsNodeRegistrationProperties)(tsInstance);
    /* Determine RunMode & Setup */
    // Note: ts-node passes a Program with the paths property stripped, so we do some comparison to determine if it's the caller
    const isTsNode = tsNodeProps && (!program || compilerOptions.configFilePath === tsNodeProps.compilerOptions.configFilePath);
    // RunMode: Program
    if (program && !isTsNode) {
        runMode = types_1.RunMode.Program;
        compilerOptions = compilerOptions;
    }
    // RunMode: Manual
    else if (manualTransformOptions) {
        runMode = types_1.RunMode.Manual;
        fileNames = manualTransformOptions.fileNames;
        compilerOptions = manualTransformOptions.compilerOptions;
    }
    // RunMode: TsNode
    else if (isTsNode) {
        fileNames = tsNodeProps.fileNames;
        runMode = types_1.RunMode.TsNode;
        tsNodeState =
            !program ||
                (fileNames.length > 1 && (program === null || program === void 0 ? void 0 : program.getRootFileNames().length) === 1) ||
                (!compilerOptions.paths && tsNodeProps.compilerOptions.paths)
                ? types_1.TsNodeState.Stripped
                : types_1.TsNodeState.Full;
        compilerOptions =
            tsNodeState === types_1.TsNodeState.Full
                ? compilerOptions
                : Object.assign(Object.assign({}, ((_b = program === null || program === void 0 ? void 0 : program.getCompilerOptions()) !== null && _b !== void 0 ? _b : {})), tsNodeProps.compilerOptions);
    }
    else {
        throw new Error(`Cannot transform without a Program, ts-node instance, or manual parameters supplied. ` +
            `Make sure you're using ts-patch or ts-node with transpileOnly.`);
    }
    return { tsInstance, compilerOptions, fileNames, runMode, tsNodeState };
}
// endregion
/* ****************************************************************************************************************** */
// region: Transformer
/* ****************************************************************************************************************** */
function transformer(program, pluginConfig, transformerExtras, 
/**
 * Supply if manually transforming with compiler API via 'transformNodes' / 'transformModule'
 */
manualTransformOptions) {
    return (transformationContext) => {
        var _a, _b, _c;
        // prettier-ignore
        const { tsInstance, compilerOptions, fileNames, runMode, tsNodeState } = getTsProperties([program, pluginConfig, transformerExtras, manualTransformOptions]);
        const rootDirs = (_a = compilerOptions.rootDirs) === null || _a === void 0 ? void 0 : _a.filter(path_1.default.isAbsolute);
        const config = pluginConfig !== null && pluginConfig !== void 0 ? pluginConfig : {};
        const getCanonicalFileName = tsInstance.createGetCanonicalFileName(tsInstance.sys.useCaseSensitiveFileNames);
        /* Add supplements for various run modes */
        let emitHost = transformationContext.getEmitHost();
        if (!emitHost || tsNodeState === types_1.TsNodeState.Stripped) {
            if (!fileNames)
                throw new Error(`No EmitHost found and could not determine files to be processed. Please file an issue with a reproduction!`);
            emitHost = (0, ts_helpers_1.createSyntheticEmitHost)(compilerOptions, tsInstance, getCanonicalFileName, fileNames);
        }
        /* Create Visitor Context */
        const { configFile, paths } = compilerOptions;
        const { tryParsePatterns } = tsInstance;
        const [tsVersionMajor, tsVersionMinor] = tsInstance.versionMajorMinor.split(".").map((v) => +v);
        const tsTransformPathsContext = {
            compilerOptions,
            config,
            elisionMap: new Map(),
            tsFactory: transformationContext.factory,
            program,
            rootDirs,
            transformationContext,
            tsInstance,
            tsVersionMajor,
            tsVersionMinor,
            emitHost,
            runMode,
            tsNodeState,
            excludeMatchers: (_b = config.exclude) === null || _b === void 0 ? void 0 : _b.map((globPattern) => new minimatch_1.Minimatch(globPattern, { matchBase: true })),
            outputFileNamesCache: new Map(),
            // Get paths patterns appropriate for TS compiler version
            pathsPatterns: paths &&
                (tryParsePatterns
                    ? ((_c = configFile === null || configFile === void 0 ? void 0 : configFile.configFileSpecs) === null || _c === void 0 ? void 0 : _c.pathPatterns) || tryParsePatterns(paths)
                    : tsInstance.getOwnKeys(paths)),
        };
        return (sourceFile) => {
            const visitorContext = Object.assign(Object.assign({}, tsTransformPathsContext), { sourceFile, isDeclarationFile: sourceFile.isDeclarationFile, originalSourceFile: tsInstance.getOriginalSourceFile(sourceFile), getVisitor() {
                    return visitor_1.nodeVisitor.bind(this);
                }, factory: (0, harmony_1.createHarmonyFactory)(tsTransformPathsContext) });
            return tsInstance.visitEachChild(sourceFile, visitorContext.getVisitor(), transformationContext);
        };
    };
}
exports.default = transformer;
// endregion
//# sourceMappingURL=transformer.js.map