"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueWebpackError = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const forward_slash_1 = require("../utils/path/forward-slash");
const relative_to_context_1 = require("../utils/path/relative-to-context");
const issue_location_1 = require("./issue-location");
class IssueWebpackError extends webpack_1.default.WebpackError {
    constructor(message, pathType, issue) {
        super(message);
        this.issue = issue;
        this.hideStack = true;
        // to display issue location using `loc` property, webpack requires `error.module` which
        // should be a NormalModule instance.
        // to avoid such a dependency, we do a workaround - error.file will contain formatted location instead
        if (issue.file) {
            this.file =
                pathType === 'absolute'
                    ? (0, forward_slash_1.forwardSlash)(path_1.default.resolve(issue.file))
                    : (0, relative_to_context_1.relativeToContext)(issue.file, process.cwd());
            if (issue.location) {
                this.file += `:${chalk_1.default.green.bold((0, issue_location_1.formatIssueLocation)(issue.location))}`;
            }
        }
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.IssueWebpackError = IssueWebpackError;
