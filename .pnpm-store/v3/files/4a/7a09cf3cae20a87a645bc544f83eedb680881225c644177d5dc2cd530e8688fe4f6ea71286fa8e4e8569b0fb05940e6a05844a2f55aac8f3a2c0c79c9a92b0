import { OptionList } from '../../util/Options.js';
import { CommonWrapper, AnyWrapperClass, Constructor } from '../common/Wrapper.js';
import { SVG } from '../svg.js';
import { SVGWrapperFactory } from './WrapperFactory.js';
import { SVGFontData, SVGDelimiterData, SVGCharOptions } from './FontData.js';
export { Constructor, StringMap } from '../common/Wrapper.js';
export declare type SVGConstructor<N, T, D> = Constructor<SVGWrapper<N, T, D>>;
export interface SVGWrapperClass extends AnyWrapperClass {
    kind: string;
}
export declare class SVGWrapper<N, T, D> extends CommonWrapper<SVG<N, T, D>, SVGWrapper<N, T, D>, SVGWrapperClass, SVGCharOptions, SVGDelimiterData, SVGFontData> {
    static kind: string;
    static borderFuzz: number;
    protected factory: SVGWrapperFactory<N, T, D>;
    parent: SVGWrapper<N, T, D>;
    childNodes: SVGWrapper<N, T, D>[];
    element: N;
    dx: number;
    font: SVGFontData;
    toSVG(parent: N): void;
    addChildren(parent: N): void;
    protected standardSVGnode(parent: N): N;
    protected createSVGnode(parent: N): N;
    protected handleStyles(): void;
    protected handleScale(): void;
    protected handleColor(): void;
    protected handleBorder(): void;
    protected addBorderSolid(path: number[][], color: string, child: N): void;
    protected addBorderBroken(path: number[][], color: string, style: string, t: number, i: number): void;
    protected handleAttributes(): void;
    place(x: number, y: number, element?: N): void;
    protected handleId(y: number): number;
    firstChild(): N;
    placeChar(n: number, x: number, y: number, parent: N, variant?: string): number;
    protected charNode(variant: string, C: string, path: string): N;
    protected pathNode(C: string, path: string): N;
    protected useNode(variant: string, C: string, path: string): N;
    drawBBox(): void;
    html(type: string, def?: OptionList, content?: (N | T)[]): N;
    svg(type: string, def?: OptionList, content?: (N | T)[]): N;
    text(text: string): T;
    fixed(x: number, n?: number): string;
}
