import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
export interface CommonMs extends AnyWrapper {
    createText(text: string): AnyWrapper;
}
export declare type MsConstructor = Constructor<CommonMs>;
export declare function CommonMsMixin<T extends WrapperConstructor>(Base: T): MsConstructor & T;
