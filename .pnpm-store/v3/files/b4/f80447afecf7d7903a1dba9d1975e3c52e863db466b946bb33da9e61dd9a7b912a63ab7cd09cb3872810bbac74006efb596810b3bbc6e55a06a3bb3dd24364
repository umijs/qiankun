/*************************************************************
 *
 *  Copyright (c) 2009-2022 The MathJax Consortium
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
 * @fileoverview Stack items hold information on the TexParser stack.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {FactoryNodeClass} from '../../core/Tree/Factory.js';
import TexError from './TexError.js';
import StackItemFactory from './StackItemFactory.js';

// Union types for abbreviation.
export type EnvProp = string | number | boolean;

export type EnvList = {[key: string]: EnvProp};

// This is the type for all fields that used to be set with With.
export type Prop = string | number | boolean | MmlNode | PropList;

export type PropList = {[key: string]: Prop};

export type CheckType = [(MmlNode | StackItem)[], boolean];


export interface NodeStack {

  /**
   * Get or set the topmost element on the node stack without removing it.
   * @return {MmlNode} The topmost node on the stack.
   */
  First: MmlNode;

  /**
   * Get or set the last element on the node stack without removing it.
   * @return {MmlNode} The last node on the stack.
   */
  Last: MmlNode;

  /**
   * @return {MmlNode} The topmost node on the item's node stack.
   */
  Pop(): MmlNode | void;

  /**
   * Pushes new nodes onto the items node stack.
   * @param {MmlNode[]} ...nodes A list of nodes.
   */
  Push(...nodes: MmlNode[]): void;

  /**
   * Get the top n elements on the node stack without removing them.
   * @param {number=} n Number of elements that should be returned.
   * @return {MmlNode[]} List of nodes on top of stack.
   */
  Peek(n?: number): MmlNode[];

  /**
   * @return {number} The size of the stack.
   */
  Size(): number;

  /**
   * Clears the stack.
   */
  Clear(): void;

  /**
   * Returns nodes on the stack item's node stack as an Mml node. I.e., in case
   * the item contains more than one node, it creates an mrow.
   * @param {boolean=} inferred If set the mrow will be an inferred mrow.
   * @param {boolean=} forceRow If set an mrow will be created, regardless of
   *     how many nodes the item contains.
   * @return {MmlNode} The topmost Mml node.
   */
  toMml(inferred?: boolean, forceRow?: boolean): MmlNode;

}


export abstract class MmlStack implements NodeStack {

  /**
   * @constructor
   * @extends {NodeStack}
   * @param {MmlNode[]} nodes An initial list of nodes to put on the stack.
   */
  constructor(private _nodes: MmlNode[]) { }

  /**
   * @return {MmlNode[]} The nodes on the stack.
   */
  protected get nodes(): MmlNode[] {
    return this._nodes;
  }

  /**
   * @override
   */
  public Push(...nodes: MmlNode[]) {
    this._nodes.push(...nodes);
  }


  /**
   * @override
   */
  public Pop(): MmlNode {
    return this._nodes.pop();
  }


  /**
   * @override
   */
  public get First(): MmlNode {
    return this._nodes[this.Size() - 1];
  }


  /**
   * @override
   */
  public set First(node: MmlNode) {
    this._nodes[this.Size() - 1] = node;
  }


  /**
   * @override
   */
  public get Last(): MmlNode {
    return this._nodes[0];
  }


  /**
   * @override
   */
  public set Last(node: MmlNode) {
    this._nodes[0] = node;
  }


  /**
   * @override
   */
  public Peek(n?: number): MmlNode[] {
    if (n == null) {
      n = 1;
    }
    return this._nodes.slice(this.Size() - n);
  }


  /**
   * @override
   */
  public Size(): number {
    return this._nodes.length;
  }


  /**
   * @override
   */
  public Clear(): void {
    this._nodes = [];
  }


  protected abstract get factory(): StackItemFactory;

