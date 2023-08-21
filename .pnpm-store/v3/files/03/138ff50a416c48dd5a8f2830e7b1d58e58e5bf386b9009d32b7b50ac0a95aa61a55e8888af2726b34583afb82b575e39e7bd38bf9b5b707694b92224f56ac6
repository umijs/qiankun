"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseMultiscripts = void 0;
const DomUtil = require("../common/dom_util");
const semantic_skeleton_1 = require("../semantic_tree/semantic_skeleton");
const case_multiindex_1 = require("./case_multiindex");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseMultiscripts extends case_multiindex_1.CaseMultiindex {
    static test(semantic) {
        if (!semantic.mathmlTree) {
            return false;
        }
        const mmlTag = DomUtil.tagName(semantic.mathmlTree);
        return (mmlTag === 'MMULTISCRIPTS' &&
            (semantic.type === "superscript" ||
                semantic.type === "subscript"));
    }
    constructor(semantic) {
        super(semantic);
    }
    getMathml() {
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        let baseSem, rsup, rsub;
        if (this.semantic.childNodes[0] &&
            this.semantic.childNodes[0].role === "subsup") {
            const ignore = this.semantic.childNodes[0];
            baseSem = ignore.childNodes[0];
            rsup = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[1]);
            rsub = case_multiindex_1.CaseMultiindex.multiscriptIndex(ignore.childNodes[1]);
            const collapsed = [this.semantic.id, [ignore.id, baseSem.id, rsub], rsup];
            EnrichMathml.addCollapsedAttribute(this.mml, collapsed);
            this.mml.setAttribute(enrich_attr_1.Attribute.TYPE, ignore.role);
            this.completeMultiscript(semantic_skeleton_1.SemanticSkeleton.interleaveIds(rsub, rsup), []);
        }
        else {
            baseSem = this.semantic.childNodes[0];
            rsup = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[1]);
            const collapsed = [this.semantic.id, baseSem.id, rsup];
            EnrichMathml.addCollapsedAttribute(this.mml, collapsed);
        }
        const childIds = semantic_skeleton_1.SemanticSkeleton.collapsedLeafs(rsub || [], rsup);
        const base = EnrichMathml.walkTree(baseSem);
        EnrichMathml.getInnerNode(base).setAttribute(enrich_attr_1.Attribute.PARENT, this.semantic.id.toString());
        childIds.unshift(baseSem.id);
        this.mml.setAttribute(enrich_attr_1.Attribute.CHILDREN, childIds.join(','));
        return this.mml;
    }
}
exports.CaseMultiscripts = CaseMultiscripts;
