/*************************************************************
 *
 *  Copyright (c) 2021-2022 The MathJax Consortium
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
 * @fileoverview  Mixin that implements lazy typesetting
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathDocumentConstructor, ContainerList} from '../../core/MathDocument.js';
import {MathItem, STATE, newState} from '../../core/MathItem.js';
import {HTMLMathItem} from '../../handlers/html/HTMLMathItem.js';
import {HTMLDocument} from '../../handlers/html/HTMLDocument.js';
import {HTMLHandler} from '../../handlers/html/HTMLHandler.js';
import {handleRetriesFor} from '../../util/Retries.js';
import {OptionList} from '../../util/Options.js';

/**
 * Add the needed function to the window object.
 */
declare const window: {
  requestIdleCallback: (callback: () => void) => void;
  addEventListener: ((type: string, handler: (event: Event) => void) => void);
  matchMedia: (type: string) => {
    addListener: (handler: (event: Event) => void) => void;
  };
};

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * A set of lazy MathItems
 */
export type LazySet = Set<string>;

/*==========================================================================*/

/**
 * The data to map expression marker IDs back to their MathItem.
 */
export class LazyList<N, T, D> {

  /**
   * The next ID to use
   */
  protected id: number = 0;

  /**
   * The map from IDs to MathItems
   */
  protected items: Map<string, LazyMathItem<N, T, D>> = new Map();

  /**
   * Add a MathItem to the list and return its ID
   *
   * @param {LazyMathItem} math   The item to add
   * @return {string}             The id for the newly added item
   */
  public add(math: LazyMathItem<N, T, D>): string {
    const id = String(this.id++);
    this.items.set(id,  math);
    return id;
  }

  /**
   * Get the MathItem with the given ID
   *
   * @param {string} id       The ID of the MathItem to get
   * @return {LazyMathItem}   The MathItem having that ID (if any)
   */
  public get(id: string): LazyMathItem<N, T, D> {
    return this.items.get(id);
  }

  /**
   * Remove an item from the map
   *
   * @param {string} id   The ID of the MathItem to remove
   */
  public delete(id: string) {
    return this.items.delete(id);
  }

}

/*==========================================================================*/

newState('LAZYALWAYS', STATE.FINDMATH + 3);

/**
 * The attribute to use for the ID on the marker node
 */
export const LAZYID = 'data-mjx-lazy';

/**
 * The properties added to MathItem for lazy typesetting
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface LazyMathItem<N, T, D> extends MathItem<N, T, D> {

  /**
   * True when the MathItem needs to be lazy compiled
   */
  lazyCompile: boolean;

  /**
   * True when the MathItem needs to be lazy displayed
   */
  lazyTypeset: boolean;

  /**
   * The DOM node used to mark the location of the math to be lazy typeset
   */
  lazyMarker: N;

  /**
   * True if this item is a TeX MathItem
   */
  lazyTex: boolean;

}

