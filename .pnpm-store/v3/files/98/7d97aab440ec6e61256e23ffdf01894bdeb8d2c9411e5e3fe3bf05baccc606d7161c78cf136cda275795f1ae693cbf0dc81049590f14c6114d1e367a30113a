/*************************************************************
 *
 *  Copyright (c) 2017-2022 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * @fileoverview  Interfaces and abstract classes for MmlNode objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Attributes, INHERIT} from './Attributes.js';
import {Property, PropertyList, Node, AbstractNode, AbstractEmptyNode, NodeClass} from '../Tree/Node.js';
import {MmlFactory} from './MmlFactory.js';
import {DOMAdaptor} from '../DOMAdaptor.js';

/**
 *  Used in setInheritedAttributes() to pass originating node kind as well as property value
 */
export type AttributeList = {[attribute: string]: [string, Property]};

/**
 *  These are the TeX classes for spacing computations
 */
export const TEXCLASS = {
  ORD:   0,
  OP:    1,
  BIN:   2,
  REL:   3,
  OPEN:  4,
  CLOSE: 5,
  PUNCT: 6,
  INNER: 7,
  VCENTER: 8,  // Used in TeXAtom, but not for spacing
  NONE:   -1
};

export const TEXCLASSNAMES = ['ORD', 'OP', 'BIN', 'REL', 'OPEN', 'CLOSE', 'PUNCT', 'INNER', 'VCENTER'];

/**
 *  The spacing sizes used by the TeX spacing table below.
 */
const TEXSPACELENGTH = ['', 'thinmathspace', 'mediummathspace', 'thickmathspace'];

/**
 * See TeXBook Chapter 18 (p. 170)
 */
const TEXSPACE = [
  [ 0, -1,  2,  3,  0,  0,  0,  1], // ORD
  [-1, -1,  0,  3,  0,  0,  0,  1], // OP
  [ 2,  2,  0,  0,  2,  0,  0,  2], // BIN
  [ 3,  3,  0,  0,  3,  0,  0,  3], // REL
  [ 0,  0,  0,  0,  0,  0,  0,  0], // OPEN
  [ 0, -1,  2,  3,  0,  0,  0,  1], // CLOSE
  [ 1,  1,  0,  1,  1,  1,  1,  1], // PUNCT
  [ 1, -1,  2,  3,  1,  0,  1,  1]  // INNER
];

/**
 * Attributes used to determine indentation and shifting
 */
export const indentAttributes = [
  'indentalign', 'indentalignfirst',
  'indentshift', 'indentshiftfirst'
];

/**
 * The nodes that can be in the internal MathML tree
 */
export type MMLNODE = MmlNode | TextNode | XMLNode;

/*****************************************************************/
/**
 *  The MmlNode interface (extends Node interface)
 */

export interface MmlNode extends Node {

  /**
   * Test various properties of MathML nodes
   */
  readonly isToken: boolean;
  readonly isEmbellished: boolean;
  readonly isSpacelike: boolean;
  readonly linebreakContainer: boolean;
  readonly hasNewLine: boolean;

  /**
   *  The expected number of children (-1 means use inferred mrow)
   */
  readonly arity: number;
  readonly isInferred: boolean;

  /**
   *  Get the parent node (skipping inferred mrows and
   *    other nodes marked as notParent)
   */
  readonly Parent: MmlNode;
  readonly notParent: boolean;

  /**
   * The actual parent in the tree
   */
  parent: MmlNode;

  /**
   *  values needed for TeX spacing computations
   */
  texClass: number;
  prevClass: number;
  prevLevel: number;

  /**
   *  The attributes (explicit and inherited) for this node
   */
  attributes: Attributes;

  /**
   * @return {MmlNode}  For embellished operators, the child node that contains the
   *                    core <mo> node.  For non-embellished nodes, the original node.
   */
  core(): MmlNode;

  /**
   * @return {MmlNode}  For embellished operators, the core <mo> element (at whatever
   *                    depth).  For non-embellished nodes, the original node itself.
   */
  coreMO(): MmlNode;

  /**
   * @return {number}   For embellished operators, the index of the child node containing
   *                    the core <mo>.  For non-embellished nodes, 0.
   */
  coreIndex(): number;

