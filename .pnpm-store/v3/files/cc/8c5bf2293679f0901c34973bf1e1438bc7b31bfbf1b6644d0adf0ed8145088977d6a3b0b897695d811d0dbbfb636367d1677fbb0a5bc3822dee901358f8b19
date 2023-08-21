"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elideImportOrExportClause = void 0;
function elideImportOrExportClause(context, node) {
    const { tsInstance, transformationContext, factory } = context;
    const resolver = transformationContext.getEmitResolver();
    // Resolver may not be present if run manually (without Program)
    if (!resolver)
        return tsInstance.isImportDeclaration(node) ? node.importClause : node.exportClause;
    const { visitNode, isNamedImportBindings, isImportSpecifier, SyntaxKind, visitNodes, isNamedExportBindings, isExportSpecifier, } = tsInstance;
    if (tsInstance.isImportDeclaration(node)) {
        if (node.importClause.isTypeOnly)
            return undefined;
        return visitNode(node.importClause, visitImportClause);
    }
    else {
        if (node.isTypeOnly)
            return undefined;
        return visitNode(node.exportClause, visitNamedExports, isNamedExportBindings);
    }
    /* ********************************************************* *
     * Helpers
     * ********************************************************* */
    // The following visitors are adapted from the TS source-base src/compiler/transformers/ts
    /**
     * Visits an import clause, eliding it if it is not referenced.
     *
     * @param node The import clause node.
     */
    function visitImportClause(node) {
        // Elide the import clause if we elide both its name and its named bindings.
        const name = resolver.isReferencedAliasDeclaration(node) ? node.name : undefined;
        const namedBindings = visitNode(node.namedBindings, visitNamedImportBindings, isNamedImportBindings);
        return name || namedBindings
            ? factory.updateImportClause(node, /*isTypeOnly*/ false, name, namedBindings)
            : undefined;
    }
    /**
     * Visits named import bindings, eliding it if it is not referenced.
     *
     * @param node The named import bindings node.
     */
    function visitNamedImportBindings(node) {
        if (node.kind === SyntaxKind.NamespaceImport) {
            // Elide a namespace import if it is not referenced.
            return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
        }
        else {
            // Elide named imports if all of its import specifiers are elided.
            const elements = visitNodes(node.elements, visitImportSpecifier, isImportSpecifier);
            return tsInstance.some(elements) ? factory.updateNamedImports(node, elements) : undefined;
        }
    }
    /**
     * Visits an import specifier, eliding it if it is not referenced.
     *
     * @param node The import specifier node.
     */
    function visitImportSpecifier(node) {
        // Elide an import specifier if it is not referenced.
        return resolver.isReferencedAliasDeclaration(node) ? node : undefined;
    }
    /**
     * Visits named exports, eliding it if it does not contain an export specifier that
     * resolves to a value.
     *
     * @param node The named exports node.
     */
    function visitNamedExports(node) {
        // Elide the named exports if all of its export specifiers were elided.
        const elements = visitNodes(node.elements, visitExportSpecifier, isExportSpecifier);
        return tsInstance.some(elements) ? factory.updateNamedExports(node, elements) : undefined;
    }
    /**
     * Visits an export specifier, eliding it if it does not resolve to a value.
     *
     * @param node The export specifier node.
     */
    function visitExportSpecifier(node) {
        // Elide an export specifier if it does not reference a value.
        return resolver.isValueAliasDeclaration(node) ? node : undefined;
    }
}
exports.elideImportOrExportClause = elideImportOrExportClause;
// endregion
//# sourceMappingURL=elide-import-export.js.map