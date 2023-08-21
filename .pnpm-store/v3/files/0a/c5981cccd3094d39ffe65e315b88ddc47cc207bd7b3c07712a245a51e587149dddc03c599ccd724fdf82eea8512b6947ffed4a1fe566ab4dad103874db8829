import { OptionList } from '../util/Options.js';
import { ProtoItem } from './MathItem.js';
export interface FindMath<N, T, _D> {
    findMath(node: N): ProtoItem<N, T>[];
    findMath(strings: string[]): ProtoItem<N, T>[];
}
export declare abstract class AbstractFindMath<N, T, D> implements FindMath<N, T, D> {
    static OPTIONS: OptionList;
    protected options: OptionList;
    constructor(options: OptionList);
    abstract findMath(where: N | string[]): ProtoItem<N, T>[];
}
