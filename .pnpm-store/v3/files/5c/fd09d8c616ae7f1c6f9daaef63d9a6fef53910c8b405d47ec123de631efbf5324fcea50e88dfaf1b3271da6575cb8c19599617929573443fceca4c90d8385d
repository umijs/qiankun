"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssuePredicateFromIssueMatch = void 0;
const path_1 = __importDefault(require("path"));
const minimatch_1 = __importDefault(require("minimatch"));
const forward_slash_1 = require("../utils/path/forward-slash");
function createIssuePredicateFromIssueMatch(context, match) {
    return (issue) => {
        const matchesSeverity = !match.severity || match.severity === issue.severity;
        const matchesCode = !match.code || match.code === issue.code;
        const matchesFile = !issue.file ||
            (!!issue.file &&
                (!match.file || (0, minimatch_1.default)((0, forward_slash_1.forwardSlash)(path_1.default.relative(context, issue.file)), match.file)));
        return matchesSeverity && matchesCode && matchesFile;
    };
}
exports.createIssuePredicateFromIssueMatch = createIssuePredicateFromIssueMatch;
