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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sitem = __importStar(require("./BaseItems.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var TexConstants_js_1 = require("../TexConstants.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var Tags_js_1 = require("../Tags.js");
var lengths_js_1 = require("../../../util/lengths.js");
var Entities_js_1 = require("../../../util/Entities.js");
var Options_js_1 = require("../../../util/Options.js");
var BaseMethods = {};
var P_HEIGHT = 1.2 / .85;
var MmlTokenAllow = {
    fontfamily: 1, fontsize: 1, fontweight: 1, fontstyle: 1,
    color: 1, background: 1,
    id: 1, 'class': 1, href: 1, style: 1
};
BaseMethods.Open = function (parser, _c) {
    parser.Push(parser.itemFactory.create('open'));
};
BaseMethods.Close = function (parser, _c) {
    parser.Push(parser.itemFactory.create('close'));
};
BaseMethods.Tilde = function (parser, _c) {
    parser.Push(parser.create('token', 'mtext', {}, Entities_js_1.entities.nbsp));
};
BaseMethods.Space = function (_parser, _c) { };
BaseMethods.Superscript = function (parser, _c) {
    var _a;
    if (parser.GetNext().match(/\d/)) {
        parser.string = parser.string.substr(0, parser.i + 1) +
            ' ' + parser.string.substr(parser.i + 1);
    }
    var primes;
    var base;
    var top = parser.stack.Top();
    if (top.isKind('prime')) {
        _a = __read(top.Peek(2), 2), base = _a[0], primes = _a[1];
        parser.stack.Pop();
    }
    else {
        base = parser.stack.Prev();
        if (!base) {
            base = parser.create('token', 'mi', {}, '');
        }
    }
    var movesupsub = NodeUtil_js_1.default.getProperty(base, 'movesupsub');
    var position = NodeUtil_js_1.default.isType(base, 'msubsup') ? base.sup :
        base.over;
    if ((NodeUtil_js_1.default.isType(base, 'msubsup') && !NodeUtil_js_1.default.isType(base, 'msup') &&
        NodeUtil_js_1.default.getChildAt(base, base.sup)) ||
        (NodeUtil_js_1.default.isType(base, 'munderover') && !NodeUtil_js_1.default.isType(base, 'mover') &&
            NodeUtil_js_1.default.getChildAt(base, base.over) &&
            !NodeUtil_js_1.default.getProperty(base, 'subsupOK'))) {
        throw new TexError_js_1.default('DoubleExponent', 'Double exponent: use braces to clarify');
    }
    if (!NodeUtil_js_1.default.isType(base, 'msubsup') || NodeUtil_js_1.default.isType(base, 'msup')) {
        if (movesupsub) {
            if (!NodeUtil_js_1.default.isType(base, 'munderover') || NodeUtil_js_1.default.isType(base, 'mover') ||
                NodeUtil_js_1.default.getChildAt(base, base.over)) {
                base = parser.create('node', 'munderover', [base], { movesupsub: true });
            }
            position = base.over;
        }
        else {
            base = parser.create('node', 'msubsup', [base]);
            position = base.sup;
        }
    }
    parser.Push(parser.itemFactory.create('subsup', base).setProperties({
        position: position, primes: primes, movesupsub: movesupsub
    }));
};
BaseMethods.Subscript = function (parser, _c) {
    var _a;
    if (parser.GetNext().match(/\d/)) {
        parser.string =
            parser.string.substr(0, parser.i + 1) + ' ' +
                parser.string.substr(parser.i + 1);
    }
    var primes, base;
    var top = parser.stack.Top();
    if (top.isKind('prime')) {
        _a = __read(top.Peek(2), 2), base = _a[0], primes = _a[1];
        parser.stack.Pop();
    }
    else {
        base = parser.stack.Prev();
        if (!base) {
            base = parser.create('token', 'mi', {}, '');
        }
    }
    var movesupsub = NodeUtil_js_1.default.getProperty(base, 'movesupsub');
    var position = NodeUtil_js_1.default.isType(base, 'msubsup') ?
        base.sub : base.under;
    if ((NodeUtil_js_1.default.isType(base, 'msubsup') && !NodeUtil_js_1.default.isType(base, 'msup') &&
        NodeUtil_js_1.default.getChildAt(base, base.sub)) ||
        (NodeUtil_js_1.default.isType(base, 'munderover') && !NodeUtil_js_1.default.isType(base, 'mover') &&
            NodeUtil_js_1.default.getChildAt(base, base.under) &&
            !NodeUtil_js_1.default.getProperty(base, 'subsupOK'))) {
        throw new TexError_js_1.default('DoubleSubscripts', 'Double subscripts: use braces to clarify');
    }
    if (!NodeUtil_js_1.default.isType(base, 'msubsup') || NodeUtil_js_1.default.isType(base, 'msup')) {
        if (movesupsub) {
            if (!NodeUtil_js_1.default.isType(base, 'munderover') || NodeUtil_js_1.default.isType(base, 'mover') ||
                NodeUtil_js_1.default.getChildAt(base, base.under)) {
                base = parser.create('node', 'munderover', [base], { movesupsub: true });
            }
            position = base.under;
        }
        else {
            base = parser.create('node', 'msubsup', [base]);
            position = base.sub;
        }
    }
    parser.Push(parser.itemFactory.create('subsup', base).setProperties({
        position: position, primes: primes, movesupsub: movesupsub
    }));
};
BaseMethods.Prime = function (parser, c) {
    var base = parser.stack.Prev();
    if (!base) {
        base = parser.create('node', 'mi');
    }
    if (NodeUtil_js_1.default.isType(base, 'msubsup') && !NodeUtil_js_1.default.isType(base, 'msup') &&
        NodeUtil_js_1.default.getChildAt(base, base.sup)) {
        throw new TexError_js_1.default('DoubleExponentPrime', 'Prime causes double exponent: use braces to clarify');
    }
    var sup = '';
    parser.i--;
    do {
        sup += Entities_js_1.entities.prime;
        parser.i++, c = parser.GetNext();
    } while (c === '\'' || c === Entities_js_1.entities.rsquo);
    sup = ['', '\u2032', '\u2033', '\u2034', '\u2057'][sup.length] || sup;
    var node = parser.create('token', 'mo', { variantForm: true }, sup);
    parser.Push(parser.itemFactory.create('prime', base, node));
};
BaseMethods.Comment = function (parser, _c) {
    while (parser.i < parser.string.length && parser.string.charAt(parser.i) !== '\n') {
        parser.i++;
    }
};
BaseMethods.Hash = function (_parser, _c) {
    throw new TexError_js_1.default('CantUseHash1', 'You can\'t use \'macro parameter character #\' in math mode');
};
BaseMethods.MathFont = function (parser, name, variant) {
    var text = parser.GetArgument(name);
    var mml = new TexParser_js_1.default(text, __assign(__assign({}, parser.stack.env), { font: variant, multiLetterIdentifiers: /^[a-zA-Z]+/, noAutoOP: true }), parser.configuration).mml();
    parser.Push(parser.create('node', 'TeXAtom', [mml]));
};
BaseMethods.SetFont = function (parser, _name, font) {
    parser.stack.env['font'] = font;
};
BaseMethods.SetStyle = function (parser, _name, texStyle, style, level) {
    parser.stack.env['style'] = texStyle;
    parser.stack.env['level'] = level;
    parser.Push(parser.itemFactory.create('style').setProperty('styles', { displaystyle: style, scriptlevel: level }));
};
BaseMethods.SetSize = function (parser, _name, size) {
    parser.stack.env['size'] = size;
    parser.Push(parser.itemFactory.create('style').setProperty('styles', { mathsize: (0, lengths_js_1.em)(size) }));
};
BaseMethods.Spacer = function (parser, _name, space) {
    var node = parser.create('node', 'mspace', [], { width: (0, lengths_js_1.em)(space) });
    var style = parser.create('node', 'mstyle', [node], { scriptlevel: 0 });
    parser.Push(style);
};
BaseMethods.LeftRight = function (parser, name) {
    var first = name.substr(1);
    parser.Push(parser.itemFactory.create(first, parser.GetDelimiter(name), parser.stack.env.color));
};
BaseMethods.NamedFn = function (parser, name, id) {
    if (!id) {
        id = name.substr(1);
    }
    var mml = parser.create('token', 'mi', { texClass: MmlNode_js_1.TEXCLASS.OP }, id);
    parser.Push(parser.itemFactory.create('fn', mml));
};
BaseMethods.NamedOp = function (parser, name, id) {
    if (!id) {
        id = name.substr(1);
    }
    id = id.replace(/&thinsp;/, '\u2006');
    var mml = parser.create('token', 'mo', {
        movablelimits: true,
        movesupsub: true,
        form: TexConstants_js_1.TexConstant.Form.PREFIX,
        texClass: MmlNode_js_1.TEXCLASS.OP
    }, id);
    parser.Push(mml);
};
BaseMethods.Limits = function (parser, _name, limits) {
    var op = parser.stack.Prev(true);
    if (!op || (NodeUtil_js_1.default.getTexClass(NodeUtil_js_1.default.getCoreMO(op)) !== MmlNode_js_1.TEXCLASS.OP &&
        NodeUtil_js_1.default.getProperty(op, 'movesupsub') == null)) {
        throw new TexError_js_1.default('MisplacedLimits', '%1 is allowed only on operators', parser.currentCS);
    }
    var top = parser.stack.Top();
    var node;
    if (NodeUtil_js_1.default.isType(op, 'munderover') && !limits) {
        node = parser.create('node', 'msubsup');
        NodeUtil_js_1.default.copyChildren(op, node);
        op = top.Last = node;
    }
    else if (NodeUtil_js_1.default.isType(op, 'msubsup') && limits) {
        node = parser.create('node', 'munderover');
        NodeUtil_js_1.default.copyChildren(op, node);
        op = top.Last = node;
    }
    NodeUtil_js_1.default.setProperty(op, 'movesupsub', limits ? true : false);
    NodeUtil_js_1.default.setProperties(NodeUtil_js_1.default.getCoreMO(op), { 'movablelimits': false });
    if (NodeUtil_js_1.default.getAttribute(op, 'movablelimits') ||
        NodeUtil_js_1.default.getProperty(op, 'movablelimits')) {
        NodeUtil_js_1.default.setProperties(op, { 'movablelimits': false });
    }
};
BaseMethods.Over = function (parser, name, open, close) {
    var mml = parser.itemFactory.create('over').setProperty('name', parser.currentCS);
    if (open || close) {
        mml.setProperty('open', open);
        mml.setProperty('close', close);
    }
    else if (name.match(/withdelims$/)) {
        mml.setProperty('open', parser.GetDelimiter(name));
        mml.setProperty('close', parser.GetDelimiter(name));
    }
    if (name.match(/^\\above/)) {
        mml.setProperty('thickness', parser.GetDimen(name));
    }
    else if (name.match(/^\\atop/) || open || close) {
        mml.setProperty('thickness', 0);
    }
    parser.Push(mml);
};
BaseMethods.Frac = function (parser, name) {
    var num = parser.ParseArg(name);
    var den = parser.ParseArg(name);
    var node = parser.create('node', 'mfrac', [num, den]);
    parser.Push(node);
};
BaseMethods.Sqrt = function (parser, name) {
    var n = parser.GetBrackets(name);
    var arg = parser.GetArgument(name);
    if (arg === '\\frac') {
        arg += '{' + parser.GetArgument(arg) + '}{' + parser.GetArgument(arg) + '}';
    }
    var mml = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
    if (!n) {
        mml = parser.create('node', 'msqrt', [mml]);
    }
    else {
        mml = parser.create('node', 'mroot', [mml, parseRoot(parser, n)]);
    }
    parser.Push(mml);
};
function parseRoot(parser, n) {
    var env = parser.stack.env;
    var inRoot = env['inRoot'];
    env['inRoot'] = true;
    var newParser = new TexParser_js_1.default(n, env, parser.configuration);
    var node = newParser.mml();
    var global = newParser.stack.global;
    if (global['leftRoot'] || global['upRoot']) {
        var def = {};
        if (global['leftRoot']) {
            def['width'] = global['leftRoot'];
        }
        if (global['upRoot']) {
            def['voffset'] = global['upRoot'];
            def['height'] = global['upRoot'];
        }
        node = parser.create('node', 'mpadded', [node], def);
    }
    env['inRoot'] = inRoot;
    return node;
}
BaseMethods.Root = function (parser, name) {
    var n = parser.GetUpTo(name, '\\of');
    var arg = parser.ParseArg(name);
    var node = parser.create('node', 'mroot', [arg, parseRoot(parser, n)]);
    parser.Push(node);
};
BaseMethods.MoveRoot = function (parser, name, id) {
    if (!parser.stack.env['inRoot']) {
        throw new TexError_js_1.default('MisplacedMoveRoot', '%1 can appear only within a root', parser.currentCS);
    }
    if (parser.stack.global[id]) {
        throw new TexError_js_1.default('MultipleMoveRoot', 'Multiple use of %1', parser.currentCS);
    }
    var n = parser.GetArgument(name);
    if (!n.match(/-?[0-9]+/)) {
        throw new TexError_js_1.default('IntegerArg', 'The argument to %1 must be an integer', parser.currentCS);
    }
    n = (parseInt(n, 10) / 15) + 'em';
    if (n.substr(0, 1) !== '-') {
        n = '+' + n;
    }
    parser.stack.global[id] = n;
};
BaseMethods.Accent = function (parser, name, accent, stretchy) {
    var c = parser.ParseArg(name);
    var def = __assign(__assign({}, ParseUtil_js_1.default.getFontDef(parser)), { accent: true, mathaccent: true });
    var entity = NodeUtil_js_1.default.createEntity(accent);
    var moNode = parser.create('token', 'mo', def, entity);
    var mml = moNode;
    NodeUtil_js_1.default.setAttribute(mml, 'stretchy', stretchy ? true : false);
    var mo = (NodeUtil_js_1.default.isEmbellished(c) ? NodeUtil_js_1.default.getCoreMO(c) : c);
    if (NodeUtil_js_1.default.isType(mo, 'mo') || NodeUtil_js_1.default.getProperty(mo, 'movablelimits')) {
        NodeUtil_js_1.default.setProperties(mo, { 'movablelimits': false });
    }
    var muoNode = parser.create('node', 'munderover');
    NodeUtil_js_1.default.setChild(muoNode, 0, c);
    NodeUtil_js_1.default.setChild(muoNode, 1, null);
    NodeUtil_js_1.default.setChild(muoNode, 2, mml);
    var texAtom = parser.create('node', 'TeXAtom', [muoNode]);
    parser.Push(texAtom);
};
BaseMethods.UnderOver = function (parser, name, c, stack) {
    var entity = NodeUtil_js_1.default.createEntity(c);
    var mo = parser.create('token', 'mo', { stretchy: true, accent: true }, entity);
    var pos = (name.charAt(1) === 'o' ? 'over' : 'under');
    var base = parser.ParseArg(name);
    parser.Push(ParseUtil_js_1.default.underOver(parser, base, mo, pos, stack));
};
BaseMethods.Overset = function (parser, name) {
    var top = parser.ParseArg(name);
    var base = parser.ParseArg(name);
    ParseUtil_js_1.default.checkMovableLimits(base);
    if (top.isKind('mo')) {
        NodeUtil_js_1.default.setAttribute(top, 'accent', false);
    }
    var node = parser.create('node', 'mover', [base, top]);
    parser.Push(node);
};
BaseMethods.Underset = function (parser, name) {
    var bot = parser.ParseArg(name);
    var base = parser.ParseArg(name);
    ParseUtil_js_1.default.checkMovableLimits(base);
    if (bot.isKind('mo')) {
        NodeUtil_js_1.default.setAttribute(bot, 'accent', false);
    }
    var node = parser.create('node', 'munder', [base, bot], { accentunder: false });
    parser.Push(node);
};
BaseMethods.Overunderset = function (parser, name) {
    var top = parser.ParseArg(name);
    var bot = parser.ParseArg(name);
    var base = parser.ParseArg(name);
    ParseUtil_js_1.default.checkMovableLimits(base);
    if (top.isKind('mo')) {
        NodeUtil_js_1.default.setAttribute(top, 'accent', false);
    }
    if (bot.isKind('mo')) {
        NodeUtil_js_1.default.setAttribute(bot, 'accent', false);
    }
    var node = parser.create('node', 'munderover', [base, bot, top], { accent: false, accentunder: false });
    parser.Push(node);
};
BaseMethods.TeXAtom = function (parser, name, mclass) {
    var def = { texClass: mclass };
    var mml;
    var node;
    var parsed;
    if (mclass === MmlNode_js_1.TEXCLASS.OP) {
        def['movesupsub'] = def['movablelimits'] = true;
        var arg = parser.GetArgument(name);
        var match = arg.match(/^\s*\\rm\s+([a-zA-Z0-9 ]+)$/);
        if (match) {
            def['mathvariant'] = TexConstants_js_1.TexConstant.Variant.NORMAL;
            node = parser.create('token', 'mi', def, match[1]);
        }
        else {
            parsed = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
            node = parser.create('node', 'TeXAtom', [parsed], def);
        }
        mml = parser.itemFactory.create('fn', node);
    }
    else {
        parsed = parser.ParseArg(name);
        mml = parser.create('node', 'TeXAtom', [parsed], def);
    }
    parser.Push(mml);
};
BaseMethods.MmlToken = function (parser, name) {
    var kind = parser.GetArgument(name);
    var attr = parser.GetBrackets(name, '').replace(/^\s+/, '');
    var text = parser.GetArgument(name);
    var def = {};
    var keep = [];
    var node;
    try {
        node = parser.create('node', kind);
    }
    catch (e) {
        node = null;
    }
    if (!node || !node.isToken) {
        throw new TexError_js_1.default('NotMathMLToken', '%1 is not a token element', kind);
    }
    while (attr !== '') {
        var match = attr.match(/^([a-z]+)\s*=\s*('[^']*'|"[^"]*"|[^ ,]*)\s*,?\s*/i);
        if (!match) {
            throw new TexError_js_1.default('InvalidMathMLAttr', 'Invalid MathML attribute: %1', attr);
        }
        if (!node.attributes.hasDefault(match[1]) && !MmlTokenAllow[match[1]]) {
            throw new TexError_js_1.default('UnknownAttrForElement', '%1 is not a recognized attribute for %2', match[1], kind);
        }
        var value = ParseUtil_js_1.default.MmlFilterAttribute(parser, match[1], match[2].replace(/^(['"])(.*)\1$/, '$2'));
        if (value) {
            if (value.toLowerCase() === 'true') {
                value = true;
            }
            else if (value.toLowerCase() === 'false') {
                value = false;
            }
            def[match[1]] = value;
            keep.push(match[1]);
        }
        attr = attr.substr(match[0].length);
    }
    if (keep.length) {
        def['mjx-keep-attrs'] = keep.join(' ');
    }
    var textNode = parser.create('text', text);
    node.appendChild(textNode);
    NodeUtil_js_1.default.setProperties(node, def);
    parser.Push(node);
};
BaseMethods.Strut = function (parser, _name) {
    var row = parser.create('node', 'mrow');
    var padded = parser.create('node', 'mpadded', [row], { height: '8.6pt', depth: '3pt', width: 0 });
    parser.Push(padded);
};
BaseMethods.Phantom = function (parser, name, v, h) {
    var box = parser.create('node', 'mphantom', [parser.ParseArg(name)]);
    if (v || h) {
        box = parser.create('node', 'mpadded', [box]);
        if (h) {
            NodeUtil_js_1.default.setAttribute(box, 'height', 0);
            NodeUtil_js_1.default.setAttribute(box, 'depth', 0);
        }
        if (v) {
            NodeUtil_js_1.default.setAttribute(box, 'width', 0);
        }
    }
    var atom = parser.create('node', 'TeXAtom', [box]);
    parser.Push(atom);
};
BaseMethods.Smash = function (parser, name) {
    var bt = ParseUtil_js_1.default.trimSpaces(parser.GetBrackets(name, ''));
    var smash = parser.create('node', 'mpadded', [parser.ParseArg(name)]);
    switch (bt) {
        case 'b':
            NodeUtil_js_1.default.setAttribute(smash, 'depth', 0);
            break;
        case 't':
            NodeUtil_js_1.default.setAttribute(smash, 'height', 0);
            break;
        default:
            NodeUtil_js_1.default.setAttribute(smash, 'height', 0);
            NodeUtil_js_1.default.setAttribute(smash, 'depth', 0);
    }
    var atom = parser.create('node', 'TeXAtom', [smash]);
    parser.Push(atom);
};
BaseMethods.Lap = function (parser, name) {
    var mml = parser.create('node', 'mpadded', [parser.ParseArg(name)], { width: 0 });
    if (name === '\\llap') {
        NodeUtil_js_1.default.setAttribute(mml, 'lspace', '-1width');
    }
    var atom = parser.create('node', 'TeXAtom', [mml]);
    parser.Push(atom);
};
BaseMethods.RaiseLower = function (parser, name) {
    var h = parser.GetDimen(name);
    var item = parser.itemFactory.create('position').setProperties({ name: parser.currentCS, move: 'vertical' });
    if (h.charAt(0) === '-') {
        h = h.slice(1);
        name = name.substr(1) === 'raise' ? '\\lower' : '\\raise';
    }
    if (name === '\\lower') {
        item.setProperty('dh', '-' + h);
        item.setProperty('dd', '+' + h);
    }
    else {
        item.setProperty('dh', '+' + h);
        item.setProperty('dd', '-' + h);
    }
    parser.Push(item);
};
BaseMethods.MoveLeftRight = function (parser, name) {
    var h = parser.GetDimen(name);
    var nh = (h.charAt(0) === '-' ? h.slice(1) : '-' + h);
    if (name === '\\moveleft') {
        var tmp = h;
        h = nh;
        nh = tmp;
    }
    parser.Push(parser.itemFactory.create('position').setProperties({
        name: parser.currentCS, move: 'horizontal',
        left: parser.create('node', 'mspace', [], { width: h }),
        right: parser.create('node', 'mspace', [], { width: nh })
    }));
};
BaseMethods.Hskip = function (parser, name) {
    var node = parser.create('node', 'mspace', [], { width: parser.GetDimen(name) });
    parser.Push(node);
};
BaseMethods.Nonscript = function (parser, _name) {
    parser.Push(parser.itemFactory.create('nonscript'));
};
BaseMethods.Rule = function (parser, name, style) {
    var w = parser.GetDimen(name), h = parser.GetDimen(name), d = parser.GetDimen(name);
    var def = { width: w, height: h, depth: d };
    if (style !== 'blank') {
        def['mathbackground'] = (parser.stack.env['color'] || 'black');
    }
    var node = parser.create('node', 'mspace', [], def);
    parser.Push(node);
};
BaseMethods.rule = function (parser, name) {
    var v = parser.GetBrackets(name), w = parser.GetDimen(name), h = parser.GetDimen(name);
    var mml = parser.create('node', 'mspace', [], {
        width: w, height: h,
        mathbackground: (parser.stack.env['color'] || 'black')
    });
    if (v) {
        mml = parser.create('node', 'mpadded', [mml], { voffset: v });
        if (v.match(/^\-/)) {
            NodeUtil_js_1.default.setAttribute(mml, 'height', v);
            NodeUtil_js_1.default.setAttribute(mml, 'depth', '+' + v.substr(1));
        }
        else {
            NodeUtil_js_1.default.setAttribute(mml, 'height', '+' + v);
        }
    }
    parser.Push(mml);
};
BaseMethods.MakeBig = function (parser, name, mclass, size) {
    size *= P_HEIGHT;
    var sizeStr = String(size).replace(/(\.\d\d\d).+/, '$1') + 'em';
    var delim = parser.GetDelimiter(name, true);
    var mo = parser.create('token', 'mo', {
        minsize: sizeStr, maxsize: sizeStr,
        fence: true, stretchy: true, symmetric: true
    }, delim);
    var node = parser.create('node', 'TeXAtom', [mo], { texClass: mclass });
    parser.Push(node);
};
BaseMethods.BuildRel = function (parser, name) {
    var top = parser.ParseUpTo(name, '\\over');
    var bot = parser.ParseArg(name);
    var node = parser.create('node', 'munderover');
    NodeUtil_js_1.default.setChild(node, 0, bot);
    NodeUtil_js_1.default.setChild(node, 1, null);
    NodeUtil_js_1.default.setChild(node, 2, top);
    var atom = parser.create('node', 'TeXAtom', [node], { texClass: MmlNode_js_1.TEXCLASS.REL });
    parser.Push(atom);
};
BaseMethods.HBox = function (parser, name, style, font) {
    parser.PushAll(ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name), style, font));
};
BaseMethods.FBox = function (parser, name) {
    var internal = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var node = parser.create('node', 'menclose', internal, { notation: 'box' });
    parser.Push(node);
};
BaseMethods.FrameBox = function (parser, name) {
    var width = parser.GetBrackets(name);
    var pos = parser.GetBrackets(name) || 'c';
    var mml = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    if (width) {
        mml = [parser.create('node', 'mpadded', mml, {
                width: width,
                'data-align': (0, Options_js_1.lookup)(pos, { l: 'left', r: 'right' }, 'center')
            })];
    }
    var node = parser.create('node', 'TeXAtom', [parser.create('node', 'menclose', mml, { notation: 'box' })], { texClass: MmlNode_js_1.TEXCLASS.ORD });
    parser.Push(node);
};
BaseMethods.Not = function (parser, _name) {
    parser.Push(parser.itemFactory.create('not'));
};
BaseMethods.Dots = function (parser, _name) {
    var ldotsEntity = NodeUtil_js_1.default.createEntity('2026');
    var cdotsEntity = NodeUtil_js_1.default.createEntity('22EF');
    var ldots = parser.create('token', 'mo', { stretchy: false }, ldotsEntity);
    var cdots = parser.create('token', 'mo', { stretchy: false }, cdotsEntity);
    parser.Push(parser.itemFactory.create('dots').setProperties({
        ldots: ldots,
        cdots: cdots
    }));
};
BaseMethods.Matrix = function (parser, _name, open, close, align, spacing, vspacing, style, cases, numbered) {
    var c = parser.GetNext();
    if (c === '') {
        throw new TexError_js_1.default('MissingArgFor', 'Missing argument for %1', parser.currentCS);
    }
    if (c === '{') {
        parser.i++;
    }
    else {
        parser.string = c + '}' + parser.string.slice(parser.i + 1);
        parser.i = 0;
    }
    var array = parser.itemFactory.create('array').setProperty('requireClose', true);
    array.arraydef = {
        rowspacing: (vspacing || '4pt'),
        columnspacing: (spacing || '1em')
    };
    if (cases) {
        array.setProperty('isCases', true);
    }
    if (numbered) {
        array.setProperty('isNumbered', true);
        array.arraydef.side = numbered;
    }
    if (open || close) {
        array.setProperty('open', open);
        array.setProperty('close', close);
    }
    if (style === 'D') {
        array.arraydef.displaystyle = true;
    }
    if (align != null) {
        array.arraydef.columnalign = align;
    }
    parser.Push(array);
};
BaseMethods.Entry = function (parser, name) {
    parser.Push(parser.itemFactory.create('cell').setProperties({ isEntry: true, name: name }));
    var top = parser.stack.Top();
    var env = top.getProperty('casesEnv');
    var cases = top.getProperty('isCases');
    if (!cases && !env)
        return;
    var str = parser.string;
    var braces = 0, close = -1, i = parser.i, m = str.length;
    var end = (env ? new RegExp("^\\\\end\\s*\\{".concat(env.replace(/\*/, '\\*'), "\\}")) : null);
    while (i < m) {
        var c = str.charAt(i);
        if (c === '{') {
            braces++;
            i++;
        }
        else if (c === '}') {
            if (braces === 0) {
                m = 0;
            }
            else {
                braces--;
                if (braces === 0 && close < 0) {
                    close = i - parser.i;
                }
                i++;
            }
        }
        else if (c === '&' && braces === 0) {
            throw new TexError_js_1.default('ExtraAlignTab', 'Extra alignment tab in \\cases text');
        }
        else if (c === '\\') {
            var rest = str.substr(i);
            if (rest.match(/^((\\cr)[^a-zA-Z]|\\\\)/) || (end && rest.match(end))) {
                m = 0;
            }
            else {
                i += 2;
            }
        }
        else {
            i++;
        }
    }
    var text = str.substr(parser.i, i - parser.i);
    if (!text.match(/^\s*\\text[^a-zA-Z]/) || close !== text.replace(/\s+$/, '').length - 1) {
        var internal = ParseUtil_js_1.default.internalMath(parser, ParseUtil_js_1.default.trimSpaces(text), 0);
        parser.PushAll(internal);
        parser.i = i;
    }
};
BaseMethods.Cr = function (parser, name) {
    parser.Push(parser.itemFactory.create('cell').setProperties({ isCR: true, name: name }));
};
BaseMethods.CrLaTeX = function (parser, name, nobrackets) {
    if (nobrackets === void 0) { nobrackets = false; }
    var n;
    if (!nobrackets) {
        if (parser.string.charAt(parser.i) === '*') {
            parser.i++;
        }
        if (parser.string.charAt(parser.i) === '[') {
            var dim = parser.GetBrackets(name, '');
            var _a = __read(ParseUtil_js_1.default.matchDimen(dim), 2), value = _a[0], unit = _a[1];
            if (dim && !value) {
                throw new TexError_js_1.default('BracketMustBeDimension', 'Bracket argument to %1 must be a dimension', parser.currentCS);
            }
            n = value + unit;
        }
    }
    parser.Push(parser.itemFactory.create('cell').setProperties({ isCR: true, name: name, linebreak: true }));
    var top = parser.stack.Top();
    var node;
    if (top instanceof sitem.ArrayItem) {
        if (n) {
            top.addRowSpacing(n);
        }
    }
    else {
        if (n) {
            node = parser.create('node', 'mspace', [], { depth: n });
            parser.Push(node);
        }
        node = parser.create('node', 'mspace', [], { linebreak: TexConstants_js_1.TexConstant.LineBreak.NEWLINE });
        parser.Push(node);
    }
};
BaseMethods.HLine = function (parser, _name, style) {
    if (style == null) {
        style = 'solid';
    }
    var top = parser.stack.Top();
    if (!(top instanceof sitem.ArrayItem) || top.Size()) {
        throw new TexError_js_1.default('Misplaced', 'Misplaced %1', parser.currentCS);
    }
    if (!top.table.length) {
        top.frame.push('top');
    }
    else {
        var lines = (top.arraydef['rowlines'] ? top.arraydef['rowlines'].split(/ /) : []);
        while (lines.length < top.table.length) {
            lines.push('none');
        }
        lines[top.table.length - 1] = style;
        top.arraydef['rowlines'] = lines.join(' ');
    }
};
BaseMethods.HFill = function (parser, _name) {
    var top = parser.stack.Top();
    if (top instanceof sitem.ArrayItem) {
        top.hfill.push(top.Size());
    }
    else {
        throw new TexError_js_1.default('UnsupportedHFill', 'Unsupported use of %1', parser.currentCS);
    }
};
BaseMethods.BeginEnd = function (parser, name) {
    var env = parser.GetArgument(name);
    if (env.match(/\\/i)) {
        throw new TexError_js_1.default('InvalidEnv', 'Invalid environment name \'%1\'', env);
    }
    var macro = parser.configuration.handlers.get('environment').lookup(env);
    if (macro && name === '\\end') {
        if (!macro.args[0]) {
            var mml = parser.itemFactory.create('end').setProperty('name', env);
            parser.Push(mml);
            return;
        }
        parser.stack.env['closing'] = env;
    }
    ParseUtil_js_1.default.checkMaxMacros(parser, false);
    parser.parse('environment', [parser, env]);
};
BaseMethods.Array = function (parser, begin, open, close, align, spacing, vspacing, style, raggedHeight) {
    if (!align) {
        align = parser.GetArgument('\\begin{' + begin.getName() + '}');
    }
    var lines = ('c' + align).replace(/[^clr|:]/g, '').replace(/[^|:]([|:])+/g, '$1');
    align = align.replace(/[^clr]/g, '').split('').join(' ');
    align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
    var array = parser.itemFactory.create('array');
    array.arraydef = {
        columnalign: align,
        columnspacing: (spacing || '1em'),
        rowspacing: (vspacing || '4pt')
    };
    if (lines.match(/[|:]/)) {
        if (lines.charAt(0).match(/[|:]/)) {
            array.frame.push('left');
            array.dashed = lines.charAt(0) === ':';
        }
        if (lines.charAt(lines.length - 1).match(/[|:]/)) {
            array.frame.push('right');
        }
        lines = lines.substr(1, lines.length - 2);
        array.arraydef.columnlines =
            lines.split('').join(' ').replace(/[^|: ]/g, 'none').replace(/\|/g, 'solid').replace(/:/g, 'dashed');
    }
    if (open) {
        array.setProperty('open', parser.convertDelimiter(open));
    }
    if (close) {
        array.setProperty('close', parser.convertDelimiter(close));
    }
    if ((style || '').charAt(1) === '\'') {
        array.arraydef['data-cramped'] = true;
        style = style.charAt(0);
    }
    if (style === 'D') {
        array.arraydef['displaystyle'] = true;
    }
    else if (style) {
        array.arraydef['displaystyle'] = false;
    }
    if (style === 'S') {
        array.arraydef['scriptlevel'] = 1;
    }
    if (raggedHeight) {
        array.arraydef['useHeight'] = false;
    }
    parser.Push(begin);
    return array;
};
BaseMethods.AlignedArray = function (parser, begin) {
    var align = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    var item = BaseMethods.Array(parser, begin);
    return ParseUtil_js_1.default.setArrayAlign(item, align);
};
BaseMethods.Equation = function (parser, begin, numbered) {
    parser.Push(begin);
    ParseUtil_js_1.default.checkEqnEnv(parser);
    return parser.itemFactory.create('equation', numbered).
        setProperty('name', begin.getName());
};
BaseMethods.EqnArray = function (parser, begin, numbered, taggable, align, spacing) {
    parser.Push(begin);
    if (taggable) {
        ParseUtil_js_1.default.checkEqnEnv(parser);
    }
    align = align.replace(/[^clr]/g, '').split('').join(' ');
    align = align.replace(/l/g, 'left').replace(/r/g, 'right').replace(/c/g, 'center');
    var newItem = parser.itemFactory.create('eqnarray', begin.getName(), numbered, taggable, parser.stack.global);
    newItem.arraydef = {
        displaystyle: true,
        columnalign: align,
        columnspacing: (spacing || '1em'),
        rowspacing: '3pt',
        side: parser.options['tagSide'],
        minlabelspacing: parser.options['tagIndent']
    };
    return newItem;
};
BaseMethods.HandleNoTag = function (parser, _name) {
    parser.tags.notag();
};
BaseMethods.HandleLabel = function (parser, name) {
    var label = parser.GetArgument(name);
    if (label === '') {
        return;
    }
    if (!parser.tags.refUpdate) {
        if (parser.tags.label) {
            throw new TexError_js_1.default('MultipleCommand', 'Multiple %1', parser.currentCS);
        }
        parser.tags.label = label;
        if ((parser.tags.allLabels[label] || parser.tags.labels[label]) && !parser.options['ignoreDuplicateLabels']) {
            throw new TexError_js_1.default('MultipleLabel', 'Label \'%1\' multiply defined', label);
        }
        parser.tags.labels[label] = new Tags_js_1.Label();
    }
};
BaseMethods.HandleRef = function (parser, name, eqref) {
    var label = parser.GetArgument(name);
    var ref = parser.tags.allLabels[label] || parser.tags.labels[label];
    if (!ref) {
        if (!parser.tags.refUpdate) {
            parser.tags.redo = true;
        }
        ref = new Tags_js_1.Label();
    }
    var tag = ref.tag;
    if (eqref) {
        tag = parser.tags.formatTag(tag);
    }
    var node = parser.create('node', 'mrow', ParseUtil_js_1.default.internalMath(parser, tag), {
        href: parser.tags.formatUrl(ref.id, parser.options.baseURL), 'class': 'MathJax_ref'
    });
    parser.Push(node);
};
BaseMethods.Macro = function (parser, name, macro, argcount, def) {
    if (argcount) {
        var args = [];
        if (def != null) {
            var optional = parser.GetBrackets(name);
            args.push(optional == null ? def : optional);
        }
        for (var i = args.length; i < argcount; i++) {
            args.push(parser.GetArgument(name));
        }
        macro = ParseUtil_js_1.default.substituteArgs(parser, args, macro);
    }
    parser.string = ParseUtil_js_1.default.addArgs(parser, macro, parser.string.slice(parser.i));
    parser.i = 0;
    ParseUtil_js_1.default.checkMaxMacros(parser);
};
BaseMethods.MathChoice = function (parser, name) {
    var D = parser.ParseArg(name);
    var T = parser.ParseArg(name);
    var S = parser.ParseArg(name);
    var SS = parser.ParseArg(name);
    parser.Push(parser.create('node', 'MathChoice', [D, T, S, SS]));
};
exports.default = BaseMethods;
//# sourceMappingURL=BaseMethods.js.map