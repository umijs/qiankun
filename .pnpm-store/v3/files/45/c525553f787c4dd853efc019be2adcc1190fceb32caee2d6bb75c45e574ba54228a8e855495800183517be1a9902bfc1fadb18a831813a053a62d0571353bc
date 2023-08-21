import { AbstractWrapper, WrapperClass } from '../../core/Tree/Wrapper.js';
import { PropertyList } from '../../core/Tree/Node.js';
import { MmlNode, TextNode } from '../../core/MmlTree/MmlNode.js';
import { Property } from '../../core/Tree/Node.js';
import { Styles } from '../../util/Styles.js';
import { StyleList } from '../../util/StyleList.js';
import { CommonOutputJax } from './OutputJax.js';
import { CommonWrapperFactory } from './WrapperFactory.js';
import { BBox } from '../../util/BBox.js';
import { FontData, DelimiterData, CharData, CharOptions, DIRECTION } from './FontData.js';
export declare type StringMap = {
    [key: string]: string;
};
export declare type Constructor<T> = new (...args: any[]) => T;
export declare type AnyWrapper = CommonWrapper<any, any, any, any, any, any>;
export declare type AnyWrapperClass = CommonWrapperClass<any, any, any, any, any, any>;
export declare type WrapperConstructor = Constructor<AnyWrapper>;
export interface CommonWrapperClass<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C, CC, DD, FD>, FD, any>, W extends CommonWrapper<J, W, C, CC, DD, FD>, C extends CommonWrapperClass<J, W, C, CC, DD, FD>, CC extends CharOptions, DD extends DelimiterData, FD extends FontData<CC, any, DD>> extends WrapperClass<MmlNode, CommonWrapper<J, W, C, CC, DD, FD>> {
    new (factory: CommonWrapperFactory<J, W, C, CC, DD, FD>, node: MmlNode, ...args: any[]): W;
}
export declare class CommonWrapper<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C, CC, DD, FD>, FD, any>, W extends CommonWrapper<J, W, C, CC, DD, FD>, C extends CommonWrapperClass<J, W, C, CC, DD, FD>, CC extends CharOptions, DD extends DelimiterData, FD extends FontData<CC, any, DD>> extends AbstractWrapper<MmlNode, CommonWrapper<J, W, C, CC, DD, FD>> {
    static kind: string;
    static styles: StyleList;
    static removeStyles: string[];
    static skipAttributes: {
        [name: string]: boolean;
    };
    static BOLDVARIANTS: {
        [name: string]: StringMap;
    };
    static ITALICVARIANTS: {
        [name: string]: StringMap;
    };
    protected factory: CommonWrapperFactory<J, W, C, CC, DD, FD>;
    parent: W;
    childNodes: W[];
    protected removedStyles: StringMap;
    protected styles: Styles;
    variant: string;
    bbox: BBox;
    protected bboxComputed: boolean;
    stretch: DD;
    font: FD;
    get jax(): J;
    get adaptor(): import("../../core/DOMAdaptor.js").DOMAdaptor<any, any, any>;
    get metrics(): import("../../core/MathItem.js").Metrics;
    get fixesPWidth(): boolean;
    constructor(factory: CommonWrapperFactory<J, W, C, CC, DD, FD>, node: MmlNode, parent?: W);
    wrap(node: MmlNode, parent?: W): W;
    getBBox(save?: boolean): BBox;
    getOuterBBox(save?: boolean): BBox;
    protected computeBBox(bbox: BBox, recompute?: boolean): void;
    setChildPWidths(recompute: boolean, w?: (number | null), clear?: boolean): boolean;
    invalidateBBox(): void;
    protected copySkewIC(bbox: BBox): void;
    protected getStyles(): void;
    protected getVariant(): void;
    protected explicitVariant(fontFamily: string, fontWeight: string, fontStyle: string): string;
    protected getScale(): void;
    protected getSpace(): void;
    protected getMathMLSpacing(): void;
    protected getTeXSpacing(isTop: boolean, hasSpacing: boolean): void;
    protected isTopEmbellished(): boolean;
    core(): CommonWrapper<J, W, C, CC, DD, FD>;
    coreMO(): CommonWrapper<J, W, C, CC, DD, FD>;
    getText(): string;
    canStretch(direction: DIRECTION): boolean;
    protected getAlignShift(): [string, number];
    protected getAlignX(W: number, bbox: BBox, align: string): number;
    protected getAlignY(H: number, D: number, h: number, d: number, align: string): number;
    getWrapWidth(i: number): number;
    getChildAlign(_i: number): string;
    protected percent(m: number): string;
    protected em(m: number): string;
    protected px(m: number, M?: number): string;
    protected length2em(length: Property, size?: number, scale?: number): number;
    protected unicodeChars(text: string, name?: string): number[];
    remapChars(chars: number[]): number[];
    mmlText(text: string): TextNode;
    mmlNode(kind: string, properties?: PropertyList, children?: MmlNode[]): MmlNode;
    protected createMo(text: string): CommonWrapper<J, W, C, CC, DD, FD>;
    protected getVariantChar(variant: string, n: number): CharData<CC>;
}
