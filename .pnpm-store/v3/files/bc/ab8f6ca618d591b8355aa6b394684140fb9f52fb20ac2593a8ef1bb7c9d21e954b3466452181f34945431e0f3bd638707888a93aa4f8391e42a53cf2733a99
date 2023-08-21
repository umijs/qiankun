"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocCommentEnhancer = void 0;
const ts = __importStar(require("typescript"));
const tsdoc = __importStar(require("@microsoft/tsdoc"));
const AstSymbol_1 = require("../analyzer/AstSymbol");
const api_extractor_model_1 = require("@microsoft/api-extractor-model");
const VisitorState_1 = require("../collector/VisitorState");
const AstReferenceResolver_1 = require("../analyzer/AstReferenceResolver");
class DocCommentEnhancer {
    constructor(collector) {
        this._collector = collector;
    }
    static analyze(collector) {
        const docCommentEnhancer = new DocCommentEnhancer(collector);
        docCommentEnhancer.analyze();
    }
    analyze() {
        for (const entity of this._collector.entities) {
            if (entity.astEntity instanceof AstSymbol_1.AstSymbol) {
                if (entity.consumable ||
                    this._collector.extractorConfig.apiReportIncludeForgottenExports ||
                    this._collector.extractorConfig.docModelIncludeForgottenExports) {
                    entity.astEntity.forEachDeclarationRecursive((astDeclaration) => {
                        this._analyzeApiItem(astDeclaration);
                    });
                }
            }
        }
    }
    _analyzeApiItem(astDeclaration) {
        const metadata = this._collector.fetchApiItemMetadata(astDeclaration);
        if (metadata.docCommentEnhancerVisitorState === VisitorState_1.VisitorState.Visited) {
            return;
        }
        if (metadata.docCommentEnhancerVisitorState === VisitorState_1.VisitorState.Visiting) {
            this._collector.messageRouter.addAnalyzerIssue("ae-cyclic-inherit-doc" /* ExtractorMessageId.CyclicInheritDoc */, `The @inheritDoc tag for "${astDeclaration.astSymbol.localName}" refers to its own declaration`, astDeclaration);
            return;
        }
        metadata.docCommentEnhancerVisitorState = VisitorState_1.VisitorState.Visiting;
        if (metadata.tsdocComment && metadata.tsdocComment.inheritDocTag) {
            this._applyInheritDoc(astDeclaration, metadata.tsdocComment, metadata.tsdocComment.inheritDocTag);
        }
        this._analyzeNeedsDocumentation(astDeclaration, metadata);
        this._checkForBrokenLinks(astDeclaration, metadata);
        metadata.docCommentEnhancerVisitorState = VisitorState_1.VisitorState.Visited;
    }
    _analyzeNeedsDocumentation(astDeclaration, metadata) {
        if (astDeclaration.declaration.kind === ts.SyntaxKind.Constructor) {
            // Constructors always do pretty much the same thing, so it's annoying to require people to write
            // descriptions for them.  Instead, if the constructor lacks a TSDoc summary, then API Extractor
            // will auto-generate one.
            metadata.needsDocumentation = false;
            // The class that contains this constructor
            const classDeclaration = astDeclaration.parent;
            const configuration = this._collector.extractorConfig.tsdocConfiguration;
            if (!metadata.tsdocComment) {
                metadata.tsdocComment = new tsdoc.DocComment({ configuration });
            }
            if (!tsdoc.PlainTextEmitter.hasAnyTextContent(metadata.tsdocComment.summarySection)) {
                metadata.tsdocComment.summarySection.appendNodesInParagraph([
                    new tsdoc.DocPlainText({ configuration, text: 'Constructs a new instance of the ' }),
                    new tsdoc.DocCodeSpan({
                        configuration,
                        code: classDeclaration.astSymbol.localName
                    }),
                    new tsdoc.DocPlainText({ configuration, text: ' class' })
                ]);
            }
            const apiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
            if (apiItemMetadata.effectiveReleaseTag === api_extractor_model_1.ReleaseTag.Internal) {
                // If the constructor is marked as internal, then add a boilerplate notice for the containing class
                const classMetadata = this._collector.fetchApiItemMetadata(classDeclaration);
                if (!classMetadata.tsdocComment) {
                    classMetadata.tsdocComment = new tsdoc.DocComment({ configuration });
                }
                if (classMetadata.tsdocComment.remarksBlock === undefined) {
                    classMetadata.tsdocComment.remarksBlock = new tsdoc.DocBlock({
                        configuration,
                        blockTag: new tsdoc.DocBlockTag({
                            configuration,
                            tagName: tsdoc.StandardTags.remarks.tagName
                        })
                    });
                }
                classMetadata.tsdocComment.remarksBlock.content.appendNode(new tsdoc.DocParagraph({ configuration }, [
                    new tsdoc.DocPlainText({
                        configuration,
                        text: `The constructor for this class is marked as internal. Third-party code should not` +
                            ` call the constructor directly or create subclasses that extend the `
                    }),
                    new tsdoc.DocCodeSpan({
                        configuration,
                        code: classDeclaration.astSymbol.localName
                    }),
                    new tsdoc.DocPlainText({ configuration, text: ' class.' })
                ]));
            }
            return;
        }
        if (metadata.tsdocComment) {
            // Require the summary to contain at least 10 non-spacing characters
            metadata.needsDocumentation = !tsdoc.PlainTextEmitter.hasAnyTextContent(metadata.tsdocComment.summarySection, 10);
        }
        else {
            metadata.needsDocumentation = true;
        }
    }
    _checkForBrokenLinks(astDeclaration, metadata) {
        if (!metadata.tsdocComment) {
            return;
        }
        this._checkForBrokenLinksRecursive(astDeclaration, metadata.tsdocComment);
    }
    _checkForBrokenLinksRecursive(astDeclaration, node) {
        if (node instanceof tsdoc.DocLinkTag) {
            if (node.codeDestination) {
                // Is it referring to the working package?  If not, we don't do any link validation, because
                // AstReferenceResolver doesn't support it yet (but ModelReferenceResolver does of course).
                // Tracked by:  https://github.com/microsoft/rushstack/issues/1195
                if (node.codeDestination.packageName === undefined ||
                    node.codeDestination.packageName === this._collector.workingPackage.name) {
                    const referencedAstDeclaration = this._collector.astReferenceResolver.resolve(node.codeDestination);
                    if (referencedAstDeclaration instanceof AstReferenceResolver_1.ResolverFailure) {
                        this._collector.messageRouter.addAnalyzerIssue("ae-unresolved-link" /* ExtractorMessageId.UnresolvedLink */, 'The @link reference could not be resolved: ' + referencedAstDeclaration.reason, astDeclaration);
                    }
                }
            }
        }
        for (const childNode of node.getChildNodes()) {
            this._checkForBrokenLinksRecursive(astDeclaration, childNode);
        }
    }
    /**
     * Follow an `{@inheritDoc ___}` reference and copy the content that we find in the referenced comment.
     */
    _applyInheritDoc(astDeclaration, docComment, inheritDocTag) {
        if (!inheritDocTag.declarationReference) {
            this._collector.messageRouter.addAnalyzerIssue("ae-unresolved-inheritdoc-base" /* ExtractorMessageId.UnresolvedInheritDocBase */, 'The @inheritDoc tag needs a TSDoc declaration reference; signature matching is not supported yet', astDeclaration);
            return;
        }
        // Is it referring to the working package?
        if (!(inheritDocTag.declarationReference.packageName === undefined ||
            inheritDocTag.declarationReference.packageName === this._collector.workingPackage.name)) {
            // It's referencing an external package, so skip this inheritDoc tag, since AstReferenceResolver doesn't
            // support it yet.  As a workaround, this tag will get handled later by api-documenter.
            // Tracked by:  https://github.com/microsoft/rushstack/issues/1195
            return;
        }
        const referencedAstDeclaration = this._collector.astReferenceResolver.resolve(inheritDocTag.declarationReference);
        if (referencedAstDeclaration instanceof AstReferenceResolver_1.ResolverFailure) {
            this._collector.messageRouter.addAnalyzerIssue("ae-unresolved-inheritdoc-reference" /* ExtractorMessageId.UnresolvedInheritDocReference */, 'The @inheritDoc reference could not be resolved: ' + referencedAstDeclaration.reason, astDeclaration);
            return;
        }
        this._analyzeApiItem(referencedAstDeclaration);
        const referencedMetadata = this._collector.fetchApiItemMetadata(referencedAstDeclaration);
        if (referencedMetadata.tsdocComment) {
            this._copyInheritedDocs(docComment, referencedMetadata.tsdocComment);
        }
    }
    /**
     * Copy the content from `sourceDocComment` to `targetDocComment`.
     */
    _copyInheritedDocs(targetDocComment, sourceDocComment) {
        targetDocComment.summarySection = sourceDocComment.summarySection;
        targetDocComment.remarksBlock = sourceDocComment.remarksBlock;
        targetDocComment.params.clear();
        for (const param of sourceDocComment.params) {
            targetDocComment.params.add(param);
        }
        for (const typeParam of sourceDocComment.typeParams) {
            targetDocComment.typeParams.add(typeParam);
        }
        targetDocComment.returnsBlock = sourceDocComment.returnsBlock;
        targetDocComment.inheritDocTag = undefined;
    }
}
exports.DocCommentEnhancer = DocCommentEnhancer;
//# sourceMappingURL=DocCommentEnhancer.js.map