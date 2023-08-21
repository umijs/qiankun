import { TextNode, MMLNODE, MmlNode } from '../../core/MmlTree/MmlNode.js';
import { Property, PropertyList } from '../../core/Tree/Node.js';
import { Args } from './Types.js';
import { OperatorDef } from '../../core/MmlTree/OperatorDictionary.js';
declare namespace NodeUtil {
    function createEntity(code: string): string;
    function getChildren(node: MmlNode): MMLNODE[];
    function getText(node: TextNode): string;
    function appendChildren(node: MmlNode, children: MMLNODE[]): void;
    function setAttribute(node: MmlNode, attribute: string, value: Args): void;
    function setProperty(node: MmlNode, property: string, value: Args): void;
    function setProperties(node: MmlNode, properties: PropertyList): void;
    function getProperty(node: MmlNode, property: string): Property;
    function getAttribute(node: MmlNode, attr: string): Property;
    function removeProperties(node: MmlNode, ...properties: string[]): void;
    function getChildAt(node: MmlNode, position: number): MMLNODE;
    function setChild(node: MmlNode, position: number, child: MmlNode): void;
    function copyChildren(oldNode: MmlNode, newNode: MmlNode): void;
    function copyAttributes(oldNode: MmlNode, newNode: MmlNode): void;
    function isType(node: MmlNode, kind: string): boolean;
    function isEmbellished(node: MmlNode): boolean;
    function getTexClass(node: MmlNode): number;
    function getCoreMO(node: MmlNode): MmlNode;
    function isNode(item: any): boolean;
    function isInferred(node: MmlNode): boolean;
    function getForm(node: MmlNode): OperatorDef;
}
export default NodeUtil;