  /**
   * @return {number}  The index of this node in its parent's childNodes array.
   */
  childPosition(): number;

  /**
   * @param {MmlNode} prev  The node that is before this one for TeX spacing purposes
   *                        (not all nodes count in TeX measurements)
   * @return {MmlNode}  The node that should be the previous node for the next one
   *                    in the tree (usually, either the last child, or the node itself)
   */
  setTeXclass(prev: MmlNode): MmlNode;

  /**
   * @return {string}  The spacing to use before this element (one of TEXSPACELENGTH array above)
   */
  texSpacing(): string;

  /**
   * @return {boolean}  The core mo element has an explicit 'form', 'lspace', or 'rspace' attribute
   */
  hasSpacingAttributes(): boolean;

  /**
   * Sets the nodes inherited attributes, and pushes them to the nodes children.
   *
   * @param {AttributeList} attributes  The list of inheritable attributes (with the node kinds
   *                                    from which they came)
   * @param {boolean} display           The displaystyle to inherit
   * @param {number} level              The scriptlevel to inherit
   * @param {boolean} prime             The TeX prime style to inherit (T vs. T', etc).
   */
  setInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean): void;

  /**
   * Set the nodes inherited attributes based on the attributes of the given node
   *   (used for creating extra nodes in the tree after setInheritedAttributes has already run)
   *
   * @param {MmlNode} node   The node whose attributes are to be used as a template
   */
  inheritAttributesFrom(node: MmlNode): void;

  /**
   * Replace the current node with an error message (or the name of the node)
   *
   * @param {string} message         The error message to use
   * @param {PropertyList} options   The options telling how much to verify
   * @param {boolean} short          True means use just the kind if not using full errors
   * @return {MmlNode}               The construted merror
   */
  mError(message: string, options: PropertyList, short?: boolean): MmlNode;

  /**
   * Check integrity of MathML structure
   *
   * @param {PropertyList} options  The options controlling the check
   */
  verifyTree(options?: PropertyList): void;
}


/*****************************************************************/
/**
 *  The MmlNode class interface (extends the NodeClass)
 */

export interface MmlNodeClass extends NodeClass {

  /**
   *  The list of default attribute values for nodes of this class
   */
  defaults?: PropertyList;

  /**
   * An MmlNode takes a NodeFactory (so it can create additional nodes as needed), a list
   *   of attributes, and an array of children and returns the desired MmlNode with
   *   those attributes and children
   *
   * @constructor
   * @param {MmlFactory} factory       The MathML node factory to use to create additional nodes
   * @param {PropertyList} attributes  The list of initial attributes for the node
   * @param {MmlNode[]} children       The initial child nodes (more can be added later)
   */
  new (factory: MmlFactory, attributes?: PropertyList, children?: MmlNode[]): MmlNode;

}


/*****************************************************************/
/**
 *  The abstract MmlNode class (extends the AbstractNode class and implements
 *  the IMmlNode interface)
 */

export abstract class AbstractMmlNode extends AbstractNode implements MmlNode {

  /**
   * The properties common to all MathML nodes
   */
  public static defaults: PropertyList = {
    mathbackground: INHERIT,
    mathcolor: INHERIT,
    mathsize: INHERIT,  // technically only for token elements, but <mstyle mathsize="..."> should
    //    scale all spaces, fractions, etc.
    dir: INHERIT
  };

  /**
   *  This lists properties that do NOT get inherited between specific kinds
   *  of nodes.  The outer keys are the node kinds that are being inherited FROM,
   *  while the second level of keys are the nodes that INHERIT the values.  Any
   *  property appearing in the innermost list is NOT inherited by the pair.
   *
   *  For example, an mpadded element will not inherit a width attribute from an mstyle node.
   */
  public static noInherit: {[node1: string]: {[node2: string]: {[attribute: string]: boolean}}} = {
    mstyle: {
      mpadded: {width: true, height: true, depth: true, lspace: true, voffset: true},
      mtable:  {width: true, height: true, depth: true, align: true}
    },
    maligngroup: {
      mrow: {groupalign: true},
      mtable: {groupalign: true}
    }
  };

