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
 * @fileoverview  Implements the interface and abstract class for MathDocument objects
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {userOptions, defaultOptions, OptionList, expandable} from '../util/Options.js';
import {InputJax, AbstractInputJax} from './InputJax.js';
import {OutputJax, AbstractOutputJax} from './OutputJax.js';
import {MathList, AbstractMathList} from './MathList.js';
import {MathItem, AbstractMathItem, STATE} from './MathItem.js';
import {MmlNode, TextNode} from './MmlTree/MmlNode.js';
import {MmlFactory} from '../core/MmlTree/MmlFactory.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {BitField, BitFieldClass} from '../util/BitField.js';

import {PrioritizedList} from '../util/PrioritizedList.js';

/*****************************************************************/

/**
 * A function to call while rendering a document (usually calls a MathDocument method)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type RenderDoc<N, T, D> = (document: MathDocument<N, T, D>) => boolean;

/**
 * A function to call while rendering a MathItem (usually calls one of its methods)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type RenderMath<N, T, D> = (math: MathItem<N, T, D>, document: MathDocument<N, T, D>) => boolean;

/**
 * The data for an action to perform during rendering or conversion
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type RenderData<N, T, D> = {
  id: string,                           //  The name for the action
  renderDoc: RenderDoc<N, T, D>,        //  The action to take during a render() call
  renderMath: RenderMath<N, T, D>,      //  The action to take during a rerender() or convert() call
  convert: boolean                      //  Whether the action is to be used during convert()
};

/**
 * The data used to define a render action in configurations and options objects
 *   (the key is used as the id, the number in the data below is the priority, and
 *    the remainind data is as described below; if no boolean is given, convert = true
 *    by default)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type RenderAction<N, T, D> =
  [number] |                                                     // id (i.e., key) is method name to use
  [number, string] |                                             // string is method to call
  [number, string, string] |                                     // the strings are methods names for doc and math
  [number, RenderDoc<N, T, D>, RenderMath<N, T, D>] |            // explicit functions for doc and math
  [number, boolean] |                                            // same as first above, with boolean for convert
  [number, string, boolean] |                                    // same as second above, with boolean for convert
  [number, string, string, boolean] |                            // same as third above, with boolean for convert
  [number, RenderDoc<N, T, D>, RenderMath<N, T, D>, boolean];    // same as forth above, with boolean for convert

/**
 * An object representing a collection of rendering actions (id's tied to priority-and-method data)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export type RenderActions<N, T, D> = {[id: string]: RenderAction<N, T, D>};

/**
 * Implements a prioritized list of render actions.  Extensions can add actions to the list
 *   to make it easy to extend the normal typesetting and conversion operations.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class RenderList<N, T, D> extends PrioritizedList<RenderData<N, T, D>> {

  /**
   * Creates a new RenderList from an initial list of rendering actions
   *
   * @param {RenderActions} actions The list of actions to take during render(), rerender(), and convert() calls
   * @returns {RenderList}    The newly created prioritied list
   */
  public static create<N, T, D>(actions: RenderActions<N, T, D>): RenderList<N, T, D> {
    const list = new this<N, T, D>();
    for (const id of Object.keys(actions)) {
      const [action, priority] = this.action<N, T, D>(id, actions[id]);
      if (priority) {
        list.add(action, priority);
      }
    }
    return list;
  }

  /**
   * Parses a RenderAction to produce the correspinding RenderData item
   *  (e.g., turn method names into actual functions that call the method)
   *
   * @param {string} id               The id of the action
   * @param {RenderAction} action     The RenderAction defining the action
   * @returns {[RenderData,number]}   The corresponding RenderData definition for the action and its priority
   */
  public static action<N, T, D>(id: string, action: RenderAction<N, T, D>): [RenderData<N, T, D>, number] {
    let renderDoc, renderMath;
    let convert = true;
    let priority = action[0];
    if (action.length === 1 || typeof action[1] === 'boolean') {
      action.length === 2 && (convert = action[1] as boolean);
      [renderDoc, renderMath] = this.methodActions(id);
    } else if (typeof action[1] === 'string') {
      if (typeof action[2] === 'string') {
        action.length === 4 && (convert = action[3] as boolean);
        const [method1, method2] = action.slice(1) as [string, string];
        [renderDoc, renderMath] = this.methodActions(method1, method2);
      } else {
        action.length === 3 && (convert = action[2] as boolean);
        [renderDoc, renderMath] = this.methodActions(action[1] as string);
      }
    } else {
      action.length === 4 && (convert = action[3] as boolean);
      [renderDoc, renderMath] = action.slice(1) as [RenderDoc<N, T, D>, RenderMath<N, T, D>];
    }
    return [{id, renderDoc, renderMath, convert} as RenderData<N, T, D>, priority];
  }

  /**
   * Produces the doc and math actions for the given method name(s)
   *   (a blank name is a no-op)
   *
   * @param {string} method1    The method to use for the render() call
   * @param {string} method1    The method to use for the rerender() and convert() calls
   */
  protected static methodActions(method1: string, method2: string = method1) {
    return [
      (document: any) => {method1 && document[method1](); return false; },
      (math: any, document: any) => {method2 && math[method2](document); return false; }
    ];
  }

  /**
   * Perform the document-level rendering functions
   *
   * @param {MathDocument} document   The MathDocument whose methods are to be called
   * @param {number=} start           The state at which to start rendering (default is UNPROCESSED)
   */
  public renderDoc(document: MathDocument<N, T, D>, start: number = STATE.UNPROCESSED) {
    for (const item of this.items) {
      if (item.priority >= start) {
        if (item.item.renderDoc(document)) return;
      }
    }
  }

  /**
   * Perform the MathItem-level rendering functions
   *
   * @param {MathItem} math           The MathItem whose methods are to be called
   * @param {MathDocument} document   The MathDocument to pass to the MathItem methods
   * @param {number=} start           The state at which to start rendering (default is UNPROCESSED)
   */
  public renderMath(math: MathItem<N, T, D>, document: MathDocument<N, T, D>, start: number = STATE.UNPROCESSED) {
    for (const item of this.items) {
      if (item.priority >= start) {
        if (item.item.renderMath(math, document)) return;
      }
    }
  }

  /**
   * Perform the MathItem-level conversion functions
   *
   * @param {MathItem} math           The MathItem whose methods are to be called
   * @param {MathDocument} document   The MathDocument to pass to the MathItem methods
   * @param {number=} end             The state at which to end rendering (default is LAST)
   */
  public renderConvert(math: MathItem<N, T, D>, document: MathDocument<N, T, D>, end: number = STATE.LAST) {
    for (const item of this.items) {
      if (item.priority > end) return;
      if (item.item.convert) {
        if (item.item.renderMath(math, document)) return;
      }
    }
  }

  /**
   * Find an entry in the list with a given ID
   *
   * @param {string} id            The id to search for
   * @returns {RenderData|null}   The data for the given id, if found, or null
   */
  public findID(id: string): RenderData<N, T, D> | null {
    for (const item of this.items) {
      if (item.item.id === id) {
        return item.item;
      }
    }
    return null;
  }

}

