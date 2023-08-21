"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseProof = void 0;
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseProof extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        return (!!semantic.mathmlTree &&
            (semantic.type === "inference" ||
                semantic.type === "premises"));
    }
    getMathml() {
        if (!this.semantic.childNodes.length) {
            return this.mml;
        }
        this.semantic.contentNodes.forEach(function (x) {
            EnrichMathml.walkTree(x);
            (0, enrich_attr_1.setAttributes)(x.mathmlTree, x);
        });
        this.semantic.childNodes.forEach(function (x) {
            EnrichMathml.walkTree(x);
        });
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        if (this.mml.getAttribute('data-semantic-id') ===
            this.mml.getAttribute('data-semantic-parent')) {
            this.mml.removeAttribute('data-semantic-parent');
        }
        return this.mml;
    }
}
exports.CaseProof = CaseProof;
