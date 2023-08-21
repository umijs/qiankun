import { SVGmenclose } from './Wrappers/menclose.js';
import * as Notation from '../common/Notation.js';
export * from '../common/Notation.js';
export declare type Menclose = SVGmenclose<any, any, any>;
export declare type RENDERER<N, T, D> = Notation.Renderer<SVGmenclose<N, T, D>, N>;
export declare type DEFPAIR<N, T, D> = Notation.DefPair<SVGmenclose<N, T, D>, N>;
export declare type LineName = Notation.Side | ('vertical' | 'horizontal' | 'up' | 'down');
export declare type LineData = [number, number, number, number];
export declare const computeLineData: {
    [kind: string]: (h: number, d: number, w: number, t: number) => LineData;
};
export declare const lineData: (node: Menclose, kind: LineName, offset?: string) => LineData;
export declare const lineOffset: (data: LineData, node: Menclose, offset: string) => LineData;
export declare const RenderLine: <N, T, D>(line: LineName, offset?: string) => RENDERER<N, T, D>;
export declare const Border: <N, T, D>(side: Notation.Side) => DEFPAIR<N, T, D>;
export declare const Border2: <N, T, D>(name: string, side1: Notation.Side, side2: Notation.Side) => DEFPAIR<N, T, D>;
export declare const DiagonalStrike: <N, T, D>(name: LineName) => DEFPAIR<N, T, D>;
export declare const DiagonalArrow: <N, T, D>(name: string) => DEFPAIR<N, T, D>;
export declare const Arrow: <N, T, D>(name: string) => DEFPAIR<N, T, D>;
