/**
 * The allowed types of encodings, as supported by Node.js
 * @public
 */
export declare enum Encoding {
    Utf8 = "utf8"
}
/**
 * Enumeration controlling conversion of newline characters.
 * @public
 */
export declare enum NewlineKind {
    /**
     * Windows-style newlines
     */
    CrLf = "\r\n",
    /**
     * POSIX-style newlines
     *
     * @remarks
     * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
     */
    Lf = "\n",
    /**
     * Default newline type for this operating system (`os.EOL`).
     */
    OsDefault = "os"
}
/**
 * Operations for working with strings that contain text.
 *
 * @remarks
 * The utilities provided by this class are intended to be simple, small, and very
 * broadly applicable.
 *
 * @public
 */
export declare class Text {
    private static readonly _newLineRegEx;
    private static readonly _newLineAtEndRegEx;
    /**
     * Returns the same thing as targetString.replace(searchValue, replaceValue), except that
     * all matches are replaced, rather than just the first match.
     * @param input         - The string to be modified
     * @param searchValue   - The value to search for
     * @param replaceValue  - The replacement text
     */
    static replaceAll(input: string, searchValue: string, replaceValue: string): string;
    /**
     * Converts all newlines in the provided string to use Windows-style CRLF end of line characters.
     */
    static convertToCrLf(input: string): string;
    /**
     * Converts all newlines in the provided string to use POSIX-style LF end of line characters.
     *
     * POSIX is a registered trademark of the Institute of Electrical and Electronic Engineers, Inc.
     */
    static convertToLf(input: string): string;
    /**
     * Converts all newlines in the provided string to use the specified newline type.
     */
    static convertTo(input: string, newlineKind: NewlineKind): string;
    /**
     * Returns the newline character sequence for the specified `NewlineKind`.
     */
    static getNewline(newlineKind: NewlineKind): string;
    /**
     * Append characters to the end of a string to ensure the result has a minimum length.
     * @remarks
     * If the string length already exceeds the minimum length, then the string is unchanged.
     * The string is not truncated.
     */
    static padEnd(s: string, minimumLength: number, paddingCharacter?: string): string;
    /**
     * Append characters to the start of a string to ensure the result has a minimum length.
     * @remarks
     * If the string length already exceeds the minimum length, then the string is unchanged.
     * The string is not truncated.
     */
    static padStart(s: string, minimumLength: number, paddingCharacter?: string): string;
    /**
     * If the string is longer than maximumLength characters, truncate it to that length
     * using "..." to indicate the truncation.
     *
     * @remarks
     * For example truncateWithEllipsis('1234578', 5) would produce '12...'.
     */
    static truncateWithEllipsis(s: string, maximumLength: number): string;
    /**
     * Returns the input string with a trailing `\n` character appended, if not already present.
     */
    static ensureTrailingNewline(s: string, newlineKind?: NewlineKind): string;
    /**
     * Escapes a string so that it can be treated as a literal string when used in a regular expression.
     */
    static escapeRegExp(literal: string): string;
}
//# sourceMappingURL=Text.d.ts.map