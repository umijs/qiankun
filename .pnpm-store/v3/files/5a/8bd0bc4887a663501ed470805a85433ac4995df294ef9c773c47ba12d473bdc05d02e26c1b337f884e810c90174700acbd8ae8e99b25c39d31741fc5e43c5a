import { SerializedMmlVisitor } from './SerializedMmlVisitor.js';
import { MmlNode } from './MmlNode.js';
import { PropertyList } from '../Tree/Node.js';
export declare class TestMmlVisitor extends SerializedMmlVisitor {
    visitDefault(node: MmlNode, space: string): string;
    protected getAttributes(node: MmlNode): string;
    protected getInherited(node: MmlNode): string;
    protected getProperties(node: MmlNode): string;
    protected attributeString(attributes: PropertyList, open: string, close: string): string;
}
