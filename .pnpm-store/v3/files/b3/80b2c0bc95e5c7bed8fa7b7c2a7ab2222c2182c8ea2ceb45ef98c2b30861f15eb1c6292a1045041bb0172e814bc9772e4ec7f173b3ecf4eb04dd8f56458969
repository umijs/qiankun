"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composeIssuePredicates = exports.createTrivialIssuePredicate = void 0;
function createTrivialIssuePredicate(result) {
    return () => result;
}
exports.createTrivialIssuePredicate = createTrivialIssuePredicate;
function composeIssuePredicates(predicates) {
    return (issue) => predicates.some((predicate) => predicate(issue));
}
exports.composeIssuePredicates = composeIssuePredicates;
