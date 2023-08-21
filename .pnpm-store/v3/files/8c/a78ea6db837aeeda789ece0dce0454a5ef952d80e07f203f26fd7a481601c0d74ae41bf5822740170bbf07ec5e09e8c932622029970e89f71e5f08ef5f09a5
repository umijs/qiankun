import { AnyWrapper } from './Wrapper.js';
import { CommonMenclose } from './Wrappers/menclose.js';
export declare const ARROWX = 4, ARROWDX = 1, ARROWY = 2;
export declare const THICKNESS = 0.067;
export declare const PADDING = 0.2;
export declare const SOLID: string;
export declare type Menclose = CommonMenclose<any, any, any>;
export declare type PaddingData = [number, number, number, number];
export declare type Renderer<W extends AnyWrapper, N> = (node: W, child: N) => void;
export declare type BBoxExtender<W extends AnyWrapper> = (node: W) => PaddingData;
export declare type BBoxBorder<W extends AnyWrapper> = (node: W) => PaddingData;
export declare type Initializer<W extends AnyWrapper> = (node: W) => void;
export declare type NotationDef<W extends AnyWrapper, N> = {
    renderer: Renderer<W, N>;
    bbox: BBoxExtender<W>;
    border?: BBoxBorder<W>;
    renderChild?: boolean;
    init?: Initializer<W>;
    remove?: string;
};
export declare type DefPair<W extends AnyWrapper, N> = [string, NotationDef<W, N>];
export declare type DefList<W extends AnyWrapper, N> = Map<string, NotationDef<W, N>>;
export declare type DefPairF<T, W extends AnyWrapper, N> = (name: T) => DefPair<W, N>;
export declare type List<W extends AnyWrapper, N> = {
    [notation: string]: NotationDef<W, N>;
};
export declare const sideIndex: {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
export declare type Side = keyof typeof sideIndex;
export declare const sideNames: ("left" | "top" | "bottom" | "right")[];
export declare const fullBBox: BBoxExtender<Menclose>;
export declare const fullPadding: BBoxExtender<Menclose>;
export declare const fullBorder: BBoxBorder<Menclose>;
export declare const arrowHead: (node: Menclose) => number;
export declare const arrowBBoxHD: (node: Menclose, TRBL: PaddingData) => PaddingData;
export declare const arrowBBoxW: (node: Menclose, TRBL: PaddingData) => PaddingData;
export declare const arrowDef: {
    [name: string]: [number, boolean, boolean, string];
};
export declare const diagonalArrowDef: {
    [name: string]: [number, number, boolean, string];
};
export declare const arrowBBox: {
    [name: string]: BBoxExtender<Menclose>;
};
export declare const CommonBorder: <W extends Menclose, N>(render: Renderer<W, N>) => DefPairF<"left" | "top" | "bottom" | "right", W, N>;
export declare const CommonBorder2: <W extends Menclose, N>(render: Renderer<W, N>) => (name: string, side1: Side, side2: Side) => DefPair<W, N>;
export declare const CommonDiagonalStrike: <W extends Menclose, N>(render: (sname: string) => Renderer<W, N>) => DefPairF<string, W, N>;
export declare const CommonDiagonalArrow: <W extends Menclose, N>(render: Renderer<W, N>) => DefPairF<string, W, N>;
export declare const CommonArrow: <W extends Menclose, N>(render: Renderer<W, N>) => DefPairF<string, W, N>;
