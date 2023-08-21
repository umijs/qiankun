"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTreeFromString = exports.getTree = exports.xmlTree = void 0;
const DomUtil = require("../common/dom_util");
const semantic_tree_1 = require("./semantic_tree");
function xmlTree(mml) {
    return getTree(mml).xml();
}
exports.xmlTree = xmlTree;
function getTree(mml) {
    return new semantic_tree_1.SemanticTree(mml);
}
exports.getTree = getTree;
function getTreeFromString(expr) {
    const mml = DomUtil.parseInput(expr);
    return getTree(mml);
}
exports.getTreeFromString = getTreeFromString;
