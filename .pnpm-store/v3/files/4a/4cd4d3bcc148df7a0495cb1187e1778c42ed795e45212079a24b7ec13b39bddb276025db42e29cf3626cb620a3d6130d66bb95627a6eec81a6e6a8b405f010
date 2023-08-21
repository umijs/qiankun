import { ICommandLineChoiceListDefinition } from './CommandLineDefinition';
import { CommandLineParameter, CommandLineParameterKind } from './BaseClasses';
/**
 * The data type returned by {@link CommandLineParameterProvider.defineChoiceListParameter}.
 * @public
 */
export declare class CommandLineChoiceListParameter extends CommandLineParameter {
    /** {@inheritDoc ICommandLineChoiceListDefinition.alternatives} */
    readonly alternatives: ReadonlyArray<string>;
    private _values;
    /** {@inheritDoc ICommandLineChoiceListDefinition.completions} */
    readonly completions: (() => Promise<string[]>) | undefined;
    /** @internal */
    constructor(definition: ICommandLineChoiceListDefinition);
    /** {@inheritDoc CommandLineParameter.kind} */
    get kind(): CommandLineParameterKind;
    /**
     * {@inheritDoc CommandLineParameter._setValue}
     * @internal
     */
    _setValue(data: any): void;
    /**
     * Returns the string arguments for a choice list parameter that was parsed from the command line.
     *
     * @remarks
     * The array will be empty if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get values(): ReadonlyArray<string>;
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList: string[]): void;
}
//# sourceMappingURL=CommandLineChoiceListParameter.d.ts.map