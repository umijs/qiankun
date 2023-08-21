"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MathtoolsMethods = void 0;
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var AmsMethods_js_1 = require("../ams/AmsMethods.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var lengths_js_1 = require("../../../util/lengths.js");
var Options_js_1 = require("../../../util/Options.js");
var NewcommandUtil_js_1 = __importDefault(require("../newcommand/NewcommandUtil.js"));
var NewcommandMethods_js_1 = __importDefault(require("../newcommand/NewcommandMethods.js"));
var MathtoolsUtil_js_1 = require("./MathtoolsUtil.js");
exports.MathtoolsMethods = {
    MtMatrix: function (parser, begin, open, close) {
        var align = parser.GetBrackets("\\begin{".concat(begin.getName(), "}"), 'c');
        return exports.MathtoolsMethods.Array(parser, begin, open, close, align);
    },
    MtSmallMatrix: function (parser, begin, open, close, align) {
        if (!align) {
            align = parser.GetBrackets("\\begin{".concat(begin.getName(), "}"), parser.options.mathtools['smallmatrix-align']);
        }
        return exports.MathtoolsMethods.Array(parser, begin, open, close, align, ParseUtil_js_1.default.Em(1 / 3), '.2em', 'S', 1);
    },
    MtMultlined: function (parser, begin) {
        var _a;
        var name = "\\begin{".concat(begin.getName(), "}");
        var pos = parser.GetBrackets(name, parser.options.mathtools['multlined-pos'] || 'c');
        var width = pos ? parser.GetBrackets(name, '') : '';
        if (pos && !pos.match(/^[cbt]$/)) {
            _a = __read([pos, width], 2), width = _a[0], pos = _a[1];
        }
        parser.Push(begin);
        var item = parser.itemFactory.create('multlined', parser, begin);
        item.arraydef = {
            displaystyle: true,
            rowspacing: '.5em',
            width: width || 'auto',
            columnwidth: '100%',
        };
        return ParseUtil_js_1.default.setArrayAlign(item, pos || 'c');
    },
    HandleShove: function (parser, name, shove) {
        var top = parser.stack.Top();
        if (top.kind !== 'multline' && top.kind !== 'multlined') {
            throw new TexError_js_1.default('CommandInMultlined', '%1 can only appear within the multline or multlined environments', name);
        }
        if (top.Size()) {
            throw new TexError_js_1.default('CommandAtTheBeginingOfLine', '%1 must come at the beginning of the line', name);
        }
        top.setProperty('shove', shove);
        var shift = parser.GetBrackets(name);
        var mml = parser.ParseArg(name);
        if (shift) {
            var mrow = parser.create('node', 'mrow', []);
            var mspace = parser.create('node', 'mspace', [], { width: shift });
            if (shove === 'left') {
                mrow.appendChild(mspace);
                mrow.appendChild(mml);
            }
            else {
                mrow.appendChild(mml);
                mrow.appendChild(mspace);
            }
            mml = mrow;
        }
        parser.Push(mml);
    },
    SpreadLines: function (parser, begin) {
        var e_1, _a;
        if (parser.stack.env.closing === begin.getName()) {
            delete parser.stack.env.closing;
            var top_1 = parser.stack.Pop();
            var mml = top_1.toMml();
            var spread = top_1.getProperty('spread');
            if (mml.isInferred) {
                try {
                    for (var _b = __values(NodeUtil_js_1.default.getChildren(mml)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        MathtoolsUtil_js_1.MathtoolsUtil.spreadLines(child, spread);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                MathtoolsUtil_js_1.MathtoolsUtil.spreadLines(mml, spread);
            }
            parser.Push(mml);
        }
        else {
            var spread = parser.GetDimen("\\begin{".concat(begin.getName(), "}"));
            begin.setProperty('spread', spread);
            parser.Push(begin);
        }
    },
    Cases: function (parser, begin, open, close, style) {
        var array = parser.itemFactory.create('array').setProperty('casesEnv', begin.getName());
        array.arraydef = {
            rowspacing: '.2em',
            columnspacing: '1em',
            columnalign: 'left'
        };
        if (style === 'D') {
            array.arraydef.displaystyle = true;
        }
        array.setProperties({ open: open, close: close });
        parser.Push(begin);
        return array;
    },
    MathLap: function (parser, name, pos, cramped) {
        var style = parser.GetBrackets(name, '').trim();
        var mml = parser.create('node', 'mstyle', [
            parser.create('node', 'mpadded', [parser.ParseArg(name)], __assign({ width: 0 }, (pos === 'r' ? {} : { lspace: (pos === 'l' ? '-1width' : '-.5width') })))
        ], { 'data-cramped': cramped });
        MathtoolsUtil_js_1.MathtoolsUtil.setDisplayLevel(mml, style);
        parser.Push(parser.create('node', 'TeXAtom', [mml]));
    },
    Cramped: function (parser, name) {
        var style = parser.GetBrackets(name, '').trim();
        var arg = parser.ParseArg(name);
        var mml = parser.create('node', 'mstyle', [arg], { 'data-cramped': true });
        MathtoolsUtil_js_1.MathtoolsUtil.setDisplayLevel(mml, style);
        parser.Push(mml);
    },
    MtLap: function (parser, name, pos) {
        var content = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name), 0);
        var mml = parser.create('node', 'mpadded', content, { width: 0 });
        if (pos !== 'r') {
            NodeUtil_js_1.default.setAttribute(mml, 'lspace', pos === 'l' ? '-1width' : '-.5width');
        }
        parser.Push(mml);
    },
    MathMakeBox: function (parser, name) {
        var width = parser.GetBrackets(name);
        var pos = parser.GetBrackets(name, 'c');
        var mml = parser.create('node', 'mpadded', [parser.ParseArg(name)]);
        if (width) {
            NodeUtil_js_1.default.setAttribute(mml, 'width', width);
        }
        var align = (0, Options_js_1.lookup)(pos, { c: 'center', r: 'right' }, '');
        if (align) {
            NodeUtil_js_1.default.setAttribute(mml, 'data-align', align);
        }
        parser.Push(mml);
    },
    MathMBox: function (parser, name) {
        parser.Push(parser.create('node', 'mrow', [parser.ParseArg(name)]));
    },
    UnderOverBracket: function (parser, name) {
        var thickness = (0, lengths_js_1.length2em)(parser.GetBrackets(name, '.1em'), .1);
        var height = parser.GetBrackets(name, '.2em');
        var arg = parser.GetArgument(name);
        var _a = __read((name.charAt(1) === 'o' ?
            ['over', 'accent', 'bottom'] :
            ['under', 'accentunder', 'top']), 3), pos = _a[0], accent = _a[1], border = _a[2];
        var t = (0, lengths_js_1.em)(thickness);
        var base = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
        var copy = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
        var script = parser.create('node', 'mpadded', [
            parser.create('node', 'mphantom', [copy])
        ], {
            style: "border: ".concat(t, " solid; border-").concat(border, ": none"),
            height: height,
            depth: 0
        });
        var node = ParseUtil_js_1.default.underOver(parser, base, script, pos, true);
        var munderover = NodeUtil_js_1.default.getChildAt(NodeUtil_js_1.default.getChildAt(node, 0), 0);
        NodeUtil_js_1.default.setAttribute(munderover, accent, true);
        parser.Push(node);
    },
    Aboxed: function (parser, name) {
        var top = MathtoolsUtil_js_1.MathtoolsUtil.checkAlignment(parser, name);
        if (top.row.length % 2 === 1) {
            top.row.push(parser.create('node', 'mtd', []));
        }
        var arg = parser.GetArgument(name);
        var rest = parser.string.substr(parser.i);
        parser.string = arg + '&&\\endAboxed';
        parser.i = 0;
        var left = parser.GetUpTo(name, '&');
        var right = parser.GetUpTo(name, '&');
        parser.GetUpTo(name, '\\endAboxed');
        var tex = ParseUtil_js_1.default.substituteArgs(parser, [left, right], '\\rlap{\\boxed{#1{}#2}}\\kern.267em\\phantom{#1}&\\phantom{{}#2}\\kern.267em');
        parser.string = tex + rest;
        parser.i = 0;
    },
    ArrowBetweenLines: function (parser, name) {
        var top = MathtoolsUtil_js_1.MathtoolsUtil.checkAlignment(parser, name);
        if (top.Size() || top.row.length) {
            throw new TexError_js_1.default('BetweenLines', '%1 must be on a row by itself', name);
        }
        var star = parser.GetStar();
        var symbol = parser.GetBrackets(name, '\\Updownarrow');
        if (star) {
            top.EndEntry();
            top.EndEntry();
        }
        var tex = (star ? '\\quad' + symbol : symbol + '\\quad');
        var mml = new TexParser_js_1.default(tex, parser.stack.env, parser.configuration).mml();
        parser.Push(mml);
        top.EndEntry();
        top.EndRow();
    },
    VDotsWithin: function (parser, name) {
        var top = parser.stack.Top();
        var isFlush = (top.getProperty('flushspaceabove') === top.table.length);
        var arg = '\\mmlToken{mi}{}' + parser.GetArgument(name) + '\\mmlToken{mi}{}';
        var base = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
        var mml = parser.create('node', 'mpadded', [
            parser.create('node', 'mpadded', [
                parser.create('node', 'mo', [
                    parser.create('text', '\u22EE')
                ])
            ], __assign({ width: 0, lspace: '-.5width' }, (isFlush ? { height: '-.6em', voffset: '-.18em' } : {}))),
            parser.create('node', 'mphantom', [base])
        ], {
            lspace: '.5width'
        });
        parser.Push(mml);
    },
    ShortVDotsWithin: function (parser, _name) {
        var top = parser.stack.Top();
        var star = parser.GetStar();
        exports.MathtoolsMethods.FlushSpaceAbove(parser, '\\MTFlushSpaceAbove');
        !star && top.EndEntry();
        exports.MathtoolsMethods.VDotsWithin(parser, '\\vdotswithin');
        star && top.EndEntry();
        exports.MathtoolsMethods.FlushSpaceBelow(parser, '\\MTFlushSpaceBelow');
    },
    FlushSpaceAbove: function (parser, name) {
        var top = MathtoolsUtil_js_1.MathtoolsUtil.checkAlignment(parser, name);
        top.setProperty('flushspaceabove', top.table.length);
        top.addRowSpacing('-' + parser.options.mathtools['shortvdotsadjustabove']);
    },
    FlushSpaceBelow: function (parser, name) {
        var top = MathtoolsUtil_js_1.MathtoolsUtil.checkAlignment(parser, name);
        top.Size() && top.EndEntry();
        top.EndRow();
        top.addRowSpacing('-' + parser.options.mathtools['shortvdotsadjustbelow']);
    },
    PairedDelimiters: function (parser, name, open, close, body, n, pre, post) {
        if (body === void 0) { body = '#1'; }
        if (n === void 0) { n = 1; }
        if (pre === void 0) { pre = ''; }
        if (post === void 0) { post = ''; }
        var star = parser.GetStar();
        var size = (star ? '' : parser.GetBrackets(name));
        var _a = __read((star ? ['\\left', '\\right'] : size ? [size + 'l', size + 'r'] : ['', '']), 2), left = _a[0], right = _a[1];
        var delim = (star ? '\\middle' : size || '');
        if (n) {
            var args = [];
            for (var i = args.length; i < n; i++) {
                args.push(parser.GetArgument(name));
            }
            pre = ParseUtil_js_1.default.substituteArgs(parser, args, pre);
            body = ParseUtil_js_1.default.substituteArgs(parser, args, body);
            post = ParseUtil_js_1.default.substituteArgs(parser, args, post);
        }
        body = body.replace(/\\delimsize/g, delim);
        parser.string = [pre, left, open, body, right, close, post, parser.string.substr(parser.i)]
            .reduce(function (s, part) { return ParseUtil_js_1.default.addArgs(parser, s, part); }, '');
        parser.i = 0;
        ParseUtil_js_1.default.checkMaxMacros(parser);
    },
    DeclarePairedDelimiter: function (parser, name) {
        var cs = NewcommandUtil_js_1.default.GetCsNameArgument(parser, name);
        var open = parser.GetArgument(name);
        var close = parser.GetArgument(name);
        MathtoolsUtil_js_1.MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close]);
    },
    DeclarePairedDelimiterX: function (parser, name) {
        var cs = NewcommandUtil_js_1.default.GetCsNameArgument(parser, name);
        var n = NewcommandUtil_js_1.default.GetArgCount(parser, name);
        var open = parser.GetArgument(name);
        var close = parser.GetArgument(name);
        var body = parser.GetArgument(name);
        MathtoolsUtil_js_1.MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close, body, n]);
    },
    DeclarePairedDelimiterXPP: function (parser, name) {
        var cs = NewcommandUtil_js_1.default.GetCsNameArgument(parser, name);
        var n = NewcommandUtil_js_1.default.GetArgCount(parser, name);
        var pre = parser.GetArgument(name);
        var open = parser.GetArgument(name);
        var close = parser.GetArgument(name);
        var post = parser.GetArgument(name);
        var body = parser.GetArgument(name);
        MathtoolsUtil_js_1.MathtoolsUtil.addPairedDelims(parser.configuration, cs, [open, close, body, n, pre, post]);
    },
    CenterColon: function (parser, _name, center, force, thin) {
        if (force === void 0) { force = false; }
        if (thin === void 0) { thin = false; }
        var options = parser.options.mathtools;
        var mml = parser.create('token', 'mo', {}, ':');
        if (center && (options['centercolon'] || force)) {
            var dy = options['centercolon-offset'];
            mml = parser.create('node', 'mpadded', [mml], __assign({ voffset: dy, height: "+".concat(dy), depth: "-".concat(dy) }, (thin ? { width: options['thincolon-dw'], lspace: options['thincolon-dx'] } : {})));
        }
        parser.Push(mml);
    },
    Relation: function (parser, _name, tex, unicode) {
        var options = parser.options.mathtools;
        if (options['use-unicode'] && unicode) {
            parser.Push(parser.create('token', 'mo', { texClass: MmlNode_js_1.TEXCLASS.REL }, unicode));
        }
        else {
            tex = '\\mathrel{' + tex.replace(/:/g, '\\MTThinColon').replace(/-/g, '\\mathrel{-}') + '}';
            parser.string = ParseUtil_js_1.default.addArgs(parser, tex, parser.string.substr(parser.i));
            parser.i = 0;
        }
    },
    NArrow: function (parser, _name, c, dy) {
        parser.Push(parser.create('node', 'TeXAtom', [
            parser.create('token', 'mtext', {}, c),
            parser.create('node', 'mpadded', [
                parser.create('node', 'mpadded', [
                    parser.create('node', 'menclose', [
                        parser.create('node', 'mspace', [], { height: '.2em', depth: 0, width: '.4em' })
                    ], { notation: 'updiagonalstrike', 'data-thickness': '.05em', 'data-padding': 0 })
                ], { width: 0, lspace: '-.5width', voffset: dy }),
                parser.create('node', 'mphantom', [
                    parser.create('token', 'mtext', {}, c)
                ])
            ], { width: 0, lspace: '-.5width' })
        ], { texClass: MmlNode_js_1.TEXCLASS.REL }));
    },
    SplitFrac: function (parser, name, display) {
        var num = parser.ParseArg(name);
        var den = parser.ParseArg(name);
        parser.Push(parser.create('node', 'mstyle', [
            parser.create('node', 'mfrac', [
                parser.create('node', 'mstyle', [
                    num,
                    parser.create('token', 'mi'),
                    parser.create('token', 'mspace', { width: '1em' })
                ], { scriptlevel: 0 }),
                parser.create('node', 'mstyle', [
                    parser.create('token', 'mspace', { width: '1em' }),
                    parser.create('token', 'mi'),
                    den
                ], { scriptlevel: 0 })
            ], { linethickness: 0, numalign: 'left', denomalign: 'right' })
        ], { displaystyle: display, scriptlevel: 0 }));
    },
    XMathStrut: function (parser, name) {
        var dd = parser.GetBrackets(name);
        var dh = parser.GetArgument(name);
        dh = MathtoolsUtil_js_1.MathtoolsUtil.plusOrMinus(name, dh);
        dd = MathtoolsUtil_js_1.MathtoolsUtil.plusOrMinus(name, dd || dh);
        parser.Push(parser.create('node', 'TeXAtom', [
            parser.create('node', 'mpadded', [
                parser.create('node', 'mphantom', [
                    parser.create('token', 'mo', { stretchy: false }, '(')
                ])
            ], { width: 0, height: dh + 'height', depth: dd + 'depth' })
        ], { texClass: MmlNode_js_1.TEXCLASS.ORD }));
    },
    Prescript: function (parser, name) {
        var sup = MathtoolsUtil_js_1.MathtoolsUtil.getScript(parser, name, 'sup');
        var sub = MathtoolsUtil_js_1.MathtoolsUtil.getScript(parser, name, 'sub');
        var base = MathtoolsUtil_js_1.MathtoolsUtil.getScript(parser, name, 'arg');
        if (NodeUtil_js_1.default.isType(sup, 'none') && NodeUtil_js_1.default.isType(sub, 'none')) {
            parser.Push(base);
            return;
        }
        var mml = parser.create('node', 'mmultiscripts', [base]);
        NodeUtil_js_1.default.getChildren(mml).push(null, null);
        NodeUtil_js_1.default.appendChildren(mml, [parser.create('node', 'mprescripts'), sub, sup]);
        mml.setProperty('fixPrescript', true);
        parser.Push(mml);
    },
    NewTagForm: function (parser, name, renew) {
        if (renew === void 0) { renew = false; }
        var tags = parser.tags;
        if (!('mtFormats' in tags)) {
            throw new TexError_js_1.default('TagsNotMT', '%1 can only be used with ams or mathtools tags', name);
        }
        var id = parser.GetArgument(name).trim();
        if (!id) {
            throw new TexError_js_1.default('InvalidTagFormID', 'Tag form name can\'t be empty');
        }
        var format = parser.GetBrackets(name, '');
        var left = parser.GetArgument(name);
        var right = parser.GetArgument(name);
        if (!renew && tags.mtFormats.has(id)) {
            throw new TexError_js_1.default('DuplicateTagForm', 'Duplicate tag form: %1', id);
        }
        tags.mtFormats.set(id, [left, right, format]);
    },
    UseTagForm: function (parser, name) {
        var tags = parser.tags;
        if (!('mtFormats' in tags)) {
            throw new TexError_js_1.default('TagsNotMT', '%1 can only be used with ams or mathtools tags', name);
        }
        var id = parser.GetArgument(name).trim();
        if (!id) {
            tags.mtCurrent = null;
            return;
        }
        if (!tags.mtFormats.has(id)) {
            throw new TexError_js_1.default('UndefinedTagForm', 'Undefined tag form: %1', id);
        }
        tags.mtCurrent = tags.mtFormats.get(id);
    },
    SetOptions: function (parser, name) {
        var e_2, _a;
        var options = parser.options.mathtools;
        if (!options['allow-mathtoolsset']) {
            throw new TexError_js_1.default('ForbiddenMathtoolsSet', '%1 is disabled', name);
        }
        var allowed = {};
        Object.keys(options).forEach(function (id) {
            if (id !== 'pariedDelimiters' && id !== 'tagforms' && id !== 'allow-mathtoolsset') {
                allowed[id] = 1;
            }
        });
        var args = parser.GetArgument(name);
        var keys = ParseUtil_js_1.default.keyvalOptions(args, allowed, true);
        try {
            for (var _b = __values(Object.keys(keys)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var id = _c.value;
                options[id] = keys[id];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    },
    Array: BaseMethods_js_1.default.Array,
    Macro: BaseMethods_js_1.default.Macro,
    xArrow: AmsMethods_js_1.AmsMethods.xArrow,
    HandleRef: AmsMethods_js_1.AmsMethods.HandleRef,
    AmsEqnArray: AmsMethods_js_1.AmsMethods.AmsEqnArray,
    MacroWithTemplate: NewcommandMethods_js_1.default.MacroWithTemplate,
};
//# sourceMappingURL=MathtoolsMethods.js.map