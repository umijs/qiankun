"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsThreeEight = void 0;
// endregion
/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */
var TsThreeEight;
(function (TsThreeEight) {
    TsThreeEight.predicate = (context) => context.tsVersionMajor < 4;
    function handler(context, prop) {
        const ts = context.tsInstance;
        switch (prop) {
            case "updateCallExpression":
                return (...args) => ts.updateCall.apply(void 0, args);
            case "updateImportClause":
                return function (node, isTypeOnly, name, namedBindings) {
                    return ts.updateImportClause.apply(void 0, downSample(node, name, namedBindings));
                };
            case "updateImportDeclaration":
                return function (node, modifiers, importClause, moduleSpecifier) {
                    const [dsNode, dsImportClause, dsModuleSpecifier] = downSample(node, importClause, moduleSpecifier);
                    return ts.updateImportDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsImportClause, dsModuleSpecifier);
                };
            case "updateExportDeclaration":
                return function (node, modifiers, isTypeOnly, exportClause, moduleSpecifier) {
                    const [dsNode, dsModuleSpecifier, dsExportClause] = downSample(node, moduleSpecifier, exportClause);
                    return ts.updateExportDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsExportClause, dsModuleSpecifier, 
                    // @ts-ignore - This was added in later versions of 3.x
                    dsNode.isTypeOnly);
                };
            case "updateModuleDeclaration":
                return function (node, modifiers, name, body) {
                    const [dsNode, dsName, dsBody] = downSample(node, name, body);
                    return ts.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
                };
            case "updateImportTypeNode":
                return function (node, argument, assertions, qualifier, typeArguments, isTypeOf) {
                    const [dsNode, dsArgument, dsQualifier, dsTypeArguments] = downSample(node, argument, qualifier, typeArguments);
                    return ts.updateImportTypeNode(dsNode, dsArgument, dsQualifier, dsTypeArguments, isTypeOf);
                };
            default:
                return (...args) => ts[prop](...args);
        }
    }
    TsThreeEight.handler = handler;
    function downSample(...args) {
        return args;
    }
    TsThreeEight.downSample = downSample;
})(TsThreeEight = exports.TsThreeEight || (exports.TsThreeEight = {}));
// endregion
//# sourceMappingURL=three-eight.js.map