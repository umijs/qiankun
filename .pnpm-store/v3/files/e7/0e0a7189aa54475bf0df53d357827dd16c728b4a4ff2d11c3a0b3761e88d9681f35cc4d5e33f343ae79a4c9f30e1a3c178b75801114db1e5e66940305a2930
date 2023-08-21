import type webpack from 'webpack';
import type { FormatterConfig } from './formatter';
import type { IssueConfig } from './issue/issue-config';
import type { Logger } from './logger';
import type { ForkTsCheckerWebpackPluginOptions } from './plugin-options';
import type { TypeScriptWorkerConfig } from './typescript/type-script-worker-config';
interface ForkTsCheckerWebpackPluginConfig {
    async: boolean;
    typescript: TypeScriptWorkerConfig;
    issue: IssueConfig;
    formatter: FormatterConfig;
    logger: Logger;
    devServer: boolean;
}
declare function createPluginConfig(compiler: webpack.Compiler, options?: ForkTsCheckerWebpackPluginOptions): ForkTsCheckerWebpackPluginConfig;
export { ForkTsCheckerWebpackPluginConfig, createPluginConfig };
