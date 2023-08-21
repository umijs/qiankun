/*************************************************************
 *
 *  Copyright (c) 2019-2022 The MathJax Consortium
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
 * @fileoverview  Mixin that adds hidden MathML to the output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Handler} from '../core/Handler.js';
import {MathDocument, AbstractMathDocument, MathDocumentConstructor} from '../core/MathDocument.js';
import {MathItem, AbstractMathItem, STATE, newState} from '../core/MathItem.js';
import {MmlNode} from '../core/MmlTree/MmlNode.js';
import {SerializedMmlVisitor} from '../core/MmlTree/SerializedMmlVisitor.js';
import {OptionList, expandable} from '../util/Options.js';
import {StyleList} from '../util/StyleList.js';

/*==========================================================================*/

export class LimitedMmlVisitor extends SerializedMmlVisitor {

  /**
   * @override
   */
  protected getAttributes(node: MmlNode): string {
    /**
     * Remove id from attribute output
     */
    return super.getAttributes(node).replace(/ ?id=".*?"/, '');
  }

}

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/*==========================================================================*/

/**
 * Add STATE value for having assistive MathML (after TYPESETTING)
 */
newState('ASSISTIVEMML', 153);

/**
 * The functions added to MathItem for assistive MathML
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface AssistiveMmlMathItem<N, T, D> extends MathItem<N, T, D> {
  /**
   * @param {MathDocument} document  The document where assistive MathML is being added
   * @param {boolean} force          True to force assistive MathML even if enableAssistiveMml is false
   */
  assistiveMml(document: MathDocument<N, T, D>, force?: boolean): void;
}

/**
 * The mixin for adding assistive MathML to MathItems
 *
 * @param {B} BaseMathItem      The MathItem class to be extended
 * @return {AssistiveMathItem}  The augmented MathItem class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathItem class to extend
 */
export function AssistiveMmlMathItemMixin<N, T, D, B extends Constructor<AbstractMathItem<N, T, D>>>(
  BaseMathItem: B
): Constructor<AssistiveMmlMathItem<N, T, D>> & B {

  return class extends BaseMathItem {

    /**
     * @param {MathDocument} document   The MathDocument for the MathItem
     * @param {boolean} force           True to force assistive MathML evenif enableAssistiveMml is false
     */
    public assistiveMml(document: AssistiveMmlMathDocument<N, T, D>, force: boolean = false) {
      if (this.state() >= STATE.ASSISTIVEMML) return;
      if (!this.isEscaped && (document.options.enableAssistiveMml || force)) {
        const adaptor = document.adaptor;
        //
        // Get the serialized MathML
        //
        const mml = document.toMML(this.root).replace(/\n */g, '').replace(/<!--.*?-->/g, '');
        //
        // Parse is as HTML and retrieve the <math> element
        //
        const mmlNodes = adaptor.firstChild(adaptor.body(adaptor.parse(mml, 'text/html')));
        //
        // Create a container for the hidden MathML
        //
        const node = adaptor.node('mjx-assistive-mml', {
          unselectable: 'on', display: (this.display ? 'block' : 'inline')
        }, [mmlNodes]);
        //
        // Hide the typeset math from assistive technology and append the MathML that is visually
        //   hidden from other users
        //
        adaptor.setAttribute(adaptor.firstChild(this.typesetRoot) as N, 'aria-hidden', 'true');
        adaptor.setStyle(this.typesetRoot, 'position', 'relative');
        adaptor.append(this.typesetRoot, node);
      }
      this.state(STATE.ASSISTIVEMML);
    }

  };

}

/*==========================================================================*/

/**
 * The functions added to MathDocument for assistive MathML
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export interface AssistiveMmlMathDocument<N, T, D> extends AbstractMathDocument<N, T, D> {

  /**
   * @param {MmlNode} node   The node to be serializes
   * @return {string}        The serialization of the node
   */
  toMML: (node: MmlNode) => string;

  /**
   * Add assistive MathML to the MathItems in the MathDocument
   *
   * @return {AssistiveMmlMathDocument}   The MathDocument (so calls can be chained)
   */
  assistiveMml(): AssistiveMmlMathDocument<N, T, D>;

}

/**
 * The mixin for adding assistive MathML to MathDocuments
 *
 * @param {B} BaseDocument         The MathDocument class to be extended
 * @return {AssistiveMmlMathDocument}  The Assistive MathML MathDocument class
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 * @template B  The MathDocument class to extend
 */
export function AssistiveMmlMathDocumentMixin<N, T, D,
B extends MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
  BaseDocument: B
): MathDocumentConstructor<AssistiveMmlMathDocument<N, T, D>> & B {

  return class BaseClass extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS: OptionList = {
      ...BaseDocument.OPTIONS,
      enableAssistiveMml: true,
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        assistiveMml: [STATE.ASSISTIVEMML]
      })
    };

    /**
     * styles needed for the hidden MathML
     */
    public static assistiveStyles: StyleList = {
      'mjx-assistive-mml': {
        position: 'absolute !important',
        top: '0px', left: '0px',
        clip: 'rect(1px, 1px, 1px, 1px)',
        padding: '1px 0px 0px 0px !important',
        border: '0px !important',
        display: 'block !important',
        width: 'auto !important',
        overflow: 'hidden !important',
        /*
         *  Don't allow the assistive MathML to become part of the selection
         */
        '-webkit-touch-callout': 'none',
        '-webkit-user-select': 'none',
        '-khtml-user-select': 'none',
        '-moz-user-select': 'none',
        '-ms-user-select': 'none',
        'user-select': 'none'
      },
      'mjx-assistive-mml[display="block"]': {
        width: '100% !important'
      }
    };

    /**
     * Visitor used for serializing internal MathML nodes
     */
    protected visitor: LimitedMmlVisitor;

    /**
     * Augment the MathItem class used for this MathDocument, and create the serialization visitor.
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      const CLASS = (this.constructor as typeof BaseClass);
      const ProcessBits = CLASS.ProcessBits;
      if (!ProcessBits.has('assistive-mml')) {
        ProcessBits.allocate('assistive-mml');
      }
      this.visitor = new LimitedMmlVisitor(this.mmlFactory);
      this.options.MathItem =
        AssistiveMmlMathItemMixin<N, T, D, Constructor<AbstractMathItem<N, T, D>>>(
          this.options.MathItem
        );
      if ('addStyles' in this) {
        (this as any).addStyles(CLASS.assistiveStyles);
      }
    }

    /**
     * @param {MmlNode} node   The node to be serializes
     * @return {string}        The serialization of the node
     */
    public toMML(node: MmlNode): string {
      return this.visitor.visitTree(node);
    }

    /**
     * Add assistive MathML to the MathItems in this MathDocument
     */
    public assistiveMml() {
      if (!this.processed.isSet('assistive-mml')) {
        for (const math of this.math) {
          (math as AssistiveMmlMathItem<N, T, D>).assistiveMml(this);
        }
        this.processed.set('assistive-mml');
      }
      return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.ASSISTIVEMML) {
        this.processed.clear('assistive-mml');
      }
      return this;
    }

  };

}

/*==========================================================================*/

/**
 * Add assitive MathML support a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chainging extensions)
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export function AssistiveMmlHandler<N, T, D>(handler: Handler<N, T, D>): Handler<N, T, D> {
  handler.documentClass =
    AssistiveMmlMathDocumentMixin<N, T, D, MathDocumentConstructor<AbstractMathDocument<N, T, D>>>(
      handler.documentClass
    );
  return handler;
}
