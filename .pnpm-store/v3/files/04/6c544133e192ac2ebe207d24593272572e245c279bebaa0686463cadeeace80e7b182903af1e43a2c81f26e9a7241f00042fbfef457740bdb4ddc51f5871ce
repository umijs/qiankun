import { SVGWrapper, SVGConstructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
import { StyleList } from '../../../util/StyleList.js';
declare const SVGsemantics_base: import("../../common/Wrappers/semantics.js").SemanticsConstructor & SVGConstructor<any, any, any>;
export declare class SVGsemantics<N, T, D> extends SVGsemantics_base {
    static kind: string;
    toSVG(parent: N): void;
}
export declare class SVGannotation<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    toSVG(parent: N): void;
    computeBBox(): BBox;
}
export declare class SVGannotationXML<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    static styles: StyleList;
}
export declare class SVGxml<N, T, D> extends SVGWrapper<N, T, D> {
    static kind: string;
    static autoStyle: boolean;
    toSVG(parent: N): void;
    computeBBox(bbox: BBox, _recompute?: boolean): void;
    protected getStyles(): void;
    protected getScale(): void;
    protected getVariant(): void;
}
export {};
