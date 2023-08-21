"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnicodeConfiguration = exports.UnicodeMethods = void 0;
var Configuration_js_1 = require("../Configuration.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
var SymbolMap_js_1 = require("../SymbolMap.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var Entities_js_1 = require("../../../util/Entities.js");
exports.UnicodeMethods = {};
var UnicodeCache = {};
exports.UnicodeMethods.Unicode = function (parser, name) {
    var HD = parser.GetBrackets(name);
    var HDsplit = null;
    var font = null;
    if (HD) {
        if (HD.replace(/ /g, '').
            match(/^(\d+(\.\d*)?|\.\d+),(\d+(\.\d*)?|\.\d+)$/)) {
            HDsplit = HD.replace(/ /g, '').split(/,/);
            font = parser.GetBrackets(name);
        }
        else {
            font = HD;
        }
    }
    var n = ParseUtil_js_1.default.trimSpaces(parser.GetArgument(name)).replace(/^0x/, 'x');
    if (!n.match(/^(x[0-9A-Fa-f]+|[0-9]+)$/)) {
        throw new TexError_js_1.default('BadUnicode', 'Argument to \\unicode must be a number');
    }
    var N = parseInt(n.match(/^x/) ? '0' + n : n);
    if (!UnicodeCache[N]) {
        UnicodeCache[N] = [800, 200, font, N];
    }
    else if (!font) {
        font = UnicodeCache[N][2];
    }
    if (HDsplit) {
        UnicodeCache[N][0] = Math.floor(parseFloat(HDsplit[0]) * 1000);
        UnicodeCache[N][1] = Math.floor(parseFloat(HDsplit[1]) * 1000);
    }
    var variant = parser.stack.env.font;
    var def = {};
    if (font) {
        UnicodeCache[N][2] = def.fontfamily = font.replace(/'/g, '\'');
        if (variant) {
            if (variant.match(/bold/)) {
                def.fontweight = 'bold';
            }
            if (variant.match(/italic|-mathit/)) {
                def.fontstyle = 'italic';
            }
        }
    }
    else if (variant) {
        def.mathvariant = variant;
    }
    var node = parser.create('token', 'mtext', def, (0, Entities_js_1.numeric)(n));
    NodeUtil_js_1.default.setProperty(node, 'unicode', true);
    parser.Push(node);
};
new SymbolMap_js_1.CommandMap('unicode', { unicode: 'Unicode' }, exports.UnicodeMethods);
exports.UnicodeConfiguration = Configuration_js_1.Configuration.create('unicode', { handler: { macro: ['unicode'] } });
//# sourceMappingURL=UnicodeConfiguration.js.map