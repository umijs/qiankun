import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
export interface CommonMrow extends AnyWrapper {
    stretchChildren(): void;
}
export declare type MrowConstructor = Constructor<CommonMrow>;
export declare function CommonMrowMixin<T extends WrapperConstructor>(Base: T): MrowConstructor & T;
export interface CommonInferredMrow extends CommonMrow {
}
export declare type InferredMrowConstructor = Constructor<CommonInferredMrow>;
export declare function CommonInferredMrowMixin<T extends MrowConstructor>(Base: T): InferredMrowConstructor & T;
