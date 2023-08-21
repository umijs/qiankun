"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printNodeList__ = exports.collapsePunctuated = exports.getInnerNode = exports.setOperatorAttribute_ = exports.createInvisibleOperator_ = exports.rewriteMfenced = exports.cloneContentNode = exports.addCollapsedAttribute = exports.parentNode_ = exports.isIgnorable_ = exports.unitChild_ = exports.descendNode_ = exports.ascendNewNode = exports.validLca_ = exports.pathToRoot_ = exports.attachedElement_ = exports.prunePath_ = exports.mathmlLca_ = exports.lcaType = exports.functionApplication_ = exports.isDescendant_ = exports.insertNewChild_ = exports.mergeChildren_ = exports.collectChildNodes_ = exports.collateChildNodes_ = exports.childrenSubset_ = exports.moveSemanticAttributes_ = exports.introduceLayerAboveLca = exports.introduceNewLayer = exports.walkTree = exports.enrich = exports.SETTINGS = void 0;
const debugger_1 = require("../common/debugger");
const DomUtil = require("../common/dom_util");
const engine_1 = require("../common/engine");
const SemanticAttr = require("../semantic_tree/semantic_attr");
const SemanticHeuristics = require("../semantic_tree/semantic_heuristic_factory");
const semantic_skeleton_1 = require("../semantic_tree/semantic_skeleton");
const SemanticUtil = require("../semantic_tree/semantic_util");
const EnrichAttr = require("./enrich_attr");
const enrich_case_1 = require("./enrich_case");
exports.SETTINGS = {
    collapsed: true,
    implicit: true,
    wiki: true
};
function enrich(mml, semantic) {
    const oldMml = DomUtil.cloneNode(mml);
    walkTree(semantic.root);
    if (engine_1.default.getInstance().structure) {
        mml.setAttribute(EnrichAttr.Attribute.STRUCTURE, semantic_skeleton_1.SemanticSkeleton.fromStructure(mml, semantic).toString());
    }
    debugger_1.Debugger.getInstance().generateOutput(() => [
        formattedOutput(oldMml, 'Original MathML', exports.SETTINGS.wiki),
        formattedOutput(semantic, 'Semantic Tree', exports.SETTINGS.wiki),
        formattedOutput(mml, 'Semantically enriched MathML', exports.SETTINGS.wiki)
    ]);
    return mml;
}
exports.enrich = enrich;
function walkTree(semantic) {
    const specialCase = (0, enrich_case_1.getCase)(semantic);
    let newNode;
    if (specialCase) {
        newNode = specialCase.getMathml();
        return ascendNewNode(newNode);
    }
    if (semantic.mathml.length === 1) {
        debugger_1.Debugger.getInstance().output('Walktree Case 0');
        newNode = semantic.mathml[0];
        EnrichAttr.setAttributes(newNode, semantic);
        if (semantic.childNodes.length) {
            debugger_1.Debugger.getInstance().output('Walktree Case 0.1');
            semantic.childNodes.forEach(function (child) {
                if (child.type === "empty") {
                    newNode.appendChild(walkTree(child));
                }
            });
        }
        return ascendNewNode(newNode);
    }
    const newContent = semantic.contentNodes.map(cloneContentNode);
    setOperatorAttribute_(semantic, newContent);
    const newChildren = semantic.childNodes.map(walkTree);
    const childrenList = semantic_skeleton_1.SemanticSkeleton.combineContentChildren(semantic, newContent, newChildren);
    newNode = semantic.mathmlTree;
    if (newNode === null) {
        debugger_1.Debugger.getInstance().output('Walktree Case 1');
        newNode = introduceNewLayer(childrenList, semantic);
    }
    else {
        const attached = attachedElement_(childrenList);
        debugger_1.Debugger.getInstance().output('Walktree Case 2');
        if (attached) {
            debugger_1.Debugger.getInstance().output('Walktree Case 2.1');
            newNode = attached.parentNode;
        }
        else {
            debugger_1.Debugger.getInstance().output('Walktree Case 2.2');
            newNode = getInnerNode(newNode);
        }
    }
    newNode = rewriteMfenced(newNode);
    mergeChildren_(newNode, childrenList, semantic);
    EnrichAttr.setAttributes(newNode, semantic);
    return ascendNewNode(newNode);
}
exports.walkTree = walkTree;
function introduceNewLayer(children, semantic) {
    const lca = mathmlLca_(children);
    let newNode = lca.node;
    const info = lca.type;
    if (info !== lcaType.VALID || !SemanticUtil.hasEmptyTag(newNode)) {
        debugger_1.Debugger.getInstance().output('Walktree Case 1.1');
        newNode = DomUtil.createElement('mrow');
        if (info === lcaType.PRUNED) {
            debugger_1.Debugger.getInstance().output('Walktree Case 1.1.0');
            newNode = introduceLayerAboveLca(newNode, lca.node, children);
        }
        else if (children[0]) {
            debugger_1.Debugger.getInstance().output('Walktree Case 1.1.1');
            const node = attachedElement_(children);
            const oldChildren = childrenSubset_(node.parentNode, children);
            DomUtil.replaceNode(node, newNode);
            oldChildren.forEach(function (x) {
                newNode.appendChild(x);
            });
        }
    }
    if (!semantic.mathmlTree) {
        semantic.mathmlTree = newNode;
    }
    return newNode;
}
exports.introduceNewLayer = introduceNewLayer;
function introduceLayerAboveLca(mrow, lca, children) {
    let innerNode = descendNode_(lca);
    if (SemanticUtil.hasMathTag(innerNode)) {
        debugger_1.Debugger.getInstance().output('Walktree Case 1.1.0.0');
        moveSemanticAttributes_(innerNode, mrow);
        DomUtil.toArray(innerNode.childNodes).forEach(function (x) {
            mrow.appendChild(x);
        });
        const auxNode = mrow;
        mrow = innerNode;
        innerNode = auxNode;
    }
    const index = children.indexOf(lca);
    children[index] = innerNode;
    DomUtil.replaceNode(innerNode, mrow);
    mrow.appendChild(innerNode);
    children.forEach(function (x) {
        mrow.appendChild(x);
    });
    return mrow;
}
exports.introduceLayerAboveLca = introduceLayerAboveLca;
function moveSemanticAttributes_(oldNode, newNode) {
    for (const attr of EnrichAttr.EnrichAttributes) {
        if (oldNode.hasAttribute(attr)) {
            newNode.setAttribute(attr, oldNode.getAttribute(attr));
            oldNode.removeAttribute(attr);
        }
    }
}
exports.moveSemanticAttributes_ = moveSemanticAttributes_;
function childrenSubset_(node, newChildren) {
    const oldChildren = DomUtil.toArray(node.childNodes);
    let leftIndex = +Infinity;
    let rightIndex = -Infinity;
    newChildren.forEach(function (child) {
        const index = oldChildren.indexOf(child);
        if (index !== -1) {
            leftIndex = Math.min(leftIndex, index);
            rightIndex = Math.max(rightIndex, index);
        }
    });
    return oldChildren.slice(leftIndex, rightIndex + 1);
}
exports.childrenSubset_ = childrenSubset_;
function collateChildNodes_(node, children, semantic) {
    const oldChildren = [];
    let newChildren = DomUtil.toArray(node.childNodes);
    let notFirst = false;
    while (newChildren.length) {
        const child = newChildren.shift();
        if (child.hasAttribute(EnrichAttr.Attribute.TYPE)) {
            oldChildren.push(child);
            continue;
        }
        const collect = collectChildNodes_(child);
        if (collect.length === 0) {
            continue;
        }
        if (collect.length === 1) {
            oldChildren.push(child);
            continue;
        }
        if (notFirst) {
            child.setAttribute('AuxiliaryImplicit', true);
        }
        else {
            notFirst = true;
        }
        newChildren = collect.concat(newChildren);
    }
    const rear = [];
    const semChildren = semantic.childNodes.map(function (x) {
        return x.mathmlTree;
    });
    while (semChildren.length) {
        const schild = semChildren.pop();
        if (!schild) {
            continue;
        }
        if (oldChildren.indexOf(schild) !== -1) {
            break;
        }
        if (children.indexOf(schild) !== -1) {
            rear.unshift(schild);
        }
    }
    return oldChildren.concat(rear);
}
exports.collateChildNodes_ = collateChildNodes_;
function collectChildNodes_(node) {
    const collect = [];
    let newChildren = DomUtil.toArray(node.childNodes);
    while (newChildren.length) {
        const child = newChildren.shift();
        if (child.nodeType !== DomUtil.NodeType.ELEMENT_NODE) {
            continue;
        }
        if (child.hasAttribute(EnrichAttr.Attribute.TYPE)) {
            collect.push(child);
            continue;
        }
        newChildren = DomUtil.toArray(child.childNodes).concat(newChildren);
    }
    return collect;
}
exports.collectChildNodes_ = collectChildNodes_;
function mergeChildren_(node, newChildren, semantic) {
    const oldChildren = semantic.role === "implicit" &&
        SemanticHeuristics.flags.combine_juxtaposition
        ? collateChildNodes_(node, newChildren, semantic)
        : DomUtil.toArray(node.childNodes);
    if (!oldChildren.length) {
        newChildren.forEach(function (x) {
            node.appendChild(x);
        });
        return;
    }
    let oldCounter = 0;
    while (newChildren.length) {
        const newChild = newChildren[0];
        if (oldChildren[oldCounter] === newChild ||
            functionApplication_(oldChildren[oldCounter], newChild)) {
            newChildren.shift();
            oldCounter++;
            continue;
        }
        if (oldChildren[oldCounter] &&
            newChildren.indexOf(oldChildren[oldCounter]) === -1) {
            oldCounter++;
            continue;
        }
        if (isDescendant_(newChild, node)) {
            newChildren.shift();
            continue;
        }
        insertNewChild_(node, oldChildren[oldCounter], newChild);
        newChildren.shift();
    }
}
exports.mergeChildren_ = mergeChildren_;
function insertNewChild_(node, oldChild, newChild) {
    if (!oldChild) {
        node.insertBefore(newChild, null);
        return;
    }
    let parent = oldChild;
    let next = parentNode_(parent);
    while (next &&
        next.firstChild === parent &&
        !parent.hasAttribute('AuxiliaryImplicit') &&
        next !== node) {
        parent = next;
        next = parentNode_(parent);
    }
    if (next) {
        next.insertBefore(newChild, parent);
        parent.removeAttribute('AuxiliaryImplicit');
    }
}
exports.insertNewChild_ = insertNewChild_;
function isDescendant_(child, node) {
    if (!child) {
        return false;
    }
    do {
        child = child.parentNode;
        if (child === node) {
            return true;
        }
    } while (child);
    return false;
}
exports.isDescendant_ = isDescendant_;
function functionApplication_(oldNode, newNode) {
    const appl = SemanticAttr.functionApplication();
    if (oldNode &&
        newNode &&
        oldNode.textContent &&
        newNode.textContent &&
        oldNode.textContent === appl &&
        newNode.textContent === appl &&
        newNode.getAttribute(EnrichAttr.Attribute.ADDED) === 'true') {
        for (let i = 0, attr; (attr = oldNode.attributes[i]); i++) {
            if (!newNode.hasAttribute(attr.nodeName)) {
                newNode.setAttribute(attr.nodeName, attr.nodeValue);
            }
        }
        DomUtil.replaceNode(oldNode, newNode);
        return true;
    }
    return false;
}
exports.functionApplication_ = functionApplication_;
var lcaType;
(function (lcaType) {
    lcaType["VALID"] = "valid";
    lcaType["INVALID"] = "invalid";
    lcaType["PRUNED"] = "pruned";
})(lcaType = exports.lcaType || (exports.lcaType = {}));
function mathmlLca_(children) {
    const leftMost = attachedElement_(children);
    if (!leftMost) {
        return { type: lcaType.INVALID, node: null };
    }
    const rightMost = attachedElement_(children.slice().reverse());
    if (leftMost === rightMost) {
        return { type: lcaType.VALID, node: leftMost };
    }
    const leftPath = pathToRoot_(leftMost);
    const newLeftPath = prunePath_(leftPath, children);
    const rightPath = pathToRoot_(rightMost, function (x) {
        return newLeftPath.indexOf(x) !== -1;
    });
    const lca = rightPath[0];
    const lIndex = newLeftPath.indexOf(lca);
    if (lIndex === -1) {
        return { type: lcaType.INVALID, node: null };
    }
    return {
        type: newLeftPath.length !== leftPath.length
            ? lcaType.PRUNED
            : validLca_(newLeftPath[lIndex + 1], rightPath[1])
                ? lcaType.VALID
                : lcaType.INVALID,
        node: lca
    };
}
exports.mathmlLca_ = mathmlLca_;
function prunePath_(path, children) {
    let i = 0;
    while (path[i] && children.indexOf(path[i]) === -1) {
        i++;
    }
    return path.slice(0, i + 1);
}
exports.prunePath_ = prunePath_;
function attachedElement_(nodes) {
    let count = 0;
    let attached = null;
    while (!attached && count < nodes.length) {
        if (nodes[count].parentNode) {
            attached = nodes[count];
        }
        count++;
    }
    return attached;
}
exports.attachedElement_ = attachedElement_;
function pathToRoot_(node, opt_test) {
    const test = opt_test || ((_x) => false);
    const path = [node];
    while (!test(node) && !SemanticUtil.hasMathTag(node) && node.parentNode) {
        node = parentNode_(node);
        path.unshift(node);
    }
    return path;
}
exports.pathToRoot_ = pathToRoot_;
function validLca_(left, right) {
    return !!(left && right && !left.previousSibling && !right.nextSibling);
}
exports.validLca_ = validLca_;
function ascendNewNode(newNode) {
    while (!SemanticUtil.hasMathTag(newNode) && unitChild_(newNode)) {
        newNode = parentNode_(newNode);
    }
    return newNode;
}
exports.ascendNewNode = ascendNewNode;
function descendNode_(node) {
    const children = DomUtil.toArray(node.childNodes);
    if (!children) {
        return node;
    }
    const remainder = children.filter(function (child) {
        return (child.nodeType === DomUtil.NodeType.ELEMENT_NODE &&
            !SemanticUtil.hasIgnoreTag(child));
    });
    if (remainder.length === 1 &&
        SemanticUtil.hasEmptyTag(remainder[0]) &&
        !remainder[0].hasAttribute(EnrichAttr.Attribute.TYPE)) {
        return descendNode_(remainder[0]);
    }
    return node;
}
exports.descendNode_ = descendNode_;
function unitChild_(node) {
    const parent = parentNode_(node);
    if (!parent || !SemanticUtil.hasEmptyTag(parent)) {
        return false;
    }
    return DomUtil.toArray(parent.childNodes).every(function (child) {
        return child === node || isIgnorable_(child);
    });
}
exports.unitChild_ = unitChild_;
function isIgnorable_(node) {
    if (node.nodeType !== DomUtil.NodeType.ELEMENT_NODE) {
        return true;
    }
    if (!node || SemanticUtil.hasIgnoreTag(node)) {
        return true;
    }
    const children = DomUtil.toArray(node.childNodes);
    if ((!SemanticUtil.hasEmptyTag(node) && children.length) ||
        SemanticUtil.hasDisplayTag(node) ||
        node.hasAttribute(EnrichAttr.Attribute.TYPE) ||
        SemanticUtil.isOrphanedGlyph(node)) {
        return false;
    }
    return DomUtil.toArray(node.childNodes).every(isIgnorable_);
}
exports.isIgnorable_ = isIgnorable_;
function parentNode_(element) {
    return element.parentNode;
}
exports.parentNode_ = parentNode_;
function addCollapsedAttribute(node, collapsed) {
    const skeleton = new semantic_skeleton_1.SemanticSkeleton(collapsed);
    node.setAttribute(EnrichAttr.Attribute.COLLAPSED, skeleton.toString());
}
exports.addCollapsedAttribute = addCollapsedAttribute;
function cloneContentNode(content) {
    if (content.mathml.length) {
        return walkTree(content);
    }
    const clone = exports.SETTINGS.implicit
        ? createInvisibleOperator_(content)
        : DomUtil.createElement('mrow');
    content.mathml = [clone];
    return clone;
}
exports.cloneContentNode = cloneContentNode;
function rewriteMfenced(mml) {
    if (DomUtil.tagName(mml) !== 'MFENCED') {
        return mml;
    }
    const newNode = DomUtil.createElement('mrow');
    for (let i = 0, attr; (attr = mml.attributes[i]); i++) {
        if (['open', 'close', 'separators'].indexOf(attr.name) === -1) {
            newNode.setAttribute(attr.name, attr.value);
        }
    }
    DomUtil.toArray(mml.childNodes).forEach(function (x) {
        newNode.appendChild(x);
    });
    DomUtil.replaceNode(mml, newNode);
    return newNode;
}
exports.rewriteMfenced = rewriteMfenced;
function createInvisibleOperator_(operator) {
    const moNode = DomUtil.createElement('mo');
    const text = DomUtil.createTextNode(operator.textContent);
    moNode.appendChild(text);
    EnrichAttr.setAttributes(moNode, operator);
    moNode.setAttribute(EnrichAttr.Attribute.ADDED, 'true');
    return moNode;
}
exports.createInvisibleOperator_ = createInvisibleOperator_;
function setOperatorAttribute_(semantic, content) {
    const operator = semantic.type + (semantic.textContent ? ',' + semantic.textContent : '');
    content.forEach(function (c) {
        getInnerNode(c).setAttribute(EnrichAttr.Attribute.OPERATOR, operator);
    });
}
exports.setOperatorAttribute_ = setOperatorAttribute_;
function getInnerNode(node) {
    const children = DomUtil.toArray(node.childNodes);
    if (!children) {
        return node;
    }
    const remainder = children.filter(function (child) {
        return !isIgnorable_(child);
    });
    const result = [];
    for (let i = 0, remain; (remain = remainder[i]); i++) {
        if (SemanticUtil.hasEmptyTag(remain)) {
            const nextInner = getInnerNode(remain);
            if (nextInner && nextInner !== remain) {
                result.push(nextInner);
            }
        }
        else {
            result.push(remain);
        }
    }
    if (result.length === 1) {
        return result[0];
    }
    return node;
}
exports.getInnerNode = getInnerNode;
function formattedOutput(element, name, wiki = false) {
    const output = EnrichAttr.removeAttributePrefix(DomUtil.formatXml(element.toString()));
    return wiki ? name + ':\n```html\n' + output + '\n```\n' : output;
}
function collapsePunctuated(semantic, opt_children) {
    const optional = !!opt_children;
    const children = opt_children || [];
    const parent = semantic.parent;
    const contentIds = semantic.contentNodes.map(function (x) {
        return x.id;
    });
    contentIds.unshift('c');
    const childIds = [semantic.id, contentIds];
    for (let i = 0, child; (child = semantic.childNodes[i]); i++) {
        const mmlChild = walkTree(child);
        children.push(mmlChild);
        const innerNode = getInnerNode(mmlChild);
        if (parent && !optional) {
            innerNode.setAttribute(EnrichAttr.Attribute.PARENT, parent.id.toString());
        }
        childIds.push(child.id);
    }
    return childIds;
}
exports.collapsePunctuated = collapsePunctuated;
function printNodeList__(title, nodes) {
    console.info(title);
    DomUtil.toArray(nodes).forEach(function (x) {
        console.info(x.toString());
    });
    console.info('<<<<<<<<<<<<<<<<<');
}
exports.printNodeList__ = printNodeList__;
