import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { BBox } from '../../../util/BBox.js';
export interface CommonMtr<C extends AnyWrapper> extends AnyWrapper {
    readonly numCells: number;
    readonly labeled: boolean;
    readonly tableCells: C[];
    childNodes: C[];
    getChild(i: number): C;
    getChildBBoxes(): BBox[];
    stretchChildren(HD?: number[]): void;
}
export declare type MtrConstructor<C extends AnyWrapper> = Constructor<CommonMtr<C>>;
export declare function CommonMtrMixin<C extends AnyWrapper, T extends WrapperConstructor>(Base: T): MtrConstructor<C> & T;
export interface CommonMlabeledtr<C extends AnyWrapper> extends CommonMtr<C> {
}
export declare type MlabeledtrConstructor<C extends AnyWrapper> = Constructor<CommonMlabeledtr<C>>;
export declare function CommonMlabeledtrMixin<C extends AnyWrapper, T extends MtrConstructor<C>>(Base: T): MlabeledtrConstructor<C> & T;
