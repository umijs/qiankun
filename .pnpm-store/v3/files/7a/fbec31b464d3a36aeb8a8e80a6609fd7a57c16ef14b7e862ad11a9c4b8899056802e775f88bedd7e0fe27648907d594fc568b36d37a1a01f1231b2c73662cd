import { MathItem } from '../../core/MathItem.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
import { SerializedMmlVisitor } from '../../core/MmlTree/SerializedMmlVisitor.js';
import { OptionList } from '../../util/Options.js';
export declare class MmlVisitor<N, T, D> extends SerializedMmlVisitor {
    options: OptionList;
    mathItem: MathItem<N, T, D>;
    visitTree(node: MmlNode, math?: MathItem<N, T, D>, options?: OptionList): any;
    visitTeXAtomNode(node: MmlNode, space: string): any;
    visitMathNode(node: MmlNode, space: string): string;
}