  /**
   * This lists the attributes that should always be inherited,
   *   even when there is no default value for the attribute.
   */
  public static alwaysInherit: {[name: string]: boolean} = {
    scriptminsize: true,
    scriptsizemultiplier: true
  };

  /**
   * This is the list of options for the verifyTree() method
   */
  public static verifyDefaults: PropertyList = {
    checkArity: true,
    checkAttributes: false,
    fullErrors: false,
    fixMmultiscripts: true,
    fixMtables: true
  };

  /*
   * These default to being unset (the node doesn't participate in spacing calculations).
   * The correct values are produced when the setTeXclass() method is called on the tree.
   */

  /**
   * The TeX class for the preceding node
   */
  public prevClass: number = null;

  /**
   * The scriptlevel of the preceding node
   */
  public prevLevel: number = null;

  /**
   * This node's attributes
   */
  public attributes: Attributes;

  /**
   *  Child nodes are MmlNodes (special case of Nodes).
   */
  public childNodes: MmlNode[];

  /**
   * The parent is an MmlNode
   */
  public parent: MmlNode;

  /**
   * The node factory is an MmlFactory
   */
  public readonly factory: MmlFactory;

  /**
   * The TeX class of this node (obtained via texClass below)
   */
  protected texclass: number = null;

  /**
   *  Create an MmlNode:
   *    If the arity is -1, add the inferred row (created by the factory)
   *    Add the children, if any
   *    Create the Attribute object from the class defaults and the global defaults (the math node defaults)
   *
   *  @override
   */
  constructor(factory: MmlFactory, attributes: PropertyList = {}, children: MmlNode[] = []) {
    super(factory);
    if (this.arity < 0) {
      this.childNodes = [factory.create('inferredMrow')];
      this.childNodes[0].parent = this;
    }
    this.setChildren(children);
    this.attributes = new Attributes(
      factory.getNodeClass(this.kind).defaults,
      factory.getNodeClass('math').defaults
    );
    this.attributes.setList(attributes);
  }

  /**
   * @override
   *
   * @param {boolean} keepIds   True to copy id attributes, false to skip them.
   *                              (May cause error in the future, since not part of the interface.)
   * @return {AbstractMmlNode}  The copied node tree.
   */
  public copy(keepIds: boolean = false): AbstractMmlNode {
    const node = this.factory.create(this.kind) as AbstractMmlNode;
    node.properties = {...this.properties};
    if (this.attributes) {
      const attributes = this.attributes.getAllAttributes();
      for (const name of Object.keys(attributes)) {
        if (name !== 'id' || keepIds) {
          node.attributes.set(name, attributes[name]);
        }
      }
    }
    if (this.childNodes && this.childNodes.length) {
      let children = this.childNodes as MmlNode[];
      if (children.length === 1 && children[0].isInferred) {
        children = children[0].childNodes as MmlNode[];
      }
      for (const child of children) {
        if (child) {
          node.appendChild(child.copy() as MmlNode);
        } else {
          node.childNodes.push(null);
        }
      }
    }
    return node;
  }

  /**
   * The TeX class for this node
   */
  public get texClass(): number {
    return this.texclass;
  }

  /**
   * The TeX class for this node
   */
  public set texClass(texClass: number) {
    this.texclass = texClass;
  }

  /**
   * @return {boolean}  true if this is a token node
   */
  public get isToken(): boolean {
    return false;
  }

  /**
   * @return {boolean}  true if this is an embellished operator
   */
  public get isEmbellished(): boolean {
    return false;
  }

  /**
   * @return {boolean}  true if this is a space-like node
   */
  public get isSpacelike(): boolean {
    return false;
  }

  /**
   * @return {boolean}  true if this is a node that supports linebreaks in its children
   */
  public get linebreakContainer(): boolean {
    return false;
  }

  /**
   * @return {boolean}  true if this node contains a line break
   */
  public get hasNewLine(): boolean {
    return false;
  }

  /**
   * @return {number}  The number of children allowed, or Infinity for any number,
   *                   or -1 for when an inferred row is needed for the children.
   *                   Special case is 1, meaning at least one (other numbers
   *                   mean exactly that many).
   */
  public get arity(): number {
    return Infinity;
  }

