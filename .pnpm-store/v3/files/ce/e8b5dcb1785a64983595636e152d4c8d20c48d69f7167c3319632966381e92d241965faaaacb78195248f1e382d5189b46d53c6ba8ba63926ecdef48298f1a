"use strict";
/**
 * patcher for api-extractor, to support legacy export = syntax
 * @reason https://github.com/microsoft/rushstack/issues/2220
 * @solution hijack tsHost.readFile for the CompilerState of api-extractor
 *           to replace legacy export = [Specifier] to export { [Specifier] as default }
 *           and re-export all types within exported namespace
 */
Object.defineProperty(exports, "__esModule", { value: true });
const api_extractor_1 = require("@microsoft/api-extractor");
const AstModule_1 = require("@microsoft/api-extractor/lib/analyzer/AstModule");
const ExportAnalyzer_1 = require("@microsoft/api-extractor/lib/analyzer/ExportAnalyzer");
const DtsRollupGenerator_1 = require("@microsoft/api-extractor/lib/generators/DtsRollupGenerator");
const IndentedWriter_1 = require("@microsoft/api-extractor/lib/generators/IndentedWriter");
const shared_1 = require("./shared");
// @ts-ignore
const oCreateCompilerHost = api_extractor_1.CompilerState._createCompilerHost;
if (!oCreateCompilerHost.name.includes('father')) {
    // @ts-ignore
    api_extractor_1.CompilerState._createCompilerHost = function _fatherHackCreateCompilerHost(...args) {
        const tsHost = oCreateCompilerHost.apply(api_extractor_1.CompilerState, args);
        const oReadFile = tsHost.readFile;
        // hack readFile method to replace legacy export = syntax to esm
        tsHost.readFile = function fatherHackReadFile(...args) {
            let content = oReadFile.apply(tsHost, args);
            const mayBeLegacyExport = /[\r\n]\s*export\s+=\s+[\w$]+/.test(content);
            // simple filter with regexp, for performance
            if (mayBeLegacyExport) {
                const ts = require('typescript');
                const sourceFile = ts.createSourceFile(args[0], content, ts.ScriptTarget.ESNext);
                const { statements } = sourceFile;
                const exportEquals = statements.find((stmt) => ts.isExportAssignment(stmt) && stmt.isExportEquals);
                // strict filter with AST, for precision
                if (exportEquals) {
                    const declarationIds = [];
                    const exportSpecifier = exportEquals.expression
                        .escapedText;
                    statements.forEach((stmt) => {
                        // try to find exported namespace
                        if (ts.isModuleDeclaration(stmt) &&
                            ts.isIdentifier(stmt.name) &&
                            stmt.name.escapedText === exportSpecifier &&
                            stmt.body &&
                            // to avoid esbuild-jest to fail
                            // ref: https://github.com/aelbore/esbuild-jest/blob/master/src/index.ts#L33
                            // issue: https://github.com/aelbore/esbuild-jest/issues/57#issuecomment-934679846
                            // prettier-ignore
                            (ts.isModuleBlock)(stmt.body)) {
                            stmt.body.statements.forEach((s) => {
                                // collect all valid declarations with exported namespace
                                if (ts.isTypeAliasDeclaration(s) ||
                                    ts.isInterfaceDeclaration(s) ||
                                    ts.isEnumDeclaration(s) ||
                                    ts.isFunctionDeclaration(s) ||
                                    ts.isClassDeclaration(s)) {
                                    declarationIds.push(s.name.escapedText);
                                }
                            });
                        }
                    });
                    // replace export = to export { [Specifier] as default }
                    content = `${content.substring(0, exportEquals.pos)}\nexport { ${exportSpecifier} as default };${content.substring(exportEquals.end)}`;
                    // re-export each types for namespace
                    declarationIds.forEach((id) => {
                        content += `\nexport type ${id} = ${exportSpecifier}.${id};`;
                    });
                }
            }
            return content;
        };
        return tsHost;
    };
    // disable typescript version checking logic to omit the log
    // because api-extractor builtin typescript is not latest
    // @ts-ignore
    api_extractor_1.Extractor._checkCompilerCompatibility = function fatherHackEmpty() { };
    // hijack write file logic
    DtsRollupGenerator_1.DtsRollupGenerator.writeTypingsFile = function fatherHackWriteTypingsFile(collector, dtsFilename, dtsKind) {
        const writer = new IndentedWriter_1.IndentedWriter();
        writer.trimLeadingSpaces = true;
        // @ts-ignore
        DtsRollupGenerator_1.DtsRollupGenerator._generateTypingsFileContent(collector, writer, dtsKind);
        (0, shared_1.setSharedData)(dtsFilename, writer.toString());
    };
    // hijack ExportAnalyzer to support export * from ambient module
    // because the rushstack team has not reviewed pull request yet
    // ref: https://github.com/microsoft/rushstack/pull/3528
    const _fetchSpecifierAstModule = 
    // @ts-ignore
    ExportAnalyzer_1.ExportAnalyzer.prototype._fetchSpecifierAstModule;
    // @ts-ignore
    ExportAnalyzer_1.ExportAnalyzer.prototype._fetchSpecifierAstModule =
        function fatherHackFetchSpecifierAstModule(...args) {
            try {
                return _fetchSpecifierAstModule.apply(this, args);
            }
            catch (err) {
                const ts = require('typescript');
                // return a fake external module for export * from ambient module
                if (ts.isExportDeclaration(args[0])) {
                    const sourceFile = args[0].getSourceFile();
                    return new AstModule_1.AstModule({
                        sourceFile,
                        // @ts-ignore
                        moduleSymbol: this._getModuleSymbolFromSourceFile(sourceFile, undefined),
                        // @ts-ignore
                        externalModulePath: this._getModuleSpecifier(args[0]),
                    });
                }
                else {
                    throw err;
                }
            }
        };
}
