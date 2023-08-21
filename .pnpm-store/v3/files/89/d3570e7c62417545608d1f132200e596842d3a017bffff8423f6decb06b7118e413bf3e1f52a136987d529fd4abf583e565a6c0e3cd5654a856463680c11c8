"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareIssueSeverities = exports.isIssueSeverity = void 0;
function isIssueSeverity(value) {
    return ['error', 'warning'].includes(value);
}
exports.isIssueSeverity = isIssueSeverity;
function compareIssueSeverities(severityA, severityB) {
    const [priorityA, priorityB] = [severityA, severityB].map((severity) => ['warning' /* 0 */, 'error' /* 1 */].indexOf(severity));
    return Math.sign(priorityB - priorityA);
}
exports.compareIssueSeverities = compareIssueSeverities;
