/*************************************************************
 *
 *  Copyright (c) 2018-2022 The MathJax Consortium
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
 * @fileoverview  Implements a startup module that allows dynamically
 *                loaded components to register themselves, and then
 *                creates MathJax methods for typesetting and converting
 *                math based on the registered components.
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathJax as MJGlobal, MathJaxObject as MJObject,
        MathJaxConfig as MJConfig, combineWithMathJax, combineDefaults} from './global.js';

import {MathDocument} from '../core/MathDocument.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {Handler} from '../core/Handler.js';
import {InputJax} from '../core/InputJax.js';
import {OutputJax} from '../core/OutputJax.js';
import {CommonOutputJax} from '../output/common/OutputJax.js';
import {DOMAdaptor} from '../core/DOMAdaptor.js';
import {PrioritizedList} from '../util/PrioritizedList.js';
import {OptionList, OPTIONS} from '../util/Options.js';

import {TeX} from '../input/tex.js';


/**
 * Update the configuration structure to include the startup configuration
 */
export interface MathJaxConfig extends MJConfig {
  startup?: {
    input?: string[];        // The names of the input jax to use
    output?: string;         // The name for the output jax to use
    handler?: string;        // The handler to register
    adaptor?: string;        // The name for the DOM adaptor to use
    document?: any;          // The document (or fragment or string) to work in
    elements?: any[];        // The elements to typeset (default is document body)
    typeset?: boolean;       // Perform initial typeset?
    ready?: () => void;      // Function to perform when components are ready
    pageReady?: () => void;  // Function to perform when page is ready
    invalidOption?: 'fatal' | 'warn'; // Do invalid options produce a warning, or throw an error?
    optionError?: (message: string, key: string) => void,  // Function to report invalid options
    [name: string]: any;     // Other configuration blocks
  };
}

/**
 * Generic types for the standard MathJax objects
 */
export type MATHDOCUMENT = MathDocument<any, any, any>;
export type HANDLER = Handler<any, any, any>;
export type DOMADAPTOR = DOMAdaptor<any, any, any>;
export type INPUTJAX = InputJax<any, any, any>;
export type OUTPUTJAX = OutputJax<any, any, any>;
export type COMMONJAX = CommonOutputJax<any, any, any, any, any, any, any>;
export type TEX = TeX<any, any, any>;

/**
 * A function to extend a handler class
 */
export type HandlerExtension = (handler: HANDLER) => HANDLER;

/**
 * Update the MathJax object to inclide the startup information
 */
export interface MathJaxObject extends MJObject {
  config: MathJaxConfig;
  startup: {
    constructors: {[name: string]: any};
    input: INPUTJAX[];
    output: OUTPUTJAX;
    handler: HANDLER;
    adaptor: DOMADAPTOR;
    elements: any[];
    document: MATHDOCUMENT;
    promise: Promise<void>;
    /* tslint:disable:jsdoc-require */
    registerConstructor(name: string, constructor: any): void;
    useHandler(name: string, force?: boolean): void;
    useAdaptor(name: string, force?: boolean): void;
    useOutput(name: string, force?: boolean): void;
    useInput(name: string, force?: boolean): void;
    extendHandler(extend: HandlerExtension): void;
    toMML(node: MmlNode): string;
    defaultReady(): void;
    defaultPageReady(): Promise<void>;
    getComponents(): void;
    makeMethods(): void;
    makeTypesetMethods(): void;
    makeOutputMethods(iname: string, oname: string, input: INPUTJAX): void;
    makeMmlMethods(name: string, input: INPUTJAX): void;
    makeResetMethod(name: string, input: INPUTJAX): void;
    getInputJax(): INPUTJAX[];
    getOutputJax(): OUTPUTJAX;
    getAdaptor(): DOMADAPTOR;
    getHandler(): HANDLER;
    /* tslint:enable */
  };
  [name: string]: any;    // Needed for the methods created by the startup module
}

/*
 * Access to the browser document
 */
declare var global: {document: Document};

/**
 * The implementation of the startup module
 */
export namespace Startup {

  /**
   * The array of handler extensions
   */
  const extensions = new PrioritizedList<HandlerExtension>();

  let visitor: any;  // the visitor for toMML();
  let mathjax: any;  // the mathjax variable from mathjax.js

  /**
   * The constructors (or other data) registered by the loaded packages
   */
  export const constructors: {[name: string]: any} = {};

  /**
   * The array of InputJax instances (created after everything is loaded)
   */
  export let input: INPUTJAX[] = [];

