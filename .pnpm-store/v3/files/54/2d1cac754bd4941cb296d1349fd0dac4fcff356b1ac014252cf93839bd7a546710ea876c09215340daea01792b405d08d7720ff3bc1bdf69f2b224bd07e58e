"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticNodeFactory = void 0;
const semantic_default_1 = require("./semantic_default");
const semantic_default_2 = require("./semantic_default");
const semantic_node_1 = require("./semantic_node");
class SemanticNodeFactory {
    constructor() {
        this.leafMap = new semantic_default_2.SemanticNodeCollator();
        this.defaultMap = new semantic_default_1.SemanticDefault();
        this.idCounter_ = -1;
    }
    makeNode(id) {
        return this.createNode_(id);
    }
    makeUnprocessed(mml) {
        const node = this.createNode_();
        node.mathml = [mml];
        node.mathmlTree = mml;
        return node;
    }
    makeEmptyNode() {
        const node = this.createNode_();
        node.type = "empty";
        return node;
    }
    makeContentNode(content) {
        const node = this.createNode_();
        node.updateContent(content);
        return node;
    }
    makeMultipleContentNodes(num, content) {
        const nodes = [];
        for (let i = 0; i < num; i++) {
            nodes.push(this.makeContentNode(content));
        }
        return nodes;
    }
    makeLeafNode(content, font) {
        if (!content) {
            return this.makeEmptyNode();
        }
        const node = this.makeContentNode(content);
        node.font = font || node.font;
        const meaning = this.defaultMap.retrieveNode(node);
        if (meaning) {
            node.type = meaning.type;
            node.role = meaning.role;
            node.font = meaning.font;
        }
        this.leafMap.addNode(node);
        return node;
    }
    makeBranchNode(type, children, contentNodes, opt_content) {
        const node = this.createNode_();
        if (opt_content) {
            node.updateContent(opt_content);
        }
        node.type = type;
        node.childNodes = children;
        node.contentNodes = contentNodes;
        children.concat(contentNodes).forEach(function (x) {
            x.parent = node;
            node.addMathmlNodes(x.mathml);
        });
        return node;
    }
    createNode_(id) {
        if (typeof id !== 'undefined') {
            this.idCounter_ = Math.max(this.idCounter_, id);
        }
        else {
            id = ++this.idCounter_;
        }
        return new semantic_node_1.SemanticNode(id);
    }
}
exports.SemanticNodeFactory = SemanticNodeFactory;