  /**
   * @override
   */
  public toMml(inferred: boolean = true, forceRow?: boolean) {
    if (this._nodes.length === 1 && !forceRow) {
      return this.First;
    }
    // @test Two Identifiers
    return this.create(
      'node', inferred ? 'inferredMrow' : 'mrow', this._nodes, {});
  }


  /**
   * Convenience method to create nodes with the node factory on this stack.
   * @param {string} kind The kind of node to create.
   * @param {any[]} ...rest The remaining arguments for the creation method.
   * @return {MmlNode} The newly created node.
   */
  public create(kind: string, ...rest: any[]): MmlNode {
    return this.factory.configuration.nodeFactory.create(kind, ...rest);
  }

}

export interface StackItem extends NodeStack {


  /**
   * Type of stack item.
   * @type {string}
   */
  kind: string;

  /**
   * Is this a closing item, e.g., end.
   * @type {boolean}
   */
  isClose: boolean;

  /**
   * Is this an opening item, e.g., begin.
   * @type {boolean}
   */
  isOpen: boolean;

  /**
   * Is this a finalising item, i.e., one that only collects nodes.
   * @type {boolean}
   */
  isFinal: boolean;

  /**
   * Global properties of the parser.
   * @type {EnvList}
   */
   global: EnvList;

  /**
   * Local properties of the stack item.
   * @type {EnvList}
   */
   env: EnvList;

  /**
   * Copy local properties when pushed to stack?
   * @type {boolean}
   */
   copyEnv: boolean;

  /**
   * Tests if item is of the given type.
   * @param {string} kind The type.
   * @return {boolean} True if item is of that type.
   */
  isKind(kind: string): boolean;

  /**
   * Get a property of the item.
   * @param {string} key Property name.
   * @return {Prop} Property value if it exists.
   */
  getProperty(key: string): Prop;

  /**
   * Set a property.
   * @param {string} key Property name.
   * @param {Prop} value Property value.
   * @return {StackItem} The item for pipelining.
   */
  setProperty(key: string, value: Prop): StackItem;

  /**
   * Sets a list of properties.
   * @param {PropList} def The properties to set.
   * @return {StackItem} Returns the stack item object for pipelining.
   */
  setProperties(def: PropList): StackItem;

  /**
   * Convenience method for returning the string property "name".
   * @return {string} The value for the name property.
   */
  getName(): string;

  /**
   * TeX parsing in MathJax is essentially implemented via a nested stack
   * automaton. That is the tex parser works on a stack, and each item on the
   * stack can have a data stack of its own. Data on the stack is either a stack
   * item or a node.
   *
   * The checkItem method effectively implements the recursive checking of
   * input data from the parser against data recursively given on the stack.
   *
   * I.e., new input is parsed resulting in a new item. When pushed on the stack
   * it is checked against the top most item on the stack. This either leads to
   * the item being pushed onto the stack or combined with the top most
   * element(s), pushing a new item, which is recursively checked, unless an
   * error is thrown.
   *
   * A simple example: If \\end{foo} is parsed, an endItem is created, pushed on
   * the stack. Nodes on the stack are collapsed into content of the 'foo'
   * environment, until a beginItem for 'foo' is found.  If a beginItem is not
   * for 'foo' or does not exist an error is thrown.
   *
   * @param {StackItem} item The pushed item.
   * @return {CheckType} True/false or an item or node.
   */
  checkItem(item: StackItem): CheckType;

}

export interface StackItemClass extends FactoryNodeClass<StackItem> {
  // new (factory: StackItemFactory, ...args: any[]): StackItem;
}


/**
 * Abstract basic item class that implements most of the stack item
 * functionality. In particular, it contains the base method for checkItem.
 */
export abstract class BaseItem extends MmlStack implements StackItem {

  /**
   * The fail value.
   * @type {CheckType}
   */
  protected static fail: CheckType = [null, false];

  /**
   * The success value.
   * @type {CheckType}
   */
  protected static success: CheckType = [null, true];

