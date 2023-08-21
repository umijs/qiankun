"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateWatchProgramRootFileNames = exports.invalidateWatchProgram = exports.useWatchProgram = void 0;
const config_1 = require("../config");
const dependencies_1 = require("../dependencies");
const diagnostics_1 = require("../diagnostics");
const emit_1 = require("../emit");
const watch_compiler_host_1 = require("../host/watch-compiler-host");
const tracing_1 = require("../tracing");
const tsbuildinfo_1 = require("../tsbuildinfo");
const typescript_1 = require("../typescript");
let watchCompilerHost;
let watchProgram;
let shouldUpdateRootFiles = false;
function useWatchProgram() {
    if (!watchCompilerHost) {
        const parsedConfig = (0, config_1.getParsedConfig)();
        watchCompilerHost = (0, watch_compiler_host_1.createWatchCompilerHost)(parsedConfig, (rootNames, compilerOptions, host, oldProgram, configFileParsingDiagnostics, projectReferences) => {
            if (compilerOptions) {
                (0, tracing_1.startTracingIfNeeded)(compilerOptions);
            }
            return typescript_1.typescript.createSemanticDiagnosticsBuilderProgram(rootNames, compilerOptions, host, oldProgram, configFileParsingDiagnostics, projectReferences);
        }, undefined, undefined, (builderProgram) => {
            (0, diagnostics_1.updateDiagnostics)((0, config_1.getConfigFilePathFromBuilderProgram)(builderProgram), (0, diagnostics_1.getDiagnosticsOfProgram)(builderProgram));
            (0, emit_1.emitDtsIfNeeded)(builderProgram);
            (0, tsbuildinfo_1.emitTsBuildInfoIfNeeded)(builderProgram);
            (0, tracing_1.stopTracingIfNeeded)(builderProgram);
        });
        watchProgram = undefined;
    }
    if (!watchProgram) {
        watchProgram = typescript_1.typescript.createWatchProgram(watchCompilerHost);
    }
    if (shouldUpdateRootFiles) {
        // we have to update root files manually as don't use config file as a program input
        watchProgram.updateRootFileNames((0, dependencies_1.getDependencies)().files);
        shouldUpdateRootFiles = false;
    }
}
exports.useWatchProgram = useWatchProgram;
function invalidateWatchProgram(withHost = false) {
    if (withHost) {
        watchCompilerHost = undefined;
    }
    watchProgram = undefined;
}
exports.invalidateWatchProgram = invalidateWatchProgram;
function invalidateWatchProgramRootFileNames() {
    shouldUpdateRootFiles = true;
}
exports.invalidateWatchProgramRootFileNames = invalidateWatchProgramRootFileNames;
