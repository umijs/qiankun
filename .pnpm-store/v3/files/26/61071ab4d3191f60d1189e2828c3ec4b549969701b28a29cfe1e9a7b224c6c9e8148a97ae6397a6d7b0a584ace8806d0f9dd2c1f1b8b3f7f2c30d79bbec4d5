"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBySemanticId = exports.getSemanticRoot = exports.getAttribute = exports.splitAttribute = void 0;
const DomUtil = require("../common/dom_util");
const enrich_attr_1 = require("../enrich_mathml/enrich_attr");
function splitAttribute(attr) {
    return !attr ? [] : attr.split(/,/);
}
exports.splitAttribute = splitAttribute;
function getAttribute(node, attr) {
    return node.getAttribute(attr);
}
exports.getAttribute = getAttribute;
function getSemanticRoot(node) {
    if (node.hasAttribute(enrich_attr_1.Attribute.TYPE) &&
        !node.hasAttribute(enrich_attr_1.Attribute.PARENT)) {
        return node;
    }
    const semanticNodes = DomUtil.querySelectorAllByAttr(node, enrich_attr_1.Attribute.TYPE);
    for (let i = 0, semanticNode; (semanticNode = semanticNodes[i]); i++) {
        if (!semanticNode.hasAttribute(enrich_attr_1.Attribute.PARENT)) {
            return semanticNode;
        }
    }
    return node;
}
exports.getSemanticRoot = getSemanticRoot;
function getBySemanticId(root, id) {
    if (root.getAttribute(enrich_attr_1.Attribute.ID) === id) {
        return root;
    }
    return DomUtil.querySelectorAllByAttrValue(root, enrich_attr_1.Attribute.ID, id)[0];
}
exports.getBySemanticId = getBySemanticId;
