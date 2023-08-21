import { Handler } from '../core/Handler.js';
import { MmlNode } from '../core/MmlTree/MmlNode.js';
import { MathML } from '../input/mathml.js';
import { EnrichedMathItem, EnrichedMathDocument } from './semantic-enrich.js';
import { MathDocumentConstructor } from '../core/MathDocument.js';
import { LiveRegion, ToolTip, HoverRegion } from './explorer/Region.js';
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type HANDLER = Handler<HTMLElement, Text, Document>;
export declare type HTMLDOCUMENT = EnrichedMathDocument<HTMLElement, Text, Document>;
export declare type HTMLMATHITEM = EnrichedMathItem<HTMLElement, Text, Document>;
export declare type MATHML = MathML<HTMLElement, Text, Document>;
export interface ExplorerMathItem extends HTMLMATHITEM {
    explorable(document: HTMLDOCUMENT, force?: boolean): void;
    attachExplorers(document: HTMLDOCUMENT): void;
}
export declare function ExplorerMathItemMixin<B extends Constructor<HTMLMATHITEM>>(BaseMathItem: B, toMathML: (node: MmlNode) => string): Constructor<ExplorerMathItem> & B;
export interface ExplorerMathDocument extends HTMLDOCUMENT {
    explorerRegions: ExplorerRegions;
    explorable(): HTMLDOCUMENT;
}
export declare function ExplorerMathDocumentMixin<B extends MathDocumentConstructor<HTMLDOCUMENT>>(BaseDocument: B): MathDocumentConstructor<ExplorerMathDocument> & B;
export declare function ExplorerHandler(handler: HANDLER, MmlJax?: MATHML): HANDLER;
export declare type ExplorerRegions = {
    speechRegion?: LiveRegion;
    brailleRegion?: LiveRegion;
    magnifier?: HoverRegion;
    tooltip1?: ToolTip;
    tooltip2?: ToolTip;
    tooltip3?: ToolTip;
};
export declare function setA11yOptions(document: HTMLDOCUMENT, options: {
    [key: string]: any;
}): void;
export declare function setA11yOption(document: HTMLDOCUMENT, option: string, value: string | boolean): void;
