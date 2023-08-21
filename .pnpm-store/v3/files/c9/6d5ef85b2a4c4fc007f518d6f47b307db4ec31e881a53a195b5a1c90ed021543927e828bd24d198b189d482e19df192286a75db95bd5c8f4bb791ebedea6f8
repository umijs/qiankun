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
 * @fileoverview Mappings for TeX parsing for the bussproofs package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */


import {ParseMethod} from '../Types.js';
import TexError from '../TexError.js';
import TexParser from '../TexParser.js';
import ParseUtil from '../ParseUtil.js';
import {StackItem} from '../StackItem.js';
import {MmlNode} from '../../../core/MmlTree/MmlNode.js';
import * as BussproofsUtil from './BussproofsUtil.js';


// Namespace
let BussproofsMethods: Record<string, ParseMethod> = {};

/**
 * Implements the proof tree environment.
 * @param {TexParser} parser The current parser.
 * @param {StackItem} begin The opening element of the environment.
 * @return {StackItem} The proof tree stackitem.
 */
// TODO: Error handling if we have leftover elements or elements are not in the
// required order.
BussproofsMethods.Prooftree = function(parser: TexParser, begin: StackItem): StackItem {
  parser.Push(begin);
  // TODO: Check if opening a proof tree is legal.
  let newItem = parser.itemFactory.create('proofTree').
    setProperties({name: begin.getName(),
                   line: 'solid', currentLine: 'solid', rootAtTop: false});
  // parser.Push(item);
  return newItem;
};


/**
 * Implements the Axiom command.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 */
BussproofsMethods.Axiom = function(parser: TexParser, name: string) {
  let top = parser.stack.Top();
  // TODO: Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let content = paddedContent(parser, parser.GetArgument(name));
  BussproofsUtil.setProperty(content, 'axiom', true);
  top.Push(content);
};


/**
 * Pads content of an inference rule.
 * @param {TexParser} parser The calling parser.
 * @param {string} content The content to be padded.
 * @return {MmlNode} The mrow element with padded content.
 */
const paddedContent = function(parser: TexParser, content: string): MmlNode {
  // Add padding on either site.
  let nodes = ParseUtil.internalMath(parser, ParseUtil.trimSpaces(content), 0);
  if (!nodes[0].childNodes[0].childNodes.length) {
    return parser.create('node', 'mrow', []);
  }
  let lpad = parser.create('node', 'mspace', [], {width: '.5ex'});
  let rpad = parser.create('node', 'mspace', [], {width: '.5ex'});
  return parser.create('node', 'mrow', [lpad, ...nodes, rpad]);
};


/**
 * Implements the Inference rule commands.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {number} n Number of premises for this inference rule.
 */
BussproofsMethods.Inference = function(parser: TexParser, name: string, n: number) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  if (top.Size() < n) {
    throw new TexError('BadProofTree', 'Proof tree badly specified.');
  }
  const rootAtTop = top.getProperty('rootAtTop') as boolean;
  const childCount = (n === 1 && !top.Peek()[0].childNodes.length) ? 0 : n;
  let children: MmlNode[] = [];
  do {
    if (children.length) {
      children.unshift(parser.create('node', 'mtd', [], {}));
    }
    children.unshift(
      parser.create('node', 'mtd', [top.Pop()],
                    {'rowalign': (rootAtTop ? 'top' : 'bottom')}));
    n--;
  } while (n > 0);
  let row = parser.create('node', 'mtr', children, {});
  let table = parser.create('node', 'mtable', [row], {framespacing: '0 0'});
  let conclusion = paddedContent(parser, parser.GetArgument(name));
  let style = top.getProperty('currentLine') as string;
  if (style !== top.getProperty('line')) {
    top.setProperty('currentLine', top.getProperty('line'));
  }
  let rule = createRule(
    parser, table, [conclusion], top.getProperty('left') as MmlNode,
    top.getProperty('right') as MmlNode, style, rootAtTop);
  top.setProperty('left', null);
  top.setProperty('right', null);
  BussproofsUtil.setProperty(rule, 'inference', childCount);
  parser.configuration.addNode('inference', rule);
  top.Push(rule);
};


/**
 * Creates a ND style inference rule.
 * @param {TexParser} parser The calling parser.
 * @param {MmlNode} premise The premise (a single table).
 * @param {MmlNode[]} conclusions Elements that are combined into the conclusion.
 * @param {MmlNode|null} left The left label if it exists.
 * @param {MmlNode|null} right The right label if it exists.
 * @param {string} style Style of inference rule line.
 * @param {boolean} rootAtTop Direction of inference rule: true for root at top.
 */
function createRule(parser: TexParser, premise: MmlNode,
                    conclusions: MmlNode[], left: MmlNode | null,
                    right: MmlNode | null, style: string,
                    rootAtTop: boolean) {
  const upper = parser.create(
    'node', 'mtr', [parser.create('node', 'mtd', [premise], {})], {});
  const lower = parser.create(
    'node', 'mtr', [parser.create('node', 'mtd', conclusions, {})], {});
  let rule = parser.create('node', 'mtable', rootAtTop ? [lower, upper] : [upper, lower],
                           {align: 'top 2', rowlines: style, framespacing: '0 0'});
  BussproofsUtil.setProperty(rule, 'inferenceRule', rootAtTop ? 'up' : 'down');
  let leftLabel, rightLabel;
  if (left) {
    leftLabel = parser.create(
      'node', 'mpadded', [left],
      {height: '+.5em', width: '+.5em', voffset: '-.15em'});
    BussproofsUtil.setProperty(leftLabel, 'prooflabel', 'left');
  }
  if (right) {
    rightLabel = parser.create(
      'node', 'mpadded', [right],
      {height: '+.5em', width: '+.5em', voffset: '-.15em'});
    BussproofsUtil.setProperty(rightLabel, 'prooflabel', 'right');
  }
  let children, label;
  if (left && right) {
    children = [leftLabel, rule, rightLabel];
    label = 'both';
  } else if (left) {
    children = [leftLabel, rule];
    label = 'left';
  } else if (right) {
    children = [rule, rightLabel];
    label = 'right';
  } else {
    return rule;
  }
  rule = parser.create('node', 'mrow', children);
  BussproofsUtil.setProperty(rule, 'labelledRule', label);
  return rule;
}


