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
 * @fileoverview  Implements the CHTMLmaction wrapper for the MmlMaction object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {CHTMLWrapper, CHTMLConstructor} from '../Wrapper.js';
import {CommonMactionMixin} from '../../common/Wrappers/maction.js';
import {ActionDef} from '../../common/Wrappers/maction.js';
import {EventHandler, TooltipData} from '../../common/Wrappers/maction.js';
import {MmlMaction} from '../../../core/MmlTree/MmlNodes/maction.js';
import {TextNode} from '../../../core/MmlTree/MmlNode.js';
import {StyleList} from '../../../util/StyleList.js';

/*****************************************************************/
/**
 * The CHTMLmaction wrapper for the MmlMaction object
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
// @ts-ignore
export class CHTMLmaction<N, T, D> extends
CommonMactionMixin<CHTMLWrapper<any, any, any>, CHTMLConstructor<any, any, any>>(CHTMLWrapper) {

  /**
   * The maction wrapper
   */
  public static kind = MmlMaction.prototype.kind;

  /**
   * @override
   */
  public static styles: StyleList = {
    'mjx-maction': {
      position: 'relative'
    },
    'mjx-maction > mjx-tool': {
      display: 'none',
      position: 'absolute',
      bottom: 0, right: 0,
      width: 0, height: 0,
      'z-index': 500
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
    'mjx-maction[toggle]': {
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
      node.adaptor.setAttribute(node.chtml, 'toggle', node.node.attributes.get('selection') as string);
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
      if (tip.node.isKind('mtext')) {
        //
        // Text tooltips are handled through title attributes
        //
        const text = (tip.node as TextNode).getText();
        node.adaptor.setAttribute(node.chtml, 'title', text);
      } else {
        //
        // Math tooltips are handled through hidden nodes and event handlers
        //
        const adaptor = node.adaptor;
        const tool = adaptor.append(node.chtml, node.html('mjx-tool', {
          style: {bottom: node.em(-node.dy), right: node.em(-node.dx)}
        }, [node.html('mjx-tip')]));
        tip.toCHTML(adaptor.firstChild(tool));
        //
        // Set up the event handlers to display and remove the tooltip
        //
        node.setEventHandler('mouseover', (event: Event) => {
          data.stopTimers(node, data);
          const timeout = setTimeout(() => adaptor.setStyle(tool, 'display', 'block'), data.postDelay);
          data.hoverTimer.set(node, timeout);
          event.stopPropagation();
        });
        node.setEventHandler('mouseout',  (event: Event) => {
          data.stopTimers(node, data);
          const timeout = setTimeout(() => adaptor.setStyle(tool, 'display', ''), data.clearDelay);
          data.clearTimer.set(node, timeout);
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
        adaptor.setAttribute(node.chtml, 'statusline', text);
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

  ] as ActionDef<CHTMLmaction<any, any, any>>[]);

  /*************************************************************/

  /**
   * @override
   */
  public toCHTML(parent: N) {
    const chtml = this.standardCHTMLnode(parent);
    const child = this.selected;
    child.toCHTML(chtml);
    this.action(this, this.data);
  }

  /**
   * Add an event handler to the output for this maction
   */
  public setEventHandler(type: string, handler: EventHandler) {
    (this.chtml as any).addEventListener(type, handler);
  }

}
