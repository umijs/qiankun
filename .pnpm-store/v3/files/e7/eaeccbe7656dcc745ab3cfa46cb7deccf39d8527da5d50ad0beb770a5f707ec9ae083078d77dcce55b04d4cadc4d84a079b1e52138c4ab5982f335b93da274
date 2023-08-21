import { OptionList } from '../../util/Options.js';
import { Styles } from '../../util/Styles.js';
import { LiteText } from './Text.js';
export declare type LiteAttributeList = OptionList;
export declare type LiteNode = LiteElement | LiteText;
export declare class LiteElement {
    kind: string;
    attributes: LiteAttributeList;
    children: LiteNode[];
    parent: LiteElement;
    styles: Styles;
    constructor(kind: string, attributes?: LiteAttributeList, children?: LiteNode[]);
}
