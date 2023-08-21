import { ICommandLineChoiceDefinition } from './CommandLineDefinition';
import { CommandLineParameter, CommandLineParameterKind } from './BaseClasses';
/**
 * The data type returned by {@link CommandLineParameterProvider.defineChoiceParameter}.
 * @public
 */
export declare class CommandLineChoiceParameter extends CommandLineParameter {
    /** {@inheritDoc ICommandLineChoiceDefinition.alternatives} */
    readonly alternatives: ReadonlyArray<string>;
    /** {@inheritDoc ICommandLineStringDefinition.defaultValue} */
    readonly defaultValue: string | undefined;
    private _value;
    /** {@inheritDoc ICommandLineChoiceDefinition.completions} */
    readonly completions: (() => Promise<string[]>) | undefined;
    /** @internal */
    constructor(definition: ICommandLineChoiceDefinition);
    /** {@inheritDoc CommandLineParameter.kind} */
    get kind(): CommandLineParameterKind;
    /**
     * {@inheritDoc CommandLineParameter._setValue}
     * @internal
     */
    _setValue(data: any): void;
    /**
     * {@inheritDoc CommandLineParameter._getSupplementaryNotes}
     * @internal
     */
    _getSupplementaryNotes(supplementaryNotes: string[]): void;
    /**
     * Returns the argument value for a choice parameter that was parsed from the command line.
     *
     * @remarks
     * The return value will be `undefined` if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get value(): string | undefined;
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList: string[]): void;
}
//# sourceMappingURL=CommandLineChoiceParameter.d.ts.map