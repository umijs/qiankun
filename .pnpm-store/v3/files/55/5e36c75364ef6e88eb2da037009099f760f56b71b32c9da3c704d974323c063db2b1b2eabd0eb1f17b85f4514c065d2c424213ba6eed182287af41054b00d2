import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
import { DelimiterData } from '../FontData.js';
export declare const DirectionVH: {
    [n: number]: string;
};
export interface CommonMo extends AnyWrapper {
    size: number;
    isAccent: boolean;
    protoBBox(bbox: BBox): void;
    getAccentOffset(): number;
    getCenterOffset(bbox?: BBox): number;
    getStretchedVariant(WH: number[], exact?: boolean): void;
    getSize(name: string, value: number): number;
    getWH(WH: number[]): number;
    getStretchBBox(WHD: number[], D: number, C: DelimiterData): void;
    getBaseline(WHD: number[], HD: number, C: DelimiterData): number[];
    checkExtendedHeight(D: number, C: DelimiterData): number;
}
export declare type MoConstructor = Constructor<CommonMo>;
export declare function CommonMoMixin<T extends WrapperConstructor>(Base: T): MoConstructor & T;
