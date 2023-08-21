"use strict";
/*!
 *************************************************************************
 *
 *  mhchemParser.ts
 *  4.2.1
 *
 *  Parser for the \ce command and \pu command for MathJax and Co.
 *
 *  mhchem's \ce is a tool for writing beautiful chemical equations easily.
 *  mhchem's \pu is a tool for writing physical units easily.
 *
 *  ----------------------------------------------------------------------
 *
 *  Copyright (c) 2015-2023 Martin Hensel
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
 *
 *  ----------------------------------------------------------------------
 *
 *  https://github.com/mhchem/mhchemParser
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mhchemParser = void 0;
var mhchemParser = (function () {
    function mhchemParser() {
    }
    mhchemParser.toTex = function (input, type) {
        return _mhchemTexify.go(_mhchemParser.go(input, type), type !== "tex");
    };
    return mhchemParser;
}());
exports.mhchemParser = mhchemParser;
function _mhchemCreateTransitions(o) {
    var pattern, state;
    var transitions = {};
    for (pattern in o) {
        for (state in o[pattern]) {
            var stateArray = state.split("|");
            o[pattern][state].stateArray = stateArray;
            for (var i = 0; i < stateArray.length; i++) {
                transitions[stateArray[i]] = [];
            }
        }
    }
    for (pattern in o) {
        for (state in o[pattern]) {
            var stateArray = o[pattern][state].stateArray || [];
            for (var i = 0; i < stateArray.length; i++) {
                var p = o[pattern][state];
                p.action_ = [].concat(p.action_);
                for (var k = 0; k < p.action_.length; k++) {
                    if (typeof p.action_[k] === "string") {
                        p.action_[k] = { type_: p.action_[k] };
                    }
                }
                var patternArray = pattern.split("|");
                for (var j = 0; j < patternArray.length; j++) {
                    if (stateArray[i] === '*') {
                        var t = void 0;
                        for (t in transitions) {
                            transitions[t].push({ pattern: patternArray[j], task: p });
                        }
                    }
                    else {
                        transitions[stateArray[i]].push({ pattern: patternArray[j], task: p });
                    }
                }
            }
        }
    }
    return transitions;
}
;
var _mhchemParser = {
    go: function (input, stateMachine) {
        if (!input) {
            return [];
        }
        if (stateMachine === undefined) {
            stateMachine = 'ce';
        }
        var state = '0';
        var buffer = {};
        buffer['parenthesisLevel'] = 0;
        input = input.replace(/\n/g, " ");
        input = input.replace(/[\u2212\u2013\u2014\u2010]/g, "-");
        input = input.replace(/[\u2026]/g, "...");
        var lastInput;
        var watchdog = 10;
        var output = [];
        while (true) {
            if (lastInput !== input) {
                watchdog = 10;
                lastInput = input;
            }
            else {
                watchdog--;
            }
            var machine = _mhchemParser.stateMachines[stateMachine];
            var t = machine.transitions[state] || machine.transitions['*'];
            iterateTransitions: for (var i = 0; i < t.length; i++) {
                var matches = _mhchemParser.patterns.match_(t[i].pattern, input);
                if (matches) {
                    var task = t[i].task;
                    for (var iA = 0; iA < task.action_.length; iA++) {
                        var o = void 0;
                        if (machine.actions[task.action_[iA].type_]) {
                            o = machine.actions[task.action_[iA].type_](buffer, matches.match_, task.action_[iA].option);
                        }
                        else if (_mhchemParser.actions[task.action_[iA].type_]) {
                            o = _mhchemParser.actions[task.action_[iA].type_](buffer, matches.match_, task.action_[iA].option);
                        }
                        else {
                            throw ["MhchemBugA", "mhchem bug A. Please report. (" + task.action_[iA].type_ + ")"];
                        }
                        _mhchemParser.concatArray(output, o);
                    }
                    state = task.nextState || state;
                    if (input.length > 0) {
                        if (!task.revisit) {
                            input = matches.remainder;
                        }
                        if (!task.toContinue) {
                            break iterateTransitions;
                        }
                    }
                    else {
                        return output;
                    }
                }
            }
            if (watchdog <= 0) {
                throw ["MhchemBugU", "mhchem bug U. Please report."];
            }
        }
    },
    concatArray: function (a, b) {
        if (b) {
            if (Array.isArray(b)) {
                for (var iB = 0; iB < b.length; iB++) {
                    a.push(b[iB]);
                }
            }
            else {
                a.push(b);
            }
        }
    },
    patterns: {
        patterns: {
            'empty': /^$/,
            'else': /^./,
            'else2': /^./,
            'space': /^\s/,
            'space A': /^\s(?=[A-Z\\$])/,
            'space$': /^\s$/,
            'a-z': /^[a-z]/,
            'x': /^x/,
            'x$': /^x$/,
            'i$': /^i$/,
            'letters': /^(?:[a-zA-Z\u03B1-\u03C9\u0391-\u03A9?@]|(?:\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))))+/,
            '\\greek': /^\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega)(?:\s+|\{\}|(?![a-zA-Z]))/,
            'one lowercase latin letter $': /^(?:([a-z])(?:$|[^a-zA-Z]))$/,
            '$one lowercase latin letter$ $': /^\$(?:([a-z])(?:$|[^a-zA-Z]))\$$/,
            'one lowercase greek letter $': /^(?:\$?[\u03B1-\u03C9]\$?|\$?\\(?:alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigma|tau|upsilon|phi|chi|psi|omega)\s*\$?)(?:\s+|\{\}|(?![a-zA-Z]))$/,
            'digits': /^[0-9]+/,
            '-9.,9': /^[+\-]?(?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))/,
            '-9.,9 no missing 0': /^[+\-]?[0-9]+(?:[.,][0-9]+)?/,
            '(-)(9.,9)(e)(99)': function (input) {
                var match = input.match(/^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))?(\((?:[0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+))\))?(?:(?:([eE])|\s*(\*|x|\\times|\u00D7)\s*10\^)([+\-]?[0-9]+|\{[+\-]?[0-9]+\}))?/);
                if (match && match[0]) {
                    return { match_: match.slice(1), remainder: input.substr(match[0].length) };
                }
                return null;
            },
            '(-)(9)^(-9)': /^(\+\-|\+\/\-|\+|\-|\\pm\s?)?([0-9]+(?:[,.][0-9]+)?|[0-9]*(?:\.[0-9]+)?)\^([+\-]?[0-9]+|\{[+\-]?[0-9]+\})/,
            'state of aggregation $': function (input) {
                var a = _mhchemParser.patterns.findObserveGroups(input, "", /^\([a-z]{1,3}(?=[\),])/, ")", "");
                if (a && a.remainder.match(/^($|[\s,;\)\]\}])/)) {
                    return a;
                }
                var match = input.match(/^(?:\((?:\\ca\s?)?\$[amothc]\$\))/);
                if (match) {
                    return { match_: match[0], remainder: input.substr(match[0].length) };
                }
                return null;
            },
            '_{(state of aggregation)}$': /^_\{(\([a-z]{1,3}\))\}/,
            '{[(': /^(?:\\\{|\[|\()/,
            ')]}': /^(?:\)|\]|\\\})/,
            ', ': /^[,;]\s*/,
            ',': /^[,;]/,
            '.': /^[.]/,
            '. __* ': /^([.\u22C5\u00B7\u2022]|[*])\s*/,
            '...': /^\.\.\.(?=$|[^.])/,
            '^{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "^{", "", "", "}"); },
            '^($...$)': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "^", "$", "$", ""); },
            '^a': /^\^([0-9]+|[^\\_])/,
            '^\\x{}{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "^", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", true); },
            '^\\x{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "^", /^\\[a-zA-Z]+\{/, "}", ""); },
            '^\\x': /^\^(\\[a-zA-Z]+)\s*/,
            '^(-1)': /^\^(-?\d+)/,
            '\'': /^'/,
            '_{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "_{", "", "", "}"); },
            '_($...$)': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "_", "$", "$", ""); },
            '_9': /^_([+\-]?[0-9]+|[^\\])/,
            '_\\x{}{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "_", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", true); },
            '_\\x{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "_", /^\\[a-zA-Z]+\{/, "}", ""); },
            '_\\x': /^_(\\[a-zA-Z]+)\s*/,
            '^_': /^(?:\^(?=_)|\_(?=\^)|[\^_]$)/,
            '{}^': /^\{\}(?=\^)/,
            '{}': /^\{\}/,
            '{...}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "", "{", "}", ""); },
            '{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "{", "", "", "}"); },
            '$...$': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "", "$", "$", ""); },
            '${(...)}$__$(...)$': function (input) {
                return _mhchemParser.patterns.findObserveGroups(input, "${", "", "", "}$") || _mhchemParser.patterns.findObserveGroups(input, "$", "", "", "$");
            },
            '=<>': /^[=<>]/,
            '#': /^[#\u2261]/,
            '+': /^\+/,
            '-$': /^-(?=[\s_},;\]/]|$|\([a-z]+\))/,
            '-9': /^-(?=[0-9])/,
            '- orbital overlap': /^-(?=(?:[spd]|sp)(?:$|[\s,;\)\]\}]))/,
            '-': /^-/,
            'pm-operator': /^(?:\\pm|\$\\pm\$|\+-|\+\/-)/,
            'operator': /^(?:\+|(?:[\-=<>]|<<|>>|\\approx|\$\\approx\$)(?=\s|$|-?[0-9]))/,
            'arrowUpDown': /^(?:v|\(v\)|\^|\(\^\))(?=$|[\s,;\)\]\}])/,
            '\\bond{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\bond{", "", "", "}"); },
            '->': /^(?:<->|<-->|->|<-|<=>>|<<=>|<=>|[\u2192\u27F6\u21CC])/,
            'CMT': /^[CMT](?=\[)/,
            '[(...)]': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "[", "", "", "]"); },
            '1st-level escape': /^(&|\\\\|\\hline)\s*/,
            '\\,': /^(?:\\[,\ ;:])/,
            '\\x{}{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "", /^\\[a-zA-Z]+\{/, "}", "", "", "{", "}", "", true); },
            '\\x{}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "", /^\\[a-zA-Z]+\{/, "}", ""); },
            '\\ca': /^\\ca(?:\s+|(?![a-zA-Z]))/,
            '\\x': /^(?:\\[a-zA-Z]+\s*|\\[_&{}%])/,
            'orbital': /^(?:[0-9]{1,2}[spdfgh]|[0-9]{0,2}sp)(?=$|[^a-zA-Z])/,
            'others': /^[\/~|]/,
            '\\frac{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\frac{", "", "", "}", "{", "", "", "}"); },
            '\\overset{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\overset{", "", "", "}", "{", "", "", "}"); },
            '\\underset{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\underset{", "", "", "}", "{", "", "", "}"); },
            '\\underbrace{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\underbrace{", "", "", "}_", "{", "", "", "}"); },
            '\\color{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\color{", "", "", "}"); },
            '\\color{(...)}{(...)}': function (input) {
                return _mhchemParser.patterns.findObserveGroups(input, "\\color{", "", "", "}", "{", "", "", "}") ||
                    _mhchemParser.patterns.findObserveGroups(input, "\\color", "\\", "", /^(?=\{)/, "{", "", "", "}");
            },
            '\\ce{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\ce{", "", "", "}"); },
            '\\pu{(...)}': function (input) { return _mhchemParser.patterns.findObserveGroups(input, "\\pu{", "", "", "}"); },
            'oxidation$': /^(?:[+-][IVX]+|(?:\\pm|\$\\pm\$|\+-|\+\/-)\s*0)$/,
            'd-oxidation$': /^(?:[+-]?[IVX]+|(?:\\pm|\$\\pm\$|\+-|\+\/-)\s*0)$/,
            '1/2$': /^[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+(?:\$[a-z]\$|[a-z])?$/,
            'amount': function (input) {
                var match;
                match = input.match(/^(?:(?:(?:\([+\-]?[0-9]+\/[0-9]+\)|[+\-]?(?:[0-9]+|\$[a-z]\$|[a-z])\/[0-9]+|[+\-]?[0-9]+[.,][0-9]+|[+\-]?\.[0-9]+|[+\-]?[0-9]+)(?:[a-z](?=\s*[A-Z]))?)|[+\-]?[a-z](?=\s*[A-Z])|\+(?!\s))/);
                if (match) {
                    return { match_: match[0], remainder: input.substr(match[0].length) };
                }
                var a = _mhchemParser.patterns.findObserveGroups(input, "", "$", "$", "");
                if (a) {
                    match = a.match_.match(/^\$(?:\(?[+\-]?(?:[0-9]*[a-z]?[+\-])?[0-9]*[a-z](?:[+\-][0-9]*[a-z]?)?\)?|\+|-)\$$/);
                    if (match) {
                        return { match_: match[0], remainder: input.substr(match[0].length) };
                    }
                }
                return null;
            },
            'amount2': function (input) { return this['amount'](input); },
            '(KV letters),': /^(?:[A-Z][a-z]{0,2}|i)(?=,)/,
            'formula$': function (input) {
                if (input.match(/^\([a-z]+\)$/)) {
                    return null;
                }
                var match = input.match(/^(?:[a-z]|(?:[0-9\ \+\-\,\.\(\)]+[a-z])+[0-9\ \+\-\,\.\(\)]*|(?:[a-z][0-9\ \+\-\,\.\(\)]+)+[a-z]?)$/);
                if (match) {
                    return { match_: match[0], remainder: input.substr(match[0].length) };
                }
                return null;
            },
            'uprightEntities': /^(?:pH|pOH|pC|pK|iPr|iBu)(?=$|[^a-zA-Z])/,
            '/': /^\s*(\/)\s*/,
            '//': /^\s*(\/\/)\s*/,
            '*': /^\s*[*.]\s*/
        },
        findObserveGroups: function (input, begExcl, begIncl, endIncl, endExcl, beg2Excl, beg2Incl, end2Incl, end2Excl, combine) {
            var _match = function (input, pattern) {
                if (typeof pattern === "string") {
                    if (input.indexOf(pattern) !== 0) {
                        return null;
                    }
                    return pattern;
                }
                else {
                    var match_1 = input.match(pattern);
                    if (!match_1) {
                        return null;
                    }
                    return match_1[0];
                }
            };
            var _findObserveGroups = function (input, i, endChars) {
                var braces = 0;
                while (i < input.length) {
                    var a = input.charAt(i);
                    var match_2 = _match(input.substr(i), endChars);
                    if (match_2 !== null && braces === 0) {
                        return { endMatchBegin: i, endMatchEnd: i + match_2.length };
                    }
                    else if (a === "{") {
                        braces++;
                    }
                    else if (a === "}") {
                        if (braces === 0) {
                            throw ["ExtraCloseMissingOpen", "Extra close brace or missing open brace"];
                        }
                        else {
                            braces--;
                        }
                    }
                    i++;
                }
                if (braces > 0) {
                    return null;
                }
                return null;
            };
            var match = _match(input, begExcl);
            if (match === null) {
                return null;
            }
            input = input.substr(match.length);
            match = _match(input, begIncl);
            if (match === null) {
                return null;
            }
            var e = _findObserveGroups(input, match.length, endIncl || endExcl);
            if (e === null) {
                return null;
            }
            var match1 = input.substring(0, (endIncl ? e.endMatchEnd : e.endMatchBegin));
            if (!(beg2Excl || beg2Incl)) {
                return {
                    match_: match1,
                    remainder: input.substr(e.endMatchEnd)
                };
            }
            else {
                var group2 = this.findObserveGroups(input.substr(e.endMatchEnd), beg2Excl, beg2Incl, end2Incl, end2Excl);
                if (group2 === null) {
                    return null;
                }
                var matchRet = [match1, group2.match_];
                return {
                    match_: (combine ? matchRet.join("") : matchRet),
                    remainder: group2.remainder
                };
            }
        },
        match_: function (m, input) {
            var pattern = _mhchemParser.patterns.patterns[m];
            if (pattern === undefined) {
                throw ["MhchemBugP", "mhchem bug P. Please report. (" + m + ")"];
            }
            else if (typeof pattern === "function") {
                return _mhchemParser.patterns.patterns[m](input);
            }
            else {
                var match = input.match(pattern);
                if (match) {
                    if (match.length > 2) {
                        return { match_: match.slice(1), remainder: input.substr(match[0].length) };
                    }
                    else {
                        return { match_: match[1] || match[0], remainder: input.substr(match[0].length) };
                    }
                }
                return null;
            }
        }
    },
    actions: {
        'a=': function (buffer, m) { buffer.a = (buffer.a || "") + m; return undefined; },
        'b=': function (buffer, m) { buffer.b = (buffer.b || "") + m; return undefined; },
        'p=': function (buffer, m) { buffer.p = (buffer.p || "") + m; return undefined; },
        'o=': function (buffer, m) { buffer.o = (buffer.o || "") + m; return undefined; },
        'o=+p1': function (buffer, _m, a) { buffer.o = (buffer.o || "") + a; return undefined; },
        'q=': function (buffer, m) { buffer.q = (buffer.q || "") + m; return undefined; },
        'd=': function (buffer, m) { buffer.d = (buffer.d || "") + m; return undefined; },
        'rm=': function (buffer, m) { buffer.rm = (buffer.rm || "") + m; return undefined; },
        'text=': function (buffer, m) { buffer.text_ = (buffer.text_ || "") + m; return undefined; },
        'insert': function (_buffer, _m, a) { return { type_: a }; },
        'insert+p1': function (_buffer, m, a) { return { type_: a, p1: m }; },
        'insert+p1+p2': function (_buffer, m, a) { return { type_: a, p1: m[0], p2: m[1] }; },
        'copy': function (_buffer, m) { return m; },
        'write': function (_buffer, _m, a) { return a; },
        'rm': function (_buffer, m) { return { type_: 'rm', p1: m }; },
        'text': function (_buffer, m) { return _mhchemParser.go(m, 'text'); },
        'tex-math': function (_buffer, m) { return _mhchemParser.go(m, 'tex-math'); },
        'tex-math tight': function (_buffer, m) { return _mhchemParser.go(m, 'tex-math tight'); },
        'bond': function (_buffer, m, k) { return { type_: 'bond', kind_: k || m }; },
        'color0-output': function (_buffer, m) { return { type_: 'color0', color: m }; },
        'ce': function (_buffer, m) { return _mhchemParser.go(m, 'ce'); },
        'pu': function (_buffer, m) { return _mhchemParser.go(m, 'pu'); },
        '1/2': function (_buffer, m) {
            var ret = [];
            if (m.match(/^[+\-]/)) {
                ret.push(m.substr(0, 1));
                m = m.substr(1);
            }
            var n = m.match(/^([0-9]+|\$[a-z]\$|[a-z])\/([0-9]+)(\$[a-z]\$|[a-z])?$/);
            n[1] = n[1].replace(/\$/g, "");
            ret.push({ type_: 'frac', p1: n[1], p2: n[2] });
            if (n[3]) {
                n[3] = n[3].replace(/\$/g, "");
                ret.push({ type_: 'tex-math', p1: n[3] });
            }
            return ret;
        },
        '9,9': function (_buffer, m) { return _mhchemParser.go(m, '9,9'); }
    },
    stateMachines: {
        'tex': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '0': { action_: 'copy' }
                },
                '\\ce{(...)}': {
                    '0': { action_: [{ type_: 'write', option: "{" }, 'ce', { type_: 'write', option: "}" }] }
                },
                '\\pu{(...)}': {
                    '0': { action_: [{ type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                'else': {
                    '0': { action_: 'copy' }
                },
            }),
            actions: {}
        },
        'ce': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                'else': {
                    '0|1|2': { action_: 'beginsWithBond=false', revisit: true, toContinue: true }
                },
                'oxidation$': {
                    '0': { action_: 'oxidation-output' }
                },
                'CMT': {
                    'r': { action_: 'rdt=', nextState: 'rt' },
                    'rd': { action_: 'rqt=', nextState: 'rdt' }
                },
                'arrowUpDown': {
                    '0|1|2|as': { action_: ['sb=false', 'output', 'operator'], nextState: '1' }
                },
                'uprightEntities': {
                    '0|1|2': { action_: ['o=', 'output'], nextState: '1' }
                },
                'orbital': {
                    '0|1|2|3': { action_: 'o=', nextState: 'o' }
                },
                '->': {
                    '0|1|2|3': { action_: 'r=', nextState: 'r' },
                    'a|as': { action_: ['output', 'r='], nextState: 'r' },
                    '*': { action_: ['output', 'r='], nextState: 'r' }
                },
                '+': {
                    'o': { action_: 'd= kv', nextState: 'd' },
                    'd|D': { action_: 'd=', nextState: 'd' },
                    'q': { action_: 'd=', nextState: 'qd' },
                    'qd|qD': { action_: 'd=', nextState: 'qd' },
                    'dq': { action_: ['output', 'd='], nextState: 'd' },
                    '3': { action_: ['sb=false', 'output', 'operator'], nextState: '0' }
                },
                'amount': {
                    '0|2': { action_: 'a=', nextState: 'a' }
                },
                'pm-operator': {
                    '0|1|2|a|as': { action_: ['sb=false', 'output', { type_: 'operator', option: '\\pm' }], nextState: '0' }
                },
                'operator': {
                    '0|1|2|a|as': { action_: ['sb=false', 'output', 'operator'], nextState: '0' }
                },
                '-$': {
                    'o|q': { action_: ['charge or bond', 'output'], nextState: 'qd' },
                    'd': { action_: 'd=', nextState: 'd' },
                    'D': { action_: ['output', { type_: 'bond', option: "-" }], nextState: '3' },
                    'q': { action_: 'd=', nextState: 'qd' },
                    'qd': { action_: 'd=', nextState: 'qd' },
                    'qD|dq': { action_: ['output', { type_: 'bond', option: "-" }], nextState: '3' }
                },
                '-9': {
                    '3|o': { action_: ['output', { type_: 'insert', option: 'hyphen' }], nextState: '3' }
                },
                '- orbital overlap': {
                    'o': { action_: ['output', { type_: 'insert', option: 'hyphen' }], nextState: '2' },
                    'd': { action_: ['output', { type_: 'insert', option: 'hyphen' }], nextState: '2' }
                },
                '-': {
                    '0|1|2': { action_: [{ type_: 'output', option: 1 }, 'beginsWithBond=true', { type_: 'bond', option: "-" }], nextState: '3' },
                    '3': { action_: { type_: 'bond', option: "-" } },
                    'a': { action_: ['output', { type_: 'insert', option: 'hyphen' }], nextState: '2' },
                    'as': { action_: [{ type_: 'output', option: 2 }, { type_: 'bond', option: "-" }], nextState: '3' },
                    'b': { action_: 'b=' },
                    'o': { action_: { type_: '- after o/d', option: false }, nextState: '2' },
                    'q': { action_: { type_: '- after o/d', option: false }, nextState: '2' },
                    'd|qd|dq': { action_: { type_: '- after o/d', option: true }, nextState: '2' },
                    'D|qD|p': { action_: ['output', { type_: 'bond', option: "-" }], nextState: '3' }
                },
                'amount2': {
                    '1|3': { action_: 'a=', nextState: 'a' }
                },
                'letters': {
                    '0|1|2|3|a|as|b|p|bp|o': { action_: 'o=', nextState: 'o' },
                    'q|dq': { action_: ['output', 'o='], nextState: 'o' },
                    'd|D|qd|qD': { action_: 'o after d', nextState: 'o' }
                },
                'digits': {
                    'o': { action_: 'q=', nextState: 'q' },
                    'd|D': { action_: 'q=', nextState: 'dq' },
                    'q': { action_: ['output', 'o='], nextState: 'o' },
                    'a': { action_: 'o=', nextState: 'o' }
                },
                'space A': {
                    'b|p|bp': { action_: [] }
                },
                'space': {
                    'a': { action_: [], nextState: 'as' },
                    '0': { action_: 'sb=false' },
                    '1|2': { action_: 'sb=true' },
                    'r|rt|rd|rdt|rdq': { action_: 'output', nextState: '0' },
                    '*': { action_: ['output', 'sb=true'], nextState: '1' }
                },
                '1st-level escape': {
                    '1|2': { action_: ['output', { type_: 'insert+p1', option: '1st-level escape' }] },
                    '*': { action_: ['output', { type_: 'insert+p1', option: '1st-level escape' }], nextState: '0' }
                },
                '[(...)]': {
                    'r|rt': { action_: 'rd=', nextState: 'rd' },
                    'rd|rdt': { action_: 'rq=', nextState: 'rdq' }
                },
                '...': {
                    'o|d|D|dq|qd|qD': { action_: ['output', { type_: 'bond', option: "..." }], nextState: '3' },
                    '*': { action_: [{ type_: 'output', option: 1 }, { type_: 'insert', option: 'ellipsis' }], nextState: '1' }
                },
                '. __* ': {
                    '*': { action_: ['output', { type_: 'insert', option: 'addition compound' }], nextState: '1' }
                },
                'state of aggregation $': {
                    '*': { action_: ['output', 'state of aggregation'], nextState: '1' }
                },
                '{[(': {
                    'a|as|o': { action_: ['o=', 'output', 'parenthesisLevel++'], nextState: '2' },
                    '0|1|2|3': { action_: ['o=', 'output', 'parenthesisLevel++'], nextState: '2' },
                    '*': { action_: ['output', 'o=', 'output', 'parenthesisLevel++'], nextState: '2' }
                },
                ')]}': {
                    '0|1|2|3|b|p|bp|o': { action_: ['o=', 'parenthesisLevel--'], nextState: 'o' },
                    'a|as|d|D|q|qd|qD|dq': { action_: ['output', 'o=', 'parenthesisLevel--'], nextState: 'o' }
                },
                ', ': {
                    '*': { action_: ['output', 'comma'], nextState: '0' }
                },
                '^_': {
                    '*': { action_: [] }
                },
                '^{(...)}|^($...$)': {
                    '0|1|2|as': { action_: 'b=', nextState: 'b' },
                    'p': { action_: 'b=', nextState: 'bp' },
                    '3|o': { action_: 'd= kv', nextState: 'D' },
                    'q': { action_: 'd=', nextState: 'qD' },
                    'd|D|qd|qD|dq': { action_: ['output', 'd='], nextState: 'D' }
                },
                '^a|^\\x{}{}|^\\x{}|^\\x|\'': {
                    '0|1|2|as': { action_: 'b=', nextState: 'b' },
                    'p': { action_: 'b=', nextState: 'bp' },
                    '3|o': { action_: 'd= kv', nextState: 'd' },
                    'q': { action_: 'd=', nextState: 'qd' },
                    'd|qd|D|qD': { action_: 'd=' },
                    'dq': { action_: ['output', 'd='], nextState: 'd' }
                },
                '_{(state of aggregation)}$': {
                    'd|D|q|qd|qD|dq': { action_: ['output', 'q='], nextState: 'q' }
                },
                '_{(...)}|_($...$)|_9|_\\x{}{}|_\\x{}|_\\x': {
                    '0|1|2|as': { action_: 'p=', nextState: 'p' },
                    'b': { action_: 'p=', nextState: 'bp' },
                    '3|o': { action_: 'q=', nextState: 'q' },
                    'd|D': { action_: 'q=', nextState: 'dq' },
                    'q|qd|qD|dq': { action_: ['output', 'q='], nextState: 'q' }
                },
                '=<>': {
                    '0|1|2|3|a|as|o|q|d|D|qd|qD|dq': { action_: [{ type_: 'output', option: 2 }, 'bond'], nextState: '3' }
                },
                '#': {
                    '0|1|2|3|a|as|o': { action_: [{ type_: 'output', option: 2 }, { type_: 'bond', option: "#" }], nextState: '3' }
                },
                '{}^': {
                    '*': { action_: [{ type_: 'output', option: 1 }, { type_: 'insert', option: 'tinySkip' }], nextState: '1' }
                },
                '{}': {
                    '*': { action_: { type_: 'output', option: 1 }, nextState: '1' }
                },
                '{...}': {
                    '0|1|2|3|a|as|b|p|bp': { action_: 'o=', nextState: 'o' },
                    'o|d|D|q|qd|qD|dq': { action_: ['output', 'o='], nextState: 'o' }
                },
                '$...$': {
                    'a': { action_: 'a=' },
                    '0|1|2|3|as|b|p|bp|o': { action_: 'o=', nextState: 'o' },
                    'as|o': { action_: 'o=' },
                    'q|d|D|qd|qD|dq': { action_: ['output', 'o='], nextState: 'o' }
                },
                '\\bond{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'bond'], nextState: "3" }
                },
                '\\frac{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 1 }, 'frac-output'], nextState: '3' }
                },
                '\\overset{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'overset-output'], nextState: '3' }
                },
                '\\underset{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'underset-output'], nextState: '3' }
                },
                '\\underbrace{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'underbrace-output'], nextState: '3' }
                },
                '\\color{(...)}{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'color-output'], nextState: '3' }
                },
                '\\color{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'color0-output'] }
                },
                '\\ce{(...)}': {
                    '*': { action_: [{ type_: 'output', option: 2 }, 'ce'], nextState: '3' }
                },
                '\\,': {
                    '*': { action_: [{ type_: 'output', option: 1 }, 'copy'], nextState: '1' }
                },
                '\\pu{(...)}': {
                    '*': { action_: ['output', { type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }], nextState: '3' }
                },
                '\\x{}{}|\\x{}|\\x': {
                    '0|1|2|3|a|as|b|p|bp|o|c0': { action_: ['o=', 'output'], nextState: '3' },
                    '*': { action_: ['output', 'o=', 'output'], nextState: '3' }
                },
                'others': {
                    '*': { action_: [{ type_: 'output', option: 1 }, 'copy'], nextState: '3' }
                },
                'else2': {
                    'a': { action_: 'a to o', nextState: 'o', revisit: true },
                    'as': { action_: ['output', 'sb=true'], nextState: '1', revisit: true },
                    'r|rt|rd|rdt|rdq': { action_: ['output'], nextState: '0', revisit: true },
                    '*': { action_: ['output', 'copy'], nextState: '3' }
                }
            }),
            actions: {
                'o after d': function (buffer, m) {
                    var ret;
                    if ((buffer.d || "").match(/^[1-9][0-9]*$/)) {
                        var tmp = buffer.d;
                        buffer.d = undefined;
                        ret = this['output'](buffer);
                        ret.push({ type_: 'tinySkip' });
                        buffer.b = tmp;
                    }
                    else {
                        ret = this['output'](buffer);
                    }
                    _mhchemParser.actions['o='](buffer, m);
                    return ret;
                },
                'd= kv': function (buffer, m) {
                    buffer.d = m;
                    buffer.dType = 'kv';
                    return undefined;
                },
                'charge or bond': function (buffer, m) {
                    if (buffer['beginsWithBond']) {
                        var ret = [];
                        _mhchemParser.concatArray(ret, this['output'](buffer));
                        _mhchemParser.concatArray(ret, _mhchemParser.actions['bond'](buffer, m, "-"));
                        return ret;
                    }
                    else {
                        buffer.d = m;
                        return undefined;
                    }
                },
                '- after o/d': function (buffer, m, isAfterD) {
                    var c1 = _mhchemParser.patterns.match_('orbital', buffer.o || "");
                    var c2 = _mhchemParser.patterns.match_('one lowercase greek letter $', buffer.o || "");
                    var c3 = _mhchemParser.patterns.match_('one lowercase latin letter $', buffer.o || "");
                    var c4 = _mhchemParser.patterns.match_('$one lowercase latin letter$ $', buffer.o || "");
                    var hyphenFollows = m === "-" && (c1 && c1.remainder === "" || c2 || c3 || c4);
                    if (hyphenFollows && !buffer.a && !buffer.b && !buffer.p && !buffer.d && !buffer.q && !c1 && c3) {
                        buffer.o = '$' + buffer.o + '$';
                    }
                    var ret = [];
                    if (hyphenFollows) {
                        _mhchemParser.concatArray(ret, this['output'](buffer));
                        ret.push({ type_: 'hyphen' });
                    }
                    else {
                        c1 = _mhchemParser.patterns.match_('digits', buffer.d || "");
                        if (isAfterD && c1 && c1.remainder === '') {
                            _mhchemParser.concatArray(ret, _mhchemParser.actions['d='](buffer, m));
                            _mhchemParser.concatArray(ret, this['output'](buffer));
                        }
                        else {
                            _mhchemParser.concatArray(ret, this['output'](buffer));
                            _mhchemParser.concatArray(ret, _mhchemParser.actions['bond'](buffer, m, "-"));
                        }
                    }
                    return ret;
                },
                'a to o': function (buffer) {
                    buffer.o = buffer.a;
                    buffer.a = undefined;
                    return undefined;
                },
                'sb=true': function (buffer) { buffer.sb = true; return undefined; },
                'sb=false': function (buffer) { buffer.sb = false; return undefined; },
                'beginsWithBond=true': function (buffer) { buffer['beginsWithBond'] = true; return undefined; },
                'beginsWithBond=false': function (buffer) { buffer['beginsWithBond'] = false; return undefined; },
                'parenthesisLevel++': function (buffer) { buffer['parenthesisLevel']++; return undefined; },
                'parenthesisLevel--': function (buffer) { buffer['parenthesisLevel']--; return undefined; },
                'state of aggregation': function (_buffer, m) {
                    return { type_: 'state of aggregation', p1: _mhchemParser.go(m, 'o') };
                },
                'comma': function (buffer, m) {
                    var a = m.replace(/\s*$/, '');
                    var withSpace = (a !== m);
                    if (withSpace && buffer['parenthesisLevel'] === 0) {
                        return { type_: 'comma enumeration L', p1: a };
                    }
                    else {
                        return { type_: 'comma enumeration M', p1: a };
                    }
                },
                'output': function (buffer, _m, entityFollows) {
                    var ret;
                    if (!buffer.r) {
                        ret = [];
                        if (!buffer.a && !buffer.b && !buffer.p && !buffer.o && !buffer.q && !buffer.d && !entityFollows) {
                        }
                        else {
                            if (buffer.sb) {
                                ret.push({ type_: 'entitySkip' });
                            }
                            if (!buffer.o && !buffer.q && !buffer.d && !buffer.b && !buffer.p && entityFollows !== 2) {
                                buffer.o = buffer.a;
                                buffer.a = undefined;
                            }
                            else if (!buffer.o && !buffer.q && !buffer.d && (buffer.b || buffer.p)) {
                                buffer.o = buffer.a;
                                buffer.d = buffer.b;
                                buffer.q = buffer.p;
                                buffer.a = buffer.b = buffer.p = undefined;
                            }
                            else {
                                if (buffer.o && buffer.dType === 'kv' && _mhchemParser.patterns.match_('d-oxidation$', buffer.d || "")) {
                                    buffer.dType = 'oxidation';
                                }
                                else if (buffer.o && buffer.dType === 'kv' && !buffer.q) {
                                    buffer.dType = undefined;
                                }
                            }
                            ret.push({
                                type_: 'chemfive',
                                a: _mhchemParser.go(buffer.a, 'a'),
                                b: _mhchemParser.go(buffer.b, 'bd'),
                                p: _mhchemParser.go(buffer.p, 'pq'),
                                o: _mhchemParser.go(buffer.o, 'o'),
                                q: _mhchemParser.go(buffer.q, 'pq'),
                                d: _mhchemParser.go(buffer.d, (buffer.dType === 'oxidation' ? 'oxidation' : 'bd')),
                                dType: buffer.dType
                            });
                        }
                    }
                    else {
                        var rd = void 0;
                        if (buffer.rdt === 'M') {
                            rd = _mhchemParser.go(buffer.rd, 'tex-math');
                        }
                        else if (buffer.rdt === 'T') {
                            rd = [{ type_: 'text', p1: buffer.rd || "" }];
                        }
                        else {
                            rd = _mhchemParser.go(buffer.rd, 'ce');
                        }
                        var rq = void 0;
                        if (buffer.rqt === 'M') {
                            rq = _mhchemParser.go(buffer.rq, 'tex-math');
                        }
                        else if (buffer.rqt === 'T') {
                            rq = [{ type_: 'text', p1: buffer.rq || "" }];
                        }
                        else {
                            rq = _mhchemParser.go(buffer.rq, 'ce');
                        }
                        ret = {
                            type_: 'arrow',
                            r: buffer.r,
                            rd: rd,
                            rq: rq
                        };
                    }
                    for (var p in buffer) {
                        if (p !== 'parenthesisLevel' && p !== 'beginsWithBond') {
                            delete buffer[p];
                        }
                    }
                    return ret;
                },
                'oxidation-output': function (_buffer, m) {
                    var ret = ["{"];
                    _mhchemParser.concatArray(ret, _mhchemParser.go(m, 'oxidation'));
                    ret.push("}");
                    return ret;
                },
                'frac-output': function (_buffer, m) {
                    return { type_: 'frac-ce', p1: _mhchemParser.go(m[0], 'ce'), p2: _mhchemParser.go(m[1], 'ce') };
                },
                'overset-output': function (_buffer, m) {
                    return { type_: 'overset', p1: _mhchemParser.go(m[0], 'ce'), p2: _mhchemParser.go(m[1], 'ce') };
                },
                'underset-output': function (_buffer, m) {
                    return { type_: 'underset', p1: _mhchemParser.go(m[0], 'ce'), p2: _mhchemParser.go(m[1], 'ce') };
                },
                'underbrace-output': function (_buffer, m) {
                    return { type_: 'underbrace', p1: _mhchemParser.go(m[0], 'ce'), p2: _mhchemParser.go(m[1], 'ce') };
                },
                'color-output': function (_buffer, m) {
                    return { type_: 'color', color1: m[0], color2: _mhchemParser.go(m[1], 'ce') };
                },
                'r=': function (buffer, m) { buffer.r = m; return undefined; },
                'rdt=': function (buffer, m) { buffer.rdt = m; return undefined; },
                'rd=': function (buffer, m) { buffer.rd = m; return undefined; },
                'rqt=': function (buffer, m) { buffer.rqt = m; return undefined; },
                'rq=': function (buffer, m) { buffer.rq = m; return undefined; },
                'operator': function (_buffer, m, p1) { return { type_: 'operator', kind_: (p1 || m) }; }
            }
        },
        'a': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: [] }
                },
                '1/2$': {
                    '0': { action_: '1/2' }
                },
                'else': {
                    '0': { action_: [], nextState: '1', revisit: true }
                },
                '${(...)}$__$(...)$': {
                    '*': { action_: 'tex-math tight', nextState: '1' }
                },
                ',': {
                    '*': { action_: { type_: 'insert', option: 'commaDecimal' } }
                },
                'else2': {
                    '*': { action_: 'copy' }
                }
            }),
            actions: {}
        },
        'o': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: [] }
                },
                '1/2$': {
                    '0': { action_: '1/2' }
                },
                'else': {
                    '0': { action_: [], nextState: '1', revisit: true }
                },
                'letters': {
                    '*': { action_: 'rm' }
                },
                '\\ca': {
                    '*': { action_: { type_: 'insert', option: 'circa' } }
                },
                '\\pu{(...)}': {
                    '*': { action_: [{ type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '\\x{}{}|\\x{}|\\x': {
                    '*': { action_: 'copy' }
                },
                '${(...)}$__$(...)$': {
                    '*': { action_: 'tex-math' }
                },
                '{(...)}': {
                    '*': { action_: [{ type_: 'write', option: "{" }, 'text', { type_: 'write', option: "}" }] }
                },
                'else2': {
                    '*': { action_: 'copy' }
                }
            }),
            actions: {}
        },
        'text': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                '{...}': {
                    '*': { action_: 'text=' }
                },
                '${(...)}$__$(...)$': {
                    '*': { action_: 'tex-math' }
                },
                '\\greek': {
                    '*': { action_: ['output', 'rm'] }
                },
                '\\pu{(...)}': {
                    '*': { action_: ['output', { type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '\\,|\\x{}{}|\\x{}|\\x': {
                    '*': { action_: ['output', 'copy'] }
                },
                'else': {
                    '*': { action_: 'text=' }
                }
            }),
            actions: {
                'output': function (buffer) {
                    if (buffer.text_) {
                        var ret = { type_: 'text', p1: buffer.text_ };
                        for (var p in buffer) {
                            delete buffer[p];
                        }
                        return ret;
                    }
                    return undefined;
                }
            }
        },
        'pq': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: [] }
                },
                'state of aggregation $': {
                    '*': { action_: 'state of aggregation' }
                },
                'i$': {
                    '0': { action_: [], nextState: '!f', revisit: true }
                },
                '(KV letters),': {
                    '0': { action_: 'rm', nextState: '0' }
                },
                'formula$': {
                    '0': { action_: [], nextState: 'f', revisit: true }
                },
                '1/2$': {
                    '0': { action_: '1/2' }
                },
                'else': {
                    '0': { action_: [], nextState: '!f', revisit: true }
                },
                '${(...)}$__$(...)$': {
                    '*': { action_: 'tex-math' }
                },
                '{(...)}': {
                    '*': { action_: 'text' }
                },
                'a-z': {
                    'f': { action_: 'tex-math' }
                },
                'letters': {
                    '*': { action_: 'rm' }
                },
                '-9.,9': {
                    '*': { action_: '9,9' }
                },
                ',': {
                    '*': { action_: { type_: 'insert+p1', option: 'comma enumeration S' } }
                },
                '\\color{(...)}{(...)}': {
                    '*': { action_: 'color-output' }
                },
                '\\color{(...)}': {
                    '*': { action_: 'color0-output' }
                },
                '\\ce{(...)}': {
                    '*': { action_: 'ce' }
                },
                '\\pu{(...)}': {
                    '*': { action_: [{ type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '\\,|\\x{}{}|\\x{}|\\x': {
                    '*': { action_: 'copy' }
                },
                'else2': {
                    '*': { action_: 'copy' }
                }
            }),
            actions: {
                'state of aggregation': function (_buffer, m) {
                    return { type_: 'state of aggregation subscript', p1: _mhchemParser.go(m, 'o') };
                },
                'color-output': function (_buffer, m) {
                    return { type_: 'color', color1: m[0], color2: _mhchemParser.go(m[1], 'pq') };
                }
            }
        },
        'bd': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: [] }
                },
                'x$': {
                    '0': { action_: [], nextState: '!f', revisit: true }
                },
                'formula$': {
                    '0': { action_: [], nextState: 'f', revisit: true }
                },
                'else': {
                    '0': { action_: [], nextState: '!f', revisit: true }
                },
                '-9.,9 no missing 0': {
                    '*': { action_: '9,9' }
                },
                '.': {
                    '*': { action_: { type_: 'insert', option: 'electron dot' } }
                },
                'a-z': {
                    'f': { action_: 'tex-math' }
                },
                'x': {
                    '*': { action_: { type_: 'insert', option: 'KV x' } }
                },
                'letters': {
                    '*': { action_: 'rm' }
                },
                '\'': {
                    '*': { action_: { type_: 'insert', option: 'prime' } }
                },
                '${(...)}$__$(...)$': {
                    '*': { action_: 'tex-math' }
                },
                '{(...)}': {
                    '*': { action_: 'text' }
                },
                '\\color{(...)}{(...)}': {
                    '*': { action_: 'color-output' }
                },
                '\\color{(...)}': {
                    '*': { action_: 'color0-output' }
                },
                '\\ce{(...)}': {
                    '*': { action_: 'ce' }
                },
                '\\pu{(...)}': {
                    '*': { action_: [{ type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '\\,|\\x{}{}|\\x{}|\\x': {
                    '*': { action_: 'copy' }
                },
                'else2': {
                    '*': { action_: 'copy' }
                }
            }),
            actions: {
                'color-output': function (_buffer, m) {
                    return { type_: 'color', color1: m[0], color2: _mhchemParser.go(m[1], 'bd') };
                }
            }
        },
        'oxidation': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'roman-numeral' }
                },
                'pm-operator': {
                    '*': { action_: { type_: 'o=+p1', option: "\\pm" } }
                },
                'else': {
                    '*': { action_: 'o=' }
                }
            }),
            actions: {
                'roman-numeral': function (buffer) { return { type_: 'roman numeral', p1: buffer.o || "" }; }
            }
        },
        'tex-math': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                '\\ce{(...)}': {
                    '*': { action_: ['output', 'ce'] }
                },
                '\\pu{(...)}': {
                    '*': { action_: ['output', { type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '{...}|\\,|\\x{}{}|\\x{}|\\x': {
                    '*': { action_: 'o=' }
                },
                'else': {
                    '*': { action_: 'o=' }
                }
            }),
            actions: {
                'output': function (buffer) {
                    if (buffer.o) {
                        var ret = { type_: 'tex-math', p1: buffer.o };
                        for (var p in buffer) {
                            delete buffer[p];
                        }
                        return ret;
                    }
                    return undefined;
                }
            }
        },
        'tex-math tight': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                '\\ce{(...)}': {
                    '*': { action_: ['output', 'ce'] }
                },
                '\\pu{(...)}': {
                    '*': { action_: ['output', { type_: 'write', option: "{" }, 'pu', { type_: 'write', option: "}" }] }
                },
                '{...}|\\,|\\x{}{}|\\x{}|\\x': {
                    '*': { action_: 'o=' }
                },
                '-|+': {
                    '*': { action_: 'tight operator' }
                },
                'else': {
                    '*': { action_: 'o=' }
                }
            }),
            actions: {
                'tight operator': function (buffer, m) { buffer.o = (buffer.o || "") + "{" + m + "}"; return undefined; },
                'output': function (buffer) {
                    if (buffer.o) {
                        var ret = { type_: 'tex-math', p1: buffer.o };
                        for (var p in buffer) {
                            delete buffer[p];
                        }
                        return ret;
                    }
                    return undefined;
                }
            }
        },
        '9,9': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: [] }
                },
                ',': {
                    '*': { action_: 'comma' }
                },
                'else': {
                    '*': { action_: 'copy' }
                }
            }),
            actions: {
                'comma': function () { return { type_: 'commaDecimal' }; }
            }
        },
        'pu': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                'space$': {
                    '*': { action_: ['output', 'space'] }
                },
                '{[(|)]}': {
                    '0|a': { action_: 'copy' }
                },
                '(-)(9)^(-9)': {
                    '0': { action_: 'number^', nextState: 'a' }
                },
                '(-)(9.,9)(e)(99)': {
                    '0': { action_: 'enumber', nextState: 'a' }
                },
                'space': {
                    '0|a': { action_: [] }
                },
                'pm-operator': {
                    '0|a': { action_: { type_: 'operator', option: '\\pm' }, nextState: '0' }
                },
                'operator': {
                    '0|a': { action_: 'copy', nextState: '0' }
                },
                '//': {
                    'd': { action_: 'o=', nextState: '/' }
                },
                '/': {
                    'd': { action_: 'o=', nextState: '/' }
                },
                '{...}|else': {
                    '0|d': { action_: 'd=', nextState: 'd' },
                    'a': { action_: ['space', 'd='], nextState: 'd' },
                    '/|q': { action_: 'q=', nextState: 'q' }
                }
            }),
            actions: {
                'enumber': function (_buffer, m) {
                    var ret = [];
                    if (m[0] === "+-" || m[0] === "+/-") {
                        ret.push("\\pm ");
                    }
                    else if (m[0]) {
                        ret.push(m[0]);
                    }
                    if (m[1]) {
                        _mhchemParser.concatArray(ret, _mhchemParser.go(m[1], 'pu-9,9'));
                        if (m[2]) {
                            if (m[2].match(/[,.]/)) {
                                _mhchemParser.concatArray(ret, _mhchemParser.go(m[2], 'pu-9,9'));
                            }
                            else {
                                ret.push(m[2]);
                            }
                        }
                        if (m[3] || m[4]) {
                            if (m[3] === "e" || m[4] === "*") {
                                ret.push({ type_: 'cdot' });
                            }
                            else {
                                ret.push({ type_: 'times' });
                            }
                        }
                    }
                    if (m[5]) {
                        ret.push("10^{" + m[5] + "}");
                    }
                    return ret;
                },
                'number^': function (_buffer, m) {
                    var ret = [];
                    if (m[0] === "+-" || m[0] === "+/-") {
                        ret.push("\\pm ");
                    }
                    else if (m[0]) {
                        ret.push(m[0]);
                    }
                    _mhchemParser.concatArray(ret, _mhchemParser.go(m[1], 'pu-9,9'));
                    ret.push("^{" + m[2] + "}");
                    return ret;
                },
                'operator': function (_buffer, m, p1) { return { type_: 'operator', kind_: (p1 || m) }; },
                'space': function () { return { type_: 'pu-space-1' }; },
                'output': function (buffer) {
                    var ret;
                    var md = _mhchemParser.patterns.match_('{(...)}', buffer.d || "");
                    if (md && md.remainder === '') {
                        buffer.d = md.match_;
                    }
                    var mq = _mhchemParser.patterns.match_('{(...)}', buffer.q || "");
                    if (mq && mq.remainder === '') {
                        buffer.q = mq.match_;
                    }
                    if (buffer.d) {
                        buffer.d = buffer.d.replace(/\u00B0C|\^oC|\^{o}C/g, "{}^{\\circ}C");
                        buffer.d = buffer.d.replace(/\u00B0F|\^oF|\^{o}F/g, "{}^{\\circ}F");
                    }
                    if (buffer.q) {
                        buffer.q = buffer.q.replace(/\u00B0C|\^oC|\^{o}C/g, "{}^{\\circ}C");
                        buffer.q = buffer.q.replace(/\u00B0F|\^oF|\^{o}F/g, "{}^{\\circ}F");
                        var b5 = {
                            d: _mhchemParser.go(buffer.d, 'pu'),
                            q: _mhchemParser.go(buffer.q, 'pu')
                        };
                        if (buffer.o === '//') {
                            ret = { type_: 'pu-frac', p1: b5.d, p2: b5.q };
                        }
                        else {
                            ret = b5.d;
                            if (b5.d.length > 1 || b5.q.length > 1) {
                                ret.push({ type_: ' / ' });
                            }
                            else {
                                ret.push({ type_: '/' });
                            }
                            _mhchemParser.concatArray(ret, b5.q);
                        }
                    }
                    else {
                        ret = _mhchemParser.go(buffer.d, 'pu-2');
                    }
                    for (var p in buffer) {
                        delete buffer[p];
                    }
                    return ret;
                }
            }
        },
        'pu-2': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '*': { action_: 'output' }
                },
                '*': {
                    '*': { action_: ['output', 'cdot'], nextState: '0' }
                },
                '\\x': {
                    '*': { action_: 'rm=' }
                },
                'space': {
                    '*': { action_: ['output', 'space'], nextState: '0' }
                },
                '^{(...)}|^(-1)': {
                    '1': { action_: '^(-1)' }
                },
                '-9.,9': {
                    '0': { action_: 'rm=', nextState: '0' },
                    '1': { action_: '^(-1)', nextState: '0' }
                },
                '{...}|else': {
                    '*': { action_: 'rm=', nextState: '1' }
                }
            }),
            actions: {
                'cdot': function () { return { type_: 'tight cdot' }; },
                '^(-1)': function (buffer, m) { buffer.rm += "^{" + m + "}"; return undefined; },
                'space': function () { return { type_: 'pu-space-2' }; },
                'output': function (buffer) {
                    var ret = [];
                    if (buffer.rm) {
                        var mrm = _mhchemParser.patterns.match_('{(...)}', buffer.rm || "");
                        if (mrm && mrm.remainder === '') {
                            ret = _mhchemParser.go(mrm.match_, 'pu');
                        }
                        else {
                            ret = { type_: 'rm', p1: buffer.rm };
                        }
                    }
                    for (var p in buffer) {
                        delete buffer[p];
                    }
                    return ret;
                }
            }
        },
        'pu-9,9': {
            transitions: _mhchemCreateTransitions({
                'empty': {
                    '0': { action_: 'output-0' },
                    'o': { action_: 'output-o' }
                },
                ',': {
                    '0': { action_: ['output-0', 'comma'], nextState: 'o' }
                },
                '.': {
                    '0': { action_: ['output-0', 'copy'], nextState: 'o' }
                },
                'else': {
                    '*': { action_: 'text=' }
                }
            }),
            actions: {
                'comma': function () { return { type_: 'commaDecimal' }; },
                'output-0': function (buffer) {
                    var ret = [];
                    buffer.text_ = buffer.text_ || "";
                    if (buffer.text_.length > 4) {
                        var a = buffer.text_.length % 3;
                        if (a === 0) {
                            a = 3;
                        }
                        for (var i = buffer.text_.length - 3; i > 0; i -= 3) {
                            ret.push(buffer.text_.substr(i, 3));
                            ret.push({ type_: '1000 separator' });
                        }
                        ret.push(buffer.text_.substr(0, a));
                        ret.reverse();
                    }
                    else {
                        ret.push(buffer.text_);
                    }
                    for (var p in buffer) {
                        delete buffer[p];
                    }
                    return ret;
                },
                'output-o': function (buffer) {
                    var ret = [];
                    buffer.text_ = buffer.text_ || "";
                    if (buffer.text_.length > 4) {
                        var a = buffer.text_.length - 3;
                        var i = void 0;
                        for (i = 0; i < a; i += 3) {
                            ret.push(buffer.text_.substr(i, 3));
                            ret.push({ type_: '1000 separator' });
                        }
                        ret.push(buffer.text_.substr(i));
                    }
                    else {
                        ret.push(buffer.text_);
                    }
                    for (var p in buffer) {
                        delete buffer[p];
                    }
                    return ret;
                }
            }
        }
    }
};
var _mhchemTexify = {
    go: function (input, addOuterBraces) {
        if (!input) {
            return "";
        }
        var res = "";
        var cee = false;
        for (var i = 0; i < input.length; i++) {
            var inputi = input[i];
            if (typeof inputi === "string") {
                res += inputi;
            }
            else {
                res += _mhchemTexify._go2(inputi);
                if (inputi.type_ === '1st-level escape') {
                    cee = true;
                }
            }
        }
        if (addOuterBraces && !cee && res) {
            res = "{" + res + "}";
        }
        return res;
    },
    _goInner: function (input) {
        return _mhchemTexify.go(input, false);
    },
    _go2: function (buf) {
        var res;
        switch (buf.type_) {
            case 'chemfive':
                res = "";
                var b5 = {
                    a: _mhchemTexify._goInner(buf.a),
                    b: _mhchemTexify._goInner(buf.b),
                    p: _mhchemTexify._goInner(buf.p),
                    o: _mhchemTexify._goInner(buf.o),
                    q: _mhchemTexify._goInner(buf.q),
                    d: _mhchemTexify._goInner(buf.d)
                };
                if (b5.a) {
                    if (b5.a.match(/^[+\-]/)) {
                        b5.a = "{" + b5.a + "}";
                    }
                    res += b5.a + "\\,";
                }
                if (b5.b || b5.p) {
                    res += "{\\vphantom{A}}";
                    res += "^{\\hphantom{" + (b5.b || "") + "}}_{\\hphantom{" + (b5.p || "") + "}}";
                    res += "\\mkern-1.5mu";
                    res += "{\\vphantom{A}}";
                    res += "^{\\smash[t]{\\vphantom{2}}\\llap{" + (b5.b || "") + "}}";
                    res += "_{\\vphantom{2}\\llap{\\smash[t]{" + (b5.p || "") + "}}}";
                }
                if (b5.o) {
                    if (b5.o.match(/^[+\-]/)) {
                        b5.o = "{" + b5.o + "}";
                    }
                    res += b5.o;
                }
                if (buf.dType === 'kv') {
                    if (b5.d || b5.q) {
                        res += "{\\vphantom{A}}";
                    }
                    if (b5.d) {
                        res += "^{" + b5.d + "}";
                    }
                    if (b5.q) {
                        res += "_{\\smash[t]{" + b5.q + "}}";
                    }
                }
                else if (buf.dType === 'oxidation') {
                    if (b5.d) {
                        res += "{\\vphantom{A}}";
                        res += "^{" + b5.d + "}";
                    }
                    if (b5.q) {
                        res += "{\\vphantom{A}}";
                        res += "_{\\smash[t]{" + b5.q + "}}";
                    }
                }
                else {
                    if (b5.q) {
                        res += "{\\vphantom{A}}";
                        res += "_{\\smash[t]{" + b5.q + "}}";
                    }
                    if (b5.d) {
                        res += "{\\vphantom{A}}";
                        res += "^{" + b5.d + "}";
                    }
                }
                break;
            case 'rm':
                res = "\\mathrm{" + buf.p1 + "}";
                break;
            case 'text':
                if (buf.p1.match(/[\^_]/)) {
                    buf.p1 = buf.p1.replace(" ", "~").replace("-", "\\text{-}");
                    res = "\\mathrm{" + buf.p1 + "}";
                }
                else {
                    res = "\\text{" + buf.p1 + "}";
                }
                break;
            case 'roman numeral':
                res = "\\mathrm{" + buf.p1 + "}";
                break;
            case 'state of aggregation':
                res = "\\mskip2mu " + _mhchemTexify._goInner(buf.p1);
                break;
            case 'state of aggregation subscript':
                res = "\\mskip1mu " + _mhchemTexify._goInner(buf.p1);
                break;
            case 'bond':
                res = _mhchemTexify._getBond(buf.kind_);
                if (!res) {
                    throw ["MhchemErrorBond", "mhchem Error. Unknown bond type (" + buf.kind_ + ")"];
                }
                break;
            case 'frac':
                var c = "\\frac{" + buf.p1 + "}{" + buf.p2 + "}";
                res = "\\mathchoice{\\textstyle" + c + "}{" + c + "}{" + c + "}{" + c + "}";
                break;
            case 'pu-frac':
                var d = "\\frac{" + _mhchemTexify._goInner(buf.p1) + "}{" + _mhchemTexify._goInner(buf.p2) + "}";
                res = "\\mathchoice{\\textstyle" + d + "}{" + d + "}{" + d + "}{" + d + "}";
                break;
            case 'tex-math':
                res = buf.p1 + " ";
                break;
            case 'frac-ce':
                res = "\\frac{" + _mhchemTexify._goInner(buf.p1) + "}{" + _mhchemTexify._goInner(buf.p2) + "}";
                break;
            case 'overset':
                res = "\\overset{" + _mhchemTexify._goInner(buf.p1) + "}{" + _mhchemTexify._goInner(buf.p2) + "}";
                break;
            case 'underset':
                res = "\\underset{" + _mhchemTexify._goInner(buf.p1) + "}{" + _mhchemTexify._goInner(buf.p2) + "}";
                break;
            case 'underbrace':
                res = "\\underbrace{" + _mhchemTexify._goInner(buf.p1) + "}_{" + _mhchemTexify._goInner(buf.p2) + "}";
                break;
            case 'color':
                res = "{\\color{" + buf.color1 + "}{" + _mhchemTexify._goInner(buf.color2) + "}}";
                break;
            case 'color0':
                res = "\\color{" + buf.color + "}";
                break;
            case 'arrow':
                var b6 = {
                    rd: _mhchemTexify._goInner(buf.rd),
                    rq: _mhchemTexify._goInner(buf.rq)
                };
                var arrow = _mhchemTexify._getArrow(buf.r);
                if (b6.rd || b6.rq) {
                    if (buf.r === "<=>" || buf.r === "<=>>" || buf.r === "<<=>" || buf.r === "<-->") {
                        arrow = "\\long" + arrow;
                        if (b6.rd) {
                            arrow = "\\overset{" + b6.rd + "}{" + arrow + "}";
                        }
                        if (b6.rq) {
                            if (buf.r === "<-->") {
                                arrow = "\\underset{\\lower2mu{" + b6.rq + "}}{" + arrow + "}";
                            }
                            else {
                                arrow = "\\underset{\\lower6mu{" + b6.rq + "}}{" + arrow + "}";
                            }
                        }
                        arrow = " {}\\mathrel{" + arrow + "}{} ";
                    }
                    else {
                        if (b6.rq) {
                            arrow += "[{" + b6.rq + "}]";
                        }
                        arrow += "{" + b6.rd + "}";
                        arrow = " {}\\mathrel{\\x" + arrow + "}{} ";
                    }
                }
                else {
                    arrow = " {}\\mathrel{\\long" + arrow + "}{} ";
                }
                res = arrow;
                break;
            case 'operator':
                res = _mhchemTexify._getOperator(buf.kind_);
                break;
            case '1st-level escape':
                res = buf.p1 + " ";
                break;
            case 'space':
                res = " ";
                break;
            case 'tinySkip':
                res = '\\mkern2mu';
                break;
            case 'entitySkip':
                res = "~";
                break;
            case 'pu-space-1':
                res = "~";
                break;
            case 'pu-space-2':
                res = "\\mkern3mu ";
                break;
            case '1000 separator':
                res = "\\mkern2mu ";
                break;
            case 'commaDecimal':
                res = "{,}";
                break;
            case 'comma enumeration L':
                res = "{" + buf.p1 + "}\\mkern6mu ";
                break;
            case 'comma enumeration M':
                res = "{" + buf.p1 + "}\\mkern3mu ";
                break;
            case 'comma enumeration S':
                res = "{" + buf.p1 + "}\\mkern1mu ";
                break;
            case 'hyphen':
                res = "\\text{-}";
                break;
            case 'addition compound':
                res = "\\,{\\cdot}\\,";
                break;
            case 'electron dot':
                res = "\\mkern1mu \\bullet\\mkern1mu ";
                break;
            case 'KV x':
                res = "{\\times}";
                break;
            case 'prime':
                res = "\\prime ";
                break;
            case 'cdot':
                res = "\\cdot ";
                break;
            case 'tight cdot':
                res = "\\mkern1mu{\\cdot}\\mkern1mu ";
                break;
            case 'times':
                res = "\\times ";
                break;
            case 'circa':
                res = "{\\sim}";
                break;
            case '^':
                res = "uparrow";
                break;
            case 'v':
                res = "downarrow";
                break;
            case 'ellipsis':
                res = "\\ldots ";
                break;
            case '/':
                res = "/";
                break;
            case ' / ':
                res = "\\,/\\,";
                break;
            default:
                assertNever(buf);
                throw ["MhchemBugT", "mhchem bug T. Please report."];
        }
        return res;
    },
    _getArrow: function (a) {
        switch (a) {
            case "->": return "rightarrow";
            case "\u2192": return "rightarrow";
            case "\u27F6": return "rightarrow";
            case "<-": return "leftarrow";
            case "<->": return "leftrightarrow";
            case "<-->": return "leftrightarrows";
            case "<=>": return "rightleftharpoons";
            case "\u21CC": return "rightleftharpoons";
            case "<=>>": return "Rightleftharpoons";
            case "<<=>": return "Leftrightharpoons";
            default:
                assertNever(a);
                throw ["MhchemBugT", "mhchem bug T. Please report."];
        }
    },
    _getBond: function (a) {
        switch (a) {
            case "-": return "{-}";
            case "1": return "{-}";
            case "=": return "{=}";
            case "2": return "{=}";
            case "#": return "{\\equiv}";
            case "3": return "{\\equiv}";
            case "~": return "{\\tripledash}";
            case "~-": return "{\\rlap{\\lower.1em{-}}\\raise.1em{\\tripledash}}";
            case "~=": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}";
            case "~--": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{\\tripledash}}-}";
            case "-~-": return "{\\rlap{\\lower.2em{-}}\\rlap{\\raise.2em{-}}\\tripledash}";
            case "...": return "{{\\cdot}{\\cdot}{\\cdot}}";
            case "....": return "{{\\cdot}{\\cdot}{\\cdot}{\\cdot}}";
            case "->": return "{\\rightarrow}";
            case "<-": return "{\\leftarrow}";
            case "<": return "{<}";
            case ">": return "{>}";
            default:
                assertNever(a);
                throw ["MhchemBugT", "mhchem bug T. Please report."];
        }
    },
    _getOperator: function (a) {
        switch (a) {
            case "+": return " {}+{} ";
            case "-": return " {}-{} ";
            case "=": return " {}={} ";
            case "<": return " {}<{} ";
            case ">": return " {}>{} ";
            case "<<": return " {}\\ll{} ";
            case ">>": return " {}\\gg{} ";
            case "\\pm": return " {}\\pm{} ";
            case "\\approx": return " {}\\approx{} ";
            case "$\\approx$": return " {}\\approx{} ";
            case "v": return " \\downarrow{} ";
            case "(v)": return " \\downarrow{} ";
            case "^": return " \\uparrow{} ";
            case "(^)": return " \\uparrow{} ";
            default:
                assertNever(a);
                throw ["MhchemBugT", "mhchem bug T. Please report."];
        }
    }
};
function assertNever(a) { }
