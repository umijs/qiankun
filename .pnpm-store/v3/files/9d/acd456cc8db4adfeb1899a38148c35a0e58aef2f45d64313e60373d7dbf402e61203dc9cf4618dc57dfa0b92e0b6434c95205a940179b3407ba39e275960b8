import { AbstractInputJax } from '../core/InputJax.js';
import { OptionList } from '../util/Options.js';
import { MathDocument } from '../core/MathDocument.js';
import { MathItem } from '../core/MathItem.js';
import { FindAsciiMath } from './asciimath/FindAsciiMath.js';
export declare class AsciiMath<N, T, D> extends AbstractInputJax<N, T, D> {
    static NAME: string;
    static OPTIONS: OptionList;
    protected findAsciiMath: FindAsciiMath<N, T, D>;
    constructor(options: OptionList);
    compile(math: MathItem<N, T, D>, _document: MathDocument<N, T, D>): any;
    findMath(strings: string[]): import("../core/MathItem.js").ProtoItem<N, T>[];
}
