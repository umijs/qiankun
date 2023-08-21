"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printPerformanceMeasuresIfNeeded = exports.disablePerformanceIfNeeded = exports.enablePerformanceIfNeeded = void 0;
const typescript_1 = require("./typescript");
const worker_config_1 = require("./worker-config");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const performance = typescript_1.typescript.performance;
function enablePerformanceIfNeeded() {
    var _a;
    if (worker_config_1.config.profile) {
        (_a = performance === null || performance === void 0 ? void 0 : performance.enable) === null || _a === void 0 ? void 0 : _a.call(performance);
    }
}
exports.enablePerformanceIfNeeded = enablePerformanceIfNeeded;
function disablePerformanceIfNeeded() {
    var _a;
    if (worker_config_1.config.profile) {
        (_a = performance === null || performance === void 0 ? void 0 : performance.disable) === null || _a === void 0 ? void 0 : _a.call(performance);
    }
}
exports.disablePerformanceIfNeeded = disablePerformanceIfNeeded;
function printPerformanceMeasuresIfNeeded() {
    var _a;
    if (worker_config_1.config.profile) {
        const measures = {};
        (_a = performance === null || performance === void 0 ? void 0 : performance.forEachMeasure) === null || _a === void 0 ? void 0 : _a.call(performance, (measureName, duration) => {
            measures[measureName] = duration;
        });
        console.table(measures);
    }
}
exports.printPerformanceMeasuresIfNeeded = printPerformanceMeasuresIfNeeded;
