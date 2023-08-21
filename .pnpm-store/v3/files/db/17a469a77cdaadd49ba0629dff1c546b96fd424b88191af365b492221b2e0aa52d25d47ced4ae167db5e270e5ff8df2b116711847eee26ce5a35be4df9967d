import { ITerminalProvider } from './ITerminalProvider';
import { IColorableSequence } from './Colors';
/**
 * @beta
 */
export interface ITerminal {
    /**
     * Subscribe a new terminal provider.
     */
    registerProvider(provider: ITerminalProvider): void;
    /**
     * Unsubscribe a terminal provider. If the provider isn't subscribed, this function does nothing.
     */
    unregisterProvider(provider: ITerminalProvider): void;
    /**
     * Write a generic message to the terminal
     */
    write(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a generic message to the terminal, followed by a newline
     */
    writeLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a warning message to the console with yellow text.
     *
     * @remarks
     * The yellow color takes precedence over any other foreground colors set.
     */
    writeWarning(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a warning message to the console with yellow text, followed by a newline.
     *
     * @remarks
     * The yellow color takes precedence over any other foreground colors set.
     */
    writeWarningLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write an error message to the console with red text.
     *
     * @remarks
     * The red color takes precedence over any other foreground colors set.
     */
    writeError(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write an error message to the console with red text, followed by a newline.
     *
     * @remarks
     * The red color takes precedence over any other foreground colors set.
     */
    writeErrorLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a verbose-level message.
     */
    writeVerbose(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a verbose-level message followed by a newline.
     */
    writeVerboseLine(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a debug-level message.
     */
    writeDebug(...messageParts: (string | IColorableSequence)[]): void;
    /**
     * Write a debug-level message followed by a newline.
     */
    writeDebugLine(...messageParts: (string | IColorableSequence)[]): void;
}
//# sourceMappingURL=ITerminal.d.ts.map