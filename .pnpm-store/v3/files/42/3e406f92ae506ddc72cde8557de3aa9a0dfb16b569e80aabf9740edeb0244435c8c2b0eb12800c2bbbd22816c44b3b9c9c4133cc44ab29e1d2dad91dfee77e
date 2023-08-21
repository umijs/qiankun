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
 * @fileoverview Parse methods and helper functtions for the color package.
 *
 * @author i@omardo.com (Omar Al-Ithawi)
 */


import NodeUtil from '../NodeUtil.js';
import {ParseMethod} from '../Types.js';
import {PropertyList} from '../../../core/Tree/Node.js';
import ParseUtil from '../ParseUtil.js';
import TexParser from '../TexParser.js';

import {ColorModel} from './ColorUtil.js';


/**
 * Build PropertyList from padding value.
 *
 * @param {string} colorPadding: Padding for \colorbox and \fcolorbox.
 * @return {PropertyList} The padding properties.
 */
function padding(colorPadding: string): PropertyList {
  const pad = `+${colorPadding}`;
  const unit = colorPadding.replace(/^.*?([a-z]*)$/, '$1');
  const pad2 = 2 * parseFloat(pad);
  return {
    width: `+${pad2}${unit}`,
    height: pad,
    depth: pad,
    lspace: colorPadding,
  };
}


export const ColorMethods: Record<string, ParseMethod> = {};


/**
 * Override \color macro definition.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.Color = function (parser: TexParser, name: string) {
  const model = parser.GetBrackets(name, '');
  const colorDef = parser.GetArgument(name);
  const colorModel: ColorModel = parser.configuration.packageData.get('color').model;
  const color = colorModel.getColor(model, colorDef);

  const style = parser.itemFactory.create('style')
    .setProperties({styles: { mathcolor: color }});
  parser.stack.env['color'] = color;

  parser.Push(style);
};


/**
 * Define the \textcolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.TextColor = function (parser: TexParser, name: string) {
  const model = parser.GetBrackets(name, '');
  const colorDef = parser.GetArgument(name);
  const colorModel: ColorModel = parser.configuration.packageData.get('color').model;
  const color = colorModel.getColor(model, colorDef);
  const old = parser.stack.env['color'];

  parser.stack.env['color'] = color;
  const math = parser.ParseArg(name);

  if (old) {
    parser.stack.env['color'] = old;
  } else {
    delete parser.stack.env['color'];
  }

  const node = parser.create('node', 'mstyle', [math], {mathcolor: color});
  parser.Push(node);
};

/**
 * Define the \definecolor macro.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.DefineColor = function (parser: TexParser, name: string) {
  const cname = parser.GetArgument(name);
  const model = parser.GetArgument(name);
  const def = parser.GetArgument(name);

  const colorModel: ColorModel = parser.configuration.packageData.get('color').model;
  colorModel.defineColor(model, cname, def);
};

/**
 * Produce a text box with a colored background: `\colorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.ColorBox = function (parser: TexParser, name: string) {
  const cname = parser.GetArgument(name);
  const math = ParseUtil.internalMath(parser, parser.GetArgument(name));
  const colorModel: ColorModel = parser.configuration.packageData.get('color').model;

  const node = parser.create('node', 'mpadded', math, {
    mathbackground: colorModel.getColor('named', cname)
  });

  NodeUtil.setProperties(node, padding(parser.options.color.padding));
  parser.Push(node);
};

/**
 * Produce a framed text box with a colored background: `\fcolorbox`.
 *
 * @param {TexParser} parser The calling parser.
 * @param {string} name The name of the control sequence.
 */
ColorMethods.FColorBox = function (parser: TexParser, name: string) {
  const fname = parser.GetArgument(name);
  const cname = parser.GetArgument(name);
  const math = ParseUtil.internalMath(parser, parser.GetArgument(name));
  const options = parser.options.color;
  const colorModel: ColorModel = parser.configuration.packageData.get('color').model;

  const node = parser.create('node', 'mpadded', math, {
    mathbackground: colorModel.getColor('named', cname),
    style: `border: ${options.borderWidth} solid ${colorModel.getColor('named', fname)}`
  });

  NodeUtil.setProperties(node, padding(options.padding));
  parser.Push(node);
};
