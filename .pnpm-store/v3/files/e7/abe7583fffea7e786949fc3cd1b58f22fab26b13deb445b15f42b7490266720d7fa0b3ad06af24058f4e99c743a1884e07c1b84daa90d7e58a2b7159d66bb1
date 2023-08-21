export declare class Debugger {
    private static instance;
    private isActive_;
    private outputFunction_;
    private fileHandle;
    private stream_;
    static getInstance(): Debugger;
    init(opt_file?: string): any;
    output(...args: any[]): void;
    generateOutput(func: () => string[]): void;
    exit(callback?: () => any): void;
    private constructor();
    private startDebugFile_;
    private output_;
}