  /**
   * @return {boolean}  true if this is an inferred mrow
   */
  public get isInferred(): boolean {
    return false;
  }

  /**
   * @return {MmlNode}  The logical parent of this node (skipping over inferred rows
   *                      some other node types)
   */
  public get Parent(): MmlNode {
    let parent = this.parent;
    while (parent && parent.notParent) {
      parent = parent.Parent;
    }
    return parent;
  }

  /**
   * @return {boolean}  true if this is a node that doesn't count as a parent node in Parent()
   */
  public get notParent(): boolean {
    return false;
  }

  /**
   * If there is an inferred row, the the children of that instead
   *
   * @override
   */
  public setChildren(children: MmlNode[]) {
    if (this.arity < 0) {
      return this.childNodes[0].setChildren(children);
    }
    return super.setChildren(children);
  }
  /**
   * If there is an inferred row, append to that instead.
   * If a child is inferred, append its children instead.
   *
   * @override
   */
  public appendChild(child: MmlNode) {
    if (this.arity < 0) {
      this.childNodes[0].appendChild(child);
      return child;
    }
    if (child.isInferred) {
      //
      //  If we can have arbitrary children, remove the inferred mrow
      //  (just add its children).
      //
      if (this.arity === Infinity) {
        child.childNodes.forEach((node) => super.appendChild(node));
        return child;
      }
      //
      //  Otherwise, convert the inferred mrow to an explicit mrow
      //
      const original = child;
      child = this.factory.create('mrow');
      child.setChildren(original.childNodes);
      child.attributes = original.attributes;
      for (const name of original.getPropertyNames()) {
        child.setProperty(name, original.getProperty(name));
      }
    }
    return super.appendChild(child);
  }
  /**
   * If there is an inferred row, remove the child from there
   *
   * @override
   */
  public replaceChild(newChild: MmlNode, oldChild: MmlNode) {
    if (this.arity < 0) {
      this.childNodes[0].replaceChild(newChild, oldChild);
      return newChild;
    }
    return super.replaceChild(newChild, oldChild);
  }

  /**
   * @override
   */
  public core(): MmlNode {
    return this;
  }

  /**
   * @override
   */
  public coreMO(): MmlNode {
    return this;
  }

  /**
   * @override
   */
  public coreIndex() {
    return 0;
  }

  /**
   * @override
   */
  public childPosition() {
    let child: MmlNode = this;
    let parent = child.parent;
    while (parent && parent.notParent) {
      child = parent;
      parent = parent.parent;
    }
    if (parent) {
      let i = 0;
      for (const node of parent.childNodes) {
        if (node === child) {
          return i;
        }
        i++;
      }
    }
    return null;
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode): MmlNode {
    this.getPrevClass(prev);
    return (this.texClass != null ? this : prev);
  }
  /**
   * For embellished operators, get the data from the core and clear the core
   *
   * @param {MmlNode} core  The core <mo> for this node
   */
  protected updateTeXclass(core: MmlNode) {
    if (core) {
      this.prevClass = core.prevClass;
      this.prevLevel = core.prevLevel;
      core.prevClass = core.prevLevel = null;
      this.texClass = core.texClass;
    }
  }
  /**
   * Get the previous element's texClass and scriptlevel
   *
   * @param {MmlNode} prev  The previous node to this one
   */
  protected getPrevClass(prev: MmlNode) {
    if (prev) {
      this.prevClass = prev.texClass;
      this.prevLevel = prev.attributes.get('scriptlevel') as number;
    }
  }

  /**
   * @return {string}  returns the spacing to use before this node
   */
  public texSpacing(): string {
    let prevClass = (this.prevClass != null ? this.prevClass : TEXCLASS.NONE);
    let texClass = this.texClass || TEXCLASS.ORD;
    if (prevClass === TEXCLASS.NONE || texClass === TEXCLASS.NONE) {
      return '';
    }
    if (prevClass === TEXCLASS.VCENTER) {
      prevClass = TEXCLASS.ORD;
    }
    if (texClass === TEXCLASS.VCENTER) {
      texClass = TEXCLASS.ORD;
    }
    let space = TEXSPACE[prevClass][texClass];
    if ((this.prevLevel > 0 || this.attributes.get('scriptlevel') > 0) && space >= 0) {
      return '';
    }
    return TEXSPACELENGTH[Math.abs(space)];
  }

