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
 * @fileoverview  Implements a subclass of ContextMenu specific to MathJax
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathItem} from '../../core/MathItem.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {SelectableInfo} from './SelectableInfo.js';

import {ContextMenu} from 'mj-context-menu/js/context_menu.js';
import {SubMenu} from 'mj-context-menu/js/sub_menu.js';
import {Submenu} from 'mj-context-menu/js/item_submenu.js';
import {Menu} from 'mj-context-menu/js/menu.js';
import {Item} from 'mj-context-menu/js/item.js';

/*==========================================================================*/

/**
 * The subclass of ContextMenu that handles the needs of the MathJax
 *   contextual menu (in particular, tying it to a MathItem).
 */
export class MJContextMenu extends ContextMenu {

  /**
   * Static map to hold methods for re-computing dynamic submenus.
   * @type {Map<string, (menu: MJContextMenu, sub: Submenu)}
   */
  public static DynamicSubmenus: Map<string,
  (menu: MJContextMenu, sub: Submenu) =>
    SubMenu> = new Map();

  /**
   * The MathItem that has posted the menu
   */
  public mathItem: MathItem<HTMLElement, Text, Document> = null;

  /**
   * The annotation selected in the Annotation submenu (neede for the info box to be able to show it)
   */
  public annotation: string = '';

  /**
   * The info box for showing annotations (created by the Menu object that contains this MJContextMenu)
   */
  public showAnnotation: SelectableInfo;

  /**
   * The function to copy the selected annotation (set by the containing Menu item)
   */
  public copyAnnotation: () => void;

  /**
   * The annotation types to look for in a MathItem
   */
  public annotationTypes: {[type: string]: string[]} = {};

  /*======================================================================*/

  /**
   * Before posting the menu, set the name for the ShowAs and CopyToClipboard menus,
   *   enable/disable the semantics check item, and get the annotations for the MathItem
   *
   * @override
   */
  public post(x?: any, y?: number) {
    if (this.mathItem) {
      if (y !== undefined) {
        // FIXME:  handle error output jax
        const input = this.mathItem.inputJax.name;
        const original = this.findID('Show', 'Original');
        original.content = (input === 'MathML' ? 'Original MathML' : input + ' Commands');
        const clipboard = this.findID('Copy', 'Original');
        clipboard.content = original.content;
        const semantics = this.findID('Settings', 'semantics');
        input === 'MathML' ? semantics.disable() : semantics.enable();
        this.getAnnotationMenu();
        this.dynamicSubmenus();
      }
      super.post(x, y);
    }
  }

  /**
   * Clear the stored MathItem when the menu is removed
   *
   * @override
   */
  public unpost() {
    super.unpost();
    this.mathItem = null;
  }

  /*======================================================================*/

  /**
   * Find an item in the menu (recursively descending into submenus, if needed)
   *
   * @param {string[]} names   The menu IDs to look for
   * @returns {Item}         The menu item (or null if not found)
   */
  public findID(...names: string[]) {
    let menu = this as Menu;
    let item = null as Item;
    for (const name of names) {
      if (menu) {
        item = menu.find(name);
        menu = (item instanceof Submenu ? item.submenu : null);
      } else {
        item = null;
      }
    }
    return item;
  }

  /*======================================================================*/

  /**
   * Look up the annotations in the MathItem and set the ShowAs and CopyToClipboard menus
   */
  protected getAnnotationMenu() {
    const annotations = this.getAnnotations(this.getSemanticNode());
    this.createAnnotationMenu('Show', annotations, () => this.showAnnotation.post());
    this.createAnnotationMenu('Copy', annotations, () => this.copyAnnotation());
  }

  /**
   * Find the top-most semantics element that encloses the contents of the expression (if any)
   *
   * @returns {MmlNode | null}   The semantics node that was found (or null)
   */
  protected getSemanticNode(): MmlNode | null {
    let node: MmlNode = this.mathItem.root;
    while (node && !node.isKind('semantics'))  {
      if (node.isToken || node.childNodes.length !== 1) return null;
      node = node.childNodes[0] as MmlNode;
    }
    return node;
  }

  /**
   * @param {MmlNode} node           The semantics node whose annotations are to be obtained
   * @returns {[string, string][]}   Array of [type, text] where the type is the annotation type
   *                                   and text is the content of the annotation of that type
   */
  protected getAnnotations(node: MmlNode): [string, string][] {
    const annotations = [] as [string, string][];
    if (!node) return annotations;
    for (const child of node.childNodes as MmlNode[]) {
      if (child.isKind('annotation')) {
        const match = this.annotationMatch(child);
        if (match) {
          const value = child.childNodes.reduce((text, chars) => text + chars.toString(), '');
          annotations.push([match, value]);
        }
      }
    }
    return annotations;
  }

  /**
   * @param {MmlNode} child    The annotation node to check if its encoding is one of the displayable ones
   * @returns {string | null}         The annotation type if it does, or null if it doesn't
   */
  protected annotationMatch(child: MmlNode): string | null {
    const encoding = child.attributes.get('encoding') as string;
    for (const type of Object.keys(this.annotationTypes)) {
      if (this.annotationTypes[type].indexOf(encoding) >= 0) {
        return type;
      }
    }
    return null;
  }

  /**
   * Create a submenu from the available annotations and attach it to the proper menu item
   *
   * @param {string} id                        The id of the menu to attach to (Show or Copy)
   * @param {[string, string][]} annotations   The annotations to use for the submenu
   * @param {() => void} action                The action to perform when the annotation is selected
   */
  protected createAnnotationMenu(id: string, annotations: [string, string][], action: () => void) {
    const menu = this.findID(id, 'Annotation') as Submenu;
    menu.submenu = this.factory.get('subMenu')(this.factory, {
      items: annotations.map(([type, value]) => {
        return {
          type: 'command',
          id: type,
          content: type,
          action: () => {
            this.annotation = value;
            action();
          }
        };
      }),
      id: 'annotations'
    }, menu);
    if (annotations.length) {
      menu.enable();
    } else {
      menu.disable();
    }
  }

  /*======================================================================*/

  /**
   * Renews the dynamic submenus.
   */
  public dynamicSubmenus() {
    for (const [id, method] of MJContextMenu.DynamicSubmenus) {
      const menu = this.find(id) as Submenu;
      if (!menu) continue;
      const sub = method(this, menu);
      menu.submenu = sub;
      if (sub.items.length) {
        menu.enable();
      } else {
        menu.disable();
      }
    }
  }

}
