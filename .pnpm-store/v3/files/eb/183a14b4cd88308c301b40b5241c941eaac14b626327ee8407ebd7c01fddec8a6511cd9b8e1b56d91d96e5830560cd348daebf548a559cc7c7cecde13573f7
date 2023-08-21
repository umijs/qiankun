import { ICommandLineIntegerDefinition } from './CommandLineDefinition';
import { CommandLineParameterWithArgument, CommandLineParameterKind } from './BaseClasses';
/**
 * The data type returned by {@link CommandLineParameterProvider.defineIntegerParameter}.
 * @public
 */
export declare class CommandLineIntegerParameter extends CommandLineParameterWithArgument {
    /** {@inheritDoc ICommandLineStringDefinition.defaultValue} */
    readonly defaultValue: number | undefined;
    private _value;
    /** @internal */
    constructor(definition: ICommandLineIntegerDefinition);
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
     * Returns the argument value for an integer parameter that was parsed from the command line.
     *
     * @remarks
     * The return value will be undefined if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get value(): number | undefined;
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList: string[]): void;
}
//# sourceMappingURL=CommandLineIntegerParameter.d.ts.map