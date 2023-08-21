"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticTree = void 0;
const DomUtil = require("../common/dom_util");
const semantic_annotations_1 = require("./semantic_annotations");
const semantic_annotator_1 = require("./semantic_annotator");
const semantic_mathml_1 = require("./semantic_mathml");
const semantic_node_1 = require("./semantic_node");
const SemanticPred = require("./semantic_pred");
require("./semantic_heuristics");
class SemanticTree {
    constructor(mathml) {
        this.mathml = mathml;
        this.parser = new semantic_mathml_1.SemanticMathml();
        this.root = this.parser.parse(mathml);
        this.collator = this.parser.getFactory().leafMap.collateMeaning();
        const newDefault = this.collator.newDefault();
        if (newDefault) {
            this.parser = new semantic_mathml_1.SemanticMathml();
            this.parser.getFactory().defaultMap = newDefault;
            this.root = this.parser.parse(mathml);
        }
        unitVisitor.visit(this.root, {});
        (0, semantic_annotations_1.annotate)(this.root);
    }
    static empty() {
        const empty = DomUtil.parseInput('<math/>');
        const stree = new SemanticTree(empty);
        stree.mathml = empty;
        return stree;
    }
    static fromNode(semantic, opt_mathml) {
        const stree = SemanticTree.empty();
        stree.root = semantic;
        if (opt_mathml) {
            stree.mathml = opt_mathml;
        }
        return stree;
    }
    static fromRoot(semantic, opt_mathml) {
        let root = semantic;
        while (root.parent) {
            root = root.parent;
        }
        const stree = SemanticTree.fromNode(root);
        if (opt_mathml) {
            stree.mathml = opt_mathml;
        }
        return stree;
    }
    static fromXml(xml) {
        const stree = SemanticTree.empty();
        if (xml.childNodes[0]) {
            stree.root = semantic_node_1.SemanticNode.fromXml(xml.childNodes[0]);
        }
        return stree;
    }
    xml(opt_brief) {
        const xml = DomUtil.parseInput('<stree></stree>');
        const xmlRoot = this.root.xml(xml.ownerDocument, opt_brief);
        xml.appendChild(xmlRoot);
        return xml;
    }
    toString(opt_brief) {
        return DomUtil.serializeXml(this.xml(opt_brief));
    }
    formatXml(opt_brief) {
        const xml = this.toString(opt_brief);
        return DomUtil.formatXml(xml);
    }
    displayTree() {
        this.root.displayTree();
    }
    replaceNode(oldNode, newNode) {
        const parent = oldNode.parent;
        if (!parent) {
            this.root = newNode;
            return;
        }
        parent.replaceChild(oldNode, newNode);
    }
    toJson() {
        const json = {};
        json['stree'] = this.root.toJson();
        return json;
    }
}
exports.SemanticTree = SemanticTree;
const unitVisitor = new semantic_annotator_1.SemanticVisitor('general', 'unit', (node, _info) => {
    if (node.type === "infixop" &&
        (node.role === "multiplication" ||
            node.role === "implicit")) {
        const children = node.childNodes;
        if (children.length &&
            (SemanticPred.isPureUnit(children[0]) ||
                SemanticPred.isUnitCounter(children[0])) &&
            node.childNodes.slice(1).every(SemanticPred.isPureUnit)) {
            node.role = "unit";
        }
    }
    return false;
});
