import { TSESTree, ParserServices } from '@typescript-eslint/typescript-estree';
import { ParserOptions as TSParserOptions } from './ParserOptions';
import { RuleModule, RuleFix } from './Rule';
import { Scope } from './Scope';
import { SourceCode } from './SourceCode';
interface Linter {
    version: string;
    verify(code: SourceCode | string, config: Linter.Config, filename?: string): Linter.LintMessage[];
    verify(code: SourceCode | string, config: Linter.Config, options: Linter.LintOptions): Linter.LintMessage[];
    verifyAndFix(code: string, config: Linter.Config, filename?: string): Linter.FixReport;
    verifyAndFix(code: string, config: Linter.Config, options: Linter.FixOptions): Linter.FixReport;
    getSourceCode(): SourceCode;
    defineRule<TMessageIds extends string, TOptions extends readonly any[]>(name: string, rule: {
        meta?: RuleModule<TMessageIds, TOptions>['meta'];
        create: RuleModule<TMessageIds, TOptions>['create'];
    }): void;
    defineRules<TMessageIds extends string, TOptions extends readonly any[]>(rules: Record<string, RuleModule<TMessageIds, TOptions>>): void;
    getRules<TMessageIds extends string, TOptions extends readonly any[]>(): Map<string, RuleModule<TMessageIds, TOptions>>;
    defineParser(name: string, parser: Linter.ParserModule): void;
}
declare namespace Linter {
    type Severity = 0 | 1 | 2;
    type RuleLevel = Severity | 'off' | 'warn' | 'error';
    interface RuleLevelAndOptions extends Array<any> {
        0: RuleLevel;
    }
    interface Config {
        rules?: {
            [name: string]: RuleLevel | RuleLevelAndOptions;
        };
        parser?: string;
        parserOptions?: ParserOptions;
        settings?: {
            [name: string]: any;
        };
        env?: {
            [name: string]: boolean;
        };
        globals?: {
            [name: string]: boolean;
        };
    }
    type ParserOptions = TSParserOptions;
    interface LintOptions {
        filename?: string;
        preprocess?: (code: string) => string[];
        postprocess?: (problemLists: LintMessage[][]) => LintMessage[];
        allowInlineConfig?: boolean;
        reportUnusedDisableDirectives?: boolean;
    }
    interface LintMessage {
        column: number;
        line: number;
        endColumn?: number;
        endLine?: number;
        ruleId: string | null;
        message: string;
        nodeType: string;
        fatal?: true;
        severity: Severity;
        fix?: RuleFix;
        source: string | null;
    }
    interface FixOptions extends LintOptions {
        fix?: boolean;
    }
    interface FixReport {
        fixed: boolean;
        output: string;
        messages: LintMessage[];
    }
    type ParserModule = {
        parse(text: string, options?: any): TSESTree.Program;
    } | {
        parseForESLint(text: string, options?: any): ESLintParseResult;
    };
    interface ESLintParseResult {
        ast: TSESTree.Program;
        parserServices?: ParserServices;
        scopeManager?: Scope.ScopeManager;
        visitorKeys?: SourceCode.VisitorKeys;
    }
}
declare const Linter: new () => Linter;
export { Linter };
//# sourceMappingURL=Linter.d.ts.map