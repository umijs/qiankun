import type { IssueLocation } from './issue-location';
import type { IssueSeverity } from './issue-severity';
interface Issue {
    severity: IssueSeverity;
    code: string;
    message: string;
    file?: string;
    location?: IssueLocation;
}
declare function isIssue(value: unknown): value is Issue;
declare function deduplicateAndSortIssues(issues: Issue[]): Issue[];
export { Issue, isIssue, deduplicateAndSortIssues };
