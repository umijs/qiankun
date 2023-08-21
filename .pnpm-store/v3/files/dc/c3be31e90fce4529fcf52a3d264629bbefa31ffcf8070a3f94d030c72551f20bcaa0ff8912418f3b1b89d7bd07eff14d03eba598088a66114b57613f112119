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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathtoolsUtil = void 0;
var BaseItems_js_1 = require("../base/BaseItems.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var Symbol_js_1 = require("../Symbol.js");
var Options_js_1 = require("../../../util/Options.js");
var MathtoolsMethods_js_1 = require("./MathtoolsMethods.js");
var MathtoolsConfiguration_js_1 = require("./MathtoolsConfiguration.js");
exports.MathtoolsUtil = {
    setDisplayLevel: function (mml, style) {
        if (!style)
            return;
        var _a = __read((0, Options_js_1.lookup)(style, {
            '\\displaystyle': [true, 0],
            '\\textstyle': [false, 0],
            '\\scriptstyle': [false, 1],
            '\\scriptscriptstyle': [false, 2]
        }, [null, null]), 2), display = _a[0], script = _a[1];
        if (display !== null) {
            mml.attributes.set('displaystyle', display);
            mml.attributes.set('scriptlevel', script);
        }
    },
    checkAlignment: function (parser, name) {
        var top = parser.stack.Top();
        if (top.kind !== BaseItems_js_1.EqnArrayItem.prototype.kind) {
            throw new TexError_js_1.default('NotInAlignment', '%1 can only be used in aligment environments', name);
        }
        return top;
    },
    addPairedDelims: function (config, cs, args) {
        var delims = config.handlers.retrieve(MathtoolsConfiguration_js_1.PAIREDDELIMS);
        delims.add(cs, new Symbol_js_1.Macro(cs, MathtoolsMethods_js_1.MathtoolsMethods.PairedDelimiters, args));
    },
    spreadLines: function (mtable, spread) {
        if (!mtable.isKind('mtable'))
            return;
        var rowspacing = mtable.attributes.get('rowspacing');
        if (rowspacing) {
            var add_1 = ParseUtil_js_1.default.dimen2em(spread);
            rowspacing = rowspacing
                .split(/ /)
                .map(function (s) { return ParseUtil_js_1.default.Em(Math.max(0, ParseUtil_js_1.default.dimen2em(s) + add_1)); })
                .join(' ');
        }
        else {
            rowspacing = spread;
        }
        mtable.attributes.set('rowspacing', rowspacing);
    },
    plusOrMinus: function (name, n) {
        n = n.trim();
        if (!n.match(/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/)) {
            throw new TexError_js_1.default('NotANumber', 'Argument to %1 is not a number', name);
        }
        return (n.match(/^[-+]/) ? n : '+' + n);
    },
    getScript: function (parser, name, pos) {
        var arg = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name));
        if (arg === '') {
            return parser.create('node', 'none');
        }
        var format = parser.options.mathtools["prescript-".concat(pos, "-format")];
        format && (arg = "".concat(format, "{").concat(arg, "}"));
        return new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
    }
};
//# sourceMappingURL=MathtoolsUtil.js.map