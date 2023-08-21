"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatIssueLocation = exports.compareIssueLocations = void 0;
const issue_position_1 = require("./issue-position");
function compareIssueLocations(locationA, locationB) {
    if (locationA === locationB) {
        return 0;
    }
    if (!locationA) {
        return -1;
    }
    if (!locationB) {
        return 1;
    }
    return ((0, issue_position_1.compareIssuePositions)(locationA.start, locationB.start) ||
        (0, issue_position_1.compareIssuePositions)(locationA.end, locationB.end));
}
exports.compareIssueLocations = compareIssueLocations;
function formatIssueLocation(location) {
    return `${location.start.line}:${location.start.column}`;
}
exports.formatIssueLocation = formatIssueLocation;
