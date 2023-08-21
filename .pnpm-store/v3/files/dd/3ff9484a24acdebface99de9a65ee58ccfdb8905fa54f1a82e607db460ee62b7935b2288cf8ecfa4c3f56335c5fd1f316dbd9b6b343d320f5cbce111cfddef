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
 * @fileoverview  Implements the MmlMglyph node
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {PropertyList} from '../../Tree/Node.js';
import {AbstractMmlTokenNode, TEXCLASS} from '../MmlNode.js';

/*****************************************************************/
/**
 *  Implements the MmlMglyph node class (subclass of AbstractMmlTokenNode)
 */

export class MmlMglyph extends AbstractMmlTokenNode {

  /**
   * @override
   */
  public static defaults: PropertyList = {
    ...AbstractMmlTokenNode.defaults,
    alt: '',
    src: '',
    index: '',
    width: 'auto',
    height: 'auto',
    valign: '0em'
  };

  /**
   * TeX class is ORD
   */
  protected texclass = TEXCLASS.ORD;

  /**
   * @override
   */
  public get kind() {
    return 'mglyph';
  }

  /**
   * @override
   */
  public verifyAttributes(options: PropertyList) {
    const {src, fontfamily, index} = this.attributes.getList('src', 'fontfamily', 'index');
    if (src === '' && (fontfamily === '' || index === '')) {
      this.mError('mglyph must have either src or fontfamily and index attributes', options, true);
    } else {
      super.verifyAttributes(options);
    }
  }

}
