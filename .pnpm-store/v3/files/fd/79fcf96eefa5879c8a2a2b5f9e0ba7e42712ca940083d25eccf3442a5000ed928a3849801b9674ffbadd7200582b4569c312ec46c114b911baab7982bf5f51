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
 * @fileoverview  A visitor to serialize MathML taking menu settings into account
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {MathItem} from '../../core/MathItem.js';
import {MmlNode} from '../../core/MmlTree/MmlNode.js';
import {SerializedMmlVisitor} from '../../core/MmlTree/SerializedMmlVisitor.js';
import {OptionList, userOptions} from '../../util/Options.js';

/*==========================================================================*/

/**
 * The visitor to serialize MathML
 *
 * @template N  The HTMLElement node class
 * @template T  The Text node class
 * @template D  The Document class
 */
export class MmlVisitor<N, T, D> extends SerializedMmlVisitor {

  /**
   * The options controlling the serialization
   */
  public options: OptionList = {
    texHints: true,           // True means include classes for TeXAtom elements
    semantics: false,         // True means include original form as annotation in a semantics element
  };

  /**
   * The MathItem currently being processed
   */
  public mathItem: MathItem<N, T, D> = null;

  /**
   * @param {MmlNode} node         The internal MathML node to serialize
   * @param {MathItem} math        The MathItem for this node
   * @param {OptionList} options   The options controlling the processing
   * @override
   */
  public visitTree(node: MmlNode, math: MathItem<N, T, D> = null, options: OptionList = {}) {
    this.mathItem = math;
    userOptions(this.options, options);
    return this.visitNode(node, '');
  }

  /**
   * @override
   */
  public visitTeXAtomNode(node: MmlNode, space: string) {
    if (this.options.texHints) {
      return super.visitTeXAtomNode(node, space);
    }
    if (node.childNodes[0] && node.childNodes[0].childNodes.length === 1) {
      return this.visitNode(node.childNodes[0], space);
    }
    return space + '<mrow' +  this.getAttributes(node) + '>\n'
      + this.childNodeMml(node, space + '  ', '\n')
      + space + '</mrow>';
  }

  /**
   * @param {MmlNode} node    The math node to visit
   * @param {string} space    The number of spaces to use for indentation
   * @returns {string}        The serialized math element
   */
  public visitMathNode(node: MmlNode, space: string): string {
    if (!this.options.semantics || this.mathItem.inputJax.name !== 'TeX') {
      return super.visitDefault(node, space);
    }
    const addRow = node.childNodes.length && node.childNodes[0].childNodes.length > 1;
    return space + '<math' + this.getAttributes(node) + '>\n'
                 + space + '  <semantics>\n'
                 + (addRow ? space + '    <mrow>\n' : '')
                 + this.childNodeMml(node, space + (addRow ? '      ' : '    '), '\n')
                 + (addRow ? space + '    </mrow>\n' : '')
                 + space + '    <annotation encoding="application/x-tex">' + this.mathItem.math + '</annotation>\n'
                 + space + '  </semantics>\n'
                 + space + '</math>';
  }

}
