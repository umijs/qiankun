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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEW_OPS = exports.AmsMethods = void 0;
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var ParseMethods_js_1 = __importDefault(require("../ParseMethods.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var TexConstants_js_1 = require("../TexConstants.js");
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var Symbol_js_1 = require("../Symbol.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
exports.AmsMethods = {};
exports.AmsMethods.AmsEqnArray = function (parser, begin, numbered, taggable, align, spacing, style) {
    var args = parser.GetBrackets('\\begin{' + begin.getName() + '}');
    var array = BaseMethods_js_1.default.EqnArray(parser, begin, numbered, taggable, align, spacing, style);
    return ParseUtil_js_1.default.setArrayAlign(array, args);
};
exports.AmsMethods.AlignAt = function (parser, begin, numbered, taggable) {
    var name = begin.getName();
    var n, valign, align = '', spacing = [];
    if (!taggable) {
        valign = parser.GetBrackets('\\begin{' + name + '}');
    }
    n = parser.GetArgument('\\begin{' + name + '}');
    if (n.match(/[^0-9]/)) {
        throw new TexError_js_1.default('PositiveIntegerArg', 'Argument to %1 must me a positive integer', '\\begin{' + name + '}');
    }
    var count = parseInt(n, 10);
    while (count > 0) {
        align += 'rl';
        spacing.push('0em 0em');
        count--;
    }
    var spaceStr = spacing.join(' ');
    if (taggable) {
        return exports.AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
    }
    var array = exports.AmsMethods.EqnArray(parser, begin, numbered, taggable, align, spaceStr);
    return ParseUtil_js_1.default.setArrayAlign(array, valign);
};
exports.AmsMethods.Multline = function (parser, begin, numbered) {
    parser.Push(begin);
    ParseUtil_js_1.default.checkEqnEnv(parser);
    var item = parser.itemFactory.create('multline', numbered, parser.stack);
    item.arraydef = {
        displaystyle: true,
        rowspacing: '.5em',
        columnspacing: '100%',
        width: parser.options.ams['multlineWidth'],
        side: parser.options['tagSide'],
        minlabelspacing: parser.options['tagIndent'],
        framespacing: parser.options.ams['multlineIndent'] + ' 0',
        frame: '',
        'data-width-includes-label': true
    };
    return item;
};
exports.AmsMethods.XalignAt = function (parser, begin, numbered, padded) {
    var n = parser.GetArgument('\\begin{' + begin.getName() + '}');
    if (n.match(/[^0-9]/)) {
        throw new TexError_js_1.default('PositiveIntegerArg', 'Argument to %1 must me a positive integer', '\\begin{' + begin.getName() + '}');
    }
    var align = (padded ? 'crl' : 'rlc');
    var width = (padded ? 'fit auto auto' : 'auto auto fit');
    var item = exports.AmsMethods.FlalignArray(parser, begin, numbered, padded, false, align, width, true);
    item.setProperty('xalignat', 2 * parseInt(n));
    return item;
};
exports.AmsMethods.FlalignArray = function (parser, begin, numbered, padded, center, align, width, zeroWidthLabel) {
    if (zeroWidthLabel === void 0) { zeroWidthLabel = false; }
    parser.Push(begin);
    ParseUtil_js_1.default.checkEqnEnv(parser);
    align = align
        .split('')
        .join(' ')
        .replace(/r/g, 'right')
        .replace(/l/g, 'left')
        .replace(/c/g, 'center');
    var item = parser.itemFactory.create('flalign', begin.getName(), numbered, padded, center, parser.stack);
    item.arraydef = {
        width: '100%',
        displaystyle: true,
        columnalign: align,
        columnspacing: '0em',
        columnwidth: width,
        rowspacing: '3pt',
        side: parser.options['tagSide'],
        minlabelspacing: (zeroWidthLabel ? '0' : parser.options['tagIndent']),
        'data-width-includes-label': true,
    };
    item.setProperty('zeroWidthLabel', zeroWidthLabel);
    return item;
};
exports.NEW_OPS = 'ams-declare-ops';
exports.AmsMethods.HandleDeclareOp = function (parser, name) {
    var star = (parser.GetStar() ? '*' : '');
    var cs = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    if (cs.charAt(0) === '\\') {
        cs = cs.substr(1);
    }
    var op = parser.GetArgument(name);
    parser.configuration.handlers.retrieve(exports.NEW_OPS).
        add(cs, new Symbol_js_1.Macro(cs, exports.AmsMethods.Macro, ["\\operatorname".concat(star, "{").concat(op, "}")]));
};
exports.AmsMethods.HandleOperatorName = function (parser, name) {
    var star = parser.GetStar();
    var op = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    var mml = new TexParser_js_1.default(op, __assign(__assign({}, parser.stack.env), { font: TexConstants_js_1.TexConstant.Variant.NORMAL, multiLetterIdentifiers: /^[-*a-z]+/i, operatorLetters: true }), parser.configuration).mml();
    if (!mml.isKind('mi')) {
        mml = parser.create('node', 'TeXAtom', [mml]);
    }
    NodeUtil_js_1.default.setProperties(mml, { movesupsub: star, movablelimits: true, texClass: MmlNode_js_1.TEXCLASS.OP });
    if (!star) {
        var c = parser.GetNext(), i = parser.i;
        if (c === '\\' && ++parser.i && parser.GetCS() !== 'limits') {
            parser.i = i;
        }
    }
    parser.Push(mml);
};
exports.AmsMethods.SideSet = function (parser, name) {
    var _a = __read(splitSideSet(parser.ParseArg(name)), 2), preScripts = _a[0], preRest = _a[1];
    var _b = __read(splitSideSet(parser.ParseArg(name)), 2), postScripts = _b[0], postRest = _b[1];
    var base = parser.ParseArg(name);
    var mml = base;
    if (preScripts) {
        if (preRest) {
            preScripts.replaceChild(parser.create('node', 'mphantom', [
                parser.create('node', 'mpadded', [ParseUtil_js_1.default.copyNode(base, parser)], { width: 0 })
            ]), NodeUtil_js_1.default.getChildAt(preScripts, 0));
        }
        else {
            mml = parser.create('node', 'mmultiscripts', [base]);
            if (postScripts) {
                NodeUtil_js_1.default.appendChildren(mml, [
                    NodeUtil_js_1.default.getChildAt(postScripts, 1) || parser.create('node', 'none'),
                    NodeUtil_js_1.default.getChildAt(postScripts, 2) || parser.create('node', 'none')
                ]);
            }
            NodeUtil_js_1.default.setProperty(mml, 'scriptalign', 'left');
            NodeUtil_js_1.default.appendChildren(mml, [
                parser.create('node', 'mprescripts'),
                NodeUtil_js_1.default.getChildAt(preScripts, 1) || parser.create('node', 'none'),
                NodeUtil_js_1.default.getChildAt(preScripts, 2) || parser.create('node', 'none')
            ]);
        }
    }
    if (postScripts && mml === base) {
        postScripts.replaceChild(base, NodeUtil_js_1.default.getChildAt(postScripts, 0));
        mml = postScripts;
    }
    var mrow = parser.create('node', 'TeXAtom', [], { texClass: MmlNode_js_1.TEXCLASS.OP, movesupsub: true, movablelimits: true });
    if (preRest) {
        preScripts && mrow.appendChild(preScripts);
        mrow.appendChild(preRest);
    }
    mrow.appendChild(mml);
    postRest && mrow.appendChild(postRest);
    parser.Push(mrow);
};
function splitSideSet(mml) {
    if (!mml || (mml.isInferred && mml.childNodes.length === 0))
        return [null, null];
    if (mml.isKind('msubsup') && checkSideSetBase(mml))
        return [mml, null];
    var child = NodeUtil_js_1.default.getChildAt(mml, 0);
    if (!(mml.isInferred && child && checkSideSetBase(child)))
        return [null, mml];
    mml.childNodes.splice(0, 1);
    return [child, mml];
}
function checkSideSetBase(mml) {
    var base = mml.childNodes[0];
    return base && base.isKind('mi') && base.getText() === '';
}
exports.AmsMethods.operatorLetter = function (parser, c) {
    return parser.stack.env.operatorLetters ? ParseMethods_js_1.default.variable(parser, c) : false;
};
exports.AmsMethods.MultiIntegral = function (parser, name, integral) {
    var next = parser.GetNext();
    if (next === '\\') {
        var i = parser.i;
        next = parser.GetArgument(name);
        parser.i = i;
        if (next === '\\limits') {
            if (name === '\\idotsint') {
                integral = '\\!\\!\\mathop{\\,\\,' + integral + '}';
            }
            else {
                integral = '\\!\\!\\!\\mathop{\\,\\,\\,' + integral + '}';
            }
        }
    }
    parser.string = integral + ' ' + parser.string.slice(parser.i);
    parser.i = 0;
};
exports.AmsMethods.xArrow = function (parser, name, chr, l, r) {
    var def = { width: '+' + ParseUtil_js_1.default.Em((l + r) / 18), lspace: ParseUtil_js_1.default.Em(l / 18) };
    var bot = parser.GetBrackets(name);
    var first = parser.ParseArg(name);
    var dstrut = parser.create('node', 'mspace', [], { depth: '.25em' });
    var arrow = parser.create('token', 'mo', { stretchy: true, texClass: MmlNode_js_1.TEXCLASS.REL }, String.fromCodePoint(chr));
    arrow = parser.create('node', 'mstyle', [arrow], { scriptlevel: 0 });
    var mml = parser.create('node', 'munderover', [arrow]);
    var mpadded = parser.create('node', 'mpadded', [first, dstrut], def);
    NodeUtil_js_1.default.setAttribute(mpadded, 'voffset', '-.2em');
    NodeUtil_js_1.default.setAttribute(mpadded, 'height', '-.2em');
    NodeUtil_js_1.default.setChild(mml, mml.over, mpadded);
    if (bot) {
        var bottom = new TexParser_js_1.default(bot, parser.stack.env, parser.configuration).mml();
        var bstrut = parser.create('node', 'mspace', [], { height: '.75em' });
        mpadded = parser.create('node', 'mpadded', [bottom, bstrut], def);
        NodeUtil_js_1.default.setAttribute(mpadded, 'voffset', '.15em');
        NodeUtil_js_1.default.setAttribute(mpadded, 'depth', '-.15em');
        NodeUtil_js_1.default.setChild(mml, mml.under, mpadded);
    }
    NodeUtil_js_1.default.setProperty(mml, 'subsupOK', true);
    parser.Push(mml);
};
exports.AmsMethods.HandleShove = function (parser, _name, shove) {
    var top = parser.stack.Top();
    if (top.kind !== 'multline') {
        throw new TexError_js_1.default('CommandOnlyAllowedInEnv', '%1 only allowed in %2 environment', parser.currentCS, 'multline');
    }
    if (top.Size()) {
        throw new TexError_js_1.default('CommandAtTheBeginingOfLine', '%1 must come at the beginning of the line', parser.currentCS);
    }
    top.setProperty('shove', shove);
};
exports.AmsMethods.CFrac = function (parser, name) {
    var lr = ParseUtil_js_1.default.trimSpaces(parser.GetBrackets(name, ''));
    var num = parser.GetArgument(name);
    var den = parser.GetArgument(name);
    var lrMap = {
        l: TexConstants_js_1.TexConstant.Align.LEFT, r: TexConstants_js_1.TexConstant.Align.RIGHT, '': ''
    };
    var numNode = new TexParser_js_1.default('\\strut\\textstyle{' + num + '}', parser.stack.env, parser.configuration).mml();
    var denNode = new TexParser_js_1.default('\\strut\\textstyle{' + den + '}', parser.stack.env, parser.configuration).mml();
    var frac = parser.create('node', 'mfrac', [numNode, denNode]);
    lr = lrMap[lr];
    if (lr == null) {
        throw new TexError_js_1.default('IllegalAlign', 'Illegal alignment specified in %1', parser.currentCS);
    }
    if (lr) {
        NodeUtil_js_1.default.setProperties(frac, { numalign: lr, denomalign: lr });
    }
    parser.Push(frac);
};
exports.AmsMethods.Genfrac = function (parser, name, left, right, thick, style) {
    if (left == null) {
        left = parser.GetDelimiterArg(name);
    }
    if (right == null) {
        right = parser.GetDelimiterArg(name);
    }
    if (thick == null) {
        thick = parser.GetArgument(name);
    }
    if (style == null) {
        style = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    }
    var num = parser.ParseArg(name);
    var den = parser.ParseArg(name);
    var frac = parser.create('node', 'mfrac', [num, den]);
    if (thick !== '') {
        NodeUtil_js_1.default.setAttribute(frac, 'linethickness', thick);
    }
    if (left || right) {
        NodeUtil_js_1.default.setProperty(frac, 'withDelims', true);
        frac = ParseUtil_js_1.default.fixedFence(parser.configuration, left, frac, right);
    }
    if (style !== '') {
        var styleDigit = parseInt(style, 10);
        var styleAlpha = ['D', 'T', 'S', 'SS'][styleDigit];
        if (styleAlpha == null) {
            throw new TexError_js_1.default('BadMathStyleFor', 'Bad math style for %1', parser.currentCS);
        }
        frac = parser.create('node', 'mstyle', [frac]);
        if (styleAlpha === 'D') {
            NodeUtil_js_1.default.setProperties(frac, { displaystyle: true, scriptlevel: 0 });
        }
        else {
            NodeUtil_js_1.default.setProperties(frac, { displaystyle: false,
                scriptlevel: styleDigit - 1 });
        }
    }
    parser.Push(frac);
};
exports.AmsMethods.HandleTag = function (parser, name) {
    if (!parser.tags.currentTag.taggable && parser.tags.env) {
        throw new TexError_js_1.default('CommandNotAllowedInEnv', '%1 not allowed in %2 environment', parser.currentCS, parser.tags.env);
    }
    if (parser.tags.currentTag.tag) {
        throw new TexError_js_1.default('MultipleCommand', 'Multiple %1', parser.currentCS);
    }
    var star = parser.GetStar();
    var tagId = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
    parser.tags.tag(tagId, star);
};
exports.AmsMethods.HandleNoTag = BaseMethods_js_1.default.HandleNoTag;
exports.AmsMethods.HandleRef = BaseMethods_js_1.default.HandleRef;
exports.AmsMethods.Macro = BaseMethods_js_1.default.Macro;
exports.AmsMethods.Accent = BaseMethods_js_1.default.Accent;
exports.AmsMethods.Tilde = BaseMethods_js_1.default.Tilde;
exports.AmsMethods.Array = BaseMethods_js_1.default.Array;
exports.AmsMethods.Spacer = BaseMethods_js_1.default.Spacer;
exports.AmsMethods.NamedOp = BaseMethods_js_1.default.NamedOp;
exports.AmsMethods.EqnArray = BaseMethods_js_1.default.EqnArray;
exports.AmsMethods.Equation = BaseMethods_js_1.default.Equation;
//# sourceMappingURL=AmsMethods.js.map