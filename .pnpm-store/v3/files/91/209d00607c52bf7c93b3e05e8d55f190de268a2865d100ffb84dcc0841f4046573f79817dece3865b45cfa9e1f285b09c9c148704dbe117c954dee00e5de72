"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWatchCompilerHost = void 0;
const system_1 = require("../system");
const typescript_1 = require("../typescript");
function createWatchCompilerHost(parsedConfig, createProgram, reportDiagnostic, reportWatchStatus, afterProgramCreate) {
    const baseWatchCompilerHost = typescript_1.typescript.createWatchCompilerHost(parsedConfig.fileNames, parsedConfig.options, system_1.system, createProgram, reportDiagnostic, reportWatchStatus, parsedConfig.projectReferences);
    return Object.assign(Object.assign({}, baseWatchCompilerHost), { createProgram(rootNames, options, compilerHost, oldProgram, configFileParsingDiagnostics, projectReferences) {
            return baseWatchCompilerHost.createProgram(rootNames, options, compilerHost, oldProgram, configFileParsingDiagnostics, projectReferences);
        },
        afterProgramCreate(program) {
            if (afterProgramCreate) {
                afterProgramCreate(program);
            }
        },
        onWatchStatusChange() {
            // do nothing
        }, watchFile: system_1.system.watchFile, watchDirectory: system_1.system.watchDirectory, setTimeout: system_1.system.setTimeout, clearTimeout: system_1.system.clearTimeout, fileExists: system_1.system.fileExists, readFile: system_1.system.readFile, directoryExists: system_1.system.directoryExists, getDirectories: system_1.system.getDirectories, realpath: system_1.system.realpath });
}
exports.createWatchCompilerHost = createWatchCompilerHost;
