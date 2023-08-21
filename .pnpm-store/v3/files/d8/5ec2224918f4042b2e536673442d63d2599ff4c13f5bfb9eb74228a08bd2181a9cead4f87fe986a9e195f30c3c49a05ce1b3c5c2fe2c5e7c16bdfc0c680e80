"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deduplicateAndSortIssues = exports.isIssue = void 0;
const issue_location_1 = require("./issue-location");
const issue_severity_1 = require("./issue-severity");
function isIssue(value) {
    return (!!value &&
        typeof value === 'object' &&
        (0, issue_severity_1.isIssueSeverity)(value.severity) &&
        !!value.code &&
        !!value.message);
}
exports.isIssue = isIssue;
function compareStrings(stringA, stringB) {
    if (stringA === stringB) {
        return 0;
    }
    if (stringA === undefined || stringA === null) {
        return -1;
    }
    if (stringB === undefined || stringB === null) {
        return 1;
    }
    return stringA.toString().localeCompare(stringB.toString());
}
function compareIssues(issueA, issueB) {
    return ((0, issue_severity_1.compareIssueSeverities)(issueA.severity, issueB.severity) ||
        compareStrings(issueA.file, issueB.file) ||
        (0, issue_location_1.compareIssueLocations)(issueA.location, issueB.location) ||
        compareStrings(issueA.code, issueB.code) ||
        compareStrings(issueA.message, issueB.message) ||
        0 /* EqualTo */);
}
function equalsIssues(issueA, issueB) {
    return compareIssues(issueA, issueB) === 0;
}
function deduplicateAndSortIssues(issues) {
    const sortedIssues = issues.filter(isIssue).sort(compareIssues);
    return sortedIssues.filter((issue, index) => index === 0 || !equalsIssues(issue, sortedIssues[index - 1]));
}
exports.deduplicateAndSortIssues = deduplicateAndSortIssues;