/**
 * The mixin for adding lazy typesetting to MathItems
 *
 * @param {B} BaseMathItem      The MathItem class to be extended
 * @return {AssistiveMathItem}  The augmented MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function LazyMathItemMixin<N, T, D, B extends Constructor<HTMLMathItem<N, T, D>>>(
  BaseMathItem: B
): Constructor<LazyMathItem<N, T, D>> & B {

  return class extends BaseMathItem {

    /**
     * True when this item should be skipped during compilation
     * (i.e., it is not showing on screen, and has not needed to be
     * compiled for a later TeX expression that is showing).
     */
    public lazyCompile: boolean = true;

    /**
     * True when this item should be skipped during typesetting
     * (i.e., it has not yet appeared on screen).
     */
    public lazyTypeset: boolean = true;

    /**
     * The marker DOM node for this item.
     */
    public lazyMarker: N;

    /**
     * True if this is a TeX expression.
     */
    public lazyTex: boolean = false;

    /**
     * @override
     */
    constructor(...args: any[]) {
      super(...args);
      if (!this.end.node) {
        //
        // This is a MathItem that isn't in the document
        // (so either from semantic enrich, or from convert())
        // and should be typeset as usual.
        //
        this.lazyCompile = this.lazyTypeset = false;
      }
    }

    /**
     * Initially don't compile math, just use an empty math item,
     *   then when the math comes into view (or is before something
     *   that comes into view), compile it properly and mark the item
     *   as only needing to be typeset.
     *
     * @override
     */
    public compile(document: LazyMathDocument<N, T, D>) {
      if (!this.lazyCompile) {
        super.compile(document);
        return;
      }
      if (this.state() < STATE.COMPILED) {
        this.lazyTex = (this.inputJax.name === 'TeX');
        this.root = document.mmlFactory.create('math');
        this.state(STATE.COMPILED);
      }
    }

    /**
     * Only update the state if restore is true or false (null is used for setting lazy states)
     * @override
     */
    public state(state: number = null, restore: boolean = false) {
      if (restore !== null) super.state(state, restore);
      return super.state();
    }

    /**
     * Initially, just insert a marker for where the math will go, and
     *   track it in the lazy list.  Then, when it comes into view,
     *   typeset it properly.
     *
     * @override
     */
    public typeset(document: LazyMathDocument<N, T, D>) {
      if (!this.lazyTypeset) {
        super.typeset(document);
        return;
      }
      if (this.state() < STATE.TYPESET) {
        const adaptor = document.adaptor;
        if (!this.lazyMarker) {
          const id = document.lazyList.add(this);
          this.lazyMarker = adaptor.node('mjx-lazy', {[LAZYID]: id});
          this.typesetRoot = adaptor.node('mjx-container', {}, [this.lazyMarker]);
        }
        this.state(STATE.TYPESET);
      }
    }

    /**
     * When the MathItem is added to the page, set the observer to watch
     *   for it coming into view so that it can be typeset.
     *
     * @override
     */
    public updateDocument(document: LazyMathDocument<N, T, D>) {
      super.updateDocument(document);
      if (this.lazyTypeset) {
        document.lazyObserver.observe(this.lazyMarker as any as Element);
      }
    }

  };

}

/*==========================================================================*/

/**
 * The properties added to MathDocument for lazy typesetting
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface LazyMathDocument<N, T, D> extends HTMLDocument<N, T, D> {

  /**
   * The Intersection Observer used to track the appearance of the expression markers
   */
  lazyObserver: IntersectionObserver;

  /**
   * The mapping of markers to MathItems
   */
  lazyList: LazyList<N, T, D>;

  /**
   * The containers whose contents should always be typeset
   */
  lazyAlwaysContainers: N[];

  /**
   * A function that will typeset all the remaining expressions (e.g., for printing)
   */
  lazyTypesetAll(): Promise<void>;

  /**
   * Mark the math items that are to be always typeset
   */
  lazyAlways(): void;

}

