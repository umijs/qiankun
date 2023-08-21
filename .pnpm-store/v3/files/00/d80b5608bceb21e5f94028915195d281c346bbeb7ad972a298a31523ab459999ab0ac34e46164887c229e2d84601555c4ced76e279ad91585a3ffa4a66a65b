export declare type StyleData = {
    [property: string]: string | number;
};
export declare type StyleList = {
    [selector: string]: StyleData;
};
export declare class CssStyles {
    protected styles: StyleList;
    get cssText(): string;
    constructor(styles?: StyleList);
    addStyles(styles: StyleList): void;
    removeStyles(...selectors: string[]): void;
    clear(): void;
    getStyleString(): string;
    getStyleRules(): string[];
    getStyleDefString(styles: StyleData): string;
}
