import { CHTMLWrapper, CHTMLConstructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
import { StyleList } from '../../../util/StyleList.js';
declare const CHTMLsemantics_base: import("../../common/Wrappers/semantics.js").SemanticsConstructor & CHTMLConstructor<any, any, any>;
export declare class CHTMLsemantics<N, T, D> extends CHTMLsemantics_base {
    static kind: string;
    toCHTML(parent: N): void;
}
export declare class CHTMLannotation<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    toCHTML(parent: N): void;
    computeBBox(): BBox;
}
export declare class CHTMLannotationXML<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    static styles: StyleList;
}
export declare class CHTMLxml<N, T, D> extends CHTMLWrapper<N, T, D> {
    static kind: string;
    static autoStyle: boolean;
    toCHTML(parent: N): void;
    computeBBox(bbox: BBox, _recompute?: boolean): void;
    protected getStyles(): void;
    protected getScale(): void;
    protected getVariant(): void;
}
export {};
