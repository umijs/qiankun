import type TSNode from "ts-node";
import type { REGISTER_INSTANCE } from "ts-node";
import ts from "typescript";
export declare function mergeTransformers(baseTransformers: ts.CustomTransformers, transformers: ts.CustomTransformers): ts.CustomTransformers;
export declare function register(): TSNode.RegisterOptions | undefined;
export declare namespace register {
    function initialize(): {
        tsNode: typeof TSNode;
        instanceSymbol: typeof REGISTER_INSTANCE;
        tsNodeInstance: TSNode.Service;
    };
}
export default register;
