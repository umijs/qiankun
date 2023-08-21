"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsFourSeven = void 0;
// endregion
/* ****************************************************************************************************************** */
// region: Utils
/* ****************************************************************************************************************** */
var TsFourSeven;
(function (TsFourSeven) {
    TsFourSeven.predicate = ({ tsVersionMajor, tsVersionMinor }) => tsVersionMajor == 4 && tsVersionMinor < 8;
    function handler(context, prop) {
        const factory = context.tsFactory;
        switch (prop) {
            case "updateImportDeclaration":
                return function (node, modifiers, importClause, moduleSpecifier, assertClause) {
                    const [dsNode, dsImportClause, dsModuleSpecifier, dsAssertClause] = downSample(node, importClause, moduleSpecifier, assertClause);
                    return factory.updateImportDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsImportClause, dsModuleSpecifier, dsAssertClause);
                };
            case "updateExportDeclaration":
                return function (node, modifiers, isTypeOnly, exportClause, moduleSpecifier, assertClause) {
                    const [dsNode, dsExportClause, dsModuleSpecifier, dsAssertClause] = downSample(node, exportClause, moduleSpecifier, assertClause);
                    return factory.updateExportDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, isTypeOnly, dsExportClause, dsModuleSpecifier, dsAssertClause);
                };
            case "updateModuleDeclaration":
                return function (node, modifiers, name, body) {
                    const [dsNode, dsName, dsBody] = downSample(node, name, body);
                    return factory.updateModuleDeclaration(dsNode, dsNode.decorators, dsNode.modifiers, dsName, dsBody);
                };
            default:
                return (...args) => factory[prop](...args);
        }
    }
    TsFourSeven.handler = handler;
    function downSample(...args) {
        return args;
    }
    TsFourSeven.downSample = downSample;
})(TsFourSeven = exports.TsFourSeven || (exports.TsFourSeven = {}));
// endregion
//# sourceMappingURL=four-seven.js.map