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
exports.tapAfterCompileToGetIssues = void 0;
const infrastructure_logger_1 = require("../infrastructure-logger");
const issue_webpack_error_1 = require("../issue/issue-webpack-error");
const plugin_hooks_1 = require("../plugin-hooks");
function tapAfterCompileToGetIssues(compiler, config, state) {
    const hooks = (0, plugin_hooks_1.getPluginHooks)(compiler);
    const { debug } = (0, infrastructure_logger_1.getInfrastructureLogger)(compiler);
    compiler.hooks.afterCompile.tapPromise('ForkTsCheckerWebpackPlugin', (compilation) => __awaiter(this, void 0, void 0, function* () {
        if (compilation.compiler !== compiler) {
            // run only for the compiler that the plugin was registered for
            return;
        }
        let issues = [];
        try {
            issues = yield state.issuesPromise;
        }
        catch (error) {
            hooks.error.call(error, compilation);
            return;
        }
        debug('Got issues from getIssuesWorker.', issues === null || issues === void 0 ? void 0 : issues.length);
        if (!issues) {
            // some error has been thrown or it was canceled
            return;
        }
        // filter list of issues by provided issue predicate
        issues = issues.filter(config.issue.predicate);
        // modify list of issues in the plugin hooks
        issues = hooks.issues.call(issues, compilation);
        issues.forEach((issue) => {
            const error = new issue_webpack_error_1.IssueWebpackError(config.formatter.format(issue), config.formatter.pathType, issue);
            if (issue.severity === 'warning') {
                compilation.warnings.push(error);
            }
            else {
                compilation.errors.push(error);
            }
        });
    }));
}
exports.tapAfterCompileToGetIssues = tapAfterCompileToGetIssues;
