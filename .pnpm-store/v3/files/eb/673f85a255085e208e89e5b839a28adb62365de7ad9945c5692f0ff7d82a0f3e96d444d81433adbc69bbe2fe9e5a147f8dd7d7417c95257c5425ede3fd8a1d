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
 * @fileoverview  An info box that allows text selection and has copy-to-clipboard functions
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {Info} from 'mj-context-menu/js/info.js';
import {HtmlClasses} from 'mj-context-menu/js/html_classes.js';

/*==========================================================================*/

/**
 * The SelectableInfo class definition
 */
export class SelectableInfo extends Info {

  /**
   * Add a keypress event to handle "select all" so that only
   * the info-box's text is selected (not the whole page)
   *
   * @override
   */
  public addEvents(element: HTMLElement) {
    element.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        this.selectAll();
        this.stop(event);
      }
    });
  }

  /**
   * Select all the main text of the info box
   */
  public selectAll() {
    const selection = document.getSelection();
    selection.selectAllChildren(this.html.querySelector('pre'));
  }

  /**
   * Implement the copy-to-clipboard action
   */
  public copyToClipboard() {
    this.selectAll();
    try {
      document.execCommand('copy');
    } catch (err) {
      alert('Can\'t copy to clipboard: ' + err.message);
    }
    document.getSelection().removeAllRanges();
  }

  /**
   * Attach the copy-to-clipboard action to its button
   */
  public generateHtml() {
    super.generateHtml();
    const footer = this.html.querySelector('span.' + HtmlClasses['INFOSIGNATURE']);
    const button = footer.appendChild(document.createElement('input'));
    button.type = 'button';
    button.value = 'Copy to Clipboard';
    button.addEventListener('click', (_event: MouseEvent) => this.copyToClipboard());
  }

}
