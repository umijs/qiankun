"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseText = void 0;
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseText extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        return (semantic.type === "punctuated" &&
            (semantic.role === "text" ||
                semantic.contentNodes.every((x) => x.role === "dummy")));
    }
    getMathml() {
        const children = [];
        const collapsed = EnrichMathml.collapsePunctuated(this.semantic, children);
        this.mml = EnrichMathml.introduceNewLayer(children, this.semantic);
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        this.mml.removeAttribute(enrich_attr_1.Attribute.CONTENT);
        EnrichMathml.addCollapsedAttribute(this.mml, collapsed);
        return this.mml;
    }
}
exports.CaseText = CaseText;
