"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partitionNodes = exports.sliceNodes = exports.getEmbellishedInner = exports.addAttributes = exports.isZeroLength = exports.purgeNodes = exports.isOrphanedGlyph = exports.hasDisplayTag = exports.hasEmptyTag = exports.hasIgnoreTag = exports.hasLeafTag = exports.hasMathTag = exports.directSpeechKeys = exports.DISPLAYTAGS = exports.EMPTYTAGS = exports.IGNORETAGS = exports.LEAFTAGS = void 0;
const DomUtil = require("../common/dom_util");
exports.LEAFTAGS = ['MO', 'MI', 'MN', 'MTEXT', 'MS', 'MSPACE'];
exports.IGNORETAGS = [
    'MERROR',
    'MPHANTOM',
    'MALIGNGROUP',
    'MALIGNMARK',
    'MPRESCRIPTS',
    'ANNOTATION',
    'ANNOTATION-XML'
];
exports.EMPTYTAGS = [
    'MATH',
    'MROW',
    'MPADDED',
    'MACTION',
    'NONE',
    'MSTYLE',
    'SEMANTICS'
];
exports.DISPLAYTAGS = ['MROOT', 'MSQRT'];
exports.directSpeechKeys = ['aria-label', 'exact-speech', 'alt'];
function hasMathTag(node) {
    return !!node && DomUtil.tagName(node) === 'MATH';
}
exports.hasMathTag = hasMathTag;
function hasLeafTag(node) {
    return !!node && exports.LEAFTAGS.indexOf(DomUtil.tagName(node)) !== -1;
}
exports.hasLeafTag = hasLeafTag;
function hasIgnoreTag(node) {
    return !!node && exports.IGNORETAGS.indexOf(DomUtil.tagName(node)) !== -1;
}
exports.hasIgnoreTag = hasIgnoreTag;
function hasEmptyTag(node) {
    return !!node && exports.EMPTYTAGS.indexOf(DomUtil.tagName(node)) !== -1;
}
exports.hasEmptyTag = hasEmptyTag;
function hasDisplayTag(node) {
    return !!node && exports.DISPLAYTAGS.indexOf(DomUtil.tagName(node)) !== -1;
}
exports.hasDisplayTag = hasDisplayTag;
function isOrphanedGlyph(node) {
    return (!!node &&
        DomUtil.tagName(node) === 'MGLYPH' &&
        !hasLeafTag(node.parentNode));
}
exports.isOrphanedGlyph = isOrphanedGlyph;
function purgeNodes(nodes) {
    const nodeArray = [];
    for (let i = 0, node; (node = nodes[i]); i++) {
        if (node.nodeType !== DomUtil.NodeType.ELEMENT_NODE) {
            continue;
        }
        const tagName = DomUtil.tagName(node);
        if (exports.IGNORETAGS.indexOf(tagName) !== -1) {
            continue;
        }
        if (exports.EMPTYTAGS.indexOf(tagName) !== -1 && node.childNodes.length === 0) {
            continue;
        }
        nodeArray.push(node);
    }
    return nodeArray;
}
exports.purgeNodes = purgeNodes;
function isZeroLength(length) {
    if (!length) {
        return false;
    }
    const negativeNamedSpaces = [
        'negativeveryverythinmathspace',
        'negativeverythinmathspace',
        'negativethinmathspace',
        'negativemediummathspace',
        'negativethickmathspace',
        'negativeverythickmathspace',
        'negativeveryverythickmathspace'
    ];
    if (negativeNamedSpaces.indexOf(length) !== -1) {
        return true;
    }
    const value = length.match(/[0-9.]+/);
    if (!value) {
        return false;
    }
    return parseFloat(value[0]) === 0;
}
exports.isZeroLength = isZeroLength;
function addAttributes(to, from) {
    if (from.hasAttributes()) {
        const attrs = from.attributes;
        for (let i = attrs.length - 1; i >= 0; i--) {
            const key = attrs[i].name;
            if (key.match(/^ext/)) {
                to.attributes[key] = attrs[i].value;
                to.nobreaking = true;
            }
            if (exports.directSpeechKeys.indexOf(key) !== -1) {
                to.attributes['ext-speech'] = attrs[i].value;
                to.nobreaking = true;
            }
            if (key.match(/texclass$/)) {
                to.attributes['texclass'] = attrs[i].value;
            }
            if (key === 'href') {
                to.attributes['href'] = attrs[i].value;
                to.nobreaking = true;
            }
        }
    }
}
exports.addAttributes = addAttributes;
function getEmbellishedInner(node) {
    if (node && node.embellished && node.childNodes.length > 0) {
        return getEmbellishedInner(node.childNodes[0]);
    }
    return node;
}
exports.getEmbellishedInner = getEmbellishedInner;
function sliceNodes(nodes, pred, opt_reverse) {
    if (opt_reverse) {
        nodes.reverse();
    }
    const head = [];
    for (let i = 0, node; (node = nodes[i]); i++) {
        if (pred(node)) {
            if (opt_reverse) {
                return {
                    head: nodes.slice(i + 1).reverse(),
                    div: node,
                    tail: head.reverse()
                };
            }
            return { head: head, div: node, tail: nodes.slice(i + 1) };
        }
        head.push(node);
    }
    if (opt_reverse) {
        return { head: [], div: null, tail: head.reverse() };
    }
    return { head: head, div: null, tail: [] };
}
exports.sliceNodes = sliceNodes;
function partitionNodes(nodes, pred) {
    let restNodes = nodes;
    const rel = [];
    const comp = [];
    let result = null;
    do {
        result = sliceNodes(restNodes, pred);
        comp.push(result.head);
        rel.push(result.div);
        restNodes = result.tail;
    } while (result.div);
    rel.pop();
    return { rel: rel, comp: comp };
}
exports.partitionNodes = partitionNodes;
