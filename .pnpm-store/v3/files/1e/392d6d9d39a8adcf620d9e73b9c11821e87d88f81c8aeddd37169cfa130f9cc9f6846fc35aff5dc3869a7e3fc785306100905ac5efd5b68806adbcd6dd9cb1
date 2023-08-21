import { ITerminalProvider } from './ITerminalProvider';
import { IColorableSequence } from './Colors';
import { ITerminal } from './ITerminal';
/**
 * This class facilitates writing to a console.
 *
 * @beta
 */
export declare class Terminal implements ITerminal {
    private _providers;
    constructor(provider: ITerminalProvider);
    /**
     * {@inheritdoc ITerminal.registerProvider}
     */
    registerProvider(provider: ITerminalProvider): void;
    /**
     * {@inheritdoc ITerminal.unregisterProvider}
     */
    unregisterProvider(provider: ITerminalProvider): void;
    /**
     * {@inheritdoc ITerminal.write}
     */
    write(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeLine}
     */
    writeLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeWarning}
     */
    writeWarning(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeWarningLine}
     */
    writeWarningLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeError}
     */
    writeError(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeErrorLine}
     */
    writeErrorLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeVerbose}
     */
    writeVerbose(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeVerboseLine}
     */
    writeVerboseLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeDebug}
     */
    writeDebug(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * {@inheritdoc ITerminal.writeDebugLine}
     */
    writeDebugLine(...messageParts: (string | IColorableSequence)[]): void;
    private _writeSegmentsToProviders;
    private _serializeFormattableTextSegments;
}
//# sourceMappingURL=Terminal.d.ts.map