  /**
   * A list of basic errors.
   * @type {{[key: string]: string[]}}
   */
  protected static errors: {[key: string]: string[]} = {
    // @test ExtraOpenMissingClose
    end: ['MissingBeginExtraEnd', 'Missing \\begin{%1} or extra \\end{%1}'],
    // @test ExtraCloseMissingOpen
    close: ['ExtraCloseMissingOpen', 'Extra close brace or missing open brace'],
    // @test MissingLeftExtraRight
    right: ['MissingLeftExtraRight', 'Missing \\left or extra \\right'],
    middle: ['ExtraMiddle', 'Extra \\middle']
  };


  /**
   * @override
   */
  public global: EnvList = {};

  private _env: EnvList;

  private _properties: PropList = {};


  /**
   * @constructor
   * @extends {MmlStack}
   */
  constructor(protected factory: StackItemFactory, ...nodes: MmlNode[]) {
    super(nodes);
    if (this.isOpen) {
      this._env = {};
    }
  }

  /**
   * @return {string} The type of the stack item.
   */
    public get kind(): string {
    return 'base';
  }

  /**
   * @return {EnvList} Get the private environment
   */
  public get env(): EnvList {
    return this._env;
  }

  /**
   * Set the private environment
   * @param {EnvList} value New private environemt.
   */
  public set env(value: EnvList) {
    this._env = value;
  }

  /**
   * Default is to copy local environment when pushed on stack
   */
  public get copyEnv() {
    return true;
  }

  /**
   * @override
   */
  public getProperty(key: string): Prop {
    return this._properties[key];
  }

  /**
   * @override
   */
  public setProperty(key: string, value: Prop) {
    this._properties[key] = value;
    return this;
  }


  /**
   * @return {boolean} True if item is an opening entity, i.e., it expects a
   *     closing counterpart on the stack later.
   */
  get isOpen(): boolean {
    return false;
  }

  /**
   * @return {boolean} True if item is an closing entity, i.e., it needs an
   *     opening counterpart already on the stack.
   */
  get isClose(): boolean {
    return false;
  }


  /**
   * @return {boolean} True if item is final, i.e., it contains one or multiple
   *      finished parsed nodes.
   */
  get isFinal(): boolean {
    return false;
  }


  /**
   * @override
   */
  public isKind(kind: string) {
    return kind === this.kind;
  }


  /**
   * @override
   */
  public checkItem(item: StackItem): CheckType {
    if (item.isKind('over') && this.isOpen) {
      item.setProperty('num', this.toMml(false));
      this.Clear();
    }
    if (item.isKind('cell') && this.isOpen) {
      if (item.getProperty('linebreak')) {
        return BaseItem.fail;
      }
      // @test Ampersand-error
      throw new TexError('Misplaced', 'Misplaced %1', item.getName());
    }
    if (item.isClose && this.getErrors(item.kind)) {
      // @test ExtraOpenMissingClose, ExtraCloseMissingOpen,
      //       MissingLeftExtraRight, MissingBeginExtraEnd
      const [id, message] = this.getErrors(item.kind);
      throw new TexError(id, message, item.getName());
    }
    if (!item.isFinal) {
      return BaseItem.success;
    }
    this.Push(item.First);
    return BaseItem.fail;
  }


  /**
   * Clears the item's environment.
   */
  public clearEnv() {
    for (const id of Object.keys(this.env)) {
      delete this.env[id];
    }
  }


  /**
   * @override
   */
  public setProperties(def: PropList) {
    Object.assign(this._properties, def);
    return this;
  }


  /**
   * @override
   */
  public getName() {
    return this.getProperty('name') as string;
  }


  /**
   * @override
   */
  public toString() {
    return this.kind + '[' + this.nodes.join('; ') + ']';
  }


  /**
   * Get error messages for a particular types of stack items. This reads error
   * messages from the static errors object, which can be extended in
   * subclasses.
   * @param {string} kind The stack item type.
   * @return {string[]} The list of arguments for the TeXError.
   */
  public getErrors(kind: string): string[] {
    const CLASS = (this.constructor as typeof BaseItem);
    return (CLASS.errors || {})[kind] || BaseItem.errors[kind];
  }

}
