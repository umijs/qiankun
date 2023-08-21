import { AbstractFindMath } from '../../core/FindMath.js';
import { OptionList } from '../../util/Options.js';
import { ProtoItem } from '../../core/MathItem.js';
export declare type EndItem = [string, boolean, RegExp];
export declare type Delims = [string, string];
export declare class FindTeX<N, T, D> extends AbstractFindMath<N, T, D> {
    static OPTIONS: OptionList;
    protected start: RegExp;
    protected end: {
        [name: string]: EndItem;
    };
    protected hasPatterns: boolean;
    protected env: number;
    protected sub: number;
    constructor(options: OptionList);
    protected getPatterns(): void;
    protected addPattern(starts: string[], delims: Delims, display: boolean): void;
    protected endPattern(end: string, endp?: string): RegExp;
    protected findEnd(text: string, n: number, start: RegExpExecArray, end: EndItem): ProtoItem<N, T>;
    protected findMathInString(math: ProtoItem<N, T>[], n: number, text: string): void;
    findMath(strings: string[]): ProtoItem<N, T>[];
}
