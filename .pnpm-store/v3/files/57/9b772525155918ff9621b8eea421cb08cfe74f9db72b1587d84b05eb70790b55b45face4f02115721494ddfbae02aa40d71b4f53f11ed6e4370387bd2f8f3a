/**
 * @beta
 */
export interface IColorableSequence {
    text: string;
    isEol?: boolean;
    foregroundColor?: ColorValue;
    backgroundColor?: ColorValue;
    textAttributes?: TextAttribute[];
}
export declare const eolSequence: IColorableSequence;
/**
 * Colors used with {@link IColorableSequence}.
 * @beta
 */
export declare enum ColorValue {
    Black = 0,
    Red = 1,
    Green = 2,
    Yellow = 3,
    Blue = 4,
    Magenta = 5,
    Cyan = 6,
    White = 7,
    Gray = 8
}
/**
 * Text styles used with {@link IColorableSequence}.
 * @beta
 */
export declare enum TextAttribute {
    Bold = 0,
    Dim = 1,
    Underline = 2,
    Blink = 3,
    InvertColor = 4,
    Hidden = 5
}
export declare enum ConsoleColorCodes {
    BlackForeground = 30,
    RedForeground = 31,
    GreenForeground = 32,
    YellowForeground = 33,
    BlueForeground = 34,
    MagentaForeground = 35,
    CyanForeground = 36,
    WhiteForeground = 37,
    GrayForeground = 90,
    DefaultForeground = 39,
    BlackBackground = 40,
    RedBackground = 41,
    GreenBackground = 42,
    YellowBackground = 43,
    BlueBackground = 44,
    MagentaBackground = 45,
    CyanBackground = 46,
    WhiteBackground = 47,
    GrayBackground = 100,
    DefaultBackground = 49,
    Bold = 1,
    Dim = 2,
    NormalColorOrIntensity = 22,
    Underline = 4,
    UnderlineOff = 24,
    Blink = 5,
    BlinkOff = 25,
    InvertColor = 7,
    InvertColorOff = 27,
    Hidden = 8,
    HiddenOff = 28
}
/**
 * The static functions on this class are used to produce colored text
 * for use with the node-core-library terminal.
 *
 * @example
 * terminal.writeLine(Colors.green('Green Text!'), ' ', Colors.blue('Blue Text!'));
 *
 * @beta
 */
export declare class Colors {
    static black(text: string | IColorableSequence): IColorableSequence;
    static red(text: string | IColorableSequence): IColorableSequence;
    static green(text: string | IColorableSequence): IColorableSequence;
    static yellow(text: string | IColorableSequence): IColorableSequence;
    static blue(text: string | IColorableSequence): IColorableSequence;
    static magenta(text: string | IColorableSequence): IColorableSequence;
    static cyan(text: string | IColorableSequence): IColorableSequence;
    static white(text: string | IColorableSequence): IColorableSequence;
    static gray(text: string | IColorableSequence): IColorableSequence;
    static blackBackground(text: string | IColorableSequence): IColorableSequence;
    static redBackground(text: string | IColorableSequence): IColorableSequence;
    static greenBackground(text: string | IColorableSequence): IColorableSequence;
    static yellowBackground(text: string | IColorableSequence): IColorableSequence;
    static blueBackground(text: string | IColorableSequence): IColorableSequence;
    static magentaBackground(text: string | IColorableSequence): IColorableSequence;
    static cyanBackground(text: string | IColorableSequence): IColorableSequence;
    static whiteBackground(text: string | IColorableSequence): IColorableSequence;
    static grayBackground(text: string | IColorableSequence): IColorableSequence;
    static bold(text: string | IColorableSequence): IColorableSequence;
    static dim(text: string | IColorableSequence): IColorableSequence;
    static underline(text: string | IColorableSequence): IColorableSequence;
    static blink(text: string | IColorableSequence): IColorableSequence;
    static invertColor(text: string | IColorableSequence): IColorableSequence;
    static hidden(text: string | IColorableSequence): IColorableSequence;
    /**
     * If called with a string, returns the string wrapped in a {@link IColorableSequence}.
     * If called with a {@link IColorableSequence}, returns the {@link IColorableSequence}.
     *
     * @internal
     */
    static _normalizeStringOrColorableSequence(value: string | IColorableSequence): IColorableSequence;
    private static _applyTextAttribute;
}
//# sourceMappingURL=Colors.d.ts.map