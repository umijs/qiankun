"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMembership = exports.elligibleRightNeutral = exports.elligibleLeftNeutral = exports.compareNeutralFences = exports.isNeutralFence = exports.isImplicitOp = exports.isImplicit = exports.isPureUnit = exports.isUnitCounter = exports.isNumber = exports.isSingletonSetContent = exports.scriptedElement_ = exports.illegalSingleton_ = exports.isSetNode = exports.isRightBrace = exports.isLeftBrace = exports.isSimpleFunction = exports.singlePunctAtPosition = exports.isSimpleFunctionHead = exports.isLimitBase = exports.isBinomial = exports.lineIsLabelled = exports.tableIsMultiline = exports.tableIsCases = exports.isFencedElement = exports.tableIsMatrixOrVector = exports.isTableOrMultiline = exports.isElligibleEmbellishedFence = exports.isFence = exports.isPunctuation = exports.isRelation = exports.isOperator = exports.isEmbellished = exports.isGeneralFunctionBoundary = exports.isIntegralDxBoundarySingle = exports.isIntegralDxBoundary = exports.isBigOpBoundary = exports.isPrefixFunctionBoundary = exports.isSimpleFunctionScope = exports.isAccent = exports.isRole = exports.embellishedType = exports.isType = void 0;
const SemanticAttr = require("./semantic_attr");
const semantic_util_1 = require("./semantic_util");
function isType(node, attr) {
    return node.type === attr;
}
exports.isType = isType;
function embellishedType(node, attr) {
    return node.embellished === attr;
}
exports.embellishedType = embellishedType;
function isRole(node, attr) {
    return node.role === attr;
}
exports.isRole = isRole;
function isAccent(node) {
    const inftyReg = new RegExp('∞|᪲');
    return (isType(node, "fence") ||
        isType(node, "punctuation") ||
        (isType(node, "operator") &&
            !node.textContent.match(inftyReg)) ||
        isType(node, "relation") ||
        (isType(node, "identifier") &&
            isRole(node, "unknown") &&
            !node.textContent.match(SemanticAttr.allLettersRegExp) &&
            !node.textContent.match(inftyReg)));
}
exports.isAccent = isAccent;
function isSimpleFunctionScope(node) {
    const children = node.childNodes;
    if (children.length === 0) {
        return true;
    }
    if (children.length > 1) {
        return false;
    }
    const child = children[0];
    if (child.type === "infixop") {
        if (child.role !== "implicit") {
            return false;
        }
        if (child.childNodes.some((x) => isType(x, "infixop"))) {
            return false;
        }
    }
    return true;
}
exports.isSimpleFunctionScope = isSimpleFunctionScope;
function isPrefixFunctionBoundary(node) {
    return ((isOperator(node) && !isRole(node, "division")) ||
        isType(node, "appl") ||
        isGeneralFunctionBoundary(node));
}
exports.isPrefixFunctionBoundary = isPrefixFunctionBoundary;
function isBigOpBoundary(node) {
    return isOperator(node) || isGeneralFunctionBoundary(node);
}
exports.isBigOpBoundary = isBigOpBoundary;
function isIntegralDxBoundary(firstNode, secondNode) {
    return (!!secondNode &&
        isType(secondNode, "identifier") &&
        SemanticAttr.lookupSecondary('d', firstNode.textContent));
}
exports.isIntegralDxBoundary = isIntegralDxBoundary;
function isIntegralDxBoundarySingle(node) {
    if (isType(node, "identifier")) {
        const firstChar = node.textContent[0];
        return (firstChar &&
            node.textContent[1] &&
            SemanticAttr.lookupSecondary('d', firstChar));
    }
    return false;
}
exports.isIntegralDxBoundarySingle = isIntegralDxBoundarySingle;
function isGeneralFunctionBoundary(node) {
    return isRelation(node) || isPunctuation(node);
}
exports.isGeneralFunctionBoundary = isGeneralFunctionBoundary;
function isEmbellished(node) {
    if (node.embellished) {
        return node.embellished;
    }
    if (SemanticAttr.isEmbellishedType(node.type)) {
        return node.type;
    }
    return null;
}
exports.isEmbellished = isEmbellished;
function isOperator(node) {
    return (isType(node, "operator") ||
        embellishedType(node, "operator"));
}
exports.isOperator = isOperator;
function isRelation(node) {
    return (isType(node, "relation") ||
        embellishedType(node, "relation"));
}
exports.isRelation = isRelation;
function isPunctuation(node) {
    return (isType(node, "punctuation") ||
        embellishedType(node, "punctuation"));
}
exports.isPunctuation = isPunctuation;
function isFence(node) {
    return (isType(node, "fence") ||
        embellishedType(node, "fence"));
}
exports.isFence = isFence;
function isElligibleEmbellishedFence(node) {
    if (!node || !isFence(node)) {
        return false;
    }
    if (!node.embellished) {
        return true;
    }
    return recurseBaseNode(node);
}
exports.isElligibleEmbellishedFence = isElligibleEmbellishedFence;
function bothSide(node) {
    return (isType(node, "tensor") &&
        (!isType(node.childNodes[1], "empty") ||
            !isType(node.childNodes[2], "empty")) &&
        (!isType(node.childNodes[3], "empty") ||
            !isType(node.childNodes[4], "empty")));
}
function recurseBaseNode(node) {
    if (!node.embellished) {
        return true;
    }
    if (bothSide(node)) {
        return false;
    }
    if (isRole(node, "close") && isType(node, "tensor")) {
        return false;
    }
    if (isRole(node, "open") &&
        (isType(node, "subscript") ||
            isType(node, "superscript"))) {
        return false;
    }
    return recurseBaseNode(node.childNodes[0]);
}
function isTableOrMultiline(node) {
    return (!!node &&
        (isType(node, "table") || isType(node, "multiline")));
}
exports.isTableOrMultiline = isTableOrMultiline;
function tableIsMatrixOrVector(node) {
    return (!!node && isFencedElement(node) && isTableOrMultiline(node.childNodes[0]));
}
exports.tableIsMatrixOrVector = tableIsMatrixOrVector;
function isFencedElement(node) {
    return (!!node &&
        isType(node, "fenced") &&
        (isRole(node, "leftright") || isNeutralFence(node)) &&
        node.childNodes.length === 1);
}
exports.isFencedElement = isFencedElement;
function tableIsCases(_table, prevNodes) {
    return (prevNodes.length > 0 &&
        isRole(prevNodes[prevNodes.length - 1], "openfence"));
}
exports.tableIsCases = tableIsCases;
function tableIsMultiline(table) {
    return table.childNodes.every(function (row) {
        const length = row.childNodes.length;
        return length <= 1;
    });
}
exports.tableIsMultiline = tableIsMultiline;
function lineIsLabelled(line) {
    return (isType(line, "line") &&
        line.contentNodes.length &&
        isRole(line.contentNodes[0], "label"));
}
exports.lineIsLabelled = lineIsLabelled;
function isBinomial(table) {
    return table.childNodes.length === 2;
}
exports.isBinomial = isBinomial;
function isLimitBase(node) {
    return (isType(node, "largeop") ||
        isType(node, "limboth") ||
        isType(node, "limlower") ||
        isType(node, "limupper") ||
        (isType(node, "function") &&
            isRole(node, "limit function")) ||
        ((isType(node, "overscore") ||
            isType(node, "underscore")) &&
            isLimitBase(node.childNodes[0])));
}
exports.isLimitBase = isLimitBase;
function isSimpleFunctionHead(node) {
    return (node.type === "identifier" ||
        node.role === "latinletter" ||
        node.role === "greekletter" ||
        node.role === "otherletter");
}
exports.isSimpleFunctionHead = isSimpleFunctionHead;
function singlePunctAtPosition(nodes, puncts, position) {
    return (puncts.length === 1 &&
        (nodes[position].type === "punctuation" ||
            nodes[position].embellished === "punctuation") &&
        nodes[position] === puncts[0]);
}
exports.singlePunctAtPosition = singlePunctAtPosition;
function isSimpleFunction(node) {
    return (isType(node, "identifier") &&
        isRole(node, "simple function"));
}
exports.isSimpleFunction = isSimpleFunction;
function isLeftBrace(node) {
    const leftBrace = ['{', '﹛', '｛'];
    return !!node && leftBrace.indexOf(node.textContent) !== -1;
}
exports.isLeftBrace = isLeftBrace;
function isRightBrace(node) {
    const rightBrace = ['}', '﹜', '｝'];
    return !!node && rightBrace.indexOf(node.textContent) !== -1;
}
exports.isRightBrace = isRightBrace;
function isSetNode(node) {
    return (isLeftBrace(node.contentNodes[0]) && isRightBrace(node.contentNodes[1]));
}
exports.isSetNode = isSetNode;
exports.illegalSingleton_ = [
    "punctuation",
    "punctuated",
    "relseq",
    "multirel",
    "table",
    "multiline",
    "cases",
    "inference"
];
exports.scriptedElement_ = [
    "limupper",
    "limlower",
    "limboth",
    "subscript",
    "superscript",
    "underscore",
    "overscore",
    "tensor"
];
function isSingletonSetContent(node) {
    const type = node.type;
    if (exports.illegalSingleton_.indexOf(type) !== -1 ||
        (type === "infixop" && node.role !== "implicit")) {
        return false;
    }
    if (type === "fenced") {
        return node.role === "leftright"
            ? isSingletonSetContent(node.childNodes[0])
            : true;
    }
    if (exports.scriptedElement_.indexOf(type) !== -1) {
        return isSingletonSetContent(node.childNodes[0]);
    }
    return true;
}
exports.isSingletonSetContent = isSingletonSetContent;
function isNumber(node) {
    return (node.type === "number" &&
        (node.role === "integer" || node.role === "float"));
}
exports.isNumber = isNumber;
function isUnitCounter(node) {
    return (isNumber(node) ||
        node.role === "vulgar" ||
        node.role === "mixed");
}
exports.isUnitCounter = isUnitCounter;
function isPureUnit(node) {
    const children = node.childNodes;
    return (node.role === "unit" &&
        (!children.length || children[0].role === "unit"));
}
exports.isPureUnit = isPureUnit;
function isImplicit(node) {
    return (node.role === "implicit" ||
        (node.role === "unit" &&
            !!node.contentNodes.length &&
            node.contentNodes[0].textContent === SemanticAttr.invisibleTimes()));
}
exports.isImplicit = isImplicit;
function isImplicitOp(node) {
    return (node.type === "infixop" && node.role === "implicit");
}
exports.isImplicitOp = isImplicitOp;
function isNeutralFence(fence) {
    return (fence.role === "neutral" || fence.role === "metric");
}
exports.isNeutralFence = isNeutralFence;
function compareNeutralFences(fence1, fence2) {
    return (isNeutralFence(fence1) &&
        isNeutralFence(fence2) &&
        (0, semantic_util_1.getEmbellishedInner)(fence1).textContent ===
            (0, semantic_util_1.getEmbellishedInner)(fence2).textContent);
}
exports.compareNeutralFences = compareNeutralFences;
function elligibleLeftNeutral(fence) {
    if (!isNeutralFence(fence)) {
        return false;
    }
    if (!fence.embellished) {
        return true;
    }
    if (fence.type === "superscript" ||
        fence.type === "subscript") {
        return false;
    }
    if (fence.type === "tensor" &&
        (fence.childNodes[3].type !== "empty" ||
            fence.childNodes[4].type !== "empty")) {
        return false;
    }
    return true;
}
exports.elligibleLeftNeutral = elligibleLeftNeutral;
function elligibleRightNeutral(fence) {
    if (!isNeutralFence(fence)) {
        return false;
    }
    if (!fence.embellished) {
        return true;
    }
    if (fence.type === "tensor" &&
        (fence.childNodes[1].type !== "empty" ||
            fence.childNodes[2].type !== "empty")) {
        return false;
    }
    return true;
}
exports.elligibleRightNeutral = elligibleRightNeutral;
function isMembership(element) {
    return [
        "element",
        "nonelement",
        "reelement",
        "renonelement"
    ].includes(element.role);
}
exports.isMembership = isMembership;
