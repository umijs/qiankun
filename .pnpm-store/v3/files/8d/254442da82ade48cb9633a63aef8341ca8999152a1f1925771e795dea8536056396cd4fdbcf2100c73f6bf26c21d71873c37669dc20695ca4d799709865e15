/*************************************************************
 *
 *  Copyright (c) 2018-2022 Omar Al-Ithawi and The MathJax Consortium
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
 * @fileoverview Configuration file for the color package.
 *
 * @author i@omardo.com (Omar Al-Ithawi)
 */


import {CommandMap} from '../SymbolMap.js';
import {Configuration, ParserConfiguration} from '../Configuration.js';
import {ColorMethods} from './ColorMethods.js';
import {ColorModel} from './ColorUtil.js';
import {TeX} from '../../tex.js';

/**
 * The color macros
 */
new CommandMap('color', {
  color: 'Color',
  textcolor: 'TextColor',
  definecolor: 'DefineColor',
  colorbox: 'ColorBox',
  fcolorbox: 'FColorBox'
}, ColorMethods);

/**
 * Config method for Color package.
 *
 * @param {Configuration} config The current configuration.
 * @param {TeX} jax              The TeX jax having that configuration
 */
const config = function(_config: ParserConfiguration, jax: TeX<any, any, any>) {
  jax.parseOptions.packageData.set('color', {model: new ColorModel()});
};

/**
 * The configuration for the color macros
 */
export const ColorConfiguration = Configuration.create(
  'color', {
    handler: {
      macro: ['color'],
    },
    options: {
      color: {
        padding: '5px',
        borderWidth: '2px'
      }
    },
    config: config
  }
);
