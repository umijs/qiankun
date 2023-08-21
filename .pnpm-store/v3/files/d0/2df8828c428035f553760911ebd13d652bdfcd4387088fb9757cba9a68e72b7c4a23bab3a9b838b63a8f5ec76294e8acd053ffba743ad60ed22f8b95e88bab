"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateSolutionBuilder = exports.useSolutionBuilder = void 0;
const config_1 = require("../config");
const diagnostics_1 = require("../diagnostics");
const watch_solution_builder_host_1 = require("../host/watch-solution-builder-host");
const tracing_1 = require("../tracing");
const tsbuildinfo_1 = require("../tsbuildinfo");
const typescript_1 = require("../typescript");
const worker_config_1 = require("../worker-config");
let solutionBuilderHost;
let solutionBuilder;
function useSolutionBuilder() {
    if (!solutionBuilderHost) {
        const parsedConfig = (0, config_1.getParsedConfig)();
        solutionBuilderHost = (0, watch_solution_builder_host_1.createWatchSolutionBuilderHost)(parsedConfig, (rootNames, compilerOptions, host, oldProgram, configFileParsingDiagnostics, projectReferences) => {
            if (compilerOptions) {
                (0, tracing_1.startTracingIfNeeded)(compilerOptions);
            }
            return typescript_1.typescript.createSemanticDiagnosticsBuilderProgram(rootNames, compilerOptions, host, oldProgram, configFileParsingDiagnostics, projectReferences);
        }, undefined, undefined, undefined, undefined, (builderProgram) => {
            (0, diagnostics_1.updateDiagnostics)((0, config_1.getConfigFilePathFromBuilderProgram)(builderProgram), (0, diagnostics_1.getDiagnosticsOfProgram)(builderProgram));
            (0, tsbuildinfo_1.emitTsBuildInfoIfNeeded)(builderProgram);
            (0, tracing_1.stopTracingIfNeeded)(builderProgram);
        });
    }
    if (!solutionBuilder) {
        solutionBuilder = typescript_1.typescript.createSolutionBuilderWithWatch(solutionBuilderHost, [worker_config_1.config.configFile], { watch: true });
        solutionBuilder.build();
    }
}
exports.useSolutionBuilder = useSolutionBuilder;
function invalidateSolutionBuilder(withHost = false) {
    if (withHost) {
        solutionBuilderHost = undefined;
    }
    solutionBuilder = undefined;
}
exports.invalidateSolutionBuilder = invalidateSolutionBuilder;
