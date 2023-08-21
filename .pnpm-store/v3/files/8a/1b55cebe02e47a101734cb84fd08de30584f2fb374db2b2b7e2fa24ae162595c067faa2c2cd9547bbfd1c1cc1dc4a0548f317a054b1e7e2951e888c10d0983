import { MathItem } from '../../../core/MathItem.js';
import { MathDocument } from '../../../core/MathDocument.js';
import { Handler } from '../../../core/Handler.js';
export declare type FILTERDATA<N, T, D> = {
    math: MathItem<N, T, D>;
    document: MathDocument<N, T, D>;
    data: N;
};
export declare class Mml3<N, T, D> {
    static XSLT: string;
    protected transform: (node: N, doc: MathDocument<N, T, D>) => N;
    constructor(document: MathDocument<N, T, D>);
    mmlFilter(args: FILTERDATA<N, T, D>): void;
}
export declare function Mml3Handler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D>;
