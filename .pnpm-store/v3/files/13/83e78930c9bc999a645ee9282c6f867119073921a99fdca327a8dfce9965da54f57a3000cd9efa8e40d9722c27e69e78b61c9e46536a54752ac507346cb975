import { SCOPING_PARAMETER_GROUP } from '../Constants';
import { CommandLineAction, ICommandLineActionOptions } from './CommandLineAction';
import { CommandLineParser, ICommandLineParserOptions } from './CommandLineParser';
import type { CommandLineParameter } from '../parameters/BaseClasses';
import type { CommandLineParameterProvider, ICommandLineParserData } from './CommandLineParameterProvider';
/**
 * Represents a sub-command that is part of the CommandLineParser command-line.
 * Applications should create subclasses of ScopedCommandLineAction corresponding to
 * each action that they want to expose.
 *
 * The action name should be comprised of lower case words separated by hyphens
 * or colons. The name should include an English verb (e.g. "deploy"). Use a
 * hyphen to separate words (e.g. "upload-docs"). A group of related commands
 * can be prefixed with a colon (e.g. "docs:generate", "docs:deploy",
 * "docs:serve", etc).
 *
 * Scoped commands allow for different parameters to be specified for different
 * provided scoping values. For example, the "scoped-action --scope A" command
 * may allow for different scoped arguments to be specified than the "scoped-action
 * --scope B" command.
 *
 * Scoped arguments are specified after the "--" pseudo-argument. For example,
 * "scoped-action --scope A -- --scopedFoo --scopedBar".
 *
 * @public
 */
export declare abstract class ScopedCommandLineAction extends CommandLineAction {
    private _options;
    private _scopingParameters;
    private _unscopedParserOptions;
    private _scopedCommandLineParser;
    /**
     * The required group name to apply to all scoping parameters. At least one parameter
     * must be defined with this group name.
     */
    static readonly ScopingParameterGroup: typeof SCOPING_PARAMETER_GROUP;
    constructor(options: ICommandLineActionOptions);
    /**
     * {@inheritDoc CommandLineParameterProvider.parameters}
     */
    get parameters(): ReadonlyArray<CommandLineParameter>;
    /**
     * {@inheritdoc CommandLineAction._processParsedData}
     * @internal
     */
    _processParsedData(parserOptions: ICommandLineParserOptions, data: ICommandLineParserData): void;
    /**
     * {@inheritdoc CommandLineAction._execute}
     * @internal
     */
    _execute(): Promise<void>;
    /**
     * {@inheritdoc CommandLineParameterProvider.onDefineParameters}
     */
    protected onDefineParameters(): void;
    /**
     * Retrieves the scoped CommandLineParser, which is populated after the ScopedCommandLineAction is executed.
     * @internal
     */
    protected _getScopedCommandLineParser(): CommandLineParser;
    /** @internal */
    protected _defineParameter(parameter: CommandLineParameter): void;
    /**
     * The child class should implement this hook to define its unscoped command-line parameters,
     * e.g. by calling defineFlagParameter(). At least one scoping parameter must be defined.
     * Scoping parameters are defined by setting the parameterGroupName to
     * ScopedCommandLineAction.ScopingParameterGroupName.
     */
    protected onDefineUnscopedParameters?(): void;
    /**
     * The child class should implement this hook to define its scoped command-line
     * parameters, e.g. by calling scopedParameterProvider.defineFlagParameter(). These
     * parameters will only be available if the action is invoked with a scope.
     *
     * @remarks
     * onDefineScopedParameters is called after the unscoped parameters have been parsed.
     * The values they provide can be used to vary the defined scope parameters.
     */
    protected abstract onDefineScopedParameters(scopedParameterProvider: CommandLineParameterProvider): void;
    /**
     * {@inheritDoc CommandLineAction.onExecute}
     */
    protected abstract onExecute(): Promise<void>;
}
//# sourceMappingURL=ScopedCommandLineAction.d.ts.map