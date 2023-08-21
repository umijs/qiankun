import { OptionList } from '../../util/Options.js';
import { CommonWrapper, AnyWrapperClass, Constructor, StringMap } from '../common/Wrapper.js';
import { CHTML } from '../chtml.js';
import { CHTMLWrapperFactory } from './WrapperFactory.js';
import { CHTMLFontData, CHTMLCharOptions, CHTMLDelimiterData } from './FontData.js';
export { Constructor, StringMap } from '../common/Wrapper.js';
export declare const FONTSIZE: StringMap;
export declare const SPACE: StringMap;
export declare type CHTMLConstructor<N, T, D> = Constructor<CHTMLWrapper<N, T, D>>;
export interface CHTMLWrapperClass extends AnyWrapperClass {
    kind: string;
    autoStyle: boolean;
}
export declare class CHTMLWrapper<N, T, D> extends CommonWrapper<CHTML<N, T, D>, CHTMLWrapper<N, T, D>, CHTMLWrapperClass, CHTMLCharOptions, CHTMLDelimiterData, CHTMLFontData> {
    static kind: string;
    static autoStyle: boolean;
    protected factory: CHTMLWrapperFactory<N, T, D>;
    parent: CHTMLWrapper<N, T, D>;
    childNodes: CHTMLWrapper<N, T, D>[];
    chtml: N;
    toCHTML(parent: N): void;
    protected standardCHTMLnode(parent: N): N;
    markUsed(): void;
    protected createCHTMLnode(parent: N): N;
    protected handleStyles(): void;
    protected handleVariant(): void;
    protected handleScale(): void;
    protected setScale(chtml: N, rscale: number): N;
    protected handleSpace(): void;
    protected handleColor(): void;
    protected handleAttributes(): void;
    protected handlePWidth(): void;
    protected setIndent(chtml: N, align: string, shift: number): void;
    drawBBox(): void;
    html(type: string, def?: OptionList, content?: (N | T)[]): N;
    text(text: string): T;
    protected char(n: number): string;
}
