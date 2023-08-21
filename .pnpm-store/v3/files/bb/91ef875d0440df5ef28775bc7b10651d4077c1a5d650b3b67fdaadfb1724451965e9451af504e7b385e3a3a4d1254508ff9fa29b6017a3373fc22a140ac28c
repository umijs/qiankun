import { ICommandLineStringDefinition } from './CommandLineDefinition';
import { CommandLineParameterWithArgument, CommandLineParameterKind } from './BaseClasses';
/**
 * The data type returned by {@link CommandLineParameterProvider.defineStringParameter}.
 * @public
 */
export declare class CommandLineStringParameter extends CommandLineParameterWithArgument {
    /** {@inheritDoc ICommandLineStringDefinition.defaultValue} */
    readonly defaultValue: string | undefined;
    private _value;
    /** @internal */
    constructor(definition: ICommandLineStringDefinition);
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
     * Returns the argument value for a string parameter that was parsed from the command line.
     *
     * @remarks
     * The return value will be undefined if the command-line has not been parsed yet,
     * or if the parameter was omitted and has no default value.
     */
    get value(): string | undefined;
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList: string[]): void;
}
//# sourceMappingURL=CommandLineStringParameter.d.ts.map