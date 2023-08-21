import { CharMap, CharOptions, CharData, VariantData, DelimiterData, FontData } from '../common/FontData.js';
export * from '../common/FontData.js';
export declare type CharStringMap = {
    [name: number]: string;
};
export interface SVGCharOptions extends CharOptions {
    c?: string;
    p?: string;
}
export declare type SVGCharMap = CharMap<SVGCharOptions>;
export declare type SVGCharData = CharData<SVGCharOptions>;
export interface SVGVariantData extends VariantData<SVGCharOptions> {
    cacheID: string;
}
export interface SVGDelimiterData extends DelimiterData {
}
export declare class SVGFontData extends FontData<SVGCharOptions, SVGVariantData, SVGDelimiterData> {
    static OPTIONS: {
        dynamicPrefix: string;
    };
    static JAX: string;
    static charOptions(font: SVGCharMap, n: number): SVGCharOptions;
}
export declare type SVGFontDataClass = typeof SVGFontData;
export declare function AddPaths(font: SVGCharMap, paths: CharStringMap, content: CharStringMap): SVGCharMap;
