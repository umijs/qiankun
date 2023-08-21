import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { CommonInferredMrow } from './mrow.js';
import { MmlNode } from '../../../core/MmlTree/MmlNode.js';
export interface CommonMfenced extends AnyWrapper {
    mrow: CommonInferredMrow;
    createMrow(): void;
    addMrowChildren(): void;
    addMo(node: MmlNode): void;
}
export declare type MfencedConstructor = Constructor<CommonMfenced>;
export declare function CommonMfencedMixin<T extends WrapperConstructor>(Base: T): MfencedConstructor & T;
