"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentIterator = exports.pauseSeparator = exports.nodeCounter = void 0;
const auditory_description_1 = require("../audio/auditory_description");
const XpathUtil = require("../common/xpath_util");
const engine_1 = require("../common/engine");
function nodeCounter(nodes, context) {
    const localLength = nodes.length;
    let localCounter = 0;
    let localContext = context;
    if (!context) {
        localContext = '';
    }
    return function () {
        if (localCounter < localLength) {
            localCounter += 1;
        }
        return localContext + ' ' + localCounter;
    };
}
exports.nodeCounter = nodeCounter;
function pauseSeparator(_nodes, context) {
    const numeral = parseFloat(context);
    const value = isNaN(numeral) ? context : numeral;
    return function () {
        return [
            auditory_description_1.AuditoryDescription.create({
                text: '',
                personality: { pause: value }
            })
        ];
    };
}
exports.pauseSeparator = pauseSeparator;
function contentIterator(nodes, context) {
    let contentNodes;
    if (nodes.length > 0) {
        contentNodes = XpathUtil.evalXPath('../../content/*', nodes[0]);
    }
    else {
        contentNodes = [];
    }
    return function () {
        const content = contentNodes.shift();
        const contextDescr = context
            ? [auditory_description_1.AuditoryDescription.create({ text: context }, { translate: true })]
            : [];
        if (!content) {
            return contextDescr;
        }
        const descrs = engine_1.default.evaluateNode(content);
        return contextDescr.concat(descrs);
    };
}
exports.contentIterator = contentIterator;
