import { AbstractFindMath } from '../../core/FindMath.js';
import { DOMAdaptor } from '../../core/DOMAdaptor.js';
import { OptionList } from '../../util/Options.js';
import { ProtoItem } from '../../core/MathItem.js';
export declare class FindMathML<N, T, D> extends AbstractFindMath<N, T, D> {
    static OPTIONS: OptionList;
    adaptor: DOMAdaptor<N, T, D>;
    findMath(node: N): ProtoItem<N, T>[];
    protected findMathNodes(node: N, set: Set<N>): void;
    protected findMathPrefixed(node: N, set: Set<N>): void;
    protected findMathNS(node: N, set: Set<N>): void;
    protected processMath(set: Set<N>): ProtoItem<N, T>[];
}
