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
 * @fileoverview  The MathJax TeXFont object
 *
 * @author dpvc@mathjax.org (Davide Cervone)
 */

import {FontDataClass, CharOptions, VariantData, DelimiterData, CssFontMap} from '../FontData.js';

/*****************************************************************/
/**
 *  The CommonTeXFont mixin for the CommonTeXFont object
 *
 * @template C  The CharOptions class for this font
 * @template V  The VariantData class for this font
 * @template B  The FontData class to extend
 */
export function CommonTeXFontMixin<
  C extends CharOptions,
  V extends VariantData<C>,
  D extends DelimiterData,
  B extends FontDataClass<C, V, D>
>(Base: B): FontDataClass<C, V, D> & B {

  return class extends Base {

    /**
     * @override
     */
    public static NAME = 'TeX';

    /**
     *  Add the extra variants for the TeX fonts
     */
    protected static defaultVariants = [
      ...Base.defaultVariants,
      ['-smallop', 'normal'],
      ['-largeop', 'normal'],
      ['-size3', 'normal'],
      ['-size4', 'normal'],
      ['-tex-calligraphic', 'italic'],
      ['-tex-bold-calligraphic', 'bold-italic'],
      ['-tex-oldstyle', 'normal'],
      ['-tex-bold-oldstyle', 'bold'],
      ['-tex-mathit', 'italic'],
      ['-tex-variant', 'normal']
    ];

    /**
     * The data used for CSS for undefined characters for each variant
     */
    protected static defaultCssFonts: CssFontMap = {
      ...Base.defaultCssFonts,
      '-smallop': ['serif', false, false],
      '-largeop': ['serif', false, false],
      '-size3': ['serif', false, false],
      '-size4': ['serif', false, false],
      '-tex-calligraphic': ['cursive', true, false],
      '-tex-bold-calligraphic': ['cursive', true, true],
      '-tex-oldstyle': ['serif', false, false],
      '-tex-bold-oldstyle': ['serif', false, true],
      '-tex-mathit': ['serif', true, false]
    };

    /**
     *  The default variants for the standard stretchy sizes
     */
    protected static defaultSizeVariants = ['normal', '-smallop', '-largeop', '-size3', '-size4', '-tex-variant'];

    /**
     *  The default variants for the standard stretchy assmebly parts
     */
    protected static defaultStretchVariants = ['-size4'];

    /**
     * @override
     */
    protected getDelimiterData(n: number) {
      return this.getChar('-smallop', n) || this.getChar('-size4', n);
    }

  };

}

