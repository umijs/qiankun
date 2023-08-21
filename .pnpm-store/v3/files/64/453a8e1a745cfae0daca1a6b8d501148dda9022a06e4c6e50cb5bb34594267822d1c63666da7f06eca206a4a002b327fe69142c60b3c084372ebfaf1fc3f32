import { SemanticMeaning, SemanticFont, SemanticRole, SemanticType } from './semantic_meaning';
declare const enum Attribute {
    EMBELLISHED = "embellished",
    FENCEPOINTER = "fencepointer",
    FONT = "font",
    ID = "id",
    ANNOTATION = "annotation",
    ROLE = "role",
    TYPE = "type",
    CHILDREN = "children",
    CONTENT = "content",
    TEXT = "$t"
}
export declare class SemanticNode {
    id: number;
    mathml: Element[];
    parent: SemanticNode;
    type: SemanticType;
    role: SemanticRole;
    font: SemanticFont;
    embellished: SemanticType;
    fencePointer: string;
    childNodes: SemanticNode[];
    textContent: string;
    mathmlTree: Element;
    contentNodes: SemanticNode[];
    annotation: {
        [key: string]: string[];
    };
    attributes: {
        [key: string]: string;
    };
    nobreaking: boolean;
    static fromXml(xml: Element): SemanticNode;
    private static setAttribute;
    private static processChildren;
    constructor(id: number);
    querySelectorAll(pred: (p1: SemanticNode) => boolean): SemanticNode[];
    xml(xml: Document, brief?: boolean): Element;
    toString(brief?: boolean): string;
    allAttributes(): [Attribute, string][];
    private annotationXml;
    attributesXml(): string;
    toJson(): any;
    updateContent(content: string, text?: boolean): void;
    addMathmlNodes(mmlNodes: Element[]): void;
    appendChild(child: SemanticNode): void;
    replaceChild(oldNode: SemanticNode, newNode: SemanticNode): void;
    appendContentNode(node: SemanticNode): void;
    removeContentNode(node: SemanticNode): void;
    equals(node: SemanticNode): boolean;
    displayTree(): void;
    addAnnotation(domain: string, annotation: string): void;
    getAnnotation(domain: string): string[];
    hasAnnotation(domain: string, annotation: string): boolean;
    parseAnnotation(stateStr: string): void;
    meaning(): SemanticMeaning;
    private xmlAttributes;
    private addExternalAttributes;
    parseAttributes(stateStr: string): void;
    private removeMathmlNodes;
    private displayTree_;
    private mathmlTreeString;
    private addAnnotation_;
}
export {};
