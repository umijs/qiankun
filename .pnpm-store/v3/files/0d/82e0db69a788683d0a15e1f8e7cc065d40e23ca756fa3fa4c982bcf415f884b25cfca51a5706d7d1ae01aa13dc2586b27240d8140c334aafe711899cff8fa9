"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordOrdinal = exports.layoutFactor_ = exports.fencedFactor_ = exports.simpleFactor_ = exports.simpleArguments = exports.fencedArguments = exports.insertNesting = exports.matchingFences = exports.nestingDepth = exports.NESTING_DEPTH = exports.ordinalExponent = exports.allTextLastContent_ = exports.isUnitExpression = exports.isSmallVulgarFraction = exports.allCellsSimple = exports.allIndices_ = exports.isInteger_ = exports.simpleCell_ = exports.simpleNode = exports.hasPreference = exports.isSimpleFraction_ = exports.isSimpleNumber_ = exports.isNumber_ = exports.isLetter_ = exports.isSimple_ = exports.isSimpleLetters_ = exports.isSimpleDegree_ = exports.isSimpleNegative_ = exports.isSimpleFunction_ = exports.isSimpleExpression = exports.nodeCounter = void 0;
const DomUtil = require("../common/dom_util");
const engine_1 = require("../common/engine");
const XpathUtil = require("../common/xpath_util");
const locale_1 = require("../l10n/locale");
const transformers_1 = require("../l10n/transformers");
const grammar_1 = require("../rule_engine/grammar");
const StoreUtil = require("../rule_engine/store_util");
const semantic_annotations_1 = require("../semantic_tree/semantic_annotations");
const semantic_annotator_1 = require("../semantic_tree/semantic_annotator");
const semantic_attr_1 = require("../semantic_tree/semantic_attr");
function nodeCounter(nodes, context) {
    const split = context.split('-');
    const func = StoreUtil.nodeCounter(nodes, split[0] || '');
    const sep = split[1] || '';
    const init = split[2] || '';
    let first = true;
    return function () {
        const result = func();
        if (first) {
            first = false;
            return init + result + sep;
        }
        else {
            return result + sep;
        }
    };
}
exports.nodeCounter = nodeCounter;
function isSimpleExpression(node) {
    return (isSimpleNumber_(node) ||
        isSimpleLetters_(node) ||
        isSimpleDegree_(node) ||
        isSimpleNegative_(node) ||
        isSimpleFunction_(node));
}
exports.isSimpleExpression = isSimpleExpression;
function isSimpleFunction_(node) {
    return (node.type === "appl" &&
        (node.childNodes[0].role === "prefix function" ||
            node.childNodes[0].role === "simple function") &&
        (isSimple_(node.childNodes[1]) ||
            (node.childNodes[1].type === "fenced" &&
                isSimple_(node.childNodes[1].childNodes[0]))));
}
exports.isSimpleFunction_ = isSimpleFunction_;
function isSimpleNegative_(node) {
    return (node.type === "prefixop" &&
        node.role === "negative" &&
        isSimple_(node.childNodes[0]) &&
        node.childNodes[0].type !== "prefixop" &&
        node.childNodes[0].type !== "appl" &&
        node.childNodes[0].type !== "punctuated");
}
exports.isSimpleNegative_ = isSimpleNegative_;
function isSimpleDegree_(node) {
    return (node.type === "punctuated" &&
        node.role === "endpunct" &&
        node.childNodes.length === 2 &&
        node.childNodes[1].role === "degree" &&
        (isLetter_(node.childNodes[0]) ||
            isNumber_(node.childNodes[0]) ||
            (node.childNodes[0].type === "prefixop" &&
                node.childNodes[0].role === "negative" &&
                (isLetter_(node.childNodes[0].childNodes[0]) ||
                    isNumber_(node.childNodes[0].childNodes[0])))));
}
exports.isSimpleDegree_ = isSimpleDegree_;
function isSimpleLetters_(node) {
    return (isLetter_(node) ||
        (node.type === "infixop" &&
            node.role === "implicit" &&
            ((node.childNodes.length === 2 &&
                (isLetter_(node.childNodes[0]) ||
                    isSimpleNumber_(node.childNodes[0])) &&
                isLetter_(node.childNodes[1])) ||
                (node.childNodes.length === 3 &&
                    isSimpleNumber_(node.childNodes[0]) &&
                    isLetter_(node.childNodes[1]) &&
                    isLetter_(node.childNodes[2])))));
}
exports.isSimpleLetters_ = isSimpleLetters_;
function isSimple_(node) {
    return node.hasAnnotation('clearspeak', 'simple');
}
exports.isSimple_ = isSimple_;
function isLetter_(node) {
    return (node.type === "identifier" &&
        (node.role === "latinletter" ||
            node.role === "greekletter" ||
            node.role === "otherletter" ||
            node.role === "simple function"));
}
exports.isLetter_ = isLetter_;
function isNumber_(node) {
    return (node.type === "number" &&
        (node.role === "integer" || node.role === "float"));
}
exports.isNumber_ = isNumber_;
function isSimpleNumber_(node) {
    return isNumber_(node) || isSimpleFraction_(node);
}
exports.isSimpleNumber_ = isSimpleNumber_;
function isSimpleFraction_(node) {
    if (hasPreference('Fraction_Over') || hasPreference('Fraction_FracOver')) {
        return false;
    }
    if (node.type !== "fraction" ||
        node.role !== "vulgar") {
        return false;
    }
    if (hasPreference('Fraction_Ordinal')) {
        return true;
    }
    const enumerator = parseInt(node.childNodes[0].textContent, 10);
    const denominator = parseInt(node.childNodes[1].textContent, 10);
    return (enumerator > 0 && enumerator < 20 && denominator > 0 && denominator < 11);
}
exports.isSimpleFraction_ = isSimpleFraction_;
function hasPreference(pref) {
    return engine_1.default.getInstance().style === pref;
}
exports.hasPreference = hasPreference;
(0, semantic_annotations_1.register)(new semantic_annotator_1.SemanticAnnotator('clearspeak', 'simple', function (node) {
    return isSimpleExpression(node) ? 'simple' : '';
}));
function simpleNode(node) {
    if (!node.hasAttribute('annotation')) {
        return false;
    }
    const annotation = node.getAttribute('annotation');
    return !!/clearspeak:simple$|clearspeak:simple;/.exec(annotation);
}
exports.simpleNode = simpleNode;
function simpleCell_(node) {
    if (simpleNode(node)) {
        return true;
    }
    if (node.tagName !== "subscript") {
        return false;
    }
    const children = node.childNodes[0].childNodes;
    const index = children[1];
    return (children[0].tagName === "identifier" &&
        (isInteger_(index) ||
            (index.tagName === "infixop" &&
                index.hasAttribute('role') &&
                index.getAttribute('role') === "implicit" &&
                allIndices_(index))));
}
exports.simpleCell_ = simpleCell_;
function isInteger_(node) {
    return (node.tagName === "number" &&
        node.hasAttribute('role') &&
        node.getAttribute('role') === "integer");
}
exports.isInteger_ = isInteger_;
function allIndices_(node) {
    const nodes = XpathUtil.evalXPath('children/*', node);
    return nodes.every((x) => isInteger_(x) || x.tagName === "identifier");
}
exports.allIndices_ = allIndices_;
function allCellsSimple(node) {
    const xpath = node.tagName === "matrix"
        ? 'children/row/children/cell/children/*'
        : 'children/line/children/*';
    const nodes = XpathUtil.evalXPath(xpath, node);
    const result = nodes.every(simpleCell_);
    return result ? [node] : [];
}
exports.allCellsSimple = allCellsSimple;
function isSmallVulgarFraction(node) {
    return (0, transformers_1.vulgarFractionSmall)(node, 20, 11) ? [node] : [];
}
exports.isSmallVulgarFraction = isSmallVulgarFraction;
function isUnitExpression(node) {
    return (node.type === "text" ||
        (node.type === "punctuated" &&
            node.role === "text" &&
            isNumber_(node.childNodes[0]) &&
            allTextLastContent_(node.childNodes.slice(1))) ||
        (node.type === "identifier" &&
            node.role === "unit") ||
        (node.type === "infixop" &&
            (node.role === "implicit" || node.role === "unit")));
}
exports.isUnitExpression = isUnitExpression;
function allTextLastContent_(nodes) {
    for (let i = 0; i < nodes.length - 1; i++) {
        if (!(nodes[i].type === "text" && nodes[i].textContent === '')) {
            return false;
        }
    }
    return nodes[nodes.length - 1].type === "text";
}
exports.allTextLastContent_ = allTextLastContent_;
(0, semantic_annotations_1.register)(new semantic_annotator_1.SemanticAnnotator('clearspeak', 'unit', function (node) {
    return isUnitExpression(node) ? 'unit' : '';
}));
function ordinalExponent(node) {
    const num = parseInt(node.textContent, 10);
    if (isNaN(num)) {
        return node.textContent;
    }
    return num > 10
        ? locale_1.LOCALE.NUMBERS.numericOrdinal(num)
        : locale_1.LOCALE.NUMBERS.wordOrdinal(num);
}
exports.ordinalExponent = ordinalExponent;
exports.NESTING_DEPTH = null;
function nestingDepth(node) {
    let count = 0;
    const fence = node.textContent;
    const index = node.getAttribute('role') === 'open' ? 0 : 1;
    let parent = node.parentNode;
    while (parent) {
        if (parent.tagName === "fenced" &&
            parent.childNodes[0].childNodes[index].textContent === fence) {
            count++;
        }
        parent = parent.parentNode;
    }
    exports.NESTING_DEPTH = count > 1 ? locale_1.LOCALE.NUMBERS.wordOrdinal(count) : '';
    return exports.NESTING_DEPTH;
}
exports.nestingDepth = nestingDepth;
function matchingFences(node) {
    const sibling = node.previousSibling;
    let left, right;
    if (sibling) {
        left = sibling;
        right = node;
    }
    else {
        left = node;
        right = node.nextSibling;
    }
    if (!right) {
        return [];
    }
    return (0, semantic_attr_1.isMatchingFence)(left.textContent, right.textContent) ? [node] : [];
}
exports.matchingFences = matchingFences;
function insertNesting(text, correction) {
    if (!correction || !text) {
        return text;
    }
    const start = text.match(/^(open|close) /);
    if (!start) {
        return correction + ' ' + text;
    }
    return start[0] + correction + ' ' + text.substring(start[0].length);
}
exports.insertNesting = insertNesting;
grammar_1.Grammar.getInstance().setCorrection('insertNesting', insertNesting);
function fencedArguments(node) {
    const content = DomUtil.toArray(node.parentNode.childNodes);
    const children = XpathUtil.evalXPath('../../children/*', node);
    const index = content.indexOf(node);
    return fencedFactor_(children[index]) || fencedFactor_(children[index + 1])
        ? [node]
        : [];
}
exports.fencedArguments = fencedArguments;
function simpleArguments(node) {
    const content = DomUtil.toArray(node.parentNode.childNodes);
    const children = XpathUtil.evalXPath('../../children/*', node);
    const index = content.indexOf(node);
    return simpleFactor_(children[index]) &&
        children[index + 1] &&
        (simpleFactor_(children[index + 1]) ||
            children[index + 1].tagName === "root" ||
            children[index + 1].tagName === "sqrt" ||
            (children[index + 1].tagName === "superscript" &&
                children[index + 1].childNodes[0].childNodes[0] &&
                (children[index + 1].childNodes[0].childNodes[0]
                    .tagName === "number" ||
                    children[index + 1].childNodes[0].childNodes[0]
                        .tagName === "identifier") &&
                (children[index + 1].childNodes[0].childNodes[1].textContent === '2' ||
                    children[index + 1].childNodes[0].childNodes[1].textContent === '3')))
        ? [node]
        : [];
}
exports.simpleArguments = simpleArguments;
function simpleFactor_(node) {
    return (!!node &&
        (node.tagName === "number" ||
            node.tagName === "identifier" ||
            node.tagName === "function" ||
            node.tagName === "appl" ||
            node.tagName === "fraction"));
}
exports.simpleFactor_ = simpleFactor_;
function fencedFactor_(node) {
    return (node &&
        (node.tagName === "fenced" ||
            (node.hasAttribute('role') &&
                node.getAttribute('role') === "leftright") ||
            layoutFactor_(node)));
}
exports.fencedFactor_ = fencedFactor_;
function layoutFactor_(node) {
    return (!!node &&
        (node.tagName === "matrix" ||
            node.tagName === "vector"));
}
exports.layoutFactor_ = layoutFactor_;
function wordOrdinal(node) {
    return locale_1.LOCALE.NUMBERS.wordOrdinal(parseInt(node.textContent, 10));
}
exports.wordOrdinal = wordOrdinal;
