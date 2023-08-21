import valueParser from 'postcss-value-parser';
import type { FunctionNode, Node, WordNode } from 'postcss-value-parser';
import type { Declaration, Result } from 'postcss';
import { pluginOptions } from './index';
export declare function isVarNode(node: Node): boolean;
export declare function validateArgumentsAndTypes(node: FunctionNode, decl: Declaration, result: Result, options: pluginOptions): valueParser.Dimension[] | undefined;
export declare function optionallyWarn(decl: Declaration, result: Result, message: string, options: pluginOptions): void;
export declare function functionNodeToWordNode(fn: FunctionNode): WordNode;
