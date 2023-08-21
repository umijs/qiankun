"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var NodeUtil_js_1 = __importDefault(require("./NodeUtil.js"));
var TexParser_js_1 = __importDefault(require("./TexParser.js"));
var TexError_js_1 = __importDefault(require("./TexError.js"));
var Entities_js_1 = require("../../util/Entities.js");
var ParseUtil;
(function (ParseUtil) {
    var emPerInch = 7.2;
    var pxPerInch = 72;
    var UNIT_CASES = {
        'em': function (m) { return m; },
        'ex': function (m) { return m * .43; },
        'pt': function (m) { return m / 10; },
        'pc': function (m) { return m * 1.2; },
        'px': function (m) { return m * emPerInch / pxPerInch; },
        'in': function (m) { return m * emPerInch; },
        'cm': function (m) { return m * emPerInch / 2.54; },
        'mm': function (m) { return m * emPerInch / 25.4; },
        'mu': function (m) { return m / 18; },
    };
    var num = '([-+]?([.,]\\d+|\\d+([.,]\\d*)?))';
    var unit = '(pt|em|ex|mu|px|mm|cm|in|pc)';
    var dimenEnd = RegExp('^\\s*' + num + '\\s*' + unit + '\\s*$');
    var dimenRest = RegExp('^\\s*' + num + '\\s*' + unit + ' ?');
    function matchDimen(dim, rest) {
        if (rest === void 0) { rest = false; }
        var match = dim.match(rest ? dimenRest : dimenEnd);
        return match ?
            muReplace([match[1].replace(/,/, '.'), match[4], match[0].length]) :
            [null, null, 0];
    }
    ParseUtil.matchDimen = matchDimen;
    function muReplace(_a) {
        var _b = __read(_a, 3), value = _b[0], unit = _b[1], length = _b[2];
        if (unit !== 'mu') {
            return [value, unit, length];
        }
        var em = Em(UNIT_CASES[unit](parseFloat(value || '1')));
        return [em.slice(0, -2), 'em', length];
    }
    function dimen2em(dim) {
        var _a = __read(matchDimen(dim), 2), value = _a[0], unit = _a[1];
        var m = parseFloat(value || '1');
        var func = UNIT_CASES[unit];
        return func ? func(m) : 0;
    }
    ParseUtil.dimen2em = dimen2em;
    function Em(m) {
        if (Math.abs(m) < .0006) {
            return '0em';
        }
        return m.toFixed(3).replace(/\.?0+$/, '') + 'em';
    }
    ParseUtil.Em = Em;
    function cols() {
        var W = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            W[_i] = arguments[_i];
        }
        return W.map(function (n) { return Em(n); }).join(' ');
    }
    ParseUtil.cols = cols;
    function fenced(configuration, open, mml, close, big, color) {
        if (big === void 0) { big = ''; }
        if (color === void 0) { color = ''; }
        var nf = configuration.nodeFactory;
        var mrow = nf.create('node', 'mrow', [], { open: open, close: close, texClass: MmlNode_js_1.TEXCLASS.INNER });
        var mo;
        if (big) {
            mo = new TexParser_js_1.default('\\' + big + 'l' + open, configuration.parser.stack.env, configuration).mml();
        }
        else {
            var openNode = nf.create('text', open);
            mo = nf.create('node', 'mo', [], { fence: true, stretchy: true, symmetric: true, texClass: MmlNode_js_1.TEXCLASS.OPEN }, openNode);
        }
        NodeUtil_js_1.default.appendChildren(mrow, [mo, mml]);
        if (big) {
            mo = new TexParser_js_1.default('\\' + big + 'r' + close, configuration.parser.stack.env, configuration).mml();
        }
        else {
            var closeNode = nf.create('text', close);
            mo = nf.create('node', 'mo', [], { fence: true, stretchy: true, symmetric: true, texClass: MmlNode_js_1.TEXCLASS.CLOSE }, closeNode);
        }
        color && mo.attributes.set('mathcolor', color);
        NodeUtil_js_1.default.appendChildren(mrow, [mo]);
        return mrow;
    }
    ParseUtil.fenced = fenced;
    function fixedFence(configuration, open, mml, close) {
        var mrow = configuration.nodeFactory.create('node', 'mrow', [], { open: open, close: close, texClass: MmlNode_js_1.TEXCLASS.ORD });
        if (open) {
            NodeUtil_js_1.default.appendChildren(mrow, [mathPalette(configuration, open, 'l')]);
        }
        if (NodeUtil_js_1.default.isType(mml, 'mrow')) {
            NodeUtil_js_1.default.appendChildren(mrow, NodeUtil_js_1.default.getChildren(mml));
        }
        else {
            NodeUtil_js_1.default.appendChildren(mrow, [mml]);
        }
        if (close) {
            NodeUtil_js_1.default.appendChildren(mrow, [mathPalette(configuration, close, 'r')]);
        }
        return mrow;
    }
    ParseUtil.fixedFence = fixedFence;
    function mathPalette(configuration, fence, side) {
        if (fence === '{' || fence === '}') {
            fence = '\\' + fence;
        }
        var D = '{\\bigg' + side + ' ' + fence + '}';
        var T = '{\\big' + side + ' ' + fence + '}';
        return new TexParser_js_1.default('\\mathchoice' + D + T + T + T, {}, configuration).mml();
    }
    ParseUtil.mathPalette = mathPalette;
    function fixInitialMO(configuration, nodes) {
        for (var i = 0, m = nodes.length; i < m; i++) {
            var child = nodes[i];
            if (child && (!NodeUtil_js_1.default.isType(child, 'mspace') &&
                (!NodeUtil_js_1.default.isType(child, 'TeXAtom') ||
                    (NodeUtil_js_1.default.getChildren(child)[0] &&
                        NodeUtil_js_1.default.getChildren(NodeUtil_js_1.default.getChildren(child)[0]).length)))) {
                if (NodeUtil_js_1.default.isEmbellished(child) ||
                    (NodeUtil_js_1.default.isType(child, 'TeXAtom') && NodeUtil_js_1.default.getTexClass(child) === MmlNode_js_1.TEXCLASS.REL)) {
                    var mi = configuration.nodeFactory.create('node', 'mi');
                    nodes.unshift(mi);
                }
                break;
            }
        }
    }
    ParseUtil.fixInitialMO = fixInitialMO;
    function internalMath(parser, text, level, font) {
        if (parser.configuration.options.internalMath) {
            return parser.configuration.options.internalMath(parser, text, level, font);
        }
        var mathvariant = font || parser.stack.env.font;
        var def = (mathvariant ? { mathvariant: mathvariant } : {});
        var mml = [], i = 0, k = 0, c, node, match = '', braces = 0;
        if (text.match(/\\?[${}\\]|\\\(|\\(eq)?ref\s*\{/)) {
            while (i < text.length) {
                c = text.charAt(i++);
                if (c === '$') {
                    if (match === '$' && braces === 0) {
                        node = parser.create('node', 'TeXAtom', [(new TexParser_js_1.default(text.slice(k, i - 1), {}, parser.configuration)).mml()]);
                        mml.push(node);
                        match = '';
                        k = i;
                    }
                    else if (match === '') {
                        if (k < i - 1) {
                            mml.push(internalText(parser, text.slice(k, i - 1), def));
                        }
                        match = '$';
                        k = i;
                    }
                }
                else if (c === '{' && match !== '') {
                    braces++;
                }
                else if (c === '}') {
                    if (match === '}' && braces === 0) {
                        var atom = (new TexParser_js_1.default(text.slice(k, i), {}, parser.configuration)).mml();
                        node = parser.create('node', 'TeXAtom', [atom], def);
                        mml.push(node);
                        match = '';
                        k = i;
                    }
                    else if (match !== '') {
                        if (braces) {
                            braces--;
                        }
                    }
                }
                else if (c === '\\') {
                    if (match === '' && text.substr(i).match(/^(eq)?ref\s*\{/)) {
                        var len = RegExp['$&'].length;
                        if (k < i - 1) {
                            mml.push(internalText(parser, text.slice(k, i - 1), def));
                        }
                        match = '}';
                        k = i - 1;
                        i += len;
                    }
                    else {
                        c = text.charAt(i++);
                        if (c === '(' && match === '') {
                            if (k < i - 2) {
                                mml.push(internalText(parser, text.slice(k, i - 2), def));
                            }
                            match = ')';
                            k = i;
                        }
                        else if (c === ')' && match === ')' && braces === 0) {
                            node = parser.create('node', 'TeXAtom', [(new TexParser_js_1.default(text.slice(k, i - 2), {}, parser.configuration)).mml()]);
                            mml.push(node);
                            match = '';
                            k = i;
                        }
                        else if (c.match(/[${}\\]/) && match === '') {
                            i--;
                            text = text.substr(0, i - 1) + text.substr(i);
                        }
                    }
                }
            }
            if (match !== '') {
                throw new TexError_js_1.default('MathNotTerminated', 'Math not terminated in text box');
            }
        }
        if (k < text.length) {
            mml.push(internalText(parser, text.slice(k), def));
        }
        if (level != null) {
            mml = [parser.create('node', 'mstyle', mml, { displaystyle: false, scriptlevel: level })];
        }
        else if (mml.length > 1) {
            mml = [parser.create('node', 'mrow', mml)];
        }
        return mml;
    }
    ParseUtil.internalMath = internalMath;
    function internalText(parser, text, def) {
        text = text.replace(/^\s+/, Entities_js_1.entities.nbsp).replace(/\s+$/, Entities_js_1.entities.nbsp);
        var textNode = parser.create('text', text);
        return parser.create('node', 'mtext', [], def, textNode);
    }
    ParseUtil.internalText = internalText;
    function underOver(parser, base, script, pos, stack) {
        ParseUtil.checkMovableLimits(base);
        if (NodeUtil_js_1.default.isType(base, 'munderover') && NodeUtil_js_1.default.isEmbellished(base)) {
            NodeUtil_js_1.default.setProperties(NodeUtil_js_1.default.getCoreMO(base), { lspace: 0, rspace: 0 });
            var mo = parser.create('node', 'mo', [], { rspace: 0 });
            base = parser.create('node', 'mrow', [mo, base]);
        }
        var mml = parser.create('node', 'munderover', [base]);
        NodeUtil_js_1.default.setChild(mml, pos === 'over' ? mml.over : mml.under, script);
        var node = mml;
        if (stack) {
            node = parser.create('node', 'TeXAtom', [mml], { texClass: MmlNode_js_1.TEXCLASS.OP, movesupsub: true });
        }
        NodeUtil_js_1.default.setProperty(node, 'subsupOK', true);
        return node;
    }
    ParseUtil.underOver = underOver;
    function checkMovableLimits(base) {
        var symbol = (NodeUtil_js_1.default.isType(base, 'mo') ? NodeUtil_js_1.default.getForm(base) : null);
        if (NodeUtil_js_1.default.getProperty(base, 'movablelimits') || (symbol && symbol[3] && symbol[3].movablelimits)) {
            NodeUtil_js_1.default.setProperties(base, { movablelimits: false });
        }
    }
    ParseUtil.checkMovableLimits = checkMovableLimits;
    function trimSpaces(text) {
        if (typeof (text) !== 'string') {
            return text;
        }
        var TEXT = text.trim();
        if (TEXT.match(/\\$/) && text.match(/ $/)) {
            TEXT += ' ';
        }
        return TEXT;
    }
    ParseUtil.trimSpaces = trimSpaces;
    function setArrayAlign(array, align) {
        align = ParseUtil.trimSpaces(align || '');
        if (align === 't') {
            array.arraydef.align = 'baseline 1';
        }
        else if (align === 'b') {
            array.arraydef.align = 'baseline -1';
        }
        else if (align === 'c') {
            array.arraydef.align = 'axis';
        }
        else if (align) {
            array.arraydef.align = align;
        }
        return array;
    }
    ParseUtil.setArrayAlign = setArrayAlign;
    function substituteArgs(parser, args, str) {
        var text = '';
        var newstring = '';
        var i = 0;
        while (i < str.length) {
            var c = str.charAt(i++);
            if (c === '\\') {
                text += c + str.charAt(i++);
            }
            else if (c === '#') {
                c = str.charAt(i++);
                if (c === '#') {
                    text += c;
                }
                else {
                    if (!c.match(/[1-9]/) || parseInt(c, 10) > args.length) {
                        throw new TexError_js_1.default('IllegalMacroParam', 'Illegal macro parameter reference');
                    }
                    newstring = addArgs(parser, addArgs(parser, newstring, text), args[parseInt(c, 10) - 1]);
                    text = '';
                }
            }
            else {
                text += c;
            }
        }
        return addArgs(parser, newstring, text);
    }
    ParseUtil.substituteArgs = substituteArgs;
    function addArgs(parser, s1, s2) {
        if (s2.match(/^[a-z]/i) && s1.match(/(^|[^\\])(\\\\)*\\[a-z]+$/i)) {
            s1 += ' ';
        }
        if (s1.length + s2.length > parser.configuration.options['maxBuffer']) {
            throw new TexError_js_1.default('MaxBufferSize', 'MathJax internal buffer size exceeded; is there a' +
                ' recursive macro call?');
        }
        return s1 + s2;
    }
    ParseUtil.addArgs = addArgs;
    function checkMaxMacros(parser, isMacro) {
        if (isMacro === void 0) { isMacro = true; }
        if (++parser.macroCount <= parser.configuration.options['maxMacros']) {
            return;
        }
        if (isMacro) {
            throw new TexError_js_1.default('MaxMacroSub1', 'MathJax maximum macro substitution count exceeded; ' +
                'is here a recursive macro call?');
        }
        else {
            throw new TexError_js_1.default('MaxMacroSub2', 'MathJax maximum substitution count exceeded; ' +
                'is there a recursive latex environment?');
        }
    }
    ParseUtil.checkMaxMacros = checkMaxMacros;
    function checkEqnEnv(parser) {
        if (parser.stack.global.eqnenv) {
            throw new TexError_js_1.default('ErroneousNestingEq', 'Erroneous nesting of equation structures');
        }
        parser.stack.global.eqnenv = true;
    }
    ParseUtil.checkEqnEnv = checkEqnEnv;
    function copyNode(node, parser) {
        var tree = node.copy();
        var options = parser.configuration;
        tree.walkTree(function (n) {
            var e_1, _a;
            options.addNode(n.kind, n);
            var lists = (n.getProperty('in-lists') || '').split(/,/);
            try {
                for (var lists_1 = __values(lists), lists_1_1 = lists_1.next(); !lists_1_1.done; lists_1_1 = lists_1.next()) {
                    var list = lists_1_1.value;
                    list && options.addNode(list, n);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (lists_1_1 && !lists_1_1.done && (_a = lists_1.return)) _a.call(lists_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        return tree;
    }
    ParseUtil.copyNode = copyNode;
    function MmlFilterAttribute(_parser, _name, value) {
        return value;
    }
    ParseUtil.MmlFilterAttribute = MmlFilterAttribute;
    function getFontDef(parser) {
        var font = parser.stack.env['font'];
        return (font ? { mathvariant: font } : {});
    }
    ParseUtil.getFontDef = getFontDef;
    function keyvalOptions(attrib, allowed, error) {
        var e_2, _a;
        if (allowed === void 0) { allowed = null; }
        if (error === void 0) { error = false; }
        var def = readKeyval(attrib);
        if (allowed) {
            try {
                for (var _b = __values(Object.keys(def)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    if (!allowed.hasOwnProperty(key)) {
                        if (error) {
                            throw new TexError_js_1.default('InvalidOption', 'Invalid option: %1', key);
                        }
                        delete def[key];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return def;
    }
    ParseUtil.keyvalOptions = keyvalOptions;
    function readKeyval(text) {
        var _a, _b;
        var options = {};
        var rest = text;
        var end, key, val;
        while (rest) {
            _a = __read(readValue(rest, ['=', ',']), 3), key = _a[0], end = _a[1], rest = _a[2];
            if (end === '=') {
                _b = __read(readValue(rest, [',']), 3), val = _b[0], end = _b[1], rest = _b[2];
                val = (val === 'false' || val === 'true') ?
                    JSON.parse(val) : val;
                options[key] = val;
            }
            else if (key) {
                options[key] = true;
            }
        }
        return options;
    }
    function removeBraces(text, count) {
        while (count > 0) {
            text = text.trim().slice(1, -1);
            count--;
        }
        return text.trim();
    }
    function readValue(text, end) {
        var length = text.length;
        var braces = 0;
        var value = '';
        var index = 0;
        var start = 0;
        var startCount = true;
        var stopCount = false;
        while (index < length) {
            var c = text[index++];
            switch (c) {
                case ' ':
                    break;
                case '{':
                    if (startCount) {
                        start++;
                    }
                    else {
                        stopCount = false;
                        if (start > braces) {
                            start = braces;
                        }
                    }
                    braces++;
                    break;
                case '}':
                    if (braces) {
                        braces--;
                    }
                    if (startCount || stopCount) {
                        start--;
                        stopCount = true;
                    }
                    startCount = false;
                    break;
                default:
                    if (!braces && end.indexOf(c) !== -1) {
                        return [stopCount ? 'true' :
                                removeBraces(value, start), c, text.slice(index)];
                    }
                    startCount = false;
                    stopCount = false;
            }
            value += c;
        }
        if (braces) {
            throw new TexError_js_1.default('ExtraOpenMissingClose', 'Extra open brace or missing close brace');
        }
        return [stopCount ? 'true' : removeBraces(value, start), '', text.slice(index)];
    }
})(ParseUtil || (ParseUtil = {}));
exports.default = ParseUtil;
//# sourceMappingURL=ParseUtil.js.map