  /**
   * @return {boolean}  The core mo element has an explicit 'form' attribute
   */
  public hasSpacingAttributes(): boolean {
    return this.isEmbellished && this.coreMO().hasSpacingAttributes();
  }

  /**
   * Sets the inherited propertis for this node, and pushes inherited properties to the children
   *
   *   For each inheritable attribute:
   *     If the node has a default for this attribute, try to inherit it
   *       but check if the noInherit object prevents that.
   *   If the node doesn't have an explicit displaystyle, inherit it
   *   If the node doesn't have an explicit scriptstyle, inherit it
   *   If the prime style is true, set it as a property (it is not a MathML attribute)
   *   Check that the number of children is correct
   *   Finally, push any inherited attributes to teh children.
   *
   * @override
   */
  public setInheritedAttributes(attributes: AttributeList = {},
                                display: boolean = false, level: number = 0, prime: boolean = false) {
    let defaults = this.attributes.getAllDefaults();
    for (const key of Object.keys(attributes)) {
      if (defaults.hasOwnProperty(key) || AbstractMmlNode.alwaysInherit.hasOwnProperty(key)) {
        let [node, value] = attributes[key];
        let noinherit = (AbstractMmlNode.noInherit[node] || {})[this.kind] || {};
        if (!noinherit[key]) {
          this.attributes.setInherited(key, value);
        }
      }
    }
    let displaystyle = this.attributes.getExplicit('displaystyle');
    if (displaystyle === undefined) {
      this.attributes.setInherited('displaystyle', display);
    }
    let scriptlevel = this.attributes.getExplicit('scriptlevel');
    if (scriptlevel === undefined) {
      this.attributes.setInherited('scriptlevel', level);
    }
    if (prime) {
      this.setProperty('texprimestyle', prime);
    }
    let arity = this.arity;
    if (arity >= 0 && arity !== Infinity && ((arity === 1 && this.childNodes.length === 0) ||
                                             (arity !== 1 && this.childNodes.length !== arity))) {
      //
      //  Make sure there are the right number of child nodes
      //  (trim them or add empty mrows)
      //
      if (arity < this.childNodes.length) {
        this.childNodes = this.childNodes.slice(0, arity);
      } else {
        while (this.childNodes.length < arity) {
          this.appendChild(this.factory.create('mrow'));
        }
      }
    }
    this.setChildInheritedAttributes(attributes, display, level, prime);
  }
  /**
   * Apply inherited attributes to all children
   * (Some classes override this to handle changes in displaystyle and scriptlevel)
   *
   * @param {AttributeList} attributes  The list of inheritable attributes (with the node kinds
   *                                    from which they came)
   * @param {boolean} display           The displaystyle to inherit
   * @param {number} level              The scriptlevel to inherit
   * @param {boolean} prime             The TeX prime style to inherit (T vs. T', etc).
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    for (const child of this.childNodes) {
      child.setInheritedAttributes(attributes, display, level, prime);
    }
  }
  /**
   * Used by subclasses to add their own attributes to the inherited list
   * (e.g., mstyle uses this to augment the inherited attibutes)
   *
   * @param {AttributeList} current    The current list of inherited attributes
   * @param {PropertyList} attributes  The new attributes to add into the list
   */
  protected addInheritedAttributes(current: AttributeList, attributes: PropertyList) {
    let updated: AttributeList = {...current};
    for (const name of Object.keys(attributes)) {
      if (name !== 'displaystyle' && name !== 'scriptlevel' && name !== 'style') {
        updated[name] = [this.kind, attributes[name]];
      }
    }
    return updated;
  }

  /**
   * Set the nodes inherited attributes based on the attributes of the given node
   *   (used for creating extra nodes in the tree after setInheritedAttributes has already run)
   *
   * @param {MmlNode} node   The node whose attributes are to be used as a template
   */
  public inheritAttributesFrom(node: MmlNode) {
    const attributes = node.attributes;
    const display = attributes.get('displaystyle') as boolean;
    const scriptlevel = attributes.get('scriptlevel') as number;
    const defaults: AttributeList = (!attributes.isSet('mathsize') ? {} : {
      mathsize: ['math', attributes.get('mathsize')]
    });
    const prime = node.getProperty('texprimestyle') as boolean || false;
    this.setInheritedAttributes(defaults, display, scriptlevel, prime);
  }

