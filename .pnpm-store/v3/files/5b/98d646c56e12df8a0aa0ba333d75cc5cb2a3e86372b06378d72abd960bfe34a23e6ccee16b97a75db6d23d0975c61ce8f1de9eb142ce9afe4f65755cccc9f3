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
 * @fileoverview The Stack for the TeX parser.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import NodeUtil from './NodeUtil.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {StackItem, EnvList} from './StackItem.js';
import StackItemFactory from './StackItemFactory.js';


export default class Stack {

  /**
   * @type {EnvList}
   */
  public global: EnvList = {};

  /**
   * The actual stack, a list of stack items.
   * @type {Array.<StackItem>}
   */
  private stack: StackItem[] = [];

  /**
   * @constructor
   * @param {StackItemFactory} factory The stack item factory.
   * @param {EnvList} env The environment.
   * @param {boolean} inner True if parser has been called recursively.
   */
  constructor(private _factory: StackItemFactory,
              private _env: EnvList, inner: boolean) {
    this.global = {isInner: inner};
    this.stack = [ this._factory.create('start', this.global) ];
    if (_env) {
      this.stack[0].env = _env;
    }
    this.env = this.stack[0].env;
  }


  /**
   * Set the environment of the stack.
   * @param {EnvList} env The new environment.
   */
  public set env(env: EnvList) {
    this._env = env;
  }


  /**
   * Retrieves the environment of that stack.
   * @return {EnvList} The current environment.
   */
  public get env(): EnvList {
    return this._env;
  }


  /**
   * Pushes items or nodes onto stack.
   * @param {...StackItem|MmlNode} args A list of items to push.
   */
  public Push(...args: (StackItem | MmlNode)[]) {
    for (const node of args) {
      if (!node) {
        continue;
      }
      const item = NodeUtil.isNode(node) ?
        this._factory.create('mml', node) : node as StackItem;
      item.global = this.global;
      const [top, success] =
        this.stack.length ? this.Top().checkItem(item) : [null, true];
      if (!success) {
        continue;
      }
      if (top) {
        this.Pop();
        this.Push(...top);
        continue;
      }
      this.stack.push(item);
      if (item.env) {
        if (item.copyEnv) {
          Object.assign(item.env, this.env);
        }
        this.env = item.env;
      } else {
        item.env = this.env;
      }
    }
  }


  /**
   * Pop the topmost elements off the stack.
   * @return {StackItem} A stack item.
   */
  public Pop(): StackItem {
    const item = this.stack.pop();
    if (!item.isOpen) {
      delete item.env;
    }
    this.env = (this.stack.length ? this.Top().env : {});
    return item;
  }


  /**
   * Lookup the nth elements on the stack without removing them.
   * @param {number=} n Position of element that should be returned. Default 1.
   * @return {StackItem} Nth item on the stack.
   */
  public Top(n: number = 1): StackItem {
    return this.stack.length < n ? null : this.stack[this.stack.length - n];
  }


  /**
   * Lookup the topmost element on the stack, returning the Mml node in that
   * item. Optionally pops the Mml node from that stack item.
   * @param {boolean=} noPop Pop top item if true.
   * @return {MmlNode} The Mml node in the topmost stack item.
   */
  public Prev(noPop?: boolean): MmlNode | void {
    const top = this.Top();
    return noPop ? top.First : top.Pop();
  }


  /**
   * @override
   */
  public toString() {
    return 'stack[\n  ' + this.stack.join('\n  ') + '\n]';
  }

}
