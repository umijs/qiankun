"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseBinomial = void 0;
const DomUtil = require("../common/dom_util");
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const enrich_mathml_1 = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseBinomial extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        return (!semantic.mathmlTree &&
            semantic.type === "line" &&
            semantic.role === "binomial");
    }
    getMathml() {
        if (!this.semantic.childNodes.length) {
            return this.mml;
        }
        const child = this.semantic.childNodes[0];
        this.mml = (0, enrich_mathml_1.walkTree)(child);
        if (this.mml.hasAttribute(enrich_attr_1.Attribute.TYPE)) {
            const mrow = DomUtil.createElement('mrow');
            mrow.setAttribute(enrich_attr_1.Attribute.ADDED, 'true');
            DomUtil.replaceNode(this.mml, mrow);
            mrow.appendChild(this.mml);
            this.mml = mrow;
        }
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        return this.mml;
    }
}
exports.CaseBinomial = CaseBinomial;
