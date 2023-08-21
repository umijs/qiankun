"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.ConsoleColorCodes = exports.TextAttribute = exports.ColorValue = exports.eolSequence = void 0;
exports.eolSequence = {
    isEol: true
};
/**
 * Colors used with {@link IColorableSequence}.
 * @beta
 */
var ColorValue;
(function (ColorValue) {
    ColorValue[ColorValue["Black"] = 0] = "Black";
    ColorValue[ColorValue["Red"] = 1] = "Red";
    ColorValue[ColorValue["Green"] = 2] = "Green";
    ColorValue[ColorValue["Yellow"] = 3] = "Yellow";
    ColorValue[ColorValue["Blue"] = 4] = "Blue";
    ColorValue[ColorValue["Magenta"] = 5] = "Magenta";
    ColorValue[ColorValue["Cyan"] = 6] = "Cyan";
    ColorValue[ColorValue["White"] = 7] = "White";
    ColorValue[ColorValue["Gray"] = 8] = "Gray";
})(ColorValue = exports.ColorValue || (exports.ColorValue = {}));
/**
 * Text styles used with {@link IColorableSequence}.
 * @beta
 */
var TextAttribute;
(function (TextAttribute) {
    TextAttribute[TextAttribute["Bold"] = 0] = "Bold";
    TextAttribute[TextAttribute["Dim"] = 1] = "Dim";
    TextAttribute[TextAttribute["Underline"] = 2] = "Underline";
    TextAttribute[TextAttribute["Blink"] = 3] = "Blink";
    TextAttribute[TextAttribute["InvertColor"] = 4] = "InvertColor";
    TextAttribute[TextAttribute["Hidden"] = 5] = "Hidden";
})(TextAttribute = exports.TextAttribute || (exports.TextAttribute = {}));
var ConsoleColorCodes;
(function (ConsoleColorCodes) {
    ConsoleColorCodes[ConsoleColorCodes["BlackForeground"] = 30] = "BlackForeground";
    ConsoleColorCodes[ConsoleColorCodes["RedForeground"] = 31] = "RedForeground";
    ConsoleColorCodes[ConsoleColorCodes["GreenForeground"] = 32] = "GreenForeground";
    ConsoleColorCodes[ConsoleColorCodes["YellowForeground"] = 33] = "YellowForeground";
    ConsoleColorCodes[ConsoleColorCodes["BlueForeground"] = 34] = "BlueForeground";
    ConsoleColorCodes[ConsoleColorCodes["MagentaForeground"] = 35] = "MagentaForeground";
    ConsoleColorCodes[ConsoleColorCodes["CyanForeground"] = 36] = "CyanForeground";
    ConsoleColorCodes[ConsoleColorCodes["WhiteForeground"] = 37] = "WhiteForeground";
    ConsoleColorCodes[ConsoleColorCodes["GrayForeground"] = 90] = "GrayForeground";
    ConsoleColorCodes[ConsoleColorCodes["DefaultForeground"] = 39] = "DefaultForeground";
    ConsoleColorCodes[ConsoleColorCodes["BlackBackground"] = 40] = "BlackBackground";
    ConsoleColorCodes[ConsoleColorCodes["RedBackground"] = 41] = "RedBackground";
    ConsoleColorCodes[ConsoleColorCodes["GreenBackground"] = 42] = "GreenBackground";
    ConsoleColorCodes[ConsoleColorCodes["YellowBackground"] = 43] = "YellowBackground";
    ConsoleColorCodes[ConsoleColorCodes["BlueBackground"] = 44] = "BlueBackground";
    ConsoleColorCodes[ConsoleColorCodes["MagentaBackground"] = 45] = "MagentaBackground";
    ConsoleColorCodes[ConsoleColorCodes["CyanBackground"] = 46] = "CyanBackground";
    ConsoleColorCodes[ConsoleColorCodes["WhiteBackground"] = 47] = "WhiteBackground";
    ConsoleColorCodes[ConsoleColorCodes["GrayBackground"] = 100] = "GrayBackground";
    ConsoleColorCodes[ConsoleColorCodes["DefaultBackground"] = 49] = "DefaultBackground";
    ConsoleColorCodes[ConsoleColorCodes["Bold"] = 1] = "Bold";
    // On Linux, the "BoldOff" code instead causes the text to be double-underlined:
    // https://en.wikipedia.org/wiki/Talk:ANSI_escape_code#SGR_21%E2%80%94%60Bold_off%60_not_widely_supported
    // Use "NormalColorOrIntensity" instead
    // BoldOff = 21,
    ConsoleColorCodes[ConsoleColorCodes["Dim"] = 2] = "Dim";
    ConsoleColorCodes[ConsoleColorCodes["NormalColorOrIntensity"] = 22] = "NormalColorOrIntensity";
    ConsoleColorCodes[ConsoleColorCodes["Underline"] = 4] = "Underline";
    ConsoleColorCodes[ConsoleColorCodes["UnderlineOff"] = 24] = "UnderlineOff";
    ConsoleColorCodes[ConsoleColorCodes["Blink"] = 5] = "Blink";
    ConsoleColorCodes[ConsoleColorCodes["BlinkOff"] = 25] = "BlinkOff";
    ConsoleColorCodes[ConsoleColorCodes["InvertColor"] = 7] = "InvertColor";
    ConsoleColorCodes[ConsoleColorCodes["InvertColorOff"] = 27] = "InvertColorOff";
    ConsoleColorCodes[ConsoleColorCodes["Hidden"] = 8] = "Hidden";
    ConsoleColorCodes[ConsoleColorCodes["HiddenOff"] = 28] = "HiddenOff";
})(ConsoleColorCodes = exports.ConsoleColorCodes || (exports.ConsoleColorCodes = {}));
/**
 * The static functions on this class are used to produce colored text
 * for use with the node-core-library terminal.
 *
 * @example
 * terminal.writeLine(Colors.green('Green Text!'), ' ', Colors.blue('Blue Text!'));
 *
 * @beta
 */
