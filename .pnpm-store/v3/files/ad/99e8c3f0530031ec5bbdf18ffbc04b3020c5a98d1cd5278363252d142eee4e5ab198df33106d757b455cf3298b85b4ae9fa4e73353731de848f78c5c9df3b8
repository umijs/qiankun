export declare type StyleList = {
    [name: string]: string;
};
export declare type connection = {
    children: string[];
    split: (name: string) => void;
    combine: (name: string) => void;
};
export declare type connections = {
    [name: string]: connection;
};
export declare class Styles {
    static pattern: {
        [name: string]: RegExp;
    };
    static connect: connections;
    protected styles: StyleList;
    constructor(cssText?: string);
    get cssText(): string;
    set(name: string, value: string | number | boolean): void;
    get(name: string): string;
    protected setStyle(name: string, value: string): void;
    protected combineChildren(name: string): void;
    protected parentName(name: string): string;
    protected childName(name: string, child: string): string;
    protected normalizeName(name: string): string;
    protected parse(cssText?: string): void;
}
