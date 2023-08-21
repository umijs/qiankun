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
 * @fileoverview  Mixin that adds a context-menu to MathJax output
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {mathjax} from '../../mathjax.js';

import {STATE, newState} from '../../core/MathItem.js';
import {MathDocumentConstructor} from '../../core/MathDocument.js';
import {Handler} from '../../core/Handler.js';
import {ComplexityMathDocument, ComplexityMathItem} from '../../a11y/complexity.js';
import {ExplorerMathDocument, ExplorerMathItem} from '../../a11y/explorer.js';
import {AssistiveMmlMathDocument, AssistiveMmlMathItem} from '../../a11y/assistive-mml.js';
import {expandable} from '../../util/Options.js';

import {Menu} from './Menu.js';

/*==========================================================================*/

/**
 * Generic constructor for Mixins
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * Constructor for base MathItem for MenuMathItem
 */
export type A11yMathItemConstructor = {
  new(...args: any[]): ComplexityMathItem<HTMLElement, Text, Document> &
    ExplorerMathItem & AssistiveMmlMathItem<HTMLElement, Text, Document>;
};

/**
 * Constructor for base document for MenuMathDocument
 */
export type A11yDocumentConstructor =
  MathDocumentConstructor<ComplexityMathDocument<HTMLElement, Text, Document> &
  ExplorerMathDocument & AssistiveMmlMathDocument<HTMLElement, Text, Document>>;

/*==========================================================================*/

/**
 * Add STATE value for menus being added (after TYPESET and before INSERTED)
 */
newState('CONTEXT_MENU', 170);

/**
 * The new function for MathItem that adds the context menu
 */
export interface MenuMathItem extends ComplexityMathItem<HTMLElement, Text, Document> {

  /**
   * @param {MenuMathDocument} document   The document where the menu is being added
   * @param {boolean} force               True if menu should be added even if enableMenu is false
   */
  addMenu(document: MenuMathDocument, force?: boolean): void;

  /**
   * @param {MenuMathDocument} document   The document to check for if anything is being loaded
   */
  checkLoading(document: MenuMathDocument): void;

}

/**
 * The mixin for adding context menus to MathItems
 *
 * @param {B} BaseMathItem   The MathItem class to be extended
 * @return {MathMathItem}    The extended MathItem class
 *
 * @template B  The MathItem class to extend
 */
export function MenuMathItemMixin<B extends A11yMathItemConstructor>(
  BaseMathItem: B
): Constructor<MenuMathItem> & B {

  return class extends BaseMathItem {

    /**
     * @param {MenuMathDocument} document   The document where the menu is being added
     * @param {boolean} force               True if menu should be added even if enableMenu is false
     */
    public addMenu(document: MenuMathDocument, force: boolean = false) {
      if (this.state() >= STATE.CONTEXT_MENU) return;
      if (!this.isEscaped && (document.options.enableMenu || force)) {
        document.menu.addMenu(this);
      }
      this.state(STATE.CONTEXT_MENU);
    }

    /**
     * @param {MenuMathDocument} document   The document to check for if anything is being loaded
     */
    public checkLoading(document: MenuMathDocument) {
      document.checkLoading();
    }

  };

}

/*==========================================================================*/

/**
 * The properties needed in the MathDocument for context menus
 */
export interface MenuMathDocument extends ComplexityMathDocument<HTMLElement, Text, Document> {

  /**
   * The menu associated with this document
   */
  menu: Menu;

  /**
   * Add context menus to the MathItems in the MathDocument
   *
   * @return {MenuMathDocument}   The MathDocument (so calls can be chained)
   */
  addMenu(): MenuMathDocument;

  /**
   * Checks if there are files being loaded by the menu, and restarts the typesetting if so
   *
   * @return {MenuMathDocument}   The MathDocument (so calls can be chained)
   */
  checkLoading(): MenuMathDocument;
}

/**
 * The mixin for adding context menus to MathDocuments
 *
 * @param {B} BaseDocument     The MathDocument class to be extended
 * @return {MenuMathDocument}      The extended MathDocument class
 *
 * @template B  The MathDocument class to extend
 */
