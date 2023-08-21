import { Attributes } from './Attributes.js';
import { Property, PropertyList, Node, AbstractNode, AbstractEmptyNode, NodeClass } from '../Tree/Node.js';
import { MmlFactory } from './MmlFactory.js';
import { DOMAdaptor } from '../DOMAdaptor.js';
export declare type AttributeList = {
    [attribute: string]: [string, Property];
};
export declare const TEXCLASS: {
    ORD: number;
    OP: number;
    BIN: number;
    REL: number;
    OPEN: number;
    CLOSE: number;
    PUNCT: number;
    INNER: number;
    VCENTER: number;
    NONE: number;
};
export declare const TEXCLASSNAMES: string[];
export declare const indentAttributes: string[];
export declare type MMLNODE = MmlNode | TextNode | XMLNode;
export interface MmlNode extends Node {
    readonly isToken: boolean;
    readonly isEmbellished: boolean;
    readonly isSpacelike: boolean;
    readonly linebreakContainer: boolean;
    readonly hasNewLine: boolean;
    readonly arity: number;
    readonly isInferred: boolean;
    readonly Parent: MmlNode;
    readonly notParent: boolean;
    parent: MmlNode;
    texClass: number;
    prevClass: number;
    prevLevel: number;
    attributes: Attributes;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    texSpacing(): string;
    hasSpacingAttributes(): boolean;
    setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    inheritAttributesFrom(node: MmlNode): void;
    mError(message: string, options: PropertyList, short?: boolean): MmlNode;
    verifyTree(options?: PropertyList): void;
}
export interface MmlNodeClass extends NodeClass {
    defaults?: PropertyList;
    new (factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]): MmlNode;
}
export declare abstract class AbstractMmlNode extends AbstractNode implements MmlNode {
    static defaults: PropertyList;
    static noInherit: {
        [node1: string]: {
            [node2: string]: {
                [attribute: string]: boolean;
            };
        };
    };
    static alwaysInherit: {
        [name: string]: boolean;
    };
    static verifyDefaults: PropertyList;
    prevClass: number;
    prevLevel: number;
    attributes: Attributes;
    childNodes: MmlNode[];
    parent: MmlNode;
    readonly factory: MmlFactory;
    protected texclass: number;
    constructor(factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]);
    copy(keepIds?: boolean): AbstractMmlNode;
    get texClass(): number;
    set texClass(texClass: number);
    get isToken(): boolean;
    get isEmbellished(): boolean;
    get isSpacelike(): boolean;
    get linebreakContainer(): boolean;
    get hasNewLine(): boolean;
    get arity(): number;
    get isInferred(): boolean;
    get Parent(): MmlNode;
    get notParent(): boolean;
    setChildren(children: MmlNode[]): void;
    appendChild(child: MmlNode): Node;
    replaceChild(newChild: MmlNode, oldChild: MmlNode): Node;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    protected updateTeXclass(core: MmlNode): void;
    protected getPrevClass(prev: MmlNode): void;
    texSpacing(): string;
    hasSpacingAttributes(): boolean;
    setInheritedAttributes(attributes?: AttributeList, display?: boolean, level?: number, prime?: boolean): void;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    protected addInheritedAttributes(current: AttributeList, attributes: PropertyList): AttributeList;
    inheritAttributesFrom(node: MmlNode): void;
    verifyTree(options?: PropertyList): void;
    protected verifyAttributes(options: PropertyList): void;
    protected verifyChildren(options: PropertyList): void;
    mError(message: string, options: PropertyList, short?: boolean): MmlNode;
}
export declare abstract class AbstractMmlTokenNode extends AbstractMmlNode {
    static defaults: PropertyList;
    get isToken(): boolean;
    getText(): string;
    protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;
    walkTree(func: (node: Node, data?: any) => void, data?: any): any;
}
export declare abstract class AbstractMmlLayoutNode extends AbstractMmlNode {
    static defaults: PropertyList;
    get isSpacelike(): boolean;
    get isEmbellished(): boolean;
    get arity(): number;
    core(): MmlNode;
    coreMO(): MmlNode;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare abstract class AbstractMmlBaseNode extends AbstractMmlNode {
    static defaults: PropertyList;
    get isEmbellished(): boolean;
    core(): MmlNode;
    coreMO(): MmlNode;
    setTeXclass(prev: MmlNode): MmlNode;
}
export declare abstract class AbstractMmlEmptyNode extends AbstractEmptyNode implements MmlNode {
    parent: MmlNode;
    get isToken(): boolean;
    get isEmbellished(): boolean;
    get isSpacelike(): boolean;
    get linebreakContainer(): boolean;
    get hasNewLine(): boolean;
    get arity(): number;
    get isInferred(): boolean;
    get notParent(): boolean;
    get Parent(): MmlNode;
    get texClass(): number;
    get prevClass(): number;
    get prevLevel(): number;
    hasSpacingAttributes(): boolean;
    get attributes(): Attributes;
    core(): MmlNode;
    coreMO(): MmlNode;
    coreIndex(): number;
    childPosition(): number;
    setTeXclass(prev: MmlNode): MmlNode;
    texSpacing(): string;
    setInheritedAttributes(_attributes: AttributeList, _display: boolean, _level: number, _prime: boolean): void;
    inheritAttributesFrom(_node: MmlNode): void;
    verifyTree(_options: PropertyList): void;
    mError(_message: string, _options: PropertyList, _short?: boolean): MmlNode;
}
export declare class TextNode extends AbstractMmlEmptyNode {
    protected text: string;
    get kind(): string;
    getText(): string;
    setText(text: string): TextNode;
    copy(): TextNode;
    toString(): string;
}
export declare class XMLNode extends AbstractMmlEmptyNode {
    protected xml: Object;
    protected adaptor: DOMAdaptor<any, any, any>;
    get kind(): string;
    getXML(): Object;
    setXML(xml: Object, adaptor?: DOMAdaptor<any, any, any>): XMLNode;
    getSerializedXML(): string;
    copy(): XMLNode;
    toString(): string;
}
