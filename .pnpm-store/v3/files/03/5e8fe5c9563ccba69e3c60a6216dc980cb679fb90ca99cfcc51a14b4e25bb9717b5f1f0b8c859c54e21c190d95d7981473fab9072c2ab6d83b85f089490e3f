import { t } from '@umijs/utils';
interface IResolver<U> {
    is(src: any): boolean;
    get(src: U): any;
}
export declare const LITERAL_NODE_RESOLVERS: (IResolver<t.StringLiteral> | IResolver<t.NumericLiteral> | IResolver<t.BooleanLiteral> | IResolver<t.NullLiteral> | IResolver<t.Identifier> | IResolver<t.ObjectExpression> | IResolver<t.ArrayExpression>)[];
export declare const NODE_RESOLVERS: (IResolver<t.StringLiteral> | IResolver<t.NumericLiteral> | IResolver<t.BooleanLiteral> | IResolver<t.NullLiteral> | IResolver<t.Identifier> | IResolver<t.ObjectExpression> | IResolver<t.Class> | IResolver<t.ArrayExpression> | IResolver<t.FunctionExpression> | IResolver<t.ArrowFunctionExpression>)[];
export declare function findObjectLiteralProperties(node: t.ObjectExpression): {};
export declare function findObjectMembers(node: t.ObjectExpression): {};
export declare function findClassStaticProperty(node: t.Class): {} | undefined;
export declare function findArrayLiteralElements(node: t.ArrayExpression): any[];
export declare function findArrayElements(node: t.ArrayExpression): any[];
export {};
