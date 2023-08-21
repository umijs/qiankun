import { MinDOMParser } from '../HTMLAdaptor.js';
import { LiteDocument } from './Document.js';
import { LiteElement } from './Element.js';
import { LiteText, LiteComment } from './Text.js';
import { LiteAdaptor } from '../liteAdaptor.js';
export declare namespace PATTERNS {
    const TAGNAME = "[a-z][^\\s\\n>]*";
    const ATTNAME = "[a-z][^\\s\\n>=]*";
    const VALUE = "(?:'[^']*'|\"[^\"]*\"|[^\\s\\n]+)";
    const VALUESPLIT = "(?:'([^']*)'|\"([^\"]*)\"|([^\\s\\n]+))";
    const SPACE = "(?:\\s|\\n)+";
    const OPTIONALSPACE = "(?:\\s|\\n)*";
    const ATTRIBUTE: string;
    const ATTRIBUTESPLIT: string;
    const TAG: string;
    const tag: RegExp;
    const attr: RegExp;
    const attrsplit: RegExp;
}
export declare class LiteParser implements MinDOMParser<LiteDocument> {
    static SELF_CLOSING: {
        [name: string]: boolean;
    };
    static PCDATA: {
        [name: string]: boolean;
    };
    static CDATA_ATTR: {
        [name: string]: boolean;
    };
    parseFromString(text: string, _format?: string, adaptor?: LiteAdaptor): LiteDocument;
    protected addText(adaptor: LiteAdaptor, node: LiteElement, text: string): LiteText;
    protected addComment(adaptor: LiteAdaptor, node: LiteElement, comment: string): LiteComment;
    protected closeTag(adaptor: LiteAdaptor, node: LiteElement, tag: string): LiteElement;
    protected openTag(adaptor: LiteAdaptor, node: LiteElement, tag: string, parts: string[]): LiteElement;
    protected addAttributes(adaptor: LiteAdaptor, node: LiteElement, attributes: string[]): void;
    protected handlePCDATA(adaptor: LiteAdaptor, node: LiteElement, kind: string, parts: string[]): void;
    protected checkDocument(adaptor: LiteAdaptor, root: LiteDocument): void;
    protected getOnlyChild(adaptor: LiteAdaptor, body: LiteElement): LiteElement;
    serialize(adaptor: LiteAdaptor, node: LiteElement, xml?: boolean): string;
    serializeInner(adaptor: LiteAdaptor, node: LiteElement, xml?: boolean): string;
    protectAttribute(text: string): string;
    protectHTML(text: string): string;
}