  /**
   * The OutputJax instance (created after everything is loaded)
   */
  export let output: OUTPUTJAX = null;

  /**
   * The Handler instance (created after everything is loaded)
   */
  export let handler: HANDLER = null;

  /**
   * The DOMAdaptor instance (created after everything is loaded)
   */
  export let adaptor: DOMADAPTOR = null;

  /**
   * The elements to process (set when typeset or conversion method is called)
   */
  export let elements: any[] = null;

  /**
   * The MathDocument instance being used (based on the browser DOM or configuration value)
   */
  export let document: MATHDOCUMENT = null;

  /**
   * The function that resolves the first promise defined below
   *   (called in the defaultReady() function when MathJax is finished with
   *    its initial typesetting)
   */
  export let promiseResolve: () => void;
  /**
   * The function that rejects the first promise defined below
   *   (called in the defaultReady() function when MathJax's initial
   *    typesetting fails)
   */
  export let promiseReject: (reason: any) => void;

  /**
   * The promise for the startup process (the initial typesetting).
   * It is resolves or rejected in the ready() function.
   */
  export let promise = new Promise<void>((resolve, reject) => {
    promiseResolve = resolve;
    promiseReject = reject;
  });

  /**
   * A promise that is resolved when the page contents are available
   * for processing.
   */
  export let pagePromise = new Promise<void>((resolve, _reject) => {
    const doc = global.document;
    if (!doc || !doc.readyState || doc.readyState === 'complete' || doc.readyState === 'interactive') {
      resolve();
    } else {
      const listener = () => resolve();
      doc.defaultView.addEventListener('load', listener, true);
      doc.defaultView.addEventListener('DOMContentLoaded', listener, true);
    }
  });

  /**
   * @param {MmlNode} node   The root of the tree to convert to serialized MathML
   * @return {string}        The serialized MathML from the tree
   */
  export function toMML(node: MmlNode): string {
    return visitor.visitTree(node, document);
  }

  /**
   * @param {string} name      The identifier for the constructor
   * @param {any} constructor  The constructor function for the named object
   */
  export function registerConstructor(name: string, constructor: any) {
    constructors[name] = constructor;
  }

  /**
   * @param {string} name      The identifier for the Handler to use
   * @param {boolean} force    True to force the Handler to be used even if one is already registered
   */
  export function useHandler(name: string, force: boolean = false) {
    if (!CONFIG.handler || force) {
      CONFIG.handler = name;
    }
  }

  /**
   * @param {string} name      The identifier for the DOMAdaptor to use
   * @param {boolean} force    True to force the DOMAdaptor to be used even if one is already registered
   */
  export function useAdaptor(name: string, force: boolean = false) {
    if (!CONFIG.adaptor || force) {
      CONFIG.adaptor = name;
    }
  }

  /**
   * @param {string} name      The identifier for the InputJax to use
   * @param {boolean} force    True to force the InputJax to be used even if the configuration already
   *                             included an array of input jax
   */
  export function useInput(name: string, force: boolean = false) {
    if (!inputSpecified || force) {
      CONFIG.input.push(name);
    }
  }

  /**
   * @param {string} name      The identifier for the OutputJax to use
   * @param {boolean} force    True to force the OutputJax to be used even if one is already registered
   */
  export function useOutput(name: string, force: boolean = false) {
    if (!CONFIG.output || force) {
      CONFIG.output = name;
    }
  }

  /**
   * @param {HandlerExtension} extend    A function to extend the handler class
   * @param {number} priority            The priority of the extension
   */
  export function extendHandler(extend: HandlerExtension, priority: number = 10) {
    extensions.add(extend, priority);
  }

  /**
   * The default ready() function called when all the packages have been loaded,
   * which creates the various objects needed by MathJax, creates the methods
   * based on the loaded components, and does the initial typesetting.
   *
   * Setting MathJax.startup.ready in the configuration will
   * override this, but you can call MathJax.startup.defaultReady()
   * within your own ready function if needed, or can use the
   * individual methods below to perform portions of the default
   * startup actions.
   */
  export function defaultReady() {
    getComponents();
    makeMethods();
    pagePromise
      .then(() => CONFIG.pageReady())  // usually the initial typesetting call
      .then(() => promiseResolve())
      .catch((err) => promiseReject(err));
  }

  /**
   * The default pageReady() function called when the page is ready to be processed,
   * which returns the function that performs the initial typesetting, if needed.
   *
   * Setting Mathjax.startup.pageReady in the configuration will override this.
   */
  export function defaultPageReady() {
    return (CONFIG.typeset && MathJax.typesetPromise ?
            MathJax.typesetPromise(CONFIG.elements) as Promise<void> :
            Promise.resolve());
  }

