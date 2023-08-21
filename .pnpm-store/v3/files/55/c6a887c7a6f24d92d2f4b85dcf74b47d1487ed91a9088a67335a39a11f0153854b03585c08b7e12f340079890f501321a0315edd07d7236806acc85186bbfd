import { MmlVisitor } from './MmlVisitor.js';
import { MmlNode, TextNode, XMLNode } from './MmlNode.js';
export declare class MathMLVisitor extends MmlVisitor {
    protected document: Document;
    visitTree(node: MmlNode, document: Document): Node;
    visitTextNode(node: TextNode, parent: Element): void;
    visitXMLNode(node: XMLNode, parent: Element): void;
    visitInferredMrowNode(node: MmlNode, parent: Element): void;
    visitDefault(node: MmlNode, parent: Element): void;
    addAttributes(node: MmlNode, mml: Element): void;
}
