import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
export interface CommonMfrac extends AnyWrapper {
    getFractionBBox(bbox: BBox, display: boolean, t: number): void;
    getTUV(display: boolean, t: number): {
        T: number;
        u: number;
        v: number;
    };
    getAtopBBox(bbox: BBox, display: boolean): void;
    getUVQ(display: boolean): {
        u: number;
        v: number;
        q: number;
        nbox: BBox;
        dbox: BBox;
    };
    getBevelledBBox(bbox: BBox, display: boolean): void;
    getBevelData(display: boolean): {
        H: number;
        delta: number;
        u: number;
        v: number;
        nbox: BBox;
        dbox: BBox;
    };
    isDisplay(): boolean;
}
export declare type MfracConstructor = Constructor<CommonMfrac>;
export declare function CommonMfracMixin<T extends WrapperConstructor>(Base: T): MfracConstructor & T;
