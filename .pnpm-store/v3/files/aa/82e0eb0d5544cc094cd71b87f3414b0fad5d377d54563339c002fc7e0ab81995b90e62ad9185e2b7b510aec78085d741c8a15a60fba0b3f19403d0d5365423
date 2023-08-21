import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
export interface CommonTextNode extends AnyWrapper {
    remappedText(text: string, variant: string): number[];
}
export declare type TextNodeConstructor = Constructor<CommonTextNode>;
export declare function CommonTextNodeMixin<T extends WrapperConstructor>(Base: T): TextNodeConstructor & T;
