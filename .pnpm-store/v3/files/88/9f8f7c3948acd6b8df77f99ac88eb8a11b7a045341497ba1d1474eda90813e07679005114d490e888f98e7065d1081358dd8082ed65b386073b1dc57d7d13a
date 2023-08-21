import { AnyWrapper, WrapperConstructor, Constructor, AnyWrapperClass } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
export interface CommonScriptbase<W extends AnyWrapper> extends AnyWrapper {
    readonly baseCore: W;
    readonly baseChild: W;
    readonly baseScale: number;
    readonly baseIc: number;
    readonly baseRemoveIc: boolean;
    readonly baseIsChar: boolean;
    readonly baseHasAccentOver: boolean;
    readonly baseHasAccentUnder: boolean;
    readonly isLineAbove: boolean;
    readonly isLineBelow: boolean;
    readonly isMathAccent: boolean;
    readonly scriptChild: W;
    getBaseCore(): W;
    getSemanticBase(): W;
    getBaseFence(fence: W, id: string): W;
    getBaseScale(): number;
    getBaseIc(): number;
    getAdjustedIc(): number;
    isCharBase(): boolean;
    checkLineAccents(): void;
    isLineAccent(script: W): boolean;
    getBaseWidth(): number;
    getOffset(): number[];
    baseCharZero(n: number): number;
    getV(): number;
    getU(): number;
    hasMovableLimits(): boolean;
    getOverKU(basebox: BBox, overbox: BBox): number[];
    getUnderKV(basebox: BBox, underbox: BBox): number[];
    getDeltaW(boxes: BBox[], delta?: number[]): number[];
    getDelta(noskew?: boolean): number;
    stretchChildren(): void;
}
export interface CommonScriptbaseClass extends AnyWrapperClass {
    useIC: boolean;
}
export declare type ScriptbaseConstructor<W extends AnyWrapper> = Constructor<CommonScriptbase<W>>;
export declare function CommonScriptbaseMixin<W extends AnyWrapper, T extends WrapperConstructor>(Base: T): ScriptbaseConstructor<W> & T;