export function MenuMathDocumentMixin<B extends A11yDocumentConstructor>(
  BaseDocument: B
): Constructor<MenuMathDocument> & B {

  return class extends BaseDocument {

    /**
     * @override
     */
    public static OPTIONS = {
      //
      //  These options are from the a11y extensions, which may not be loaded
      //    initially, and so would cause "undefined option" error messages
      //    if a user tries to configure them.  So we include them here.
      //    They are overridden by the options from the extensions when
      //    those are loaded (via ...BaseDocument.OPTIONS).
      //
      enableEnrichment: true,
      enableComplexity: true,
      enableExplorer: true,
      enrichSpeech: 'none',
      enrichError: (_doc: MenuMathDocument, _math: MenuMathItem, err: Error) =>
        console.warn('Enrichment Error:', err),
      ...BaseDocument.OPTIONS,
      MenuClass: Menu,
      menuOptions: Menu.OPTIONS,
      enableMenu: true,
      sre: (BaseDocument.OPTIONS.sre || expandable({})),
      a11y: (BaseDocument.OPTIONS.a11y || expandable({})),
      renderActions: expandable({
        ...BaseDocument.OPTIONS.renderActions,
        addMenu: [STATE.CONTEXT_MENU],
        checkLoading: [STATE.UNPROCESSED + 1]
      })
    };

    /**
     * The menu associated with this document
     */
    public menu: Menu;

    /**
     * Extend the MathItem class used for this MathDocument
     *
     * @override
     * @constructor
     */
    constructor(...args: any[]) {
      super(...args);
      this.menu = new this.options.MenuClass(this, this.options.menuOptions);
      const ProcessBits = (this.constructor as typeof BaseDocument).ProcessBits;
      if (!ProcessBits.has('context-menu')) {
        ProcessBits.allocate('context-menu');
      }
      this.options.MathItem = MenuMathItemMixin<A11yMathItemConstructor>(this.options.MathItem);
    }

    /**
     * Add context menus to the MathItems in the MathDocument
     *
     * @return {MenuMathDocument}   The MathDocument (so calls can be chained)
     */
    public addMenu(): MenuMathDocument {
      if (!this.processed.isSet('context-menu')) {
        for (const math of this.math) {
          (math as MenuMathItem).addMenu(this);
        }
        this.processed.set('context-menu');
      }
      return this;
    }

    /**
     * Checks if there are files being loaded by the menu, and restarts the typesetting if so
     *
     * @return {MenuMathDocument}   The MathDocument (so calls can be chained)
     */
    public checkLoading(): MenuMathDocument {
      if (this.menu.isLoading) {
        mathjax.retryAfter(this.menu.loadingPromise.catch((err) => console.log(err)));
      }
      const settings = this.menu.settings;
      if (settings.collapsible) {
        this.options.enableComplexity = true;
        this.menu.checkComponent('a11y/complexity');
      }
      if (settings.explorer) {
        this.options.enableEnrichment = true;
        this.options.enableExplorer = true;
        this.menu.checkComponent('a11y/explorer');
      }
      return this;
    }

    /**
     * @override
     */
    public state(state: number, restore: boolean = false) {
      super.state(state, restore);
      if (state < STATE.CONTEXT_MENU) {
        this.processed.clear('context-menu');
      }
      return this;
    }

    /**
     * @override
     */
    public updateDocument() {
      super.updateDocument();
      (this.menu.menu.store as any).sort();
      return this;
    }

  };

}

/*==========================================================================*/

/**
 * Add context-menu support to a Handler instance
 *
 * @param {Handler} handler   The Handler instance to enhance
 * @return {Handler}          The handler that was modified (for purposes of chaining extensions)
 */
export function MenuHandler(handler: Handler<HTMLElement, Text, Document>): Handler<HTMLElement, Text, Document> {
  handler.documentClass = MenuMathDocumentMixin<A11yDocumentConstructor>(handler.documentClass as any);
  return handler;
}
