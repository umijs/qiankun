"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIssueConfig = void 0;
const issue_match_1 = require("./issue-match");
const issue_predicate_1 = require("./issue-predicate");
function createIssuePredicateFromOption(context, option) {
    if (Array.isArray(option)) {
        return (0, issue_predicate_1.composeIssuePredicates)(option.map((option) => typeof option === 'function' ? option : (0, issue_match_1.createIssuePredicateFromIssueMatch)(context, option)));
    }
    return typeof option === 'function'
        ? option
        : (0, issue_match_1.createIssuePredicateFromIssueMatch)(context, option);
}
function createIssueConfig(compiler, options) {
    const context = compiler.options.context || process.cwd();
    if (!options) {
        options = {};
    }
    const include = options.include
        ? createIssuePredicateFromOption(context, options.include)
        : (0, issue_predicate_1.createTrivialIssuePredicate)(true);
    const exclude = options.exclude
        ? createIssuePredicateFromOption(context, options.exclude)
        : (0, issue_predicate_1.createTrivialIssuePredicate)(false);
    return {
        predicate: (issue) => include(issue) && !exclude(issue),
    };
}
exports.createIssueConfig = createIssueConfig;
