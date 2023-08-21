"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smallRoot = exports.generateTensorRules = exports.removeParens = exports.generateBaselineConstraint = exports.determinantIsSimple = exports.nestedOverscript = exports.endscripts = exports.overscoreNestingDepth = exports.nestedUnderscript = exports.underscoreNestingDepth = exports.indexRadicalSbrief = exports.openingRadicalSbrief = exports.indexRadicalBrief = exports.closingRadicalBrief = exports.openingRadicalBrief = exports.indexRadicalVerbose = exports.closingRadicalVerbose = exports.openingRadicalVerbose = exports.getRootIndex = exports.nestedRadical = exports.radicalNestingDepth = exports.baselineBrief = exports.baselineVerbose = exports.superscriptBrief = exports.superscriptVerbose = exports.subscriptBrief = exports.subscriptVerbose = exports.nestedSubSuper = exports.isSmallVulgarFraction = exports.overFractionSbrief = exports.closingFractionSbrief = exports.openingFractionSbrief = exports.closingFractionBrief = exports.openingFractionBrief = exports.overFractionVerbose = exports.closingFractionVerbose = exports.openingFractionVerbose = exports.nestedFraction = exports.fractionNestingDepth = exports.computeNestingDepth_ = exports.containsAttr = exports.getNestingDepth = exports.resetNestingDepth = exports.nestingBarriers = exports.spaceoutIdentifier = exports.spaceoutNumber = exports.spaceoutNodes = exports.spaceoutText = void 0;
const BaseUtil = require("../common/base_util");
const DomUtil = require("../common/dom_util");
const XpathUtil = require("../common/xpath_util");
const locale_1 = require("../l10n/locale");
const semantic_processor_1 = require("../semantic_tree/semantic_processor");
let nestingDepth = {};
function spaceoutText(node) {
    return Array.from(node.textContent).join(' ');
}
exports.spaceoutText = spaceoutText;
function spaceoutNodes(node, correction) {
    const content = Array.from(node.textContent);
    const result = [];
    const processor = semantic_processor_1.default.getInstance();
    const doc = node.ownerDocument;
    for (let i = 0, chr; (chr = content[i]); i++) {
        const leaf = processor
            .getNodeFactory()
            .makeLeafNode(chr, "unknown");
        const sn = processor.identifierNode(leaf, "unknown", '');
        correction(sn);
        result.push(sn.xml(doc));
    }
    return result;
}
exports.spaceoutNodes = spaceoutNodes;
function spaceoutNumber(node) {
    return spaceoutNodes(node, function (sn) {
        if (!sn.textContent.match(/\W/)) {
            sn.type = "number";
        }
    });
}
exports.spaceoutNumber = spaceoutNumber;
function spaceoutIdentifier(node) {
    return spaceoutNodes(node, function (sn) {
        sn.font = "unknown";
        sn.type = "identifier";
    });
}
exports.spaceoutIdentifier = spaceoutIdentifier;
exports.nestingBarriers = [
    "cases",
    "cell",
    "integral",
    "line",
    "matrix",
    "multiline",
    "overscore",
    "root",
    "row",
    "sqrt",
    "subscript",
    "superscript",
    "table",
    "underscore",
    "vector"
];
function resetNestingDepth(node) {
    nestingDepth = {};
    return [node];
}
exports.resetNestingDepth = resetNestingDepth;
function getNestingDepth(type, node, tags, opt_barrierTags, opt_barrierAttrs, opt_func) {
    opt_barrierTags = opt_barrierTags || exports.nestingBarriers;
    opt_barrierAttrs = opt_barrierAttrs || {};
    opt_func =
        opt_func ||
            function (_node) {
                return false;
            };
    const xmlText = DomUtil.serializeXml(node);
    if (!nestingDepth[type]) {
        nestingDepth[type] = {};
    }
    if (nestingDepth[type][xmlText]) {
        return nestingDepth[type][xmlText];
    }
    if (opt_func(node) || tags.indexOf(node.tagName) < 0) {
        return 0;
    }
    const depth = computeNestingDepth_(node, tags, BaseUtil.setdifference(opt_barrierTags, tags), opt_barrierAttrs, opt_func, 0);
    nestingDepth[type][xmlText] = depth;
    return depth;
}
exports.getNestingDepth = getNestingDepth;
function containsAttr(node, attrs) {
    if (!node.attributes) {
        return false;
    }
    const attributes = DomUtil.toArray(node.attributes);
    for (let i = 0, attr; (attr = attributes[i]); i++) {
        if (attrs[attr.nodeName] === attr.nodeValue) {
            return true;
        }
    }
    return false;
}
exports.containsAttr = containsAttr;
function computeNestingDepth_(node, tags, barriers, attrs, func, depth) {
    if (func(node) ||
        barriers.indexOf(node.tagName) > -1 ||
        containsAttr(node, attrs)) {
        return depth;
    }
    if (tags.indexOf(node.tagName) > -1) {
        depth++;
    }
    if (!node.childNodes || node.childNodes.length === 0) {
        return depth;
    }
    const children = DomUtil.toArray(node.childNodes);
    return Math.max.apply(null, children.map(function (subNode) {
        return computeNestingDepth_(subNode, tags, barriers, attrs, func, depth);
    }));
}
exports.computeNestingDepth_ = computeNestingDepth_;
function fractionNestingDepth(node) {
    return getNestingDepth('fraction', node, ['fraction'], exports.nestingBarriers, {}, locale_1.LOCALE.FUNCTIONS.fracNestDepth);
}
exports.fractionNestingDepth = fractionNestingDepth;
function nestedFraction(node, expr, opt_end) {
    const depth = fractionNestingDepth(node);
    const annotation = Array(depth).fill(expr);
    if (opt_end) {
        annotation.push(opt_end);
    }
    return annotation.join(locale_1.LOCALE.MESSAGES.regexp.JOINER_FRAC);
}
exports.nestedFraction = nestedFraction;
function openingFractionVerbose(node) {
    return nestedFraction(node, locale_1.LOCALE.MESSAGES.MS.START, locale_1.LOCALE.MESSAGES.MS.FRAC_V);
}
exports.openingFractionVerbose = openingFractionVerbose;
function closingFractionVerbose(node) {
    return nestedFraction(node, locale_1.LOCALE.MESSAGES.MS.END, locale_1.LOCALE.MESSAGES.MS.FRAC_V);
}
exports.closingFractionVerbose = closingFractionVerbose;
function overFractionVerbose(node) {
    return nestedFraction(node, locale_1.LOCALE.MESSAGES.MS.FRAC_OVER);
}
exports.overFractionVerbose = overFractionVerbose;
function openingFractionBrief(node) {
    return nestedFraction(node, locale_1.LOCALE.MESSAGES.MS.START, locale_1.LOCALE.MESSAGES.MS.FRAC_B);
}
exports.openingFractionBrief = openingFractionBrief;
function closingFractionBrief(node) {
    return nestedFraction(node, locale_1.LOCALE.MESSAGES.MS.END, locale_1.LOCALE.MESSAGES.MS.FRAC_B);
}
exports.closingFractionBrief = closingFractionBrief;
function openingFractionSbrief(node) {
    const depth = fractionNestingDepth(node);
    if (depth === 1) {
        return locale_1.LOCALE.MESSAGES.MS.FRAC_S;
    }
    return locale_1.LOCALE.FUNCTIONS.combineNestedFraction(locale_1.LOCALE.MESSAGES.MS.NEST_FRAC, locale_1.LOCALE.FUNCTIONS.radicalNestDepth(depth - 1), locale_1.LOCALE.MESSAGES.MS.FRAC_S);
}
exports.openingFractionSbrief = openingFractionSbrief;
function closingFractionSbrief(node) {
    const depth = fractionNestingDepth(node);
    if (depth === 1) {
        return locale_1.LOCALE.MESSAGES.MS.ENDFRAC;
    }
    return locale_1.LOCALE.FUNCTIONS.combineNestedFraction(locale_1.LOCALE.MESSAGES.MS.NEST_FRAC, locale_1.LOCALE.FUNCTIONS.radicalNestDepth(depth - 1), locale_1.LOCALE.MESSAGES.MS.ENDFRAC);
}
exports.closingFractionSbrief = closingFractionSbrief;
function overFractionSbrief(node) {
    const depth = fractionNestingDepth(node);
    if (depth === 1) {
        return locale_1.LOCALE.MESSAGES.MS.FRAC_OVER;
    }
    return locale_1.LOCALE.FUNCTIONS.combineNestedFraction(locale_1.LOCALE.MESSAGES.MS.NEST_FRAC, locale_1.LOCALE.FUNCTIONS.radicalNestDepth(depth - 1), locale_1.LOCALE.MESSAGES.MS.FRAC_OVER);
}
exports.overFractionSbrief = overFractionSbrief;
function isSmallVulgarFraction(node) {
    return locale_1.LOCALE.FUNCTIONS.fracNestDepth(node) ? [node] : [];
}
exports.isSmallVulgarFraction = isSmallVulgarFraction;
function nestedSubSuper(node, init, replace) {
    while (node.parentNode) {
        const children = node.parentNode;
        const parent = children.parentNode;
        if (!parent) {
            break;
        }
        const nodeRole = node.getAttribute && node.getAttribute('role');
        if ((parent.tagName === "subscript" &&
            node === children.childNodes[1]) ||
            (parent.tagName === "tensor" &&
                nodeRole &&
                (nodeRole === "leftsub" ||
                    nodeRole === "rightsub"))) {
            init = replace.sub + locale_1.LOCALE.MESSAGES.regexp.JOINER_SUBSUPER + init;
        }
        if ((parent.tagName === "superscript" &&
            node === children.childNodes[1]) ||
            (parent.tagName === "tensor" &&
                nodeRole &&
                (nodeRole === "leftsuper" ||
                    nodeRole === "rightsuper"))) {
            init = replace.sup + locale_1.LOCALE.MESSAGES.regexp.JOINER_SUBSUPER + init;
        }
        node = parent;
    }
    return init.trim();
}
exports.nestedSubSuper = nestedSubSuper;
function subscriptVerbose(node) {
    return nestedSubSuper(node, locale_1.LOCALE.MESSAGES.MS.SUBSCRIPT, {
        sup: locale_1.LOCALE.MESSAGES.MS.SUPER,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
}
exports.subscriptVerbose = subscriptVerbose;
function subscriptBrief(node) {
    return nestedSubSuper(node, locale_1.LOCALE.MESSAGES.MS.SUB, {
        sup: locale_1.LOCALE.MESSAGES.MS.SUP,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
}
exports.subscriptBrief = subscriptBrief;
function superscriptVerbose(node) {
    return nestedSubSuper(node, locale_1.LOCALE.MESSAGES.MS.SUPERSCRIPT, {
        sup: locale_1.LOCALE.MESSAGES.MS.SUPER,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
}
exports.superscriptVerbose = superscriptVerbose;
function superscriptBrief(node) {
    return nestedSubSuper(node, locale_1.LOCALE.MESSAGES.MS.SUP, {
        sup: locale_1.LOCALE.MESSAGES.MS.SUP,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
}
exports.superscriptBrief = superscriptBrief;
function baselineVerbose(node) {
    const baseline = nestedSubSuper(node, '', {
        sup: locale_1.LOCALE.MESSAGES.MS.SUPER,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
    if (!baseline) {
        return locale_1.LOCALE.MESSAGES.MS.BASELINE;
    }
    return baseline
        .replace(new RegExp(locale_1.LOCALE.MESSAGES.MS.SUB + '$'), locale_1.LOCALE.MESSAGES.MS.SUBSCRIPT)
        .replace(new RegExp(locale_1.LOCALE.MESSAGES.MS.SUPER + '$'), locale_1.LOCALE.MESSAGES.MS.SUPERSCRIPT);
}
exports.baselineVerbose = baselineVerbose;
function baselineBrief(node) {
    const baseline = nestedSubSuper(node, '', {
        sup: locale_1.LOCALE.MESSAGES.MS.SUP,
        sub: locale_1.LOCALE.MESSAGES.MS.SUB
    });
    return baseline || locale_1.LOCALE.MESSAGES.MS.BASE;
}
exports.baselineBrief = baselineBrief;
function radicalNestingDepth(node) {
    return getNestingDepth('radical', node, ['sqrt', 'root'], exports.nestingBarriers, {});
}
exports.radicalNestingDepth = radicalNestingDepth;
function nestedRadical(node, prefix, postfix) {
    const depth = radicalNestingDepth(node);
    const index = getRootIndex(node);
    postfix = index ? locale_1.LOCALE.FUNCTIONS.combineRootIndex(postfix, index) : postfix;
    if (depth === 1) {
        return postfix;
    }
    return locale_1.LOCALE.FUNCTIONS.combineNestedRadical(prefix, locale_1.LOCALE.FUNCTIONS.radicalNestDepth(depth - 1), postfix);
}
exports.nestedRadical = nestedRadical;
function getRootIndex(node) {
    const content = node.tagName === 'sqrt'
        ? '2'
        :
            XpathUtil.evalXPath('children/*[1]', node)[0].textContent.trim();
    return locale_1.LOCALE.MESSAGES.MSroots[content] || '';
}
exports.getRootIndex = getRootIndex;
function openingRadicalVerbose(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NESTED, locale_1.LOCALE.MESSAGES.MS.STARTROOT);
}
exports.openingRadicalVerbose = openingRadicalVerbose;
function closingRadicalVerbose(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NESTED, locale_1.LOCALE.MESSAGES.MS.ENDROOT);
}
exports.closingRadicalVerbose = closingRadicalVerbose;
function indexRadicalVerbose(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NESTED, locale_1.LOCALE.MESSAGES.MS.ROOTINDEX);
}
exports.indexRadicalVerbose = indexRadicalVerbose;
function openingRadicalBrief(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NEST_ROOT, locale_1.LOCALE.MESSAGES.MS.STARTROOT);
}
exports.openingRadicalBrief = openingRadicalBrief;
function closingRadicalBrief(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NEST_ROOT, locale_1.LOCALE.MESSAGES.MS.ENDROOT);
}
exports.closingRadicalBrief = closingRadicalBrief;
function indexRadicalBrief(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NEST_ROOT, locale_1.LOCALE.MESSAGES.MS.ROOTINDEX);
}
exports.indexRadicalBrief = indexRadicalBrief;
function openingRadicalSbrief(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NEST_ROOT, locale_1.LOCALE.MESSAGES.MS.ROOT);
}
exports.openingRadicalSbrief = openingRadicalSbrief;
function indexRadicalSbrief(node) {
    return nestedRadical(node, locale_1.LOCALE.MESSAGES.MS.NEST_ROOT, locale_1.LOCALE.MESSAGES.MS.INDEX);
}
exports.indexRadicalSbrief = indexRadicalSbrief;
function underscoreNestingDepth(node) {
    return getNestingDepth('underscore', node, ['underscore'], exports.nestingBarriers, {}, function (node) {
        return (node.tagName &&
            node.tagName === "underscore" &&
            node.childNodes[0].childNodes[1].getAttribute('role') ===
                "underaccent");
    });
}
exports.underscoreNestingDepth = underscoreNestingDepth;
function nestedUnderscript(node) {
    const depth = underscoreNestingDepth(node);
    return (Array(depth).join(locale_1.LOCALE.MESSAGES.MS.UNDER) + locale_1.LOCALE.MESSAGES.MS.UNDERSCRIPT);
}
exports.nestedUnderscript = nestedUnderscript;
function overscoreNestingDepth(node) {
    return getNestingDepth('overscore', node, ['overscore'], exports.nestingBarriers, {}, function (node) {
        return (node.tagName &&
            node.tagName === "overscore" &&
            node.childNodes[0].childNodes[1].getAttribute('role') ===
                "overaccent");
    });
}
exports.overscoreNestingDepth = overscoreNestingDepth;
function endscripts(_node) {
    return locale_1.LOCALE.MESSAGES.MS.ENDSCRIPTS;
}
exports.endscripts = endscripts;
function nestedOverscript(node) {
    const depth = overscoreNestingDepth(node);
    return (Array(depth).join(locale_1.LOCALE.MESSAGES.MS.OVER) + locale_1.LOCALE.MESSAGES.MS.OVERSCRIPT);
}
exports.nestedOverscript = nestedOverscript;
function determinantIsSimple(node) {
    if (node.tagName !== "matrix" ||
        node.getAttribute('role') !== "determinant") {
        return [];
    }
    const cells = XpathUtil.evalXPath('children/row/children/cell/children/*', node);
    for (let i = 0, cell; (cell = cells[i]); i++) {
        if (cell.tagName === "number") {
            continue;
        }
        if (cell.tagName === "identifier") {
            const role = cell.getAttribute('role');
            if (role === "latinletter" ||
                role === "greekletter" ||
                role === "otherletter") {
                continue;
            }
        }
        return [];
    }
    return [node];
}
exports.determinantIsSimple = determinantIsSimple;
function generateBaselineConstraint() {
    const ignoreElems = ['subscript', 'superscript', 'tensor'];
    const mainElems = ['relseq', 'multrel'];
    const breakElems = ['fraction', 'punctuation', 'fenced', 'sqrt', 'root'];
    const ancestrify = (elemList) => elemList.map((elem) => 'ancestor::' + elem);
    const notify = (elem) => 'not(' + elem + ')';
    const prefix = 'ancestor::*/following-sibling::*';
    const middle = notify(ancestrify(ignoreElems).join(' or '));
    const mainList = ancestrify(mainElems);
    const breakList = ancestrify(breakElems);
    let breakCstrs = [];
    for (let i = 0, brk; (brk = breakList[i]); i++) {
        breakCstrs = breakCstrs.concat(mainList.map(function (elem) {
            return brk + '/' + elem;
        }));
    }
    const postfix = notify(breakCstrs.join(' | '));
    return [[prefix, middle, postfix].join(' and ')];
}
exports.generateBaselineConstraint = generateBaselineConstraint;
function removeParens(node) {
    if (!node.childNodes.length ||
        !node.childNodes[0].childNodes.length ||
        !node.childNodes[0].childNodes[0].childNodes.length) {
        return '';
    }
    const content = node.childNodes[0].childNodes[0].childNodes[0].textContent;
    return content.match(/^\(.+\)$/) ? content.slice(1, -1) : content;
}
exports.removeParens = removeParens;
const componentString = new Map([
    [3, 'CSFleftsuperscript'],
    [4, 'CSFleftsubscript'],
    [2, 'CSFbaseline'],
    [1, 'CSFrightsubscript'],
    [0, 'CSFrightsuperscript']
]);
const childNumber = new Map([
    [4, 2],
    [3, 3],
    [2, 1],
    [1, 4],
    [0, 5]
]);
function generateTensorRuleStrings_(constellation) {
    const constraints = [];
    let verbString = '';
    let briefString = '';
    let constel = parseInt(constellation, 2);
    for (let i = 0; i < 5; i++) {
        const childString = 'children/*[' + childNumber.get(i) + ']';
        if (constel & 1) {
            const compString = componentString.get(i % 5);
            verbString =
                '[t] ' + compString + 'Verbose; [n] ' + childString + ';' + verbString;
            briefString =
                '[t] ' + compString + 'Brief; [n] ' + childString + ';' + briefString;
        }
        else {
            constraints.unshift('name(' + childString + ')="empty"');
        }
        constel >>= 1;
    }
    return [constraints, verbString, briefString];
}
function generateTensorRules(store, brief = true) {
    const constellations = [
        '11111',
        '11110',
        '11101',
        '11100',
        '10111',
        '10110',
        '10101',
        '10100',
        '01111',
        '01110',
        '01101',
        '01100'
    ];
    for (let i = 0, constel; (constel = constellations[i]); i++) {
        let name = 'tensor' + constel;
        let [components, verbStr, briefStr] = generateTensorRuleStrings_(constel);
        store.defineRule(name, 'default', verbStr, 'self::tensor', ...components);
        if (brief) {
            store.defineRule(name, 'brief', briefStr, 'self::tensor', ...components);
            store.defineRule(name, 'sbrief', briefStr, 'self::tensor', ...components);
        }
        const baselineStr = componentString.get(2);
        verbStr += '; [t]' + baselineStr + 'Verbose';
        briefStr += '; [t]' + baselineStr + 'Brief';
        name = name + '-baseline';
        const cstr = '((.//*[not(*)])[last()]/@id)!=(((.//ancestor::fraction|' +
            'ancestor::root|ancestor::sqrt|ancestor::cell|ancestor::line|' +
            'ancestor::stree)[1]//*[not(*)])[last()]/@id)';
        store.defineRule(name, 'default', verbStr, 'self::tensor', cstr, ...components);
        if (brief) {
            store.defineRule(name, 'brief', briefStr, 'self::tensor', cstr, ...components);
            store.defineRule(name, 'sbrief', briefStr, 'self::tensor', cstr, ...components);
        }
    }
}
exports.generateTensorRules = generateTensorRules;
function smallRoot(node) {
    let max = Object.keys(locale_1.LOCALE.MESSAGES.MSroots).length;
    if (!max) {
        return [];
    }
    else {
        max++;
    }
    if (!node.childNodes ||
        node.childNodes.length === 0 ||
        !node.childNodes[0].childNodes) {
        return [];
    }
    const index = node.childNodes[0].childNodes[0].textContent;
    if (!/^\d+$/.test(index)) {
        return [];
    }
    const num = parseInt(index, 10);
    return num > 1 && num <= max ? [node] : [];
}
exports.smallRoot = smallRoot;
