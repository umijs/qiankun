import { CommonOutputJax } from './OutputJax.js';
import { AbstractWrapperFactory } from '../../core/Tree/WrapperFactory.js';
import { CommonWrapper, CommonWrapperClass } from './Wrapper.js';
import { CharOptions, DelimiterData, FontData } from './FontData.js';
import { MmlNode } from '../../core/MmlTree/MmlNode.js';
export declare class CommonWrapperFactory<J extends CommonOutputJax<any, any, any, W, CommonWrapperFactory<J, W, C, CC, DD, FD>, FD, any>, W extends CommonWrapper<J, W, C, CC, DD, FD>, C extends CommonWrapperClass<J, W, C, CC, DD, FD>, CC extends CharOptions, DD extends DelimiterData, FD extends FontData<CC, any, DD>> extends AbstractWrapperFactory<MmlNode, W, C> {
    static defaultNodes: {
        [kind: string]: CommonWrapperClass<any, any, any, any, any, any>;
    };
    jax: J;
    get Wrappers(): Object;
}
export declare type AnyWrapperFactory = CommonWrapperFactory<any, any, any, any, any, any>;