  /**
   * Create the instances of the registered components
   */
  export function getComponents() {
    visitor = new MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor();
    mathjax = MathJax._.mathjax.mathjax;
    input = getInputJax();
    output = getOutputJax();
    adaptor = getAdaptor();
    if (handler) {
      mathjax.handlers.unregister(handler);
    }
    handler = getHandler();
    if (handler) {
      mathjax.handlers.register(handler);
      document = getDocument();
    }
  }

  /**
   * Make the typeset and conversion methods based on the registered components
   *
   * If there are both input and output jax,
   *   Make Typeset() and TypesetPromise() methods using the given jax,
   *    and TypesetClear() to clear the existing math items
   * For each input jax
   *   Make input2mml() and input2mmlPromise() conversion methods and inputReset() method
   *   If there is a registered output jax
   *     Make input2output() and input2outputPromise conversion methods and outputStylesheet() method
   */
  export function makeMethods() {
    if (input && output) {
      makeTypesetMethods();
    }
    const oname = (output ? output.name.toLowerCase() : '');
    for (const jax of input) {
      const iname = jax.name.toLowerCase();
      makeMmlMethods(iname, jax);
      makeResetMethod(iname, jax);
      if (output) {
        makeOutputMethods(iname, oname, jax);
      }
    }
  }

  /**
   * Create the Typeset(elements?), TypesetPromise(elements?), and TypesetClear() methods.
   *
   * The first two call the document's render() function, the latter
   *   wrapped in handleRetriesFor() and returning the resulting promise.
   *
   * TypeseClear() clears all the MathItems from the document.
   */
  export function makeTypesetMethods() {
    MathJax.typeset = (elements: any[] = null) => {
      document.options.elements = elements;
      document.reset();
      document.render();
    };
    MathJax.typesetPromise = (elements: any[] = null) => {
      document.options.elements = elements;
      document.reset();
      return mathjax.handleRetriesFor(() => {
        document.render();
      });
    };
    MathJax.typesetClear = (elements: any[] = null) => {
      if (elements) {
        document.clearMathItemsWithin(elements);
      } else {
        document.clear();
      }
    };
  }

  /**
   * Make the input2output(math, options?) and input2outputPromise(math, options?) methods,
   *   and outputStylesheet() method, where "input" and "output" are replaced by the
   *   jax names (e.g., tex2chtml() and chtmlStyleSheet()).
   *
   * The first two perform the document's convert() call, with the Promise version wrapped in
   *   handlerRetriesFor() and returning the resulting promise.  The return value is the
   *   DOM object for the converted math.  Use MathJax.startup.adaptor.outerHTML(result)
   *   to get the serialized string version of the output.
   *
   * The outputStylesheet() method returns the styleSheet object for the output.
   * Use MathJax.startup.adaptor.innerHTML(MathJax.outputStylesheet()) to get the serialized
   *   version of the stylesheet.
   * The getMetricsFor(node, display) method returns the metric data for the given node
   *
   * @param {string} iname     The name of the input jax
   * @param {string} oname     The name of the output jax
   * @param {INPUTJAX} input   The input jax instance
   */
  export function makeOutputMethods(iname: string, oname: string, input: INPUTJAX) {
    const name = iname + '2' + oname;
    MathJax[name] =
      (math: string, options: OptionList = {}) => {
        options.format = input.name;
        return document.convert(math, options);
      };
    MathJax[name + 'Promise'] =
      (math: string, options: OptionList = {}) => {
        options.format = input.name;
        return mathjax.handleRetriesFor(() => document.convert(math, options));
      };
    MathJax[oname + 'Stylesheet'] = () => output.styleSheet(document);
    if ('getMetricsFor' in output) {
      MathJax.getMetricsFor = (node: any, display: boolean) => {
        return (output as COMMONJAX).getMetricsFor(node, display);
      };
    }
  }

  /**
   * Make the input2mml(math, options?) and input2mmlPromise(math, options?) methods,
   *   where "input" is replaced by the name of the input jax (e.g., "tex2mml").
   *
   * These convert the math to its serialized MathML representation.
   *   The second wraps the conversion in handleRetriesFor() and
   *   returns the resulting promise.
   *
   * @param {string} name     The name of the input jax
   * @param {INPUTJAX} input  The input jax itself
   */
  export function makeMmlMethods(name: string, input: INPUTJAX) {
    const STATE = MathJax._.core.MathItem.STATE;
    MathJax[name + '2mml'] =
      (math: string, options: OptionList = {}) => {
        options.end = STATE.CONVERT;
        options.format = input.name;
        return toMML(document.convert(math, options));
      };
    MathJax[name + '2mmlPromise'] =
      (math: string, options: OptionList = {}) => {
        options.end = STATE.CONVERT;
        options.format = input.name;
        return mathjax.handleRetriesFor(() => toMML(document.convert(math, options)));
      };
  }

