import { SVGConstructor, Constructor } from '../Wrapper.js';
import { SVGmtd } from './mtd.js';
export declare type SizeData = {
    x: number;
    y: number;
    w: number;
    lSpace: number;
    rSpace: number;
    lLine: number;
    rLine: number;
};
declare const SVGmtr_base: import("../../common/Wrappers/mtr.js").MtrConstructor<SVGmtd<any, any, any>> & SVGConstructor<any, any, any>;
export declare class SVGmtr<N, T, D> extends SVGmtr_base {
    static kind: string;
    H: number;
    D: number;
    tSpace: number;
    bSpace: number;
    tLine: number;
    bLine: number;
    toSVG(parent: N): void;
    protected placeCells(svg: N): void;
    placeCell(cell: SVGmtd<N, T, D>, sizes: SizeData): number;
    protected placeColor(): void;
}
declare const SVGmlabeledtr_base: import("../../common/Wrappers/mtr.js").MlabeledtrConstructor<SVGmtd<any, any, any>> & Constructor<SVGmtr<any, any, any>>;
export declare class SVGmlabeledtr<N, T, D> extends SVGmlabeledtr_base {
    static kind: string;
    toSVG(parent: N): void;
}
export {};
