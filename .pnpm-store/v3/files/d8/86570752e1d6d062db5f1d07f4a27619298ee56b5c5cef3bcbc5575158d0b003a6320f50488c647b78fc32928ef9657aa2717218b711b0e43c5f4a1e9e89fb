"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = exports.NewlineKind = exports.Encoding = void 0;
const os = __importStar(require("os"));
/**
 * The allowed types of encodings, as supported by Node.js
 * @public
 */
var Encoding;
(function (Encoding) {
    Encoding["Utf8"] = "utf8";
})(Encoding = exports.Encoding || (exports.Encoding = {}));
/**
 * Enumeration controlling conversion of newline characters.
 * @public
 */
var NewlineKind;
(function (NewlineKind) {
    /**
     * Windows-style newlines
     */
    NewlineKind["CrLf"] = "\r\n";
    /**
     * POSIX-style newlines
     *
     * @remarks
     * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
     */
    NewlineKind["Lf"] = "\n";
    /**
     * Default newline type for this operating system (`os.EOL`).
     */
    NewlineKind["OsDefault"] = "os";
})(NewlineKind = exports.NewlineKind || (exports.NewlineKind = {}));
/**
 * Operations for working with strings that contain text.
 *
 * @remarks
 * The utilities provided by this class are intended to be simple, small, and very
 * broadly applicable.
 *
 * @public
 */
class Text {
    /**
     * Returns the same thing as targetString.replace(searchValue, replaceValue), except that
     * all matches are replaced, rather than just the first match.
     * @param input         - The string to be modified
     * @param searchValue   - The value to search for
     * @param replaceValue  - The replacement text
     */
    static replaceAll(input, searchValue, replaceValue) {
        return input.split(searchValue).join(replaceValue);
    }
    /**
     * Converts all newlines in the provided string to use Windows-style CRLF end of line characters.
     */
    static convertToCrLf(input) {
        return input.replace(Text._newLineRegEx, '\r\n');
    }
    /**
     * Converts all newlines in the provided string to use POSIX-style LF end of line characters.
     *
     * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
     */
    static convertToLf(input) {
        return input.replace(Text._newLineRegEx, '\n');
    }
    /**
     * Converts all newlines in the provided string to use the specified newline type.
     */
    static convertTo(input, newlineKind) {
        return input.replace(Text._newLineRegEx, Text.getNewline(newlineKind));
    }
    /**
     * Returns the newline character sequence for the specified `NewlineKind`.
     */
    static getNewline(newlineKind) {
        switch (newlineKind) {
            case NewlineKind.CrLf:
                return '\r\n';
            case NewlineKind.Lf:
                return '\n';
            case NewlineKind.OsDefault:
                return os.EOL;
            default:
                throw new Error('Unsupported newline kind');
        }
    }
    /**
     * Append characters to the end of a string to ensure the result has a minimum length.
     * @remarks
     * If the string length already exceeds the minimum length, then the string is unchanged.
     * The string is not truncated.
     */
    static padEnd(s, minimumLength, paddingCharacter = ' ') {
        if (paddingCharacter.length !== 1) {
            throw new Error('The paddingCharacter parameter must be a single character.');
        }
        if (s.length < minimumLength) {
            const paddingArray = new Array(minimumLength - s.length);
            paddingArray.unshift(s);
            return paddingArray.join(paddingCharacter);
        }
        else {
            return s;
        }
    }
    /**
     * Append characters to the start of a string to ensure the result has a minimum length.
     * @remarks
     * If the string length already exceeds the minimum length, then the string is unchanged.
     * The string is not truncated.
     */
    static padStart(s, minimumLength, paddingCharacter = ' ') {
        if (paddingCharacter.length !== 1) {
            throw new Error('The paddingCharacter parameter must be a single character.');
        }
        if (s.length < minimumLength) {
            const paddingArray = new Array(minimumLength - s.length);
            paddingArray.push(s);
            return paddingArray.join(paddingCharacter);
        }
        else {
            return s;
        }
    }
    /**
     * If the string is longer than maximumLength characters, truncate it to that length
     * using "..." to indicate the truncation.
     *
     * @remarks
     * For example truncateWithEllipsis('1234578', 5) would produce '12...'.
     */
    static truncateWithEllipsis(s, maximumLength) {
        if (maximumLength < 0) {
            throw new Error('The maximumLength cannot be a negative number');
        }
        if (s.length <= maximumLength) {
            return s;
        }
        if (s.length <= 3) {
            return s.substring(0, maximumLength);
        }
        return s.substring(0, maximumLength - 3) + '...';
    }
    /**
     * Returns the input string with a trailing `\n` character appended, if not already present.
     */
    static ensureTrailingNewline(s, newlineKind = NewlineKind.Lf) {
        // Is there already a newline?
        if (Text._newLineAtEndRegEx.test(s)) {
            return s; // yes, no change
        }
        return s + newlineKind; // no, add it
    }
    /**
     * Escapes a string so that it can be treated as a literal string when used in a regular expression.
     */
    static escapeRegExp(literal) {
        return literal.replace(/[^A-Za-z0-9_]/g, '\\$&');
    }
}
Text._newLineRegEx = /\r\n|\n\r|\r|\n/g;
Text._newLineAtEndRegEx = /(\r\n|\n\r|\r|\n)$/;
exports.Text = Text;
//# sourceMappingURL=Text.js.map