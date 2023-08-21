export declare class Cli {
    process: any;
    setup: {
        [key: string]: string | boolean;
    };
    processors: string[];
    dp: DOMParser;
    private output;
    constructor();
    set(arg: string, value: string | boolean, _def: string): void;
    processor(processor: string): void;
    private loadLocales;
    enumerate(all?: boolean): Promise<void>;
    execute(input: string): void;
    readline(): void;
    commandLine(): Promise<void>;
    private runProcessors_;
    private readExpression_;
}
