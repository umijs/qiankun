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
 * @fileoverview Explorers for A11Y purposes.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {A11yDocument, Region} from './Region.js';
import Sre from '../sre.js';

/**
 * A11y explorers.
 * @interface
 */
export interface Explorer {

  /**
   * Flag indicating if the explorer is active.
   * @type {boolean}
   */
  active: boolean;

  /**
   * Flag indicating if event bubbling is stopped.
   * @type {boolean}
   */
  stoppable: boolean;

  /**
   * Attaches navigator and its event handlers to a node.
   */
  Attach(): void;

  /**
   * Detaches navigator and its event handlers to a node.
   */
  Detach(): void;

  /**
   * Starts the explorer.
   */
  Start(): void;

  /**
   * Stops the explorer.
   */
  Stop(): void;


  /**
   * Adds the events of the explorer to the node's event listener.
   */
  AddEvents(): void;

  /**
   * Removes the events of the explorer from the node's event listener.
   */
  RemoveEvents(): void;

  /**
   * Update the explorer after state changes.
   * @param {boolean=} force Forces the update in any case. (E.g., even if
   *     explorer is inactive.)
   */
  Update(force?: boolean): void;

}


/**
 * Abstract class implementing the very basic explorer functionality.
 *
 * Explorers use creator pattern to ensure they automatically attach themselves
 * to their node. This class provides the create method and is consequently not
 * declared abstract.
 *
 * @constructor
 * @implements {Explorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export class AbstractExplorer<T> implements Explorer {

  /**
   * @override
   */
  public stoppable: boolean = true;

  /**
   * Named events and their functions.
   * @type {[string, function(x: Event)][]}
   */
  protected events: [string, (x: Event) => void][] = [];

  /**
   * The Sre highlighter associated with the walker.
   * @type {Sre.highlighter}
   */
  protected highlighter: Sre.highlighter = this.getHighlighter();

  /**
   * Flag if explorer is active.
   * @type {boolean}
   */
  private _active: boolean = false;

  /**
   * Stops event bubbling.
   * @param {Event} event The event that is stopped.
   */
  protected static stopEvent(event: Event) {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    } else if (event.stopPropagation) {
      event.stopPropagation();
    }
    event.cancelBubble = true;
  }

  /**
   * Creator pattern for explorers.
   * @param {A11yDocument} document The current document.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {any[]} ...rest Remaining information.
   * @return {Explorer} An object of the particular explorer class.
   *
   * @template T
   */
  public static create<T>(
    document: A11yDocument,
    region: Region<T>,
    node: HTMLElement, ...rest: any[]
  ): Explorer {
    let explorer = new this(document, region, node, ...rest);
    return explorer;
  }

  /**
   * @constructor
   * @param {A11yDocument} document The current document.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {any[]} ...rest Remaining information.
   */
  protected constructor(
    public document: A11yDocument,
    protected region: Region<T>,
    protected node: HTMLElement, ..._rest: any[]
  ) {
  }


  /**
   * @return {[string, (x: Event) => void][]} The events associated with this
   *     explorer.
   */
  protected Events(): [string, (x: Event) => void][] {
    return this.events;
  }


  /**
   * @override
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   * @override
   */
  public set active(flag: boolean) {
    this._active = flag;
  }

  /**
   * @override
   */
  public Attach() {
    this.AddEvents();
  }

  /**
   * @override
   */
  public Detach() {
    this.RemoveEvents();
  }

  /**
   * @override
   */
  public Start() {
    this.highlighter = this.getHighlighter();
    this.active = true;
  }

  /**
   * @override
   */
  public Stop() {
    if (this.active) {
      this.region.Clear();
      this.region.Hide();
      this.active = false;
    }
  }

  /**
   * @override
   */
  public AddEvents() {
    for (let [eventkind, eventfunc]  of this.events) {
      this.node.addEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  public RemoveEvents() {
    for (let [eventkind, eventfunc]  of this.events) {
      this.node.removeEventListener(eventkind, eventfunc);
    }
  }

  /**
   * @override
   */
  // @ts-ignore: unused variable
  public Update(force: boolean = false): void {}


  /**
   * @return {Sre.Highlighter} A highlighter for the explorer.
   */
  protected getHighlighter(): Sre.highlighter {
    let opts = this.document.options.a11y;
    let foreground = {color: opts.foregroundColor.toLowerCase(),
                      alpha: opts.foregroundOpacity / 100};
    let background = {color: opts.backgroundColor.toLowerCase(),
                      alpha: opts.backgroundOpacity / 100};
    return Sre.getHighlighter(
      background, foreground,
      {renderer: this.document.outputJax.name, browser: 'v3'});
  }

  /**
   * Stops the events of this explorer from bubbling.
   * @param {Event} event The event to stop.
   */
  protected stopEvent(event: Event) {
    if (this.stoppable) {
      AbstractExplorer.stopEvent(event);
    }
  }

}
