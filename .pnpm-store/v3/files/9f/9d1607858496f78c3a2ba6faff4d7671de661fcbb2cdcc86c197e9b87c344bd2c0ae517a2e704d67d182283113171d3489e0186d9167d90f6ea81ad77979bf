import webpack from 'webpack';
import type { FormatterPathType } from '../formatter';
import type { Issue } from './issue';
declare class IssueWebpackError extends webpack.WebpackError {
    readonly issue: Issue;
    readonly hideStack = true;
    constructor(message: string, pathType: FormatterPathType, issue: Issue);
}
export { IssueWebpackError };
