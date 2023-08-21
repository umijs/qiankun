"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebpackFormatter = void 0;
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const issue_1 = require("../issue");
const forward_slash_1 = require("../utils/path/forward-slash");
const relative_to_context_1 = require("../utils/path/relative-to-context");
function createWebpackFormatter(formatter, pathType) {
    // mimics webpack error formatter
    return function webpackFormatter(issue) {
        const color = issue.severity === 'warning' ? chalk_1.default.yellow.bold : chalk_1.default.red.bold;
        const severity = issue.severity.toUpperCase();
        if (issue.file) {
            let location = chalk_1.default.bold(pathType === 'absolute'
                ? (0, forward_slash_1.forwardSlash)(path_1.default.resolve(issue.file))
                : (0, relative_to_context_1.relativeToContext)(issue.file, process.cwd()));
            if (issue.location) {
                location += `:${chalk_1.default.green.bold((0, issue_1.formatIssueLocation)(issue.location))}`;
            }
            return [`${color(severity)} in ${location}`, formatter(issue), ''].join(os_1.default.EOL);
        }
        else {
            return [`${color(severity)} in ` + formatter(issue), ''].join(os_1.default.EOL);
        }
    };
}
exports.createWebpackFormatter = createWebpackFormatter;
