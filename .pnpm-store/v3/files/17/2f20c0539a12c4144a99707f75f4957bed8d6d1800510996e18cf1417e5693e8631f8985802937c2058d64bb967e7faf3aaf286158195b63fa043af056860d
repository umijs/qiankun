"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateProgram = exports.useProgram = void 0;
const config_1 = require("../config");
const diagnostics_1 = require("../diagnostics");
const emit_1 = require("../emit");
const compiler_host_1 = require("../host/compiler-host");
const tracing_1 = require("../tracing");
const typescript_1 = require("../typescript");
let compilerHost;
let program;
function useProgram() {
    const parsedConfig = (0, config_1.getParsedConfig)();
    if (!compilerHost) {
        compilerHost = (0, compiler_host_1.createCompilerHost)(parsedConfig);
    }
    if (!program) {
        (0, tracing_1.startTracingIfNeeded)(parsedConfig.options);
        program = typescript_1.typescript.createProgram({
            rootNames: parsedConfig.fileNames,
            options: parsedConfig.options,
            projectReferences: parsedConfig.projectReferences,
            host: compilerHost,
        });
    }
    (0, diagnostics_1.updateDiagnostics)((0, config_1.getConfigFilePathFromProgram)(program), (0, diagnostics_1.getDiagnosticsOfProgram)(program));
    (0, emit_1.emitDtsIfNeeded)(program);
    (0, tracing_1.stopTracingIfNeeded)(program);
}
exports.useProgram = useProgram;
function invalidateProgram(withHost = false) {
    if (withHost) {
        compilerHost = undefined;
    }
    program = undefined;
}
exports.invalidateProgram = invalidateProgram;