/*****************************************************************/

/**
 * The ways of specifying a container (a selector string, an actual node,
 * or an array of those (e.g., the result of document.getElementsByTagName())
 *
 * @template N  The HTMLElement node class
 */
export type ContainerList<N> = string | N | (string | N | N[])[];

/**
 * The options allowed for the reset() method
 */
export type ResetList = {
  all?: boolean,
  processed?: boolean,
  inputJax?: any[],
  outputJax?: any[]
};

/**
 * The default option list for the reset() method
 */
export const resetOptions: ResetList = {
  all: false,
  processed: false,
  inputJax: null,
  outputJax: null
};

/**
 * The option list for when all options are to be reset
 */
export const resetAllOptions: ResetList = {
  all: true,
  processed: true,
  inputJax: [],
  outputJax: []
};

/*****************************************************************/
/**
 *  The MathDocument interface
 *
 *  The MathDocument is created by MathJax.Document() and holds the
 *  document, the math found in it, and so on.  The methods of the
 *  MathDocument all return the MathDocument itself, so you can
 *  chain the method calls.  E.g.,
 *
 *    const html = MathJax.Document('<html>...</html>');
 *    html.findMath()
 *        .compile()
 *        .getMetrics()
 *        .typeset()
 *        .updateDocument();
 *
 *  The MathDocument is the main interface for page authors to
 *  interact with MathJax.
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface MathDocument<N, T, D> {
  /**
   * The document being processed (e.g., DOM document, or Markdown string)
   */
  document: D;

  /**
   * The kind of MathDocument (e.g., "HTML")
   */
  kind: string;

  /**
   * The options for the document
   */
  options: OptionList;

  /**
   * The list of MathItems found in this page
   */
  math: MathList<N, T, D>;

  /**
   * The list of actions to take during a render() or convert() call
   */
  renderActions: RenderList<N, T, D>;

  /**
   * This object tracks what operations have been performed, so that (when
   *  asynchronous operations are used), the ones that have already been
   *  completed won't be performed again.
   */
  processed: BitField;

  /**
   * An array of input jax to run on the document
   */
  inputJax: InputJax<N, T, D>[];

  /**
   * The output jax to use for the document
   */
  outputJax: OutputJax<N, T, D>;

  /**
   * The DOM adaptor to use for input and output
   */
  adaptor: DOMAdaptor<N, T, D>;

  /**
   * The MmlFactory to be used for input jax and error processing
   */
  mmlFactory: MmlFactory;

  /**
   * @param {string} id      The id of the action to add
   * @param {any[]} action   The RenderAction to take
   */
  addRenderAction(id: string, ...action: any[]): void;

  /**
   * @param {string} id   The id of the action to remove
   */
  removeRenderAction(id: string): void;

  /**
   * Perform the renderActions on the document
   */
  render(): MathDocument<N, T, D>;

  /**
   * Rerender the MathItems on the page
   *
   * @param {number=} start    The state to start rerendering at
   * @return {MathDocument}    The math document instance
   */
  rerender(start?: number): MathDocument<N, T, D>;

  /**
   * Convert a math string to the document's output format
   *
   * @param {string} math           The math string to convert
   * @params {OptionList} options   The options for the conversion (e.g., format, ex, em, etc.)
   * @return {MmlNode|N}            The MmlNode or N node for the converted content
   */
  convert(math: string, options?: OptionList): MmlNode | N;

  /**
   * Locates the math in the document and constructs the MathList
   *  for the document.
   *
   * @param {OptionList} options  The options for locating the math
   * @return {MathDocument}       The math document instance
   */
  findMath(options?: OptionList): MathDocument<N, T, D>;

  /**
   * Calls the input jax to process the MathItems in the MathList
   *
   * @return {MathDocument}  The math document instance
   */
  compile(): MathDocument<N, T, D>;

  /**
   * Gets the metric information for the MathItems
   *
   * @return {MathDocument}  The math document instance
   */
  getMetrics(): MathDocument<N, T, D>;

  /**
   * Calls the output jax to process the compiled math in the MathList
   *
   * @return {MathDocument}  The math document instance
   */
  typeset(): MathDocument<N, T, D>;

  /**
   * Updates the document to include the typeset math
   *
   * @return {MathDocument}  The math document instance
   */
  updateDocument(): MathDocument<N, T, D>;

  /**
   * Removes the typeset math from the document
   *
   * @param {boolean} restore  True if the original math should be put
   *                            back into the document as well
   * @return {MathDocument}    The math document instance
   */
  removeFromDocument(restore?: boolean): MathDocument<N, T, D>;

  /**
   * Set the state of the document (allowing you to roll back
   *  the state to a previous one, if needed).
   *
   * @param {number} state     The new state of the document
   * @param {boolean} restore  True if the original math should be put
   *                            back into the document during the rollback
   * @return {MathDocument}    The math document instance
   */
  state(state: number, restore?: boolean): MathDocument<N, T, D>;

  /**
   * Clear the processed values so that the document can be reprocessed
   *
   * @param {ResetList} options   The things to be reset
   * @return {MathDocument}       The math document instance
   */
  reset(options?: ResetList): MathDocument<N, T, D>;

  /**
   * Reset the processed values and clear the MathList (so that new math
   * can be processed in the document).
   *
   * @return {MathDocument}  The math document instance
   */
  clear(): MathDocument<N, T, D>;

  /**
   * Merges a MathList into the list for this document.
   *
   * @param {MathList} list   The MathList to be merged into this document's list
   * @return {MathDocument}   The math document instance
   */
  concat(list: MathList<N, T, D>): MathDocument<N, T, D>;

  /**
   * Clear the typeset MathItems that are within the given container
   *   from the document's MathList.  (E.g., when the content of the
   *   container has been updated and you want to remove the
   *   associated MathItems)
   *
   * @param {ContainerList<N>} elements   The container DOM elements whose math items are to be removed
   * @return {MathItem<N,T,D>[]}          The removed MathItems
   */
  clearMathItemsWithin(containers: ContainerList<N>): MathItem<N, T, D>[];

  /**
   * Get the typeset MathItems that are within a given container.
   *
   * @param {ContainerList<N>} elements   The container DOM elements whose math items are to be found
   * @return {MathItem<N,T,D>[]}          The list of MathItems within that container
   */
  getMathItemsWithin(elements: ContainerList<N>): MathItem<N, T, D>[];

}