  /**
   * Verify the attributes, and that there are the right number of children.
   * Then verify the children.
   *
   * @param {PropertyList} options   The options telling how much to verify
   */
  public verifyTree(options: PropertyList = null) {
    if (options === null) {
      return;
    }
    this.verifyAttributes(options);
    let arity = this.arity;
    if (options['checkArity']) {
      if (arity >= 0 && arity !== Infinity &&
          ((arity === 1 && this.childNodes.length === 0) ||
           (arity !== 1 && this.childNodes.length !== arity))) {
        this.mError('Wrong number of children for "' + this.kind + '" node', options, true);
      }
    }
    this.verifyChildren(options);
  }

  /**
   * Verify that all the attributes are valid (i.e., have defaults)
   *
   * @param {PropertyList} options   The options telling how much to verify
   */
  protected verifyAttributes(options: PropertyList) {
    if (options['checkAttributes']) {
      const attributes = this.attributes;
      const bad = [];
      for (const name of attributes.getExplicitNames()) {
        if (name.substr(0, 5) !== 'data-' && attributes.getDefault(name) === undefined &&
            !name.match(/^(?:class|style|id|(?:xlink:)?href)$/)) {
          // FIXME: provide a configurable checker for names that are OK
          bad.push(name);
        }
        // FIXME: add ability to check attribute values?
      }
      if (bad.length) {
        this.mError('Unknown attributes for ' + this.kind + ' node: ' + bad.join(', '), options);
      }
    }
  }

  /**
   * Verify the children.
   *
   * @param {PropertyList} options   The options telling how much to verify
   */
  protected verifyChildren(options: PropertyList) {
    for (const child of this.childNodes) {
      child.verifyTree(options);
    }
  }

  /**
   * Replace the current node with an error message (or the name of the node)
   *
   * @param {string} message         The error message to use
   * @param {PropertyList} options   The options telling how much to verify
   * @param {boolean} short          True means use just the kind if not using full errors
   * @return {MmlNode}               The constructed merror
   */
  public mError(message: string, options: PropertyList, short: boolean = false): MmlNode {
    if (this.parent && this.parent.isKind('merror')) {
      return null;
    }
    let merror = this.factory.create('merror');
    merror.attributes.set('data-mjx-message', message);
    if (options['fullErrors'] || short) {
      let mtext = this.factory.create('mtext');
      let text = this.factory.create('text') as TextNode;
      text.setText(options['fullErrors'] ? message : this.kind);
      mtext.appendChild(text);
      merror.appendChild(mtext);
      this.parent.replaceChild(merror, this);
    } else {
      this.parent.replaceChild(merror, this);
      merror.appendChild(this);
    }
    return merror;
  }

}

/*****************************************************************/
/**
 *  The abstract MmlNode Token node class (extends the AbstractMmlNode)
 */

export abstract class AbstractMmlTokenNode extends AbstractMmlNode {

  /**
   * Add the attributes common to all token nodes
   */
  public static defaults: PropertyList = {
      ...AbstractMmlNode.defaults,
    mathvariant: 'normal',
    mathsize: INHERIT
  };

  /**
   * @override
   */
  public get isToken() {
    return true;
  }

  /**
   * Get the text of the token node (skipping mglyphs, and combining
   *   multiple text nodes)
   */
  public getText() {
    let text = '';
    for (const child of this.childNodes) {
      if (child instanceof TextNode) {
        text += child.getText();
      }
    }
    return text;
  }

  /**
   * Only inherit to child nodes that are AbstractMmlNodes (not TextNodes)
   *
   * @override
   */
  protected setChildInheritedAttributes(attributes: AttributeList, display: boolean, level: number, prime: boolean) {
    for (const child of this.childNodes) {
      if (child instanceof AbstractMmlNode) {
        child.setInheritedAttributes(attributes, display, level, prime);
      }
    }
  }

