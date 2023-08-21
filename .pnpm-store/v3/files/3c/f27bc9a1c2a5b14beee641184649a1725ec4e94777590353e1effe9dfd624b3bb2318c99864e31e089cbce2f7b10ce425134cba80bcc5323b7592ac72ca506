/// <reference types="node" />
/// <reference types="node" />
import type { ITerminal } from './ITerminal';
import { TerminalProviderSeverity } from './ITerminalProvider';
import { Writable, type WritableOptions } from 'stream';
/**
 * Options for {@link TerminalWritable}.
 *
 * @beta
 */
export interface ITerminalWritableOptions {
    /**
     * The {@link ITerminal} that the Writable will write to.
     */
    terminal: ITerminal;
    /**
     * The severity of the messages that will be written to the {@link ITerminal}.
     */
    severity: TerminalProviderSeverity;
    /**
     * Options for the underlying Writable.
     */
    writableOptions?: WritableOptions;
}
/**
 * A adapter to allow writing to a provided terminal using Writable streams.
 *
 * @beta
 */
export declare class TerminalWritable extends Writable {
    private _writeMethod;
    constructor(options: ITerminalWritableOptions);
    _write(chunk: string | Buffer | Uint8Array, encoding: string, callback: (error?: Error | null) => void): void;
}
//# sourceMappingURL=TerminalWritable.d.ts.map