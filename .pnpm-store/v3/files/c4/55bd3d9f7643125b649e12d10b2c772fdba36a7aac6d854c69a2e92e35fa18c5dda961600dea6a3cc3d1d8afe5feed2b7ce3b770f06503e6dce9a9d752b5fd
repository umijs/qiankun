import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
import { Property } from '../../../core/Tree/Node.js';
export interface CommonMpadded extends AnyWrapper {
    getDimens(): number[];
    dimen(length: Property, bbox: BBox, d?: string, m?: number): number;
}
export declare type MpaddedConstructor = Constructor<CommonMpadded>;
export declare function CommonMpaddedMixin<T extends WrapperConstructor>(Base: T): MpaddedConstructor & T;