/**
 * The mixin for adding lazy typesetting to MathDocuments
 *
 * @param {B} BaseDocument        The MathDocument class to be extended
 * @return {LazyMathDocument}     The Lazy MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function LazyMathDocumentMixin<N, T, D,
B extends MathDocumentConstructor<HTMLDocument<N, T, D>>>(
  BaseDocument: B
): MathDocumentConstructor<HTMLDocument<N, T, D>> & B {

  return class BaseClass extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      lazyMargin: '200px',
      lazyAlwaysTypeset: null,
      renderActions: {
        ...BaseDocument.OPTIONS.renderActions,
        lazyAlways: [STATE.LAZYALWAYS, 'lazyAlways', '', false]
      }
    };

    /**
     * The Intersection Observer used to track the appearance of the expression markers
     */
    public lazyObserver: IntersectionObserver;

    /**
     * The mapping of markers to MathItems
     */
    public lazyList: LazyList<N, T, D>;

    /**
     * The containers whose contents should always be typeset
     */
    public lazyAlwaysContainers: N[] = null;

    /**
     * Index of last container where math was found in lazyAlwaysContainers
     */
    public lazyAlwaysIndex: number = 0;

    /**
     * A promise to make sure our compiling/typesetting is sequential
     */
    protected lazyPromise: Promise<void> = Promise.resolve();

    /**
     * The function used to typeset a set of lazy MathItems.
     *   (uses requestIdleCallback if available, or setTimeout otherwise)
     */
    protected lazyProcessSet: () => void;

    /**
     * True when a set of MathItems is queued for being processed
     */
    protected lazyIdle: boolean = false;

    /**
     * The set of items that have come into view
     */
    protected lazySet: LazySet = new Set();

    /**
     * Augment the MathItem class used for this MathDocument,
     *   then create the intersection observer and lazy list,
     *   and bind the lazyProcessSet function to this instance
     *   so it can be used as a callback more easily. Add the
     *   event listeners to typeset everything before printing.
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      //
      //  Use the LazyMathItem for math items
      //
      this.options.MathItem =
        LazyMathItemMixin<N, T, D, Constructor<HTMLMathItem<N, T, D>>>(this.options.MathItem);
      //
      //  Allocate a process bit for lazyAlways
      //
      const ProcessBits = (this.constructor as typeof HTMLDocument).ProcessBits;
      !ProcessBits.has('lazyAlways') && ProcessBits.allocate('lazyAlways');
      //
      //  Set up the lazy observer and other needed data
      //
      this.lazyObserver = new IntersectionObserver(this.lazyObserve.bind(this), {rootMargin: this.options.lazyMargin});
      this.lazyList = new LazyList<N, T, D>();
      const callback = this.lazyHandleSet.bind(this);
      this.lazyProcessSet = (window && window.requestIdleCallback ?
                             () => window.requestIdleCallback(callback) :
                             () => setTimeout(callback, 10));
      //
      //  Install print listeners to typeset the rest of the document before printing
      //
      if (window) {
        let done = false;
        const handler = () => {
          !done && this.lazyTypesetAll();
          done = true;
        };
        window.matchMedia('print').addListener(handler);  // for Safari
        window.addEventListener('beforeprint', handler);  // for everyone else
      }
    }

    /**
     * Check all math items for those that should always be typeset
     */
    public lazyAlways() {
      if (!this.lazyAlwaysContainers || this.processed.isSet('lazyAlways')) return;
      for (const item of this.math) {
        const math = item as LazyMathItem<N, T, D>;
        if (math.lazyTypeset && this.lazyIsAlways(math)) {
          math.lazyCompile = math.lazyTypeset = false;
        }
      }
      this.processed.set('lazyAlways');
    }

    /**
     * Check if the MathItem is in one of the containers to always typeset.
     *  (start looking using the last container where math was found,
     *   in case the next math is in the same container).
     *
     * @param {LazyMathItem<N,T,D>} math   The MathItem to test
     * @return {boolean}   True if one of the document's containers holds the MathItem
     */
    protected lazyIsAlways(math: LazyMathItem<N, T, D>): boolean {
      if (math.state() < STATE.LAZYALWAYS) {
        math.state(STATE.LAZYALWAYS);
        const node = math.start.node;
        const adaptor = this.adaptor;
        const start = this.lazyAlwaysIndex;
        const end = this.lazyAlwaysContainers.length;
        do {
          const container = this.lazyAlwaysContainers[this.lazyAlwaysIndex];
          if (adaptor.contains(container, node)) return true;
          if (++this.lazyAlwaysIndex >= end) {
            this.lazyAlwaysIndex = 0;
          }
        } while (this.lazyAlwaysIndex !== start);
      }
      return false;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.LAZYALWAYS) {
        this.processed.clear('lazyAlways');
      }
      return this;
    }

    /**
     * Function to typeset all remaining expressions (for printing, etc.)
     *
     * @return {Promise}   Promise that is resolved after the typesetting completes.
     */
    public async lazyTypesetAll(): Promise<void> {
      //
      // The state we need to go back to (COMPILED or TYPESET).
      //
      let state = STATE.LAST;
      //
      // Loop through all the math...
      //
      for (const item of this.math) {
        const math = item as LazyMathItem<N, T, D>;
        //
        // If it is not lazy compile or typeset, skip it.
        //
        if (!math.lazyCompile && !math.lazyTypeset) continue;
        //
        // Mark the state that we need to start at.
        //
        if (math.lazyCompile) {
          math.state(STATE.COMPILED - 1);
          state = STATE.COMPILED;
        } else {
          math.state(STATE.TYPESET - 1);
          if (STATE.TYPESET < state) state = STATE.TYPESET;
        }
        //
        // Mark it as not lazy and remove it from the observer.
        //
        math.lazyCompile = math.lazyTypeset = false;
        math.lazyMarker && this.lazyObserver.unobserve(math.lazyMarker as any as Element);
      }
      //
      // If something needs updating
      //
      if (state === STATE.LAST) return Promise.resolve();
      //
      // Reset the document state to the starting state that we need.
      //
      this.state(state - 1, null);
      //
      // Save the SVG font cache and set it to "none" temporarily
      //   (needed by Firefox, which doesn't seem to process the
      //    xlinks otherwise).
      //
      const fontCache = this.outputJax.options.fontCache;
      if (fontCache) this.outputJax.options.fontCache = 'none';
      //
      //  Typeset the math and put back the font cache when done.
      //
      this.reset();
      return handleRetriesFor(() => this.render()).then(() => {
        if (fontCache) this.outputJax.options.fontCache = fontCache;
      });
    }

    /**
     * The function used by the IntersectionObserver to monitor the markers coming into view.
     * When one (or more) does, add its math item to or remove it from the set to be processed, and
     *   if added to the set, queue an idle task, if one isn't already pending.
     *
     * The idea is, if you start scrolling and reveal an expression marker, we add it into
     * the set and queue an idle task. But if you keep scrolling and the idle task hasn't run
     * yet, the mark may move out of view, and we don't want to waste time typesetting it, so
     * we remove it from the set. When you stop scrolling and the idle task finally runs, it
     * takes the expressions still in the set (those should be the ones still in view) and
     * starts typesetting them after having created a new set to add expressions to. If one
     * of the expressions loads an extension and the idle task has to pause, you can add new
     * expressions into the new list (or remove them from there), but can't affect the
     * current idle-task list. Those will be typeset even if they scroll out of view at that
     * point.
     *
     * Note that it is possible that an expression is added to the set and then removed
     * before the idle task runs, and it could be that the set is empty when it does. Then
     * the idle task does nothing, and new expressions are added to the new set to be
     * processed by the next idle task.
     *
     * @param {IntersectionObserverEntry[]} entries   The markers that have come into or out of view.
     */
    protected lazyObserve(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        const id = this.adaptor.getAttribute(entry.target as any as N, LAZYID);
        const math = this.lazyList.get(id);
        if (!math) continue;
        if (!entry.isIntersecting) {
          this.lazySet.delete(id);
          continue;
        }
        this.lazySet.add(id);
        if (!this.lazyIdle) {
          this.lazyIdle = true;
          this.lazyProcessSet();
        }
      }
    }

    /**
     * Mark the MathItems in the set as needing compiling or typesetting,
     *   and for TeX items, make sure the earlier TeX items are typeset
     *   (in case they have automatic numbers, or define macros, etc.).
     * Then rerender the page to update the visible equations.
     */
    protected lazyHandleSet() {
      const set = this.lazySet;
      this.lazySet = new Set();
      this.lazyPromise = this.lazyPromise.then(() => {
        let state = this.compileEarlierItems(set) ? STATE.COMPILED : STATE.TYPESET;
        state = this.resetStates(set, state);
        this.state(state - 1, null); // reset processed bits to allow reprocessing
        return handleRetriesFor(() => {
          this.render();
          this.lazyIdle = false;
        });
      });
    }

    /**
     * Set the states of the MathItems in the set, depending on
     *   whether they need compiling or just typesetting, and
     *   update the state needed for the page rerendering.
     *
     * @param {LazySet} set    The set of math items to update
     * @param {number} state   The state needed for the items
     * @return {number}        The updated state based on the items
     */
    protected resetStates(set: LazySet, state: number): number {
      for (const id of set.values()) {
        const math = this.lazyList.get(id);
        if (math.lazyCompile) {
          math.state(STATE.COMPILED - 1);
          state = STATE.COMPILED;
        } else {
          math.state(STATE.TYPESET - 1);
        }
        math.lazyCompile = math.lazyTypeset = false;
        math.lazyMarker && this.lazyObserver.unobserve(math.lazyMarker as any as Element);
      }
      return state;
    }

    /**
     * Mark any TeX items (earlier than the ones in the set) to be compiled.
     *
     * @param {LazySet} set   The set of items that are newly visible
     * @return {boolean}      True if there are TeX items to be typeset
     */
    protected compileEarlierItems(set: LazySet): boolean {
      let math = this.earliestTex(set);
      if (!math) return false;
      let compile = false;
      for (const item of this.math) {
        const earlier = item as LazyMathItem<N, T, D>;
        if (earlier === math || !earlier?.lazyCompile || !earlier.lazyTex) {
          break;
        }
        earlier.lazyCompile = false;
        earlier.lazyMarker && this.lazyObserver.unobserve(earlier.lazyMarker as any as Element);
        earlier.state(STATE.COMPILED - 1);
        compile = true;
      }
      return compile;
    }

    /**
     * Find the earliest TeX math item in the set, if any.
     *
     * @param {LazySet} set     The set of newly visble math items
     * @return {LazyMathItem}   The earliest TeX math item in the set, if any
     */
    protected earliestTex(set: LazySet): LazyMathItem<N, T, D> {
      let min: number = null;
      let minMath = null;
      for (const id of set.values()) {
        const math = this.lazyList.get(id);
        if (!math.lazyTex) continue;
        if (min === null || parseInt(id) < min) {
          min = parseInt(id);
          minMath = math;
        }
      }
      return minMath;
    }

    /**
     * If any of the removed items are observed or in the lazy list, remove them.
     *
     * @override
     */
    public clearMathItemsWithin(containers: ContainerList<N>) {
      const items = super.clearMathItemsWithin(containers) as LazyMathItem<N, T, D>[];
      for (const math of items) {
        const marker = math.lazyMarker;
        if (marker) {
          this.lazyObserver.unobserve(marker as any as Element);
          this.lazyList.delete(this.adaptor.getAttribute(marker, LAZYID));
        }
      }
      return items;
    }

    /**
     * @override
     */
    public render() {
      //
      // Get the containers whose content should always be typeset
      //
      const always = this.options.lazyAlwaysTypeset;
      this.lazyAlwaysContainers = !always ? null :
        this.adaptor.getElements(Array.isArray(always) ? always : [always], this.document);
      this.lazyAlwaysIndex = 0;
      super.render();
      return this;
    }

  };

}

/*==========================================================================*/

/**
 * Add lazy typesetting support to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chaining extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function LazyHandler<N, T, D>(handler: HTMLHandler<N, T, D>): HTMLHandler<N, T, D> {
  //
  // Only update the document class if we can handle IntersectionObservers
  //
  if (typeof IntersectionObserver !== 'undefined') {
    handler.documentClass =
      LazyMathDocumentMixin<N, T, D, MathDocumentConstructor<HTMLDocument<N, T, D>>>(
        handler.documentClass
      ) as typeof HTMLDocument;
  }
  return handler;
}
