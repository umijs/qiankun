"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpc_1 = require("../../rpc");
const artifacts_1 = require("./lib/artifacts");
const config_1 = require("./lib/config");
const dependencies_1 = require("./lib/dependencies");
const diagnostics_1 = require("./lib/diagnostics");
const performance_1 = require("./lib/performance");
const program_1 = require("./lib/program/program");
const solution_builder_1 = require("./lib/program/solution-builder");
const watch_program_1 = require("./lib/program/watch-program");
const system_1 = require("./lib/system");
const tracing_1 = require("./lib/tracing");
const tsbuildinfo_1 = require("./lib/tsbuildinfo");
const worker_config_1 = require("./lib/worker-config");
const getIssuesWorker = (change, watching) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    system_1.system.invalidateCache();
    if ((0, config_1.didConfigFileChanged)(change)) {
        (0, config_1.invalidateConfig)();
        (0, dependencies_1.invalidateDependencies)();
        (0, artifacts_1.invalidateArtifacts)();
        (0, diagnostics_1.invalidateDiagnostics)();
        (0, program_1.invalidateProgram)(true);
        (0, watch_program_1.invalidateWatchProgram)(true);
        (0, solution_builder_1.invalidateSolutionBuilder)(true);
        (0, tsbuildinfo_1.invalidateTsBuildInfo)();
    }
    else if ((0, config_1.didDependenciesProbablyChanged)((0, dependencies_1.getDependencies)(), change)) {
        (0, config_1.invalidateConfig)();
        (0, dependencies_1.invalidateDependencies)();
        (0, artifacts_1.invalidateArtifacts)();
        if ((0, config_1.didRootFilesChanged)()) {
            (0, watch_program_1.invalidateWatchProgramRootFileNames)();
            (0, solution_builder_1.invalidateSolutionBuilder)();
        }
    }
    (0, artifacts_1.registerArtifacts)();
    (0, performance_1.enablePerformanceIfNeeded)();
    const parseConfigIssues = (0, config_1.getParseConfigIssues)();
    if (parseConfigIssues.length) {
        // report config parse issues and exit
        return parseConfigIssues;
    }
    // use proper implementation based on the config
    if (worker_config_1.config.build) {
        (0, solution_builder_1.useSolutionBuilder)();
    }
    else if (watching) {
        (0, watch_program_1.useWatchProgram)();
    }
    else {
        (0, program_1.useProgram)();
    }
    // simulate file system events
    (_a = change.changedFiles) === null || _a === void 0 ? void 0 : _a.forEach((changedFile) => {
        system_1.system === null || system_1.system === void 0 ? void 0 : system_1.system.invokeFileChanged(changedFile);
    });
    (_b = change.deletedFiles) === null || _b === void 0 ? void 0 : _b.forEach((deletedFile) => {
        system_1.system === null || system_1.system === void 0 ? void 0 : system_1.system.invokeFileDeleted(deletedFile);
    });
    // wait for all queued events to be processed
    yield system_1.system.waitForQueued();
    // retrieve all collected diagnostics as normalized issues
    const issues = (0, diagnostics_1.getIssues)();
    (0, tracing_1.dumpTracingLegendIfNeeded)();
    (0, performance_1.printPerformanceMeasuresIfNeeded)();
    (0, performance_1.disablePerformanceIfNeeded)();
    return issues;
});
(0, rpc_1.exposeRpc)(getIssuesWorker);
