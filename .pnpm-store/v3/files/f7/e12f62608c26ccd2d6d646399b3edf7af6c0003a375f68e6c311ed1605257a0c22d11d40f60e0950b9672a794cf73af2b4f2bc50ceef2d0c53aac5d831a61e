"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpTracingLegendIfNeeded = exports.stopTracingIfNeeded = exports.startTracingIfNeeded = void 0;
const config_1 = require("./config");
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traceableTypescript = typescript_1.typescript;
function startTracingIfNeeded(compilerOptions) {
    if (typeof compilerOptions.generateTrace === 'string' &&
        typeof traceableTypescript.startTracing === 'function') {
        traceableTypescript.startTracing(worker_config_1.config.build ? 'build' : 'project', compilerOptions.generateTrace, (0, config_1.getConfigFilePathFromCompilerOptions)(compilerOptions));
    }
}
exports.startTracingIfNeeded = startTracingIfNeeded;
function stopTracingIfNeeded(program) {
    var _a;
    const compilerOptions = program.getCompilerOptions();
    if (typeof compilerOptions.generateTrace === 'string' &&
        typeof ((_a = traceableTypescript.tracing) === null || _a === void 0 ? void 0 : _a.stopTracing) === 'function') {
        traceableTypescript.tracing.stopTracing();
    }
}
exports.stopTracingIfNeeded = stopTracingIfNeeded;
function dumpTracingLegendIfNeeded() {
    var _a;
    (_a = traceableTypescript.tracing) === null || _a === void 0 ? void 0 : _a.dumpLegend();
}
exports.dumpTracingLegendIfNeeded = dumpTracingLegendIfNeeded;
