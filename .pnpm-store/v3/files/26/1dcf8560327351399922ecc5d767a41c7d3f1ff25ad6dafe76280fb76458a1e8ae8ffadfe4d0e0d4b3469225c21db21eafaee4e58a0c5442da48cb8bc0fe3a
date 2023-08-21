interface NamedColor {
    color: string;
    alpha?: number;
}
interface ChannelColor {
    red: number;
    green: number;
    blue: number;
    alpha?: number;
}
export interface StringColor {
    background: string;
    alphaback?: string;
    foreground: string;
    alphafore?: string;
}
export declare type Color = ChannelColor | NamedColor;
export declare class ColorPicker {
    private static DEFAULT_BACKGROUND_;
    private static DEFAULT_FOREGROUND_;
    foreground: ChannelColor;
    background: ChannelColor;
    private static toHex;
    constructor(background: Color, foreground?: Color);
    rgba(): StringColor;
    rgb(): StringColor;
    hex(): StringColor;
}
export declare class ContrastPicker {
    hue: number;
    sat: number;
    light: number;
    incr: number;
    generate(): string;
    increment(): void;
}
export {};
