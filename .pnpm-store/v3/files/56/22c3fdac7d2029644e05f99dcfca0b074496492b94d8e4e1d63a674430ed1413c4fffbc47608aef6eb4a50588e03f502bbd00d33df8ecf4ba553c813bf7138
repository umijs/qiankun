import { Collector } from '../collector/Collector';
export declare class ApiReportGenerator {
    private static _trimSpacesRegExp;
    /**
     * Compares the contents of two API files that were created using ApiFileGenerator,
     * and returns true if they are equivalent.  Note that these files are not normally edited
     * by a human; the "equivalence" comparison here is intended to ignore spurious changes that
     * might be introduced by a tool, e.g. Git newline normalization or an editor that strips
     * whitespace when saving.
     */
    static areEquivalentApiFileContents(actualFileContent: string, expectedFileContent: string): boolean;
    static generateReviewFileContent(collector: Collector): string;
    /**
     * Before writing out a declaration, _modifySpan() applies various fixups to make it nice.
     */
    private static _modifySpan;
    /**
     * For declarations marked as `@preapproved`, this is used instead of _modifySpan().
     */
    private static _modifySpanForPreapproved;
    /**
     * Writes a synopsis of the AEDoc comments, which indicates the release tag,
     * whether the item has been documented, and any warnings that were detected
     * by the analysis.
     */
    private static _getAedocSynopsis;
    private static _writeLineAsComments;
}
//# sourceMappingURL=ApiReportGenerator.d.ts.map