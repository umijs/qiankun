import type { ImportDeclaration, ModuleItem, TsType } from '@swc/core';
import Visitor from '@swc/core/Visitor';
declare class AutoCSSModule extends Visitor {
    visitTsType(expression: TsType): TsType;
    /**
     * call path:
     *   visitProgram -> visitModule -> visitModuleItems -> visitModuleItem -> visitImportDeclaration
     * @see https://github.com/swc-project/swc/blob/main/node-swc/src/Visitor.ts#L189
     */
    visitModuleItem(n: ModuleItem): ImportDeclaration | import("@swc/core").ExportDeclaration | import("@swc/core").ExportNamedDeclaration | import("@swc/core").ExportDefaultDeclaration | import("@swc/core").ExportDefaultExpression | import("@swc/core").ExportAllDeclaration | import("@swc/core").TsImportEqualsDeclaration | import("@swc/core").TsExportAssignment | import("@swc/core").TsNamespaceExportDeclaration | import("@swc/core").BlockStatement | import("@swc/core").EmptyStatement | import("@swc/core").DebuggerStatement | import("@swc/core").WithStatement | import("@swc/core").ReturnStatement | import("@swc/core").LabeledStatement | import("@swc/core").BreakStatement | import("@swc/core").ContinueStatement | import("@swc/core").IfStatement | import("@swc/core").SwitchStatement | import("@swc/core").ThrowStatement | import("@swc/core").TryStatement | import("@swc/core").WhileStatement | import("@swc/core").DoWhileStatement | import("@swc/core").ForStatement | import("@swc/core").ForInStatement | import("@swc/core").ForOfStatement | import("@swc/core").ClassDeclaration | import("@swc/core").FunctionDeclaration | import("@swc/core").VariableDeclaration | import("@swc/core").TsInterfaceDeclaration | import("@swc/core").TsTypeAliasDeclaration | import("@swc/core").TsEnumDeclaration | import("@swc/core").TsModuleDeclaration | import("@swc/core").ExpressionStatement;
    visitImportDeclaration(expression: ImportDeclaration): ImportDeclaration;
}
/**
 * @deprecated Swc will not support js plugin in the future.
 * See https://github.com/swc-project/website/commit/fde42ad5371c1a16ca9729fe17bcfd3489841ac1
 */
export default AutoCSSModule;