  /**
   * Creates the inputReset() method, where "input" is replaced by the input jax name (e.g., "texReset()).
   *
   * The texReset() method clears the equation numbers and labels
   *
   * @param {string} name     The name of the input jax
   * @param {INPUTJAX} input  The input jax itself
   */
  export function makeResetMethod(name: string, input: INPUTJAX) {
    MathJax[name + 'Reset'] = (...args: any[]) => input.reset(...args);
  }

  /**
   * @return {INPUTJAX[]}  The array of instances of the registered input jax
   */
  export function getInputJax(): INPUTJAX[] {
    const jax = [] as INPUTJAX[];
    for (const name of CONFIG.input) {
      const inputClass = constructors[name];
      if (inputClass) {
        jax.push(new inputClass(MathJax.config[name]));
      } else {
        throw Error('Input Jax "' + name + '" is not defined (has it been loaded?)');
      }
    }
    return jax;
  }

  /**
   * @return {OUTPUTJAX}   The instance of the registered output jax
   */
  export function getOutputJax(): OUTPUTJAX {
    const name = CONFIG.output;
    if (!name) return null;
    const outputClass = constructors[name];
    if (!outputClass) {
      throw Error('Output Jax "' + name + '" is not defined (has it been loaded?)');
    }
    return new outputClass(MathJax.config[name]);
  }

  /**
   * @return {DOMADAPTOR}  The instance of the registered DOMAdator (the registered constructor
   *                         in this case is a function that creates the adaptor, not a class)
   */
  export function getAdaptor(): DOMADAPTOR {
    const name = CONFIG.adaptor;
    if (!name || name === 'none') return null;
    const adaptor = constructors[name];
    if (!adaptor) {
      throw Error('DOMAdaptor "' + name + '" is not defined (has it been loaded?)');
    }
    return adaptor(MathJax.config[name]);
  }

  /**
   * @return {HANDLER}  The instance of the registered Handler, extended by the registered extensions
   */
  export function getHandler(): HANDLER {
    const name = CONFIG.handler;
    if (!name || name === 'none' || !adaptor) return null;
    const handlerClass = constructors[name];
    if (!handlerClass) {
      throw Error('Handler "' + name + '" is not defined (has it been loaded?)');
    }
    let handler = new handlerClass(adaptor, 5);
    for (const extend of extensions) {
      handler = extend.item(handler);
    }
    return handler;
  }

  /**
   * Create the document with the given input and output jax
   *
   * @param {any=} root        The Document to use as the root document (or null to use the configured document)
   * @returns {MathDocument}   The MathDocument with the configured input and output jax
   */
  export function getDocument(root: any = null): MathDocument<any, any, any> {
    return mathjax.document(root || CONFIG.document, {
        ...MathJax.config.options,
      InputJax: input,
      OutputJax: output
    });
  }
}

/**
 * Export the global MathJax object for convenience
 */
export const MathJax = MJGlobal as MathJaxObject;

/*
 * If the startup module hasn't been added to the MathJax variable,
 *   Add the startup configuration and data objects, and
 *   set the method for handling invalid options, if provided.
 */
if (typeof MathJax._.startup === 'undefined') {

  combineDefaults(MathJax.config, 'startup', {
    input: [],
    output: '',
    handler: null,
    adaptor: null,
    document: (typeof document === 'undefined' ? '' : document),
    elements: null,
    typeset: true,
    ready: Startup.defaultReady.bind(Startup),
    pageReady: Startup.defaultPageReady.bind(Startup)
  });
  combineWithMathJax({
    startup: Startup,
    options: {}
  });

  if (MathJax.config.startup.invalidOption) {
    OPTIONS.invalidOption = MathJax.config.startup.invalidOption;
  }
  if (MathJax.config.startup.optionError) {
    OPTIONS.optionError = MathJax.config.startup.optionError;
  }

}

/**
 * Export the startup configuration for convenience
 */
export const CONFIG = MathJax.config.startup;


/*
 * Tells if the user configuration included input jax or not
 */
const inputSpecified = CONFIG.input.length !== 0;