  /**
   * Only step into children that are AbstractMmlNodes (not TextNodes)
   * @override
   */
  public walkTree(func: (node: Node, data?: any) => void, data?: any) {
    func(this, data);
    for (const child of this.childNodes) {
      if (child instanceof AbstractMmlNode) {
        child.walkTree(func, data);
      }
    }
    return data;
  }

}


/*****************************************************************/
/**
 *  The abstract MmlNode Layout class (extends the AbstractMmlNode)
 *
 *  These have inferred mrows (so only one child) and can be
 *  spacelike or embellished based on their contents.
 */

export abstract class AbstractMmlLayoutNode extends AbstractMmlNode {

  /**
   * Use the same defaults as AbstractMmlNodes
   */
  public static defaults: PropertyList = AbstractMmlNode.defaults;

  /**
   * @override
   */
  public get isSpacelike() {
    return this.childNodes[0].isSpacelike;
  }

  /**
   * @override
   */
  public get isEmbellished() {
    return this.childNodes[0].isEmbellished;
  }

  /**
   * @override
   */
  public get arity() {
    return -1;
  }

  /**
   * @override
   */
  public core() {
    return this.childNodes[0];
  }

  /**
   * @override
   */
  public coreMO() {
    return this.childNodes[0].coreMO();
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    prev = this.childNodes[0].setTeXclass(prev);
    this.updateTeXclass(this.childNodes[0]);
    return prev;
  }
}

/*****************************************************************/
/**
 *  The abstract MmlNode-with-base-node Class (extends the AbstractMmlNode)
 *
 *  These have a base element and other elemetns, (e.g., script elements for msubsup).
 *  They can be embellished (if their base is), and get their TeX classes
 *    from their base with their scripts being handled as separate math lists.
 */

export abstract class AbstractMmlBaseNode extends AbstractMmlNode {

  /**
   * Use the same defaults as AbstractMmlNodes
   */
  public static defaults: PropertyList = AbstractMmlNode.defaults;

  /**
   * @override
   */
  public get isEmbellished() {
    return this.childNodes[0].isEmbellished;
  }

  /**
   * @override
   */
  public core() {
    return this.childNodes[0];
  }

  /**
   * @override
   */
  public coreMO() {
    return this.childNodes[0].coreMO();
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    this.getPrevClass(prev);
    this.texClass = TEXCLASS.ORD;
    let base = this.childNodes[0];
    if (base) {
      if (this.isEmbellished || base.isKind('mi')) {
        prev = base.setTeXclass(prev);
        this.updateTeXclass(this.core());
      } else {
        base.setTeXclass(null);
        prev = this;
      }
    } else {
      prev = this;
    }
    for (const child of this.childNodes.slice(1)) {
      if (child) {
        child.setTeXclass(null);
      }
    }
    return prev;
  }
}

/*****************************************************************/
/**
 *  The abstract MmlNode Empty Class (extends AbstractEmptyNode, implements MmlNode)
 *
 *  These have no children and no attributes (TextNode and XMLNode), so we
 *  override all the methods dealing with them, and with the data that usually
 *  goes with an MmlNode.
 */

export abstract class AbstractMmlEmptyNode extends AbstractEmptyNode implements MmlNode {

  /**
   *  Parent is an MmlNode
   */
  public parent: MmlNode;

  /**
   * @return {boolean}  Not a token element
   */
  public get isToken(): boolean {
    return false;
  }

  /**
   * @return {boolean}  Not embellished
   */
  public get isEmbellished(): boolean {
    return false;
  }

  /**
   * @return {boolean}  Not space-like
   */
  public get isSpacelike(): boolean {
    return false;
  }

  /**
   * @return {boolean}  Not a container of any kind
   */
  public get linebreakContainer(): boolean {
    return false;
  }

  /**
   * @return {boolean}  Does not contain new lines
   */
  public get hasNewLine(): boolean {
    return false;
  }

  /**
   * @return {number}  No children
   */
  public get arity(): number {
    return 0;
  }

  /**
   * @return {boolean}  Is not an inferred row
   */
  public get isInferred(): boolean {
    return false;
  }

  /**
   * @return {boolean}  Is not a container element
   */
  public get notParent(): boolean {
    return false;
  }

