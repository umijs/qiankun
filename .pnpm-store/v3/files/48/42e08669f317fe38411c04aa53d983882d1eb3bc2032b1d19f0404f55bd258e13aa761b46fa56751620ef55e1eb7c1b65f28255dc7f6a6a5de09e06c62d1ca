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
 * @fileoverview Mappings for TeX parsing of the physics package.
 *
 * @author v.sorge@mathjax.org (Volker Sorge)
 */

import {EnvironmentMap, CommandMap, MacroMap, CharacterMap} from '../SymbolMap.js';
import PhysicsMethods from './PhysicsMethods.js';
import {TexConstant} from '../TexConstants.js';
import ParseMethods from '../ParseMethods.js';
import {TEXCLASS} from '../../../core/MmlTree/MmlNode.js';


/**
 * Macros for physics package (section 2.1).
 */
new CommandMap('Physics-automatic-bracing-macros', {
  'quantity':       'Quantity',
  'qty':            'Quantity',
  'pqty':           ['Quantity', '(', ')', true],
  'bqty':           ['Quantity', '[', ']', true],
  'vqty':           ['Quantity', '|', '|', true],
  'Bqty':           ['Quantity', '\\{', '\\}', true],
  'absolutevalue':  ['Quantity', '|', '|', true],
  'abs':            ['Quantity', '|', '|', true],
  'norm':           ['Quantity', '\\|', '\\|', true],
  'evaluated':      'Eval',
  'eval':           'Eval',
  'order':          ['Quantity', '(', ')', true, 'O',
                     TexConstant.Variant.CALLIGRAPHIC],
  'commutator':     'Commutator',
  'comm':           'Commutator',
  'anticommutator': ['Commutator', '\\{', '\\}'],
  'acomm':          ['Commutator', '\\{', '\\}'],
  'poissonbracket': ['Commutator', '\\{', '\\}'],
  'pb':             ['Commutator', '\\{', '\\}']
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.2).
 */
new CharacterMap('Physics-vector-mo', ParseMethods.mathchar0mo, {
  dotproduct:    ['\u22C5', {mathvariant: TexConstant.Variant.BOLD}],
  vdot:          ['\u22C5', {mathvariant: TexConstant.Variant.BOLD}],
  crossproduct:  '\u00D7',
  cross:         '\u00D7',
  cp:            '\u00D7',
  // This is auxiliary!
  gradientnabla: ['\u2207', {mathvariant: TexConstant.Variant.BOLD}]
});

new CharacterMap('Physics-vector-mi', ParseMethods.mathchar0mi, {
  real:          ['\u211C', {mathvariant: TexConstant.Variant.NORMAL}],
  imaginary:     ['\u2111', {mathvariant: TexConstant.Variant.NORMAL}]
});

new CommandMap('Physics-vector-macros', {
  'vnabla':      'Vnabla',
  'vectorbold':  'VectorBold',
  'vb':          'VectorBold',
  'vectorarrow': ['StarMacro', 1, '\\vec{\\vb', '{#1}}'],
  'va':          ['StarMacro', 1, '\\vec{\\vb', '{#1}}'],
  'vectorunit':  ['StarMacro', 1, '\\hat{\\vb', '{#1}}'],
  'vu':          ['StarMacro', 1, '\\hat{\\vb', '{#1}}'],
  'gradient':    ['OperatorApplication', '\\vnabla', '(', '['],
  'grad':        ['OperatorApplication', '\\vnabla', '(', '['],
  'divergence':  ['VectorOperator', '\\vnabla\\vdot', '(', '['],
  'div':         ['VectorOperator', '\\vnabla\\vdot', '(', '['],
  'curl':        ['VectorOperator', '\\vnabla\\crossproduct', '(', '['],
  'laplacian':   ['OperatorApplication', '\\nabla^2', '(', '['],
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.3).
 */
new CommandMap('Physics-expressions-macros', {
  'sin':              'Expression',
  'sinh':             'Expression',
  'arcsin':           'Expression',
  'asin':             'Expression',
  'cos':              'Expression',
  'cosh':             'Expression',
  'arccos':           'Expression',
  'acos':             'Expression',
  'tan':              'Expression',
  'tanh':             'Expression',
  'arctan':           'Expression',
  'atan':             'Expression',
  'csc':              'Expression',
  'csch':             'Expression',
  'arccsc':           'Expression',
  'acsc':             'Expression',
  'sec':              'Expression',
  'sech':             'Expression',
  'arcsec':           'Expression',
  'asec':             'Expression',
  'cot':              'Expression',
  'coth':             'Expression',
  'arccot':           'Expression',
  'acot':             'Expression',
  'exp':              ['Expression', false],
  'log':              'Expression',
  'ln':               'Expression',
  'det':              ['Expression', false],
  'Pr':               ['Expression', false],
  // New expressions.
  'tr':               ['Expression', false],
  'trace':            ['Expression', false, 'tr'],
  'Tr':               ['Expression', false],
  'Trace':            ['Expression', false, 'Tr'],
  'rank':             'NamedFn',
  'erf':              ['Expression', false],
  'Residue':          ['Macro', '\\mathrm{Res}'],
  'Res':              ['OperatorApplication', '\\Residue', '(', '[', '{'],
  'principalvalue':   ['OperatorApplication', '{\\cal P}'],
  'pv':               ['OperatorApplication', '{\\cal P}'],
  'PV':               ['OperatorApplication', '{\\rm P.V.}'],
  'Re':               ['OperatorApplication', '\\mathrm{Re}', '{'],
  'Im':               ['OperatorApplication', '\\mathrm{Im}', '{'],
  // Old named functions.
  'sine':             ['NamedFn', 'sin'],
  'hypsine':          ['NamedFn', 'sinh'],
  'arcsine':          ['NamedFn', 'arcsin'],
  'asine':            ['NamedFn', 'asin'],
  'cosine':           ['NamedFn', 'cos'],
  'hypcosine':        ['NamedFn', 'cosh'],
  'arccosine':        ['NamedFn', 'arccos'],
  'acosine':          ['NamedFn', 'acos'],
  'tangent':          ['NamedFn', 'tan'],
  'hyptangent':       ['NamedFn', 'tanh'],
  'arctangent':       ['NamedFn', 'arctan'],
  'atangent':         ['NamedFn', 'atan'],
  'cosecant':         ['NamedFn', 'csc'],
  'hypcosecant':      ['NamedFn', 'csch'],
  'arccosecant':      ['NamedFn', 'arccsc'],
  'acosecant':        ['NamedFn', 'acsc'],
  'secant':           ['NamedFn', 'sec'],
  'hypsecant':        ['NamedFn', 'sech'],
  'arcsecant':        ['NamedFn', 'arcsec'],
  'asecant':          ['NamedFn', 'asec'],
  'cotangent':        ['NamedFn', 'cot'],
  'hypcotangent':     ['NamedFn', 'coth'],
  'arccotangent':     ['NamedFn', 'arccot'],
  'acotangent':       ['NamedFn', 'acot'],
  'exponential':      ['NamedFn', 'exp'],
  'logarithm':        ['NamedFn', 'log'],
  'naturallogarithm': ['NamedFn', 'ln'],
  'determinant':      ['NamedFn', 'det'],
  'Probability':      ['NamedFn', 'Pr'],
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.4).
 */
new CommandMap('Physics-quick-quad-macros', {
  'qqtext':     'Qqtext',
  'qq':         'Qqtext',
  'qcomma':     ['Macro', '\\qqtext*{,}'],
  'qc':         ['Macro', '\\qqtext*{,}'],
  'qcc':        ['Qqtext', 'c.c.'],
  'qif':        ['Qqtext', 'if'],
  'qthen':      ['Qqtext', 'then'],
  'qelse':      ['Qqtext', 'else'],
  'qotherwise': ['Qqtext', 'otherwise'],
  'qunless':    ['Qqtext', 'unless'],
  'qgiven':     ['Qqtext', 'given'],
  'qusing':     ['Qqtext', 'using'],
  'qassume':    ['Qqtext', 'assume'],
  'qsince':     ['Qqtext', 'since'],
  'qlet':       ['Qqtext', 'let'],
  'qfor':       ['Qqtext', 'for'],
  'qall':       ['Qqtext', 'all'],
  'qeven':      ['Qqtext', 'even'],
  'qodd':       ['Qqtext', 'odd'],
  'qinteger':   ['Qqtext', 'integer'],
  'qand':       ['Qqtext', 'and'],
  'qor':        ['Qqtext', 'or'],
  'qas':        ['Qqtext', 'as'],
  'qin':        ['Qqtext', 'in'],
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.5).
 */
new CommandMap('Physics-derivative-macros', {
  'diffd':                'DiffD',
  'flatfrac':             ['Macro', '\\left.#1\\middle/#2\\right.', 2],
  'differential':         ['Differential', '\\diffd'],
  'dd':                   ['Differential', '\\diffd'],
  'variation':            ['Differential', '\\delta'],
  'var':                  ['Differential', '\\delta'],
  'derivative':           ['Derivative', 2, '\\diffd'],
  'dv':                   ['Derivative', 2, '\\diffd'],
  'partialderivative':    ['Derivative', 3, '\\partial'],
  'pderivative':          ['Derivative', 3, '\\partial'],
  'pdv':                  ['Derivative', 3, '\\partial'],
  'functionalderivative': ['Derivative', 2, '\\delta'],
  'fderivative':          ['Derivative', 2, '\\delta'],
  'fdv':                  ['Derivative', 2, '\\delta'],
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.6).
 */
new CommandMap('Physics-bra-ket-macros', {
  'bra':              'Bra',
  'ket':              'Ket',
  'innerproduct':     'BraKet',
  'ip':               'BraKet',
  'braket':           'BraKet',
  'outerproduct':     'KetBra',
  'dyad':             'KetBra',
  'ketbra':           'KetBra',
  'op':               'KetBra',
  'expectationvalue': 'Expectation',
  'expval':           'Expectation',
  'ev':               'Expectation',
  'matrixelement':    'MatrixElement',
  'matrixel':         'MatrixElement',
  'mel':              'MatrixElement',
}, PhysicsMethods);


/**
 * Macros for physics package (section 2.7).
 */
new CommandMap('Physics-matrix-macros', {
  'matrixquantity':      'MatrixQuantity',
  'mqty'          :      'MatrixQuantity',
  'pmqty':               ['Macro', '\\mqty(#1)', 1],
  'Pmqty':               ['Macro', '\\mqty*(#1)', 1],
  'bmqty':               ['Macro', '\\mqty[#1]', 1],
  'vmqty':               ['Macro', '\\mqty|#1|', 1],
  // Smallmatrices
  'smallmatrixquantity': ['MatrixQuantity', true],
  'smqty':               ['MatrixQuantity', true],
  'spmqty':              ['Macro', '\\smqty(#1)', 1],
  'sPmqty':              ['Macro', '\\smqty*(#1)', 1],
  'sbmqty':              ['Macro', '\\smqty[#1]', 1],
  'svmqty':              ['Macro', '\\smqty|#1|', 1],
  'matrixdeterminant':   ['Macro', '\\vmqty{#1}', 1],
  'mdet':                ['Macro', '\\vmqty{#1}', 1],
  'smdet':               ['Macro', '\\svmqty{#1}', 1],
  'identitymatrix':      'IdentityMatrix',
  'imat':                'IdentityMatrix',
  'xmatrix':             'XMatrix',
  'xmat':                'XMatrix',
  'zeromatrix':          ['Macro', '\\xmat{0}{#1}{#2}', 2],
  'zmat':                ['Macro', '\\xmat{0}{#1}{#2}', 2],
  'paulimatrix':         'PauliMatrix',
  'pmat':                'PauliMatrix',
  'diagonalmatrix': 'DiagonalMatrix',
  'dmat': 'DiagonalMatrix',
  'antidiagonalmatrix': ['DiagonalMatrix', true],
  'admat': ['DiagonalMatrix', true]
}, PhysicsMethods);



/**
 * Auxiliary environment map to define smallmatrix. This makes Physics
 * independent of AmsMath.
 */
new EnvironmentMap('Physics-aux-envs', ParseMethods.environment, {
  smallmatrix:   ['Array', null, null, null, 'c', '0.333em', '.2em', 'S', 1]
}, PhysicsMethods);


/**
 * Character map for braket package.
 */
new MacroMap('Physics-characters', {
  '|': ['AutoClose', TEXCLASS.ORD],   // texClass: TEXCLASS.ORD, // Have to push the closer as mml with special property
  ')': 'AutoClose',
  ']': 'AutoClose'
}, PhysicsMethods);