/**
 * Implements the label command.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {string} side The side of the label.
 */
BussproofsMethods.Label = function(parser: TexParser, name: string, side: string) {
  let top = parser.stack.Top();
  // Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let content = ParseUtil.internalMath(parser, parser.GetArgument(name), 0);
  let label = (content.length > 1) ?
    parser.create('node', 'mrow', content, {}) : content[0];
  top.setProperty(side, label);
};


/**
 * Sets line style for inference rules.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {string} style The line style to set.
 * @param {boolean} always Set as permanent style.
 */
BussproofsMethods.SetLine = function(parser: TexParser, _name: string, style: string, always: boolean) {
  let top = parser.stack.Top();
  // Label error
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  top.setProperty('currentLine', style);
  if (always) {
    top.setProperty('line', style);
  }
};


/**
 * Implements commands indicating where the root of the proof tree is.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {string} where If true root is at top, otherwise at bottom.
 */
BussproofsMethods.RootAtTop = function(parser: TexParser, _name: string, where: boolean) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  top.setProperty('rootAtTop', where);
};


/**
 * Implements Axiom command for sequents.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 */
BussproofsMethods.AxiomF = function(parser: TexParser, name: string) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  let line = parseFCenterLine(parser, name);
  BussproofsUtil.setProperty(line, 'axiom', true);
  top.Push(line);
};


/**
 * Parses a line with a sequent (i.e., one containing \\fcenter).
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the calling command.
 * @return {MmlNode} The parsed line.
 */
function parseFCenterLine(parser: TexParser, name: string): MmlNode {
  let dollar = parser.GetNext();
  if (dollar !== '$') {
    throw new TexError('IllegalUseOfCommand',
                       'Use of %1 does not match it\'s definition.', name);
  }
  parser.i++;
  let axiom = parser.GetUpTo(name, '$');
  if (axiom.indexOf('\\fCenter') === -1) {
    throw new TexError('IllegalUseOfCommand',
                       'Missing \\fCenter in %1.', name);
  }
  // Check for fCenter and throw error?
  let [prem, conc] = axiom.split('\\fCenter');
  let premise = (new TexParser(prem, parser.stack.env, parser.configuration)).mml();
  let conclusion = (new TexParser(conc, parser.stack.env, parser.configuration)).mml();
  let fcenter = (new TexParser('\\fCenter', parser.stack.env, parser.configuration)).mml();
  const left = parser.create('node', 'mtd', [premise], {});
  const middle = parser.create('node', 'mtd', [fcenter], {});
  const right = parser.create('node', 'mtd', [conclusion], {});
  const row = parser.create('node', 'mtr', [left, middle, right], {});
  const table = parser.create('node', 'mtable', [row], {columnspacing: '.5ex', columnalign: 'center 2'});
  BussproofsUtil.setProperty(table, 'sequent', true);
  parser.configuration.addNode('sequent', row);
  return table;
}


/**
 * Placeholder for Fcenter macro that can be overwritten with renewcommand.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 */
BussproofsMethods.FCenter = function(_parser: TexParser, _name: string) { };


/**
 * Implements inference rules for sequents.
 * @param {TexParser} parser The current parser.
 * @param {string} name The name of the command.
 * @param {number} n Number of premises for this inference rule.
 */
BussproofsMethods.InferenceF = function(parser: TexParser, name: string, n: number) {
  let top = parser.stack.Top();
  if (top.kind !== 'proofTree') {
    throw new TexError('IllegalProofCommand',
                       'Proof commands only allowed in prooftree environment.');
  }
  if (top.Size() < n) {
    throw new TexError('BadProofTree', 'Proof tree badly specified.');
  }
  const rootAtTop = top.getProperty('rootAtTop') as boolean;
  const childCount = (n === 1 && !top.Peek()[0].childNodes.length) ? 0 : n;
  let children: MmlNode[] = [];
  do {
    if (children.length) {
      children.unshift(parser.create('node', 'mtd', [], {}));
    }
    children.unshift(
      parser.create('node', 'mtd', [top.Pop()],
                    {'rowalign': (rootAtTop ? 'top' : 'bottom')}));
    n--;
  } while (n > 0);
  let row = parser.create('node', 'mtr', children, {});
  let table = parser.create('node', 'mtable', [row], {framespacing: '0 0'});

  let conclusion = parseFCenterLine(parser, name); // TODO: Padding
  let style = top.getProperty('currentLine') as string;
  if (style !== top.getProperty('line')) {
    top.setProperty('currentLine', top.getProperty('line'));
  }
  let rule = createRule(
    parser, table, [conclusion], top.getProperty('left') as MmlNode,
    top.getProperty('right') as MmlNode, style, rootAtTop);
  top.setProperty('left', null);
  top.setProperty('right', null);
  BussproofsUtil.setProperty(rule, 'inference', childCount);
  parser.configuration.addNode('inference', rule);
  top.Push(rule);
};

export default BussproofsMethods;
