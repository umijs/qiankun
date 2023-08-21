export declare type ParseMethod = (factory: ParserFactory, json: any, ...aux: any[]) => any;
export declare class ParserFactory {
    private _parser;
    constructor(init: [string, ParseMethod][]);
    get(name: string): ParseMethod;
    add(name: string, method: ParseMethod): void;
}