  /**
   * @return {MmlNode}  Parent is the actual parent
   */
  public get Parent(): MmlNode {
    return this.parent;
  }

  /**
   * @return {number}  No TeX class
   */
  public get texClass(): number {
    return TEXCLASS.NONE;
  }

  /**
   * @return {number}  No previous element
   */
  public get prevClass(): number {
    return TEXCLASS.NONE;
  }

  /**
   * @return {number}  No previous element
   */
  public get prevLevel(): number {
    return 0;
  }

  /**
   * @return {boolean}  The core mo element has an explicit 'form' attribute
   */
  public hasSpacingAttributes(): boolean {
    return false;
  }

  /**
   * return {Attributes}  No attributes, so don't store one
   */
  public get attributes(): Attributes {
    return null;
  }

  /**
   * @override
   */
  public core(): MmlNode {
    return this;
  }

  /**
   * @override
   */
  public coreMO(): MmlNode {
    return this;
  }

  /**
   * @override
   */
  public coreIndex() {
    return 0;
  }

  /**
   * @override
   */
  public childPosition() {
    return 0;
  }

  /**
   * @override
   */
  public setTeXclass(prev: MmlNode) {
    return prev;
  }
  /**
   * @override
   */
  public texSpacing() {
    return '';
  }

  /**
   * No children or attributes, so ignore this call.
   *
   * @override
   */
  public setInheritedAttributes(_attributes: AttributeList, _display: boolean, _level: number, _prime: boolean) {}

  /**
   * No children or attributes, so ignore this call.
   *
   * @override
   */
  public inheritAttributesFrom(_node: MmlNode) {}

  /**
   * No children or attributes, so ignore this call.
   *
   * @param {PropertyList} options  The options for the check
   */
  public verifyTree(_options: PropertyList) {}

  /**
   *  @override
   */
  public mError(_message: string, _options: PropertyList, _short: boolean = false) {
    return null as MmlNode;
  }

}

/*****************************************************************/
/**
 *  The TextNode Class (extends AbstractMmlEmptyNode)
 */

export class TextNode extends AbstractMmlEmptyNode {
  /**
   * The text for this node
   */
  protected text: string = '';

  /**
   * @override
   */
  public get kind() {
    return 'text';
  }

  /**
   * @return {string}  Return the node's text
   */
  public getText(): string {
    return this.text;
  }

  /**
   * @param {string} text  The text to use for the node
   * @return {TextNode}  The text node (for chaining of method calls)
   */
  public setText(text: string): TextNode {
    this.text = text;
    return this;
  }

  /**
   * @override
   */
  public copy() {
    return (this.factory.create(this.kind) as TextNode).setText(this.getText());
  }

  /**
   * Just use the text
   */
  public toString() {
    return this.text;
  }

}


/*****************************************************************/
/**
 *  The XMLNode Class (extends AbstractMmlEmptyNode)
 */

export class XMLNode extends AbstractMmlEmptyNode {
  /**
   * The XML content for this node
   */
  protected xml: Object = null;

  /**
   * DOM adaptor for the content
   */
  protected adaptor: DOMAdaptor<any, any, any> = null;

  /**
   * @override
   */
  public get kind() {
    return 'XML';
  }

  /**
   * @return {Object}  Return the node's XML content
   */
  public getXML(): Object {
    return this.xml;
  }

  /**
   * @param {object} xml  The XML content to be saved
   * @param {DOMAdaptor} adaptor DOM adaptor for the content
   * @return {XMLNode}  The XML node (for chaining of method calls)
   */
  public setXML(xml: Object, adaptor: DOMAdaptor<any, any, any> = null): XMLNode {
    this.xml = xml;
    this.adaptor = adaptor;
    return this;
  }

  /**
   * @return {string}  The serialized XML content
   */
  public getSerializedXML(): string {
    return this.adaptor.serializeXML(this.xml);
  }

  /**
   * @override
   */
  public copy(): XMLNode {
    return (this.factory.create(this.kind) as XMLNode).setXML(this.adaptor.clone(this.xml));
  }

  /**
   * Just indicate that this is XML data
   */
  public toString() {
    return 'XML data';
  }

}
