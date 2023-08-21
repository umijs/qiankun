"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnsiEscape = void 0;
const Colors_1 = require("./Colors");
/**
 * Operations for working with text strings that contain
 * {@link https://en.wikipedia.org/wiki/ANSI_escape_code | ANSI escape codes}.
 * The most commonly used escape codes set the foreground/background color for console output.
 * @public
 */
class AnsiEscape {
    /**
     * Returns the input text with all ANSI escape codes removed.  For example, this is useful when saving
     * colorized console output to a log file.
     */
    static removeCodes(text) {
        // eslint-disable-next-line no-control-regex
        return text.replace(AnsiEscape._csiRegExp, '');
    }
    /**
     * Replaces ANSI escape codes with human-readable tokens.  This is useful for unit tests
     * that compare text strings in test assertions or snapshot files.
     */
    static formatForTests(text, options) {
        if (!options) {
            options = {};
        }
        let result = text.replace(AnsiEscape._csiRegExp, (capture, csiCode) => {
            // If it is an SGR code, then try to show a friendly token
            const match = csiCode.match(AnsiEscape._sgrRegExp);
            if (match) {
                const sgrParameter = parseInt(match[1]);
                const sgrParameterName = AnsiEscape._tryGetSgrFriendlyName(sgrParameter);
                if (sgrParameterName) {
                    // Example: "[black-bg]"
                    return `[${sgrParameterName}]`;
                }
            }
            // Otherwise show the raw code, but without the "[" from the CSI prefix
            // Example: "[31m]"
            return `[${csiCode}]`;
        });
        if (options.encodeNewlines) {
            result = result
                .replace(AnsiEscape._backslashNRegExp, '[n]')
                .replace(AnsiEscape._backslashRRegExp, `[r]`);
        }
        return result;
    }
    // Returns a human-readable token representing an SGR parameter, or undefined for parameter that is not well-known.
    // The SGR parameter numbers are documented in this table:
    // https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters
    static _tryGetSgrFriendlyName(sgiParameter) {
        switch (sgiParameter) {
            case Colors_1.ConsoleColorCodes.BlackForeground:
                return 'black';
            case Colors_1.ConsoleColorCodes.RedForeground:
                return 'red';
            case Colors_1.ConsoleColorCodes.GreenForeground:
                return 'green';
            case Colors_1.ConsoleColorCodes.YellowForeground:
                return 'yellow';
            case Colors_1.ConsoleColorCodes.BlueForeground:
                return 'blue';
            case Colors_1.ConsoleColorCodes.MagentaForeground:
                return 'magenta';
            case Colors_1.ConsoleColorCodes.CyanForeground:
                return 'cyan';
            case Colors_1.ConsoleColorCodes.WhiteForeground:
                return 'white';
            case Colors_1.ConsoleColorCodes.GrayForeground:
                return 'gray';
            case Colors_1.ConsoleColorCodes.DefaultForeground:
                return 'default';
            case Colors_1.ConsoleColorCodes.BlackBackground:
                return 'black-bg';
            case Colors_1.ConsoleColorCodes.RedBackground:
                return 'red-bg';
            case Colors_1.ConsoleColorCodes.GreenBackground:
                return 'green-bg';
            case Colors_1.ConsoleColorCodes.YellowBackground:
                return 'yellow-bg';
            case Colors_1.ConsoleColorCodes.BlueBackground:
                return 'blue-bg';
            case Colors_1.ConsoleColorCodes.MagentaBackground:
                return 'magenta-bg';
            case Colors_1.ConsoleColorCodes.CyanBackground:
                return 'cyan-bg';
            case Colors_1.ConsoleColorCodes.WhiteBackground:
                return 'white-bg';
            case Colors_1.ConsoleColorCodes.GrayBackground:
                return 'gray-bg';
            case Colors_1.ConsoleColorCodes.DefaultBackground:
                return 'default-bg';
            case Colors_1.ConsoleColorCodes.Bold:
                return 'bold';
            case Colors_1.ConsoleColorCodes.Dim:
                return 'dim';
            case Colors_1.ConsoleColorCodes.NormalColorOrIntensity:
                return 'normal';
            case Colors_1.ConsoleColorCodes.Underline:
                return 'underline';
            case Colors_1.ConsoleColorCodes.UnderlineOff:
                return 'underline-off';
            case Colors_1.ConsoleColorCodes.Blink:
                return 'blink';
            case Colors_1.ConsoleColorCodes.BlinkOff:
                return 'blink-off';
            case Colors_1.ConsoleColorCodes.InvertColor:
                return 'invert';
            case Colors_1.ConsoleColorCodes.InvertColorOff:
                return 'invert-off';
            case Colors_1.ConsoleColorCodes.Hidden:
                return 'hidden';
            case Colors_1.ConsoleColorCodes.HiddenOff:
                return 'hidden-off';
            default:
                return undefined;
        }
    }
}
// For now, we only care about the Control Sequence Introducer (CSI) commands which always start with "[".
// eslint-disable-next-line no-control-regex
AnsiEscape._csiRegExp = /\x1b\[([\x30-\x3f]*[\x20-\x2f]*[\x40-\x7e])/gu;
// Text coloring is performed using Select Graphic Rendition (SGR) codes, which come after the
// CSI introducer "ESC [".  The SGR sequence is a number followed by "m".
AnsiEscape._sgrRegExp = /([0-9]+)m/u;
AnsiEscape._backslashNRegExp = /\n/g;
AnsiEscape._backslashRRegExp = /\r/g;
exports.AnsiEscape = AnsiEscape;
//# sourceMappingURL=AnsiEscape.js.map