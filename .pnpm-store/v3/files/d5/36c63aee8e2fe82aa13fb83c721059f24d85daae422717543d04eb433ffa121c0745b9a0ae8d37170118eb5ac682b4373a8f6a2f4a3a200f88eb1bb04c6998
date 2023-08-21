import { CHTMLWrapper, CHTMLConstructor } from '../Wrapper.js';
import { CHTMLmsqrt } from './msqrt.js';
import * as Notation from '../Notation.js';
import { StyleList } from '../../../util/StyleList.js';
declare const CHTMLmenclose_base: import("../../common/Wrappers/menclose.js").MencloseConstructor<CHTMLWrapper<any, any, any>, CHTMLmsqrt<any, any, any>, any> & CHTMLConstructor<any, any, any>;
export declare class CHTMLmenclose<N, T, D> extends CHTMLmenclose_base {
    static kind: string;
    static styles: StyleList;
    static notations: Notation.DefList<CHTMLmenclose<any, any, any>, any>;
    toCHTML(parent: N): void;
    arrow(w: number, a: number, double: boolean, offset?: string, dist?: number): N;
    protected adjustArrow(arrow: N, double: boolean): void;
    protected adjustHead(head: N, border: string[], a: string): void;
    protected adjustLine(line: N, t: number, x: number, double: boolean): void;
    protected moveArrow(arrow: N, offset: string, d: number): void;
    adjustBorder(node: N): N;
    adjustThickness(shape: N): N;
    fixed(m: number, n?: number): string;
    em(m: number): string;
}
export {};
