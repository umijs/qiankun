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
/**
 * TODO(usergenic): The following set of helper functions are more-or-less
 * copied from the npm package dom5 which could not be brought in at this
 * time because it is bound to `parse5@4` where this package uses `parse5@5`.
 * Once dom5 is updated, we can just use that package and not maintain these
 * here.
 */
import { DefaultTreeCommentNode, DefaultTreeDocument, DefaultTreeDocumentFragment, DefaultTreeElement, DefaultTreeNode, DefaultTreeParentNode, DefaultTreeTextNode } from 'parse5';
export declare const filter: <T>(iter: IterableIterator<T>, predicate: (t: T) => boolean, matches?: T[]) => T[];
export declare const getAttr: (element: DefaultTreeNode, name: string) => string;
export declare const getTextContent: (node: DefaultTreeNode) => string;
export declare const setAttr: (element: DefaultTreeNode, name: string, value: string) => void;
export declare const insertBefore: (parent: DefaultTreeNode, oldNode: DefaultTreeNode, newNode: DefaultTreeNode) => void;
export declare const insertNode: (parent: DefaultTreeNode, index: number, newNode: DefaultTreeNode, replace?: DefaultTreeNode | undefined) => void;
export declare const isChild: (node: DefaultTreeNode) => node is DefaultTreeElement | DefaultTreeCommentNode | DefaultTreeTextNode;
export declare const isCommentNode: (node: DefaultTreeNode) => node is DefaultTreeCommentNode;
export declare const isDocument: (node: DefaultTreeNode) => node is DefaultTreeDocument;
export declare const isDocumentFragment: (node: DefaultTreeNode) => node is DefaultTreeDocumentFragment;
export declare const isElement: (node: DefaultTreeNode) => node is DefaultTreeElement;
export declare const isParent: (node: DefaultTreeNode) => node is DefaultTreeDocument | DefaultTreeDocumentFragment | DefaultTreeElement;
export declare const isTextNode: (node: DefaultTreeNode) => node is DefaultTreeTextNode;
export declare const defaultChildNodes: (node: DefaultTreeParentNode) => DefaultTreeNode[];
export declare const depthFirst: (node: DefaultTreeNode, getChildNodes?: (node: DefaultTreeParentNode) => DefaultTreeNode[]) => IterableIterator<DefaultTreeNode>;
export declare const nodeWalkAll: (node: DefaultTreeNode, predicate: (node: DefaultTreeNode) => boolean, matches?: DefaultTreeNode[], getChildNodes?: (node: DefaultTreeParentNode) => DefaultTreeNode[]) => DefaultTreeNode[];
export declare const removeFakeRootElements: (node: DefaultTreeNode) => void;
export declare const removeNode: (node: DefaultTreeNode) => void;
export declare const removeNodeSaveChildren: (node: DefaultTreeNode) => void;
export declare const setTextContent: (node: DefaultTreeNode, value: string) => void;
export declare const newTextNode: (value: string, parentNode: DefaultTreeParentNode) => DefaultTreeTextNode;
//# sourceMappingURL=parse5-utils.d.ts.map