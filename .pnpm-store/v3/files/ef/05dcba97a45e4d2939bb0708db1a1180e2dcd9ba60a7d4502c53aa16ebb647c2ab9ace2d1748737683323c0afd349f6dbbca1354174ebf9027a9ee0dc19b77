"use strict";
/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = (iter, predicate, matches = []) => {
    for (const value of iter) {
        if (predicate(value)) {
            matches.push(value);
        }
    }
    return matches;
};
exports.getAttr = (element, name) => {
    if (exports.isElement(element)) {
        const attr = element.attrs.find(({ name: attrName }) => attrName === name);
        if (attr) {
            return attr.value;
        }
    }
    return '';
};
exports.getTextContent = (node) => {
    if (exports.isCommentNode(node)) {
        return node.data;
    }
    if (exports.isTextNode(node)) {
        return node.value;
    }
    const subtree = exports.nodeWalkAll(node, exports.isTextNode);
    return subtree.map(exports.getTextContent).join('');
};
exports.setAttr = (element, name, value) => {
    if (!exports.isElement(element)) {
        return;
    }
    const attr = element.attrs.find(({ name: attrName }) => attrName === name);
    if (attr) {
        attr.value = value;
    }
    else {
        element.attrs.push({ name, value });
    }
};
exports.insertBefore = (parent, oldNode, newNode) => {
    if (!exports.isParent(parent)) {
        return;
    }
    const index = parent.childNodes.indexOf(oldNode);
    exports.insertNode(parent, index, newNode);
};
exports.insertNode = (parent, index, newNode, replace = undefined) => {
    if (!exports.isParent(parent)) {
        return;
    }
    let newNodes = [];
    let removedNode = replace ? parent.childNodes[index] : null;
    if (newNode) {
        if (exports.isDocumentFragment(newNode)) {
            if (newNode.childNodes) {
                newNodes = [...newNode.childNodes];
                newNode.childNodes.length = 0;
            }
        }
        else {
            newNodes = [newNode];
            exports.removeNode(newNode);
        }
    }
    if (replace) {
        removedNode = parent.childNodes[index];
    }
    parent.childNodes.splice(index, replace ? 1 : 0, ...newNodes);
    newNodes.forEach((n) => {
        if (exports.isChild(n)) {
            n.parentNode = parent;
        }
    });
    if (removedNode && exports.isChild(removedNode)) {
        removedNode.parentNode = undefined;
    }
};
exports.isChild = (node) => exports.isCommentNode(node) || exports.isElement(node) || exports.isTextNode(node);
exports.isCommentNode = (node) => node.nodeName === '#comment';
exports.isDocument = (node) => node.nodeName === '#document';
exports.isDocumentFragment = (node) => node.nodeName === '#document-fragment';
exports.isElement = (node) => !node.nodeName.startsWith('#');
exports.isParent = (node) => exports.isElement(node) || exports.isDocumentFragment(node) || exports.isDocument(node);
exports.isTextNode = (node) => node.nodeName === '#text';
exports.defaultChildNodes = (node) => node.childNodes;
exports.depthFirst = function* (node, getChildNodes = exports.defaultChildNodes) {
    yield node;
    if (exports.isParent(node)) {
        const childNodes = getChildNodes(node);
        if (childNodes === undefined) {
            return;
        }
        for (const child of childNodes) {
            yield* exports.depthFirst(child, getChildNodes);
        }
    }
};
exports.nodeWalkAll = (node, predicate, matches = [], getChildNodes = exports.defaultChildNodes) => exports.filter(exports.depthFirst(node, getChildNodes), predicate, matches);
exports.removeFakeRootElements = (node) => {
    const fakeRootElements = [];
    exports.nodeWalkAll(node, (node) => {
        if (node.nodeName && node.nodeName.match(/^(html|head|body)$/i) &&
            !node.sourceCodeLocation) {
            fakeRootElements.unshift(node);
        }
        return false;
    });
    fakeRootElements.forEach(exports.removeNodeSaveChildren);
};
exports.removeNode = (node) => {
    if (exports.isChild(node)) {
        const parent = node.parentNode;
        if (parent && parent.childNodes) {
            const idx = parent.childNodes.indexOf(node);
            parent.childNodes.splice(idx, 1);
        }
    }
    node.parentNode = undefined;
};
exports.removeNodeSaveChildren = (node) => {
    // We can't save the children if there's no parent node to provide
    // for them.
    if (!exports.isChild(node)) {
        return;
    }
    const fosterParent = node.parentNode;
    if (!fosterParent) {
        return;
    }
    if (exports.isParent(node)) {
        const children = (node.childNodes || []).slice();
        for (const child of children) {
            exports.insertBefore(fosterParent, node, child);
        }
    }
    exports.removeNode(node);
};
exports.setTextContent = (node, value) => {
    if (exports.isCommentNode(node)) {
        node.data = value;
    }
    else if (exports.isTextNode(node)) {
        node.value = value;
    }
    else if (exports.isParent(node)) {
        exports.newTextNode(value, node);
    }
};
exports.newTextNode = (value, parentNode) => {
    const textNode = { nodeName: '#text', value, parentNode };
    parentNode.childNodes = [textNode];
    return textNode;
};
//# sourceMappingURL=parse5-utils.js.map