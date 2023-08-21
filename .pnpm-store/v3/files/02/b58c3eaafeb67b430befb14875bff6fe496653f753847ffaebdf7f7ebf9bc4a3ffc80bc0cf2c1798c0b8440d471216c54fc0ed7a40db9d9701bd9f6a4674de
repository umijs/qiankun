import { SVGConstructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
import { SVGCharData } from '../FontData.js';
declare const SVGmo_base: import("../../common/Wrappers/mo.js").MoConstructor & SVGConstructor<any, any, any>;
export declare class SVGmo<N, T, D> extends SVGmo_base {
    static kind: string;
    toSVG(parent: N): void;
    protected stretchSVG(): void;
    protected getStretchVariants(): string[];
    protected stretchVertical(stretch: number[], variant: string[], bbox: BBox): void;
    protected stretchHorizontal(stretch: number[], variant: string[], bbox: BBox): void;
    protected getChar(n: number, variant: string): SVGCharData;
    protected addGlyph(n: number, variant: string, x: number, y: number, parent?: N): number;
    protected addTop(n: number, v: string, H: number, W: number): number;
    protected addExtV(n: number, v: string, H: number, D: number, T: number, B: number, W: number): void;
    protected addBot(n: number, v: string, D: number, W: number): number;
    protected addMidV(n: number, v: string, W: number): [number, number];
    protected addLeft(n: number, v: string): number;
    protected addExtH(n: number, v: string, W: number, L: number, R: number, x?: number): void;
    protected addRight(n: number, v: string, W: number): number;
    protected addMidH(n: number, v: string, W: number): [number, number];
}
export {};
