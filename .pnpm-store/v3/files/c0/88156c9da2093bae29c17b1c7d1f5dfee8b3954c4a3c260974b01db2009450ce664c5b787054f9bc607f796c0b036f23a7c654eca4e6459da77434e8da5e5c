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
 * @fileoverview Explorers based on mouse events.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {A11yDocument, DummyRegion, Region} from './Region.js';
import {Explorer, AbstractExplorer} from './Explorer.js';
import '../sre.js';


/**
 * Interface for mouse explorers. Adds the necessary mouse events.
 * @interface
 * @extends {Explorer}
 */
export interface MouseExplorer extends Explorer {

  /**
   * Function to be executed on mouse over.
   * @param {MouseEvent} event The mouse event.
   */
  MouseOver(event: MouseEvent): void;

  /**
   * Function to be executed on mouse out.
   * @param {MouseEvent} event The mouse event.
   */
  MouseOut(event: MouseEvent): void;

}


/**
 * @constructor
 * @extends {AbstractExplorer}
 *
 * @template T  The type that is consumed by the Region of this explorer.
 */
export abstract class AbstractMouseExplorer<T> extends AbstractExplorer<T> implements MouseExplorer {

  /**
   * @override
   */
  protected events: [string, (x: Event) => void][] =
    super.Events().concat([
      ['mouseover', this.MouseOver.bind(this)],
      ['mouseout', this.MouseOut.bind(this)]
    ]);

  /**
   * @override
   */
  public MouseOver(_event: MouseEvent) {
    this.Start();
  }


  /**
   * @override
   */
  public MouseOut(_event: MouseEvent) {
    this.Stop();
  }

}


/**
 * Exploration via hovering.
 * @constructor
 * @extends {AbstractMouseExplorer}
 */
export abstract class Hoverer<T> extends AbstractMouseExplorer<T> {

  /**
   * Remember the last position to avoid flickering.
   * @type {[number, number]}
   */
  protected coord: [number, number];

  /**
   * @constructor
   * @extends {AbstractMouseExplorer<T>}
   *
   * @param {A11yDocument} document The current document.
   * @param {Region<T>} region A region to display results.
   * @param {HTMLElement} node The node on which the explorer works.
   * @param {(node: HTMLElement) => boolean} nodeQuery Predicate on nodes that
   *    will fire the hoverer.
   * @param {(node: HTMLElement) => T} nodeAccess Accessor to extract node value
   *    that is passed to the region.
   *
   * @template T
   */
  protected constructor(public document: A11yDocument,
                        protected region: Region<T>,
                        protected node: HTMLElement,
                        protected nodeQuery: (node: HTMLElement) => boolean,
                        protected nodeAccess: (node: HTMLElement) => T) {
    super(document, region, node);
  }


  /**
   * @override
   */
  public MouseOut(event: MouseEvent) {
    if (event.clientX === this.coord[0] &&
        event.clientY === this.coord[1]) {
      return;
    }
    this.highlighter.unhighlight();
    this.region.Hide();
    super.MouseOut(event);
  }


  /**
   * @override
   */
  public MouseOver(event: MouseEvent) {
    super.MouseOver(event);
    let target = event.target as HTMLElement;
    this.coord = [event.clientX, event.clientY];
    let [node, kind] = this.getNode(target);
    if (!node) {
      return;
    }
    this.highlighter.unhighlight();
    this.highlighter.highlight([node]);
    this.region.Update(kind);
    this.region.Show(node, this.highlighter);
  }


  /**
   * Retrieves the closest node on which the node query fires. Thereby closest
   * is defined as:
   * 1. The node or its ancestor on which the query is true.
   * 2. In case 1 does not exist the left-most child on which query is true.
   * 3. Otherwise fails.
   *
   * @param {HTMLElement} node The node on which the mouse event fired.
   * @return {[HTMLElement, T]} Node and output pair if successful.
   */
  public getNode(node: HTMLElement): [HTMLElement, T] {
    let original = node;
    while (node && node !== this.node) {
      if (this.nodeQuery(node)) {
        return [node, this.nodeAccess(node)];
      }
      node = node.parentNode as HTMLElement;
    }
    node = original;
    while (node) {
      if (this.nodeQuery(node)) {
        return [node, this.nodeAccess(node)];
      }
      let child = node.childNodes[0] as HTMLElement;
      node = (child && child.tagName === 'defs') ? // This is for SVG.
      node.childNodes[1] as HTMLElement : child;
    }
    return [null, null];
  }

}


/**
 * Hoverer that displays information on nodes (e.g., as tooltips).
 * @constructor
 * @extends {Hoverer}
 */
export class ValueHoverer extends Hoverer<string> { }


/**
 * Hoverer that displays node content (e.g., for magnification).
 * @constructor
 * @extends {Hoverer}
 */
export class ContentHoverer extends Hoverer<HTMLElement> { }


/**
 * Highlights maction nodes on hovering.
 * @constructor
 * @extends {Hoverer}
 */
export class FlameHoverer extends Hoverer<void> {

  /**
   * @override
   */
  protected constructor(
    public document: A11yDocument,
    _ignore: any,
    protected node: HTMLElement) {
    super(document, new DummyRegion(document), node,
          x => this.highlighter.isMactionNode(x),
          () => {});
  }

}
