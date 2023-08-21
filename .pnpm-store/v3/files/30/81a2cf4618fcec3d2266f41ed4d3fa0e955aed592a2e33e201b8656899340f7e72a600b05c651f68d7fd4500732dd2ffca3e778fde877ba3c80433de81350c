import type { IssuePredicate } from './issue-predicate';
import type { Issue } from './index';
declare type IssueMatch = Partial<Pick<Issue, 'severity' | 'code' | 'file'>>;
declare function createIssuePredicateFromIssueMatch(context: string, match: IssueMatch): IssuePredicate;
export { IssueMatch, createIssuePredicateFromIssueMatch };
