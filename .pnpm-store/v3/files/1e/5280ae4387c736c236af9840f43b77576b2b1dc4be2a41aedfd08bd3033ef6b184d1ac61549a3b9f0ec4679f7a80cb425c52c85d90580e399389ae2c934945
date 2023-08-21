"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseDoubleScript = void 0;
const DomUtil = require("../common/dom_util");
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseDoubleScript extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        if (!semantic.mathmlTree || !semantic.childNodes.length) {
            return false;
        }
        const mmlTag = DomUtil.tagName(semantic.mathmlTree);
        const role = semantic.childNodes[0].role;
        return ((mmlTag === 'MSUBSUP' && role === "subsup") ||
            (mmlTag === 'MUNDEROVER' && role === "underover"));
    }
    getMathml() {
        const ignore = this.semantic.childNodes[0];
        const baseSem = ignore.childNodes[0];
        const supSem = this.semantic.childNodes[1];
        const subSem = ignore.childNodes[1];
        const supMml = EnrichMathml.walkTree(supSem);
        const baseMml = EnrichMathml.walkTree(baseSem);
        const subMml = EnrichMathml.walkTree(subSem);
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        this.mml.setAttribute(enrich_attr_1.Attribute.CHILDREN, (0, enrich_attr_1.makeIdList)([baseSem, subSem, supSem]));
        [baseMml, subMml, supMml].forEach((child) => EnrichMathml.getInnerNode(child).setAttribute(enrich_attr_1.Attribute.PARENT, this.mml.getAttribute(enrich_attr_1.Attribute.ID)));
        this.mml.setAttribute(enrich_attr_1.Attribute.TYPE, ignore.role);
        EnrichMathml.addCollapsedAttribute(this.mml, [
            this.semantic.id,
            [ignore.id, baseSem.id, subSem.id],
            supSem.id
        ]);
        return this.mml;
    }
}
exports.CaseDoubleScript = CaseDoubleScript;