/*****************************************************************/

/**
 * Defaults used when input jax isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultInputJax<N, T, D> extends AbstractInputJax<N, T, D> {
  /**
   * @override
   */
  public compile(_math: MathItem<N, T, D>) {
    return null as MmlNode;
  }
}

/**
 * Defaults used when ouput jax isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultOutputJax<N, T, D> extends AbstractOutputJax<N, T, D> {
  /**
   * @override
   */
  public typeset(_math: MathItem<N, T, D>, _document: MathDocument<N, T, D> = null) {
    return null as N;
  }
  /**
   * @override
   */
  public escaped(_math: MathItem<N, T, D>, _document?: MathDocument<N, T, D>) {
    return null as N;
  }
}

/**
 * Default for the MathList when one isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultMathList<N, T, D> extends AbstractMathList<N, T, D> {}

/**
 * Default for the Mathitem when one isn't specified
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
class DefaultMathItem<N, T, D> extends AbstractMathItem<N, T, D> {}

/*****************************************************************/
/**
 *  Implements the abstract MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export abstract class AbstractMathDocument<N, T, D> implements MathDocument<N, T, D> {

  /**
   * The type of MathDocument
   */
  public static KIND: string = 'MathDocument';

  /**
   * The default options for the document
   */
  public static OPTIONS: OptionList = {
    OutputJax: null,           // instance of an OutputJax for the document
    InputJax: null,            // instance of an InputJax or an array of them
    MmlFactory: null,          // instance of a MmlFactory for this document
    MathList: DefaultMathList, // constructor for a MathList to use for the document
    MathItem: DefaultMathItem, // constructor for a MathItem to use for the MathList
    compileError: (doc: AbstractMathDocument<any, any, any>, math: MathItem<any, any, any>, err: Error) => {
      doc.compileError(math, err);
    },
    typesetError: (doc: AbstractMathDocument<any, any, any>, math: MathItem<any, any, any>, err: Error) => {
      doc.typesetError(math, err);
    },
    renderActions: expandable({
      find:    [STATE.FINDMATH, 'findMath', '', false],
      compile: [STATE.COMPILED],
      metrics: [STATE.METRICS, 'getMetrics', '', false],
      typeset: [STATE.TYPESET],
      update:  [STATE.INSERTED, 'updateDocument', false]
    }) as RenderActions<any, any, any>
  };

  /**
   * A bit-field for the actions that have been processed
   */
  public static ProcessBits = BitFieldClass('findMath', 'compile', 'getMetrics', 'typeset', 'updateDocument');

  /**
   * The document managed by this MathDocument
   */
  public document: D;
  /**
   * The actual options for this document (with user-supplied ones merged in)
   */
  public options: OptionList;

  /**
   * The list of MathItems for this document
   */
  public math: MathList<N, T, D>;

  /**
   * The list of render actions
   */
  public renderActions: RenderList<N, T, D>;

  /**
   * The bit-field used to tell what steps have been taken on the document (for retries)
   */
  public processed: BitField;

  /**
   * The list of input jax for the document
   */
  public inputJax: InputJax<N, T, D>[];

  /**
   * The output jax for the document
   */
  public outputJax: OutputJax<N, T, D>;

  /**
   * The DOM adaptor for the document
   */
  public adaptor: DOMAdaptor<N, T, D>;

  /**
   * The MathML node factory for the internal MathML representation
   */
  public mmlFactory: MmlFactory;


  /**
   * @param {any} document           The document (HTML string, parsed DOM, etc.) to be processed
   * @param {DOMAdaptor} adaptor     The DOM adaptor for this document
   * @param {OptionList} options     The options for this document
   * @constructor
   */
  constructor (document: D, adaptor: DOMAdaptor<N, T, D>, options: OptionList) {
    let CLASS = this.constructor as typeof AbstractMathDocument;
    this.document = document;
    this.options = userOptions(defaultOptions({}, CLASS.OPTIONS), options);
    this.math = new (this.options['MathList'] || DefaultMathList)();
    this.renderActions = RenderList.create<N, T, D>(this.options['renderActions']);
    this.processed = new AbstractMathDocument.ProcessBits();
    this.outputJax = this.options['OutputJax'] || new DefaultOutputJax<N, T, D>();
    let inputJax = this.options['InputJax'] || [new DefaultInputJax<N, T, D>()];
    if (!Array.isArray(inputJax)) {
      inputJax = [inputJax];
    }
    this.inputJax = inputJax;
    //
    // Pass the DOM adaptor to the jax
    //
    this.adaptor = adaptor;
    this.outputJax.setAdaptor(adaptor);
    this.inputJax.map(jax => jax.setAdaptor(adaptor));
    //
    // Pass the MmlFactory to the jax
    //
    this.mmlFactory = this.options['MmlFactory'] || new MmlFactory();
    this.inputJax.map(jax => jax.setMmlFactory(this.mmlFactory));
    //
    // Do any initialization that requires adaptors or factories
    //
    this.outputJax.initialize();
    this.inputJax.map(jax => jax.initialize());
  }

  /**
   * @return {string}  The kind of document
   */
  public get kind(): string {
    return (this.constructor as typeof AbstractMathDocument).KIND;
  }

  /**
   * @override
   */
  public addRenderAction(id: string, ...action: any[]) {
    const [fn, p] = RenderList.action<N, T, D>(id, action as RenderAction<N, T, D>);
    this.renderActions.add(fn, p);
  }

  /**
   * @override
   */
  public removeRenderAction(id: string) {
    const action = this.renderActions.findID(id);
    if (action) {
      this.renderActions.remove(action);
    }
  }

  /**
   * @override
   */
  public render() {
    this.renderActions.renderDoc(this);
    return this;
  }

  /**
   * @override
   */
  public rerender(start: number = STATE.RERENDER) {
    this.state(start - 1);
    this.render();
    return this;
  }

  /**
   * @override
   */
  public convert(math: string, options: OptionList = {}) {
    let {format, display, end, ex, em, containerWidth, lineWidth, scale, family} = userOptions({
      format: this.inputJax[0].name, display: true, end: STATE.LAST,
      em: 16, ex: 8, containerWidth: null, lineWidth: 1000000, scale: 1, family: ''
    }, options);
    if (containerWidth === null) {
      containerWidth = 80 * ex;
    }
    const jax = this.inputJax.reduce((jax, ijax) => (ijax.name === format ? ijax : jax), null);
    const mitem = new this.options.MathItem(math, jax, display);
    mitem.start.node = this.adaptor.body(this.document);
    mitem.setMetrics(em, ex, containerWidth, lineWidth, scale);
    if (this.outputJax.options.mtextInheritFont) {
      mitem.outputData.mtextFamily = family;
    }
    if (this.outputJax.options.merrorInheritFont) {
      mitem.outputData.merrorFamily = family;
    }
    mitem.convert(this, end);
    return (mitem.typesetRoot || mitem.root);
  }

  /**
   * @override
   */
  public findMath(_options: OptionList = null) {
    this.processed.set('findMath');
    return this;
  }

  /**
   * @override
   */
  public compile() {
    if (!this.processed.isSet('compile')) {
      //
      //  Compile all the math in the list
      //
      const recompile = [];
      for (const math of this.math) {
        this.compileMath(math);
        if (math.inputData.recompile !== undefined) {
          recompile.push(math);
        }
      }
      //
      //  If any were added to the recompile list,
      //    compile them again
      //
      for (const math of recompile) {
        const data = math.inputData.recompile;
        math.state(data.state);
        math.inputData.recompile = data;
        this.compileMath(math);
      }
      this.processed.set('compile');
    }
    return this;
  }

  /**
   * @param {MathItem} math   The item to compile
   */
  protected compileMath(math: MathItem<N, T, D>) {
    try {
      math.compile(this);
    } catch (err) {
      if (err.retry || err.restart) {
        throw err;
      }
      this.options['compileError'](this, math, err);
      math.inputData['error'] = err;
    }
  }

  /**
   * Produce an error using MmlNodes
   *
   * @param {MathItem} math  The MathItem producing the error
   * @param {Error} err      The Error object for the error
   */
  public compileError(math: MathItem<N, T, D>, err: Error) {
    math.root = this.mmlFactory.create('math', null, [
      this.mmlFactory.create('merror', {'data-mjx-error': err.message, title: err.message}, [
        this.mmlFactory.create('mtext', null, [
          (this.mmlFactory.create('text') as TextNode).setText('Math input error')
        ])
      ])
    ]);
    if (math.display) {
      math.root.attributes.set('display', 'block');
    }
    math.inputData.error = err.message;
  }

  /**
   * @override
   */
  public typeset() {
    if (!this.processed.isSet('typeset')) {
      for (const math of this.math) {
        try {
          math.typeset(this);
        } catch (err) {
          if (err.retry || err.restart) {
            throw err;
          }
          this.options['typesetError'](this, math, err);
          math.outputData['error'] = err;
        }
      }
      this.processed.set('typeset');
    }
    return this;
  }

  /**
   * Produce an error using HTML
   *
   * @param {MathItem} math  The MathItem producing the error
   * @param {Error} err      The Error object for the error
   */
  public typesetError(math: MathItem<N, T, D>, err: Error) {
    math.typesetRoot = this.adaptor.node('mjx-container', {
      class: 'MathJax mjx-output-error',
      jax: this.outputJax.name,
    }, [
      this.adaptor.node('span', {
        'data-mjx-error': err.message,
        title: err.message,
        style: {
          color: 'red',
          'background-color': 'yellow',
          'line-height': 'normal'
        }
      }, [
        this.adaptor.text('Math output error')
      ])
    ]);
    if (math.display) {
      this.adaptor.setAttributes(math.typesetRoot, {
        style: {
          display: 'block',
          margin: '1em 0',
          'text-align': 'center'
        }
      });
    }
    math.outputData.error = err.message;
  }

  /**
   * @override
   */
  public getMetrics() {
    if (!this.processed.isSet('getMetrics')) {
      this.outputJax.getMetrics(this);
      this.processed.set('getMetrics');
    }
    return this;
  }

  /**
   * @override
   */
  public updateDocument() {
    if (!this.processed.isSet('updateDocument')) {
      for (const math of this.math.reversed()) {
        math.updateDocument(this);
      }
      this.processed.set('updateDocument');
    }
    return this;
  }

  /**
   * @override
   */
  public removeFromDocument(_restore: boolean = false) {
    return this;
  }

  /**
   * @override
   */
  public state(state: number, restore: boolean = false) {
    for (const math of this.math) {
      math.state(state, restore);
    }
    if (state < STATE.INSERTED) {
      this.processed.clear('updateDocument');
    }
    if (state < STATE.TYPESET) {
      this.processed.clear('typeset');
      this.processed.clear('getMetrics');
    }
    if (state < STATE.COMPILED) {
      this.processed.clear('compile');
    }
    return this;
  }

  /**
   * @override
   */
  public reset(options: ResetList = {processed: true}) {
    options = userOptions(Object.assign({}, resetOptions), options);
    options.all && Object.assign(options, resetAllOptions);
    options.processed && this.processed.reset();
    options.inputJax && this.inputJax.forEach(jax => jax.reset(...options.inputJax));
    options.outputJax && this.outputJax.reset(...options.outputJax);
    return this;
  }

  /**
   * @override
   */
  public clear() {
    this.reset();
    this.math.clear();
    return this;
  }

  /**
   * @override
   */
  public concat(list: MathList<N, T, D>) {
    this.math.merge(list);
    return this;
  }

  /**
   * @override
   */
  public clearMathItemsWithin(containers: ContainerList<N>) {
    const items = this.getMathItemsWithin(containers);
    this.math.remove(...items);
    return items;
  }

  /**
   * @override
   */
  public getMathItemsWithin(elements: ContainerList<N>) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }
    const adaptor = this.adaptor;
    const items = [] as MathItem<N, T, D>[];
    const containers = adaptor.getElements(elements, this.document);
    ITEMS:
    for (const item of this.math) {
      for (const container of containers) {
        if (item.start.node && adaptor.contains(container, item.start.node)) {
          items.push(item);
          continue ITEMS;
        }
      }
    }
    return items;
  }

}

/**
 * The constructor type for a MathDocument
 *
 * @template D    The MathDocument type this constructor is for
 */
export interface MathDocumentConstructor<D extends MathDocument<any, any, any>> {
  KIND: string;
  OPTIONS: OptionList;
  ProcessBits: typeof BitField;
  new (...args: any[]): D;
}
