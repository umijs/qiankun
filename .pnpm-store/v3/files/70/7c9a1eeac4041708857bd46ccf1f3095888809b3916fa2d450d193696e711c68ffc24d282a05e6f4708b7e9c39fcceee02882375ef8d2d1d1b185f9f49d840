import { ICommandLineFlagDefinition } from './CommandLineDefinition';
import { CommandLineParameter, CommandLineParameterKind } from './BaseClasses';
/**
 * The data type returned by {@link CommandLineParameterProvider.defineFlagParameter}.
 * @public
 */
export declare class CommandLineFlagParameter extends CommandLineParameter {
    private _value;
    /** @internal */
    constructor(definition: ICommandLineFlagDefinition);
    /** {@inheritDoc CommandLineParameter.kind} */
    get kind(): CommandLineParameterKind;
    /**
     * {@inheritDoc CommandLineParameter._setValue}
     * @internal
     */
    _setValue(data: any): void;
    /**
     * Returns a boolean indicating whether the parameter was included in the command line.
     *
     * @remarks
     * The return value will be false if the command-line has not been parsed yet,
     * or if the flag was not used.
     */
    get value(): boolean;
    /** {@inheritDoc CommandLineParameter.appendToArgList} @override */
    appendToArgList(argList: string[]): void;
}
//# sourceMappingURL=CommandLineFlagParameter.d.ts.map