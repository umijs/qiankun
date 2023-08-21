import type { DomHandlerOptions } from '../domhandler';
import type { ParserOptions } from '../htmlparser2';
/** Options accepted by htmlparser2, the default parser for XML. */
export interface HTMLParser2Options extends DomHandlerOptions, ParserOptions {
}
/** Options for parse5, the default parser for HTML. */
export interface Parse5Options {
    /** Disable scripting in parse5, so noscript tags would be parsed. */
    scriptingEnabled?: boolean;
    /** Enable location support for parse5. */
    sourceCodeLocationInfo?: boolean;
}
/** Internal options for Cheerio. */
export interface InternalOptions extends HTMLParser2Options, Parse5Options {
    _useHtmlParser2?: boolean;
}
/**
 * Options accepted by Cheerio.
 *
 * Please note that parser-specific options are *only recognized* if the
 * relevant parser is used.
 */
export interface CheerioOptions extends HTMLParser2Options, Parse5Options {
    /** Suggested way of configuring htmlparser2 when wanting to parse XML. */
    xml?: HTMLParser2Options | boolean;
}
declare const defaultOpts: CheerioOptions;
/** Cheerio default options. */
export default defaultOpts;
export declare function flatten(options?: CheerioOptions | null): InternalOptions | undefined;
//# sourceMappingURL=options.d.ts.map