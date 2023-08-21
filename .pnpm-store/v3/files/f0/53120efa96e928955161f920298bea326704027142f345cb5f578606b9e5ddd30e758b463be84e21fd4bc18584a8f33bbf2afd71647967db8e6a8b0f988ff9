import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
export interface CommonMsqrt extends AnyWrapper {
    readonly base: number;
    readonly surd: number;
    readonly root: number;
    surdH: number;
    combineRootBBox(bbox: BBox, sbox: BBox, H: number): void;
    getPQ(sbox: BBox): number[];
    getRootDimens(sbox: BBox, H: Number): number[];
}
export declare type MsqrtConstructor = Constructor<CommonMsqrt>;
export declare function CommonMsqrtMixin<T extends WrapperConstructor>(Base: T): MsqrtConstructor & T;
