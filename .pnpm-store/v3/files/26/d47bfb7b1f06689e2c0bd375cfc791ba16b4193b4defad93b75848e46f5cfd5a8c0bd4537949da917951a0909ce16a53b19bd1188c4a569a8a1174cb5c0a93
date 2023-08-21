"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEvaluator = exports.evaluateString = exports.evaluateBoolean = exports.getLeafNodes = exports.evalXPath = exports.resolveNameSpace = exports.xpath = void 0;
const engine_1 = require("./engine");
const EngineConst = require("../common/engine_const");
const system_external_1 = require("./system_external");
function xpathSupported() {
    if (typeof XPathResult === 'undefined') {
        return false;
    }
    return true;
}
exports.xpath = {
    currentDocument: null,
    evaluate: xpathSupported()
        ? document.evaluate
        : system_external_1.default.xpath.evaluate,
    result: xpathSupported() ? XPathResult : system_external_1.default.xpath.XPathResult,
    createNSResolver: xpathSupported()
        ? document.createNSResolver
        : system_external_1.default.xpath.createNSResolver
};
const nameSpaces = {
    xhtml: 'http://www.w3.org/1999/xhtml',
    mathml: 'http://www.w3.org/1998/Math/MathML',
    mml: 'http://www.w3.org/1998/Math/MathML',
    svg: 'http://www.w3.org/2000/svg'
};
function resolveNameSpace(prefix) {
    return nameSpaces[prefix] || null;
}
exports.resolveNameSpace = resolveNameSpace;
class Resolver {
    constructor() {
        this.lookupNamespaceURI = resolveNameSpace;
    }
}
function evaluateXpath(expression, rootNode, type) {
    return engine_1.default.getInstance().mode === EngineConst.Mode.HTTP &&
        !engine_1.default.getInstance().isIE &&
        !engine_1.default.getInstance().isEdge
        ? exports.xpath.currentDocument.evaluate(expression, rootNode, resolveNameSpace, type, null)
        : exports.xpath.evaluate(expression, rootNode, new Resolver(), type, null);
}
function evalXPath(expression, rootNode) {
    let iterator;
    try {
        iterator = evaluateXpath(expression, rootNode, exports.xpath.result.ORDERED_NODE_ITERATOR_TYPE);
    }
    catch (err) {
        return [];
    }
    const results = [];
    for (let xpathNode = iterator.iterateNext(); xpathNode; xpathNode = iterator.iterateNext()) {
        results.push(xpathNode);
    }
    return results;
}
exports.evalXPath = evalXPath;
function getLeafNodes(rootNode) {
    return evalXPath('.//*[count(*)=0]', rootNode);
}
exports.getLeafNodes = getLeafNodes;
function evaluateBoolean(expression, rootNode) {
    let result;
    try {
        result = evaluateXpath(expression, rootNode, exports.xpath.result.BOOLEAN_TYPE);
    }
    catch (err) {
        return false;
    }
    return result.booleanValue;
}
exports.evaluateBoolean = evaluateBoolean;
function evaluateString(expression, rootNode) {
    let result;
    try {
        result = evaluateXpath(expression, rootNode, exports.xpath.result.STRING_TYPE);
    }
    catch (err) {
        return '';
    }
    return result.stringValue;
}
exports.evaluateString = evaluateString;
function updateEvaluator(node) {
    if (engine_1.default.getInstance().mode !== EngineConst.Mode.HTTP)
        return;
    let parent = node;
    while (parent && !parent.evaluate) {
        parent = parent.parentNode;
    }
    if (parent && parent.evaluate) {
        exports.xpath.currentDocument = parent;
    }
    else if (node.ownerDocument) {
        exports.xpath.currentDocument = node.ownerDocument;
    }
}
exports.updateEvaluator = updateEvaluator;
