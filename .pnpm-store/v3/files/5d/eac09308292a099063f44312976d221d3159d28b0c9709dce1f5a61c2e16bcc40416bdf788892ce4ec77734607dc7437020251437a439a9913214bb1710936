"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseLimit = void 0;
const DomUtil = require("../common/dom_util");
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseLimit extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        if (!semantic.mathmlTree || !semantic.childNodes.length) {
            return false;
        }
        const mmlTag = DomUtil.tagName(semantic.mathmlTree);
        const type = semantic.type;
        return (((type === "limupper" || type === "limlower") &&
            (mmlTag === 'MSUBSUP' || mmlTag === 'MUNDEROVER')) ||
            (type === "limboth" &&
                (mmlTag === 'MSUB' ||
                    mmlTag === 'MUNDER' ||
                    mmlTag === 'MSUP' ||
                    mmlTag === 'MOVER')));
    }
    static walkTree_(node) {
        if (node) {
            EnrichMathml.walkTree(node);
        }
    }
    getMathml() {
        const children = this.semantic.childNodes;
        if (this.semantic.type !== "limboth" &&
            this.mml.childNodes.length >= 3) {
            this.mml = EnrichMathml.introduceNewLayer([this.mml], this.semantic);
        }
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        if (!children[0].mathmlTree) {
            children[0].mathmlTree = this.semantic.mathmlTree;
        }
        children.forEach(CaseLimit.walkTree_);
        return this.mml;
    }
}
exports.CaseLimit = CaseLimit;
