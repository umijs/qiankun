"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implicitIterator = exports.relationIterator = exports.propagateNumber = exports.checkParent_ = exports.NUMBER_INHIBITORS_ = exports.NUMBER_PROPAGATORS_ = exports.enlargeFence = exports.indexRadical = exports.closingRadical = exports.openingRadical = exports.radicalNestingDepth = exports.nestedRadical = exports.hyperFractionBoundary = exports.overBevelledFraction = exports.overFraction = exports.closingFraction = exports.openingFraction = void 0;
const auditory_description_1 = require("../audio/auditory_description");
const DomUtil = require("../common/dom_util");
const XpathUtil = require("../common/xpath_util");
const grammar_1 = require("../rule_engine/grammar");
const engine_1 = require("../common/engine");
const semantic_annotations_1 = require("../semantic_tree/semantic_annotations");
const semantic_annotator_1 = require("../semantic_tree/semantic_annotator");
const locale_1 = require("../l10n/locale");
const MathspeakUtil = require("./mathspeak_util");
function openingFraction(node) {
    const depth = MathspeakUtil.fractionNestingDepth(node);
    return (new Array(depth).join(locale_1.LOCALE.MESSAGES.MS.FRACTION_REPEAT) +
        locale_1.LOCALE.MESSAGES.MS.FRACTION_START);
}
exports.openingFraction = openingFraction;
function closingFraction(node) {
    const depth = MathspeakUtil.fractionNestingDepth(node);
    return (new Array(depth).join(locale_1.LOCALE.MESSAGES.MS.FRACTION_REPEAT) +
        locale_1.LOCALE.MESSAGES.MS.FRACTION_END);
}
exports.closingFraction = closingFraction;
function overFraction(node) {
    const depth = MathspeakUtil.fractionNestingDepth(node);
    return (new Array(depth).join(locale_1.LOCALE.MESSAGES.MS.FRACTION_REPEAT) +
        locale_1.LOCALE.MESSAGES.MS.FRACTION_OVER);
}
exports.overFraction = overFraction;
function overBevelledFraction(node) {
    const depth = MathspeakUtil.fractionNestingDepth(node);
    return (new Array(depth).join(locale_1.LOCALE.MESSAGES.MS.FRACTION_REPEAT) +
        '⠸' +
        locale_1.LOCALE.MESSAGES.MS.FRACTION_OVER);
}
exports.overBevelledFraction = overBevelledFraction;
function hyperFractionBoundary(node) {
    return locale_1.LOCALE.MESSAGES.regexp.HYPER ===
        MathspeakUtil.fractionNestingDepth(node).toString() ? [node] : [];
}
exports.hyperFractionBoundary = hyperFractionBoundary;
function nestedRadical(node, postfix) {
    const depth = radicalNestingDepth(node);
    if (depth === 1) {
        return postfix;
    }
    return new Array(depth).join(locale_1.LOCALE.MESSAGES.MS.NESTED) + postfix;
}
exports.nestedRadical = nestedRadical;
function radicalNestingDepth(node, opt_depth) {
    const depth = opt_depth || 0;
    if (!node.parentNode) {
        return depth;
    }
    return radicalNestingDepth(node.parentNode, node.tagName === 'root' || node.tagName === 'sqrt' ? depth + 1 : depth);
}
exports.radicalNestingDepth = radicalNestingDepth;
function openingRadical(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.STARTROOT);
}
exports.openingRadical = openingRadical;
function closingRadical(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.ENDROOT);
}
exports.closingRadical = closingRadical;
function indexRadical(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.ROOTINDEX);
}
exports.indexRadical = indexRadical;
function enlargeFence(text) {
    const start = '⠠';
    if (text.length === 1) {
        return start + text;
    }
    const neut = '⠳';
    const split = text.split('');
    if (split.every(function (x) {
        return x === neut;
    })) {
        return start + split.join(start);
    }
    return text.slice(0, -1) + start + text.slice(-1);
}
exports.enlargeFence = enlargeFence;
grammar_1.Grammar.getInstance().setCorrection('enlargeFence', enlargeFence);
exports.NUMBER_PROPAGATORS_ = [
    "multirel",
    "relseq",
    "appl",
    "row",
    "line"
];
exports.NUMBER_INHIBITORS_ = [
    "subscript",
    "superscript",
    "overscore",
    "underscore"
];
function checkParent_(node, info) {
    const parent = node.parent;
    if (!parent) {
        return false;
    }
    const type = parent.type;
    if (exports.NUMBER_PROPAGATORS_.indexOf(type) !== -1 ||
        (type === "prefixop" &&
            parent.role === "negative" &&
            !info.script) ||
        (type === "prefixop" &&
            parent.role === "geometry")) {
        return true;
    }
    if (type === "punctuated") {
        if (!info.enclosed || parent.role === "text") {
            return true;
        }
    }
    return false;
}
exports.checkParent_ = checkParent_;
function propagateNumber(node, info) {
    if (!node.childNodes.length) {
        if (checkParent_(node, info)) {
            info.number = true;
            info.script = false;
            info.enclosed = false;
        }
        return [
            info['number'] ? 'number' : '',
            { number: false, enclosed: info.enclosed, script: info.script }
        ];
    }
    if (exports.NUMBER_INHIBITORS_.indexOf(node.type) !== -1) {
        info.script = true;
    }
    if (node.type === "fenced") {
        info.number = false;
        info.enclosed = true;
        return ['', info];
    }
    if (checkParent_(node, info)) {
        info.number = true;
        info.enclosed = false;
    }
    return ['', info];
}
exports.propagateNumber = propagateNumber;
(0, semantic_annotations_1.register)(new semantic_annotator_1.SemanticVisitor('nemeth', 'number', propagateNumber, { number: true }));
function relationIterator(nodes, context) {
    const childNodes = nodes.slice(0);
    let first = true;
    let contentNodes;
    if (nodes.length > 0) {
        contentNodes = XpathUtil.evalXPath('../../content/*', nodes[0]);
    }
    else {
        contentNodes = [];
    }
    return function () {
        const content = contentNodes.shift();
        const leftChild = childNodes.shift();
        const rightChild = childNodes[0];
        const contextDescr = context
            ? [auditory_description_1.AuditoryDescription.create({ text: context }, { translate: true })]
            : [];
        if (!content) {
            return contextDescr;
        }
        const base = leftChild
            ? MathspeakUtil.nestedSubSuper(leftChild, '', {
                sup: locale_1.LOCALE.MESSAGES.MS.SUPER,
                sub: locale_1.LOCALE.MESSAGES.MS.SUB
            })
            : '';
        const left = (leftChild && DomUtil.tagName(leftChild) !== 'EMPTY') ||
            (first &&
                content.parentNode.parentNode &&
                content.parentNode.parentNode.previousSibling)
            ? [auditory_description_1.AuditoryDescription.create({ text: locale_1.LOCALE.MESSAGES.regexp.SPACE + base }, {})]
            : [];
        const right = (rightChild && DomUtil.tagName(rightChild) !== 'EMPTY') ||
            (!contentNodes.length &&
                content.parentNode.parentNode &&
                content.parentNode.parentNode.nextSibling)
            ? [auditory_description_1.AuditoryDescription.create({ text: locale_1.LOCALE.MESSAGES.regexp.SPACE }, {})]
            : [];
        const descrs = engine_1.default.evaluateNode(content);
        first = false;
        return contextDescr.concat(left, descrs, right);
    };
}
exports.relationIterator = relationIterator;
function implicitIterator(nodes, context) {
    const childNodes = nodes.slice(0);
    let contentNodes;
    if (nodes.length > 0) {
        contentNodes = XpathUtil.evalXPath('../../content/*', nodes[0]);
    }
    else {
        contentNodes = [];
    }
    return function () {
        const leftChild = childNodes.shift();
        const rightChild = childNodes[0];
        const content = contentNodes.shift();
        const contextDescr = context
            ? [auditory_description_1.AuditoryDescription.create({ text: context }, { translate: true })]
            : [];
        if (!content) {
            return contextDescr;
        }
        const left = leftChild && DomUtil.tagName(leftChild) === 'NUMBER';
        const right = rightChild && DomUtil.tagName(rightChild) === 'NUMBER';
        return contextDescr.concat(left && right && content.getAttribute('role') === "space"
            ? [auditory_description_1.AuditoryDescription.create({ text: locale_1.LOCALE.MESSAGES.regexp.SPACE }, {})]
            : []);
    };
}
exports.implicitIterator = implicitIterator;
