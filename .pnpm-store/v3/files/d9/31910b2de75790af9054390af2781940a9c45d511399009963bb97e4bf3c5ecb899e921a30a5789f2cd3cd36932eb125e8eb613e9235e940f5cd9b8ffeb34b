import { AnyWrapper, WrapperConstructor, Constructor } from '../Wrapper.js';
import { CommonTextNode } from './TextNode.js';
export interface CommonMglyph extends AnyWrapper {
    width: number;
    height: number;
    valign: number;
    charWrapper: CommonTextNode;
    getParameters(): void;
}
export declare type MglyphConstructor = Constructor<CommonMglyph>;
export declare function CommonMglyphMixin<T extends WrapperConstructor>(Base: T): MglyphConstructor & T;
