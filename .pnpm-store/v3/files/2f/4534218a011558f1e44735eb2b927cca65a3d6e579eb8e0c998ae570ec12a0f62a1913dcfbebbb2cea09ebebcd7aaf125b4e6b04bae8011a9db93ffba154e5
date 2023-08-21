"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTensor = void 0;
const semantic_skeleton_1 = require("../semantic_tree/semantic_skeleton");
const case_multiindex_1 = require("./case_multiindex");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseTensor extends case_multiindex_1.CaseMultiindex {
    static test(semantic) {
        return !!semantic.mathmlTree && semantic.type === "tensor";
    }
    constructor(semantic) {
        super(semantic);
    }
    getMathml() {
        EnrichMathml.walkTree(this.semantic.childNodes[0]);
        const lsub = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[1]);
        const lsup = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[2]);
        const rsub = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[3]);
        const rsup = case_multiindex_1.CaseMultiindex.multiscriptIndex(this.semantic.childNodes[4]);
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        const collapsed = [
            this.semantic.id,
            this.semantic.childNodes[0].id,
            lsub,
            lsup,
            rsub,
            rsup
        ];
        EnrichMathml.addCollapsedAttribute(this.mml, collapsed);
        const childIds = semantic_skeleton_1.SemanticSkeleton.collapsedLeafs(lsub, lsup, rsub, rsup);
        childIds.unshift(this.semantic.childNodes[0].id);
        this.mml.setAttribute(enrich_attr_1.Attribute.CHILDREN, childIds.join(','));
        this.completeMultiscript(semantic_skeleton_1.SemanticSkeleton.interleaveIds(rsub, rsup), semantic_skeleton_1.SemanticSkeleton.interleaveIds(lsub, lsup));
        return this.mml;
    }
}
exports.CaseTensor = CaseTensor;
