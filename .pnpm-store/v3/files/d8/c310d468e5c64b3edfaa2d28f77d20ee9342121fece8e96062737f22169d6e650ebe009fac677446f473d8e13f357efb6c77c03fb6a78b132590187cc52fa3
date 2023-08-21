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
 * @fileoverview  Implements the SVGmaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {SVGWrapper, SVGConstructor} from '../Wrapper.js';
import {CommonMactionMixin} from '../../common/Wrappers/maction.js';
import {ActionDef} from '../../common/Wrappers/maction.js';
import {EventHandler, TooltipData} from '../../common/Wrappers/maction.js';
import {MmlMaction} from '../../../core/MmlTree/MmlNodes/maction.js';
import {TextNode, AbstractMmlNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The SVGmaction wrapper for the MmlMaction object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class SVGmaction<N, T, D> extends
CommonMactionMixin<SVGWrapper<any, any, any>, SVGConstructor<any, any, any>>(SVGWrapper) {

  /**
   * The maction wrapper
   */
  public static kind = MmlMaction.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    '[jax="SVG"] mjx-tool': {
      display: 'inline-block',
      position: 'relative',
      width: 0, height: 0
    },
    '[jax="SVG"] mjx-tool > mjx-tip': {
      position: 'absolute',
      top: 0, left: 0
    },
    'mjx-tool > mjx-tip': {
      display: 'inline-block',
      padding: '.2em',
      border: '1px solid #888',
      'font-size': '70%',
      'background-color': '#F8F8F8',
      color: 'black',
      'box-shadow': '2px 2px 5px #AAAAAA'
    },
    'g[data-mml-node="maction"][data-toggle]': {
      cursor: 'pointer'
    },
    'mjx-status': {
      display: 'block',
      position: 'fixed',
      left: '1em',
      bottom: '1em',
      'min-width': '25%',
      padding: '.2em .4em',
      border: '1px solid #888',
      'font-size': '90%',
      'background-color': '#F8F8F8',
      color: 'black'
    }
  };

  /**
   * The valid action types and their handlers
   */
  public static actions = new Map([
    ['toggle', [(node, _data) => {
      //
      // Mark which child is selected
      //
      node.adaptor.setAttribute(node.element, 'data-toggle', node.node.attributes.get('selection') as string);
      //
      // Cache the data needed to select another node
      //
      const math = node.factory.jax.math;
      const document = node.factory.jax.document;
      const mml = node.node as MmlMaction;
      //
      // Add a click handler that changes the selection and rerenders the expression
      //
      node.setEventHandler('click', (event: Event) => {
        if (!math.end.node) {
          //
          // If the MathItem was created by hand, it might not have a node
          // telling it where to replace the existing math, so set it.
          //
          math.start.node = math.end.node = math.typesetRoot;
          math.start.n = math.end.n = 0;
        }
        mml.nextToggleSelection();
        math.rerender(document);
        event.stopPropagation();
      });
    }, {}]],

    ['tooltip', [(node, data) => {
      const tip = node.childNodes[1];
      if (!tip) return;
      const rect = node.firstChild();
      if (tip.node.isKind('mtext')) {
        //
        // Text tooltips are handled through title attributes
        //
        const text = (tip.node as TextNode).getText();
        node.adaptor.insert(node.svg('title', {}, [node.text(text)]), rect);
      } else {
        //
        // Math tooltips are handled through hidden nodes and event handlers
        //
        const adaptor = node.adaptor;
        const container = node.jax.container;
        const math = (node.node as AbstractMmlNode).factory.create('math', {}, [node.childNodes[1].node]);
        const tool = node.html('mjx-tool', {}, [node.html('mjx-tip')]);
        const hidden = adaptor.append(rect, node.svg('foreignObject', {style: {display: 'none'}}, [tool]));
        node.jax.processMath(math, adaptor.firstChild(tool));
        node.childNodes[1].node.parent = node.node;
        //
        // Set up the event handlers to display and remove the tooltip
        //
        node.setEventHandler('mouseover', (event: Event) => {
          data.stopTimers(node, data);
          data.hoverTimer.set(node, setTimeout(() => {
            adaptor.setStyle(tool, 'left', '0');
            adaptor.setStyle(tool, 'top', '0');
            adaptor.append(container, tool);
            const tbox = adaptor.nodeBBox(tool);
            const nbox = adaptor.nodeBBox(node.element);
            const dx = (nbox.right - tbox.left) / node.metrics.em + node.dx;
            const dy = (nbox.bottom - tbox.bottom) / node.metrics.em + node.dy;
            adaptor.setStyle(tool, 'left', node.px(dx));
            adaptor.setStyle(tool, 'top', node.px(dy));
          }, data.postDelay));
          event.stopPropagation();
        });
        node.setEventHandler('mouseout',  (event: Event) => {
          data.stopTimers(node, data);
          const timer = setTimeout(() => adaptor.append(hidden, tool), data.clearDelay);
          data.clearTimer.set(node, timer);
          event.stopPropagation();
        });
      }
    }, TooltipData]],

    ['statusline', [(node, data) => {
      const tip = node.childNodes[1];
      if (!tip) return;
      if (tip.node.isKind('mtext')) {
        const adaptor = node.adaptor;
        const text = (tip.node as TextNode).getText();
        adaptor.setAttribute(node.element, 'data-statusline', text);
        //
        // Set up event handlers to change the status window
        //
        node.setEventHandler('mouseover', (event: Event) => {
          if (data.status === null) {
            const body = adaptor.body(adaptor.document);
            data.status = adaptor.append(body, node.html('mjx-status', {}, [node.text(text)]));
          }
          event.stopPropagation();
        });
        node.setEventHandler('mouseout', (event: Event) => {
          if (data.status) {
            adaptor.remove(data.status);
            data.status = null;
          }
          event.stopPropagation();
        });
      }
    }, {
      status: null  // cached status line
    }]]

  ] as ActionDef<SVGmaction<any, any, any>>[]);

  /*************************************************************/

  /**
   * @override
   */
  public toSVG(parent: N) {
    const svg = this.standardSVGnode(parent);
    const child = this.selected;
    const {h, d, w} = child.getOuterBBox();
    this.adaptor.append(this.element, this.svg('rect', {
      width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d),
      fill: 'none', 'pointer-events': 'all'
    }));
    child.toSVG(svg);
    const bbox = child.getOuterBBox();
    if (child.element) {
      child.place(bbox.L * bbox.rscale, 0);
    }
    this.action(this, this.data);
  }

  /**
   * Add an event handler to the output for this maction
   */
  public setEventHandler(type: string, handler: EventHandler) {
    (this.element as any).addEventListener(type, handler);
  }

}
