"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseLine = void 0;
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseLine extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static test(semantic) {
        return !!semantic.mathmlTree && semantic.type === "line";
    }
    getMathml() {
        if (this.semantic.contentNodes.length) {
            EnrichMathml.walkTree(this.semantic.contentNodes[0]);
        }
        if (this.semantic.childNodes.length) {
            EnrichMathml.walkTree(this.semantic.childNodes[0]);
        }
        (0, enrich_attr_1.setAttributes)(this.mml, this.semantic);
        return this.mml;
    }
}
exports.CaseLine = CaseLine;
