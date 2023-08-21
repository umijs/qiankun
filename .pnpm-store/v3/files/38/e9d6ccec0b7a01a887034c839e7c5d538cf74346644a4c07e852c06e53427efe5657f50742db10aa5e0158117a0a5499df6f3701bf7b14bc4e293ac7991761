import { AbstractFindMath } from '../../core/FindMath.js';
import { OptionList } from '../../util/Options.js';
import { ProtoItem } from '../../core/MathItem.js';
export declare type EndItem = [string, boolean, RegExp];
export declare type Delims = [string, string];
export declare class FindAsciiMath<N, T, D> extends AbstractFindMath<N, T, D> {
    static OPTIONS: OptionList;
    protected start: RegExp;
    protected end: {
        [name: string]: EndItem;
    };
    protected hasPatterns: boolean;
    constructor(options: OptionList);
    protected getPatterns(): void;
    protected addPattern(starts: string[], delims: Delims, display: boolean): void;
    protected findEnd(text: string, n: number, start: RegExpExecArray, end: EndItem): ProtoItem<N, T>;
    protected findMathInString(math: ProtoItem<N, T>[], n: number, text: string): void;
    findMath(strings: string[]): ProtoItem<N, T>[];
}
