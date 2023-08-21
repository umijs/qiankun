"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseTable = void 0;
const DomUtil = require("../common/dom_util");
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseTable extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.inner = [];
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        return (semantic.type === "matrix" ||
            semantic.type === "vector" ||
            semantic.type === "cases");
    }
    getMathml() {
        const lfence = EnrichMathml.cloneContentNode(this.semantic.contentNodes[0]);
        const rfence = this.semantic.contentNodes[1]
            ? EnrichMathml.cloneContentNode(this.semantic.contentNodes[1])
            : null;
        this.inner = this.semantic.childNodes.map(EnrichMathml.walkTree);
        if (!this.mml) {
            this.mml = EnrichMathml.introduceNewLayer([lfence].concat(this.inner, [rfence]), this.semantic);
        }
        else if (DomUtil.tagName(this.mml) === 'MFENCED') {
            const children = this.mml.childNodes;
            this.mml.insertBefore(lfence, children[0] || null);
            rfence && this.mml.appendChild(rfence);
            this.mml = EnrichMathml.rewriteMfenced(this.mml);
        }
        else {
            const newChildren = [lfence, this.mml];
            rfence && newChildren.push(rfence);
            this.mml = EnrichMathml.introduceNewLayer(newChildren, this.semantic);
        }
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        return this.mml;
    }
}
exports.CaseTable = CaseTable;