class Colors {
    static black(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Black });
    }
    static red(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Red });
    }
    static green(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Green });
    }
    static yellow(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Yellow });
    }
    static blue(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Blue });
    }
    static magenta(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Magenta });
    }
    static cyan(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Cyan });
    }
    static white(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.White });
    }
    static gray(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { foregroundColor: ColorValue.Gray });
    }
    static blackBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Black });
    }
    static redBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Red });
    }
    static greenBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Green });
    }
    static yellowBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Yellow });
    }
    static blueBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Blue });
    }
    static magentaBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Magenta });
    }
    static cyanBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Cyan });
    }
    static whiteBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.White });
    }
    static grayBackground(text) {
        return Object.assign(Object.assign({}, Colors._normalizeStringOrColorableSequence(text)), { backgroundColor: ColorValue.Gray });
    }
    static bold(text) {
        return Colors._applyTextAttribute(text, TextAttribute.Bold);
    }
    static dim(text) {
        return Colors._applyTextAttribute(text, TextAttribute.Dim);
    }
    static underline(text) {
        return Colors._applyTextAttribute(text, TextAttribute.Underline);
    }
    static blink(text) {
        return Colors._applyTextAttribute(text, TextAttribute.Blink);
    }
    static invertColor(text) {
        return Colors._applyTextAttribute(text, TextAttribute.InvertColor);
    }
    static hidden(text) {
        return Colors._applyTextAttribute(text, TextAttribute.Hidden);
    }
    /**
     * If called with a string, returns the string wrapped in a {@link IColorableSequence}.
     * If called with a {@link IColorableSequence}, returns the {@link IColorableSequence}.
     *
     * @internal
     */
    static _normalizeStringOrColorableSequence(value) {
        if (typeof value === 'string') {
            return {
                text: value
            };
        }
        else {
            return value;
        }
    }
    static _applyTextAttribute(text, attribute) {
        const sequence = Colors._normalizeStringOrColorableSequence(text);
        if (!sequence.textAttributes) {
            sequence.textAttributes = [];
        }
        sequence.textAttributes.push(attribute);
        return sequence;
    }
}
exports.Colors = Colors;
//# sourceMappingURL=Colors.js.map