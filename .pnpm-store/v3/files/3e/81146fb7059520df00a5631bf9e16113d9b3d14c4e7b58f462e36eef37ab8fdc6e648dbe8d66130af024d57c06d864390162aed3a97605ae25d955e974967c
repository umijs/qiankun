import { LinkedList } from '../util/LinkedList.js';
import { MathItem } from './MathItem.js';
export interface MathList<N, T, D> extends LinkedList<MathItem<N, T, D>> {
    isBefore(a: MathItem<N, T, D>, b: MathItem<N, T, D>): boolean;
}
export declare abstract class AbstractMathList<N, T, D> extends LinkedList<MathItem<N, T, D>> implements MathList<N, T, D> {
    isBefore(a: MathItem<N, T, D>, b: MathItem<N, T, D>): boolean;
}
