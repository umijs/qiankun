import { Linter } from './Linter';
import { RuleModule, RuleListener } from './Rule';
interface CLIEngine {
    version: string;
    executeOnFiles(patterns: string[]): CLIEngine.LintReport;
    resolveFileGlobPatterns(patterns: string[]): string[];
    getConfigForFile(filePath: string): Linter.Config;
    executeOnText(text: string, filename?: string): CLIEngine.LintReport;
    addPlugin(name: string, pluginObject: any): void;
    isPathIgnored(filePath: string): boolean;
    getFormatter(format?: string): CLIEngine.Formatter;
    getRules<TMessageIds extends string = any, TOptions extends readonly any[] = any[], TRuleListener extends RuleListener = RuleListener>(): Map<string, RuleModule<TMessageIds, TOptions, TRuleListener>>;
}
declare namespace CLIEngine {
    interface Options {
        allowInlineConfig?: boolean;
        baseConfig?: false | {
            [name: string]: any;
        };
        cache?: boolean;
        cacheFile?: string;
        cacheLocation?: string;
        configFile?: string;
        cwd?: string;
        envs?: string[];
        extensions?: string[];
        fix?: boolean;
        globals?: string[];
        ignore?: boolean;
        ignorePath?: string;
        ignorePattern?: string | string[];
        useEslintrc?: boolean;
        parser?: string;
        parserOptions?: Linter.ParserOptions;
        plugins?: string[];
        rules?: {
            [name: string]: Linter.RuleLevel | Linter.RuleLevelAndOptions;
        };
        rulePaths?: string[];
        reportUnusedDisableDirectives?: boolean;
    }
    interface LintResult {
        filePath: string;
        messages: Linter.LintMessage[];
        errorCount: number;
        warningCount: number;
        fixableErrorCount: number;
        fixableWarningCount: number;
        output?: string;
        source?: string;
    }
    interface LintReport {
        results: LintResult[];
        errorCount: number;
        warningCount: number;
        fixableErrorCount: number;
        fixableWarningCount: number;
    }
    type Formatter = (results: LintResult[]) => string;
}
declare const CLIEngine: {
    new (options: CLIEngine.Options): CLIEngine;
    getErrorResults(results: CLIEngine.LintResult[]): CLIEngine.LintResult[];
    outputFixes(report: CLIEngine.LintReport): void;
};
export { CLIEngine };
//# sourceMappingURL=CLIEngine.d.ts.map