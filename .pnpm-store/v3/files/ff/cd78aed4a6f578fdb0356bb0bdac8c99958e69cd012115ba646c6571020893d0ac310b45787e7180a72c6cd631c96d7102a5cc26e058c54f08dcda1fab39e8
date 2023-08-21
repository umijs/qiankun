import { CharMap, CharOptions, CharData, VariantData, DelimiterData, FontData } from '../common/FontData.js';
import { Usage } from './Usage.js';
import { StringMap } from './Wrapper.js';
import { StyleList } from '../../util/StyleList.js';
export * from '../common/FontData.js';
export interface CHTMLCharOptions extends CharOptions {
    c?: string;
    f?: string;
}
export declare type CHTMLCharMap = CharMap<CHTMLCharOptions>;
export declare type CHTMLCharData = CharData<CHTMLCharOptions>;
export interface CHTMLVariantData extends VariantData<CHTMLCharOptions> {
    classes?: string;
    letter: string;
}
export interface CHTMLDelimiterData extends DelimiterData {
}
export declare class CHTMLFontData extends FontData<CHTMLCharOptions, CHTMLVariantData, CHTMLDelimiterData> {
    static OPTIONS: {
        fontURL: string;
    };
    static JAX: string;
    protected static defaultVariantClasses: StringMap;
    protected static defaultVariantLetters: StringMap;
    protected static defaultStyles: {
        'mjx-c::before': {
            display: string;
            width: number;
        };
    };
    protected static defaultFonts: {
        '@font-face /* 0 */': {
            'font-family': string;
            src: string;
        };
    };
    charUsage: Usage<[string, number]>;
    delimUsage: Usage<number>;
    static charOptions(font: CHTMLCharMap, n: number): CHTMLCharOptions;
    adaptiveCSS(adapt: boolean): void;
    clearCache(): void;
    createVariant(name: string, inherit?: string, link?: string): void;
    defineChars(name: string, chars: CHTMLCharMap): void;
    get styles(): StyleList;
    updateStyles(styles: StyleList): StyleList;
    protected allStyles(styles: StyleList): void;
    protected addFontURLs(styles: StyleList, fonts: StyleList, url: string): void;
    protected addDelimiterStyles(styles: StyleList, n: number, data: CHTMLDelimiterData): void;
    protected addDelimiterVStyles(styles: StyleList, c: string, data: CHTMLDelimiterData): void;
    protected addDelimiterVPart(styles: StyleList, c: string, part: string, n: number, HDW: CHTMLCharData): number;
    protected addDelimiterHStyles(styles: StyleList, c: string, data: CHTMLDelimiterData): void;
    protected addDelimiterHPart(styles: StyleList, c: string, part: string, n: number, HDW: CHTMLCharData): void;
    protected addCharStyles(styles: StyleList, vletter: string, n: number, data: CHTMLCharData): void;
    protected getDelimiterData(n: number): CHTMLCharData;
    em(n: number): string;
    em0(n: number): string;
    padding([h, d, w]: CHTMLCharData, dw?: number, ic?: number): string;
    charContent(n: number): string;
    charSelector(n: number): string;
}
export declare type CHTMLFontDataClass = typeof CHTMLFontData;
export declare type CharOptionsMap = {
    [name: number]: CHTMLCharOptions;
};
export declare type CssMap = {
    [name: number]: number;
};
export declare function AddCSS(font: CHTMLCharMap, options: CharOptionsMap): CHTMLCharMap;
