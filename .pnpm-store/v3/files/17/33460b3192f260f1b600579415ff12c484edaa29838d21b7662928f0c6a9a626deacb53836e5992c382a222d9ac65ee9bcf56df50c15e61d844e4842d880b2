"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseMultiindex = void 0;
const DomUtil = require("../common/dom_util");
const abstract_enrich_case_1 = require("./abstract_enrich_case");
const EnrichMathml = require("./enrich_mathml");
const enrich_attr_1 = require("./enrich_attr");
class CaseMultiindex extends abstract_enrich_case_1.AbstractEnrichCase {
    constructor(semantic) {
        super(semantic);
        this.mml = semantic.mathmlTree;
    }
    static multiscriptIndex(index) {
        if (index.type === "punctuated" &&
            index.contentNodes[0].role === "dummy") {
            return EnrichMathml.collapsePunctuated(index);
        }
        EnrichMathml.walkTree(index);
        return index.id;
    }
    static createNone_(semantic) {
        const newNode = DomUtil.createElement('none');
        if (semantic) {
            (0, enrich_attr_1.setAttributes)(newNode, semantic);
        }
        newNode.setAttribute(enrich_attr_1.Attribute.ADDED, 'true');
        return newNode;
    }
    completeMultiscript(rightIndices, leftIndices) {
        const children = DomUtil.toArray(this.mml.childNodes).slice(1);
        let childCounter = 0;
        const completeIndices = (indices) => {
            for (let i = 0, index; (index = indices[i]); i++) {
                const child = children[childCounter];
                if (!child ||
                    index !==
                        parseInt(EnrichMathml.getInnerNode(child).getAttribute(enrich_attr_1.Attribute.ID))) {
                    const query = this.semantic.querySelectorAll((x) => x.id === index);
                    this.mml.insertBefore(CaseMultiindex.createNone_(query[0]), child || null);
                }
                else {
                    EnrichMathml.getInnerNode(child).setAttribute(enrich_attr_1.Attribute.PARENT, this.semantic.id.toString());
                    childCounter++;
                }
            }
        };
        completeIndices(rightIndices);
        if (children[childCounter] &&
            DomUtil.tagName(children[childCounter]) !== 'MPRESCRIPTS') {
            this.mml.insertBefore(children[childCounter], DomUtil.createElement('mprescripts'));
        }
        else {
            childCounter++;
        }
        completeIndices(leftIndices);
    }
}
exports.CaseMultiindex = CaseMultiindex;
