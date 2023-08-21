import { AST_NODE_TYPES, AST_TOKEN_TYPES } from '@typescript-eslint/typescript-estree';
import { ParserOptions } from './ParserOptions';
import { RuleModule } from './Rule';
interface ValidTestCase<TOptions extends Readonly<any[]>> {
    code: string;
    options?: TOptions;
    filename?: string;
    parserOptions?: ParserOptions;
    settings?: Record<string, any>;
    parser?: string;
    globals?: Record<string, boolean>;
    env?: {
        browser?: boolean;
    };
}
interface InvalidTestCase<TMessageIds extends string, TOptions extends Readonly<any[]>> extends ValidTestCase<TOptions> {
    errors: TestCaseError<TMessageIds>[];
    output?: string | null;
}
interface TestCaseError<TMessageIds extends string> {
    messageId: TMessageIds;
    data?: Record<string, any>;
    type?: AST_NODE_TYPES | AST_TOKEN_TYPES;
    line?: number;
    column?: number;
    endLine?: number;
    endColumn?: number;
}
interface RunTests<TMessageIds extends string, TOptions extends Readonly<any[]>> {
    valid: (ValidTestCase<TOptions> | string)[];
    invalid: InvalidTestCase<TMessageIds, TOptions>[];
}
interface RuleTesterConfig {
    parser?: '@typescript-eslint/parser' | 'espree' | 'babel-eslint' | 'esprima' | string;
    parserOptions?: ParserOptions;
}
declare interface RuleTester {
    run<TMessageIds extends string, TOptions extends Readonly<any[]>>(name: string, rule: RuleModule<TMessageIds, TOptions>, tests: RunTests<TMessageIds, TOptions>): void;
}
declare const RuleTester: new (config?: RuleTesterConfig | undefined) => RuleTester;
export { InvalidTestCase, RuleTester, RuleTesterConfig, RunTests, TestCaseError, ValidTestCase, };
//# sourceMappingURL=RuleTester.d.ts.map