"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MhchemConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
var AmsMethods_js_1 = require("../ams/AmsMethods.js");
var mhchemParser_js_1 = require("mhchemparser/dist/mhchemParser.js");
var MhchemMethods = {};
MhchemMethods.Macro = BaseMethods_js_1.default.Macro;
MhchemMethods.xArrow = AmsMethods_js_1.AmsMethods.xArrow;
MhchemMethods.Machine = function (parser, name, machine) {
    var arg = parser.GetArgument(name);
    var tex;
    try {
        tex = mhchemParser_js_1.mhchemParser.toTex(arg, machine);
    }
    catch (err) {
        throw new TexError_js_1.default(err[0], err[1]);
    }
    parser.string = tex + parser.string.substr(parser.i);
    parser.i = 0;
};
new SymbolMap_js_1.CommandMap('mhchem', {
    ce: ['Machine', 'ce'],
    pu: ['Machine', 'pu'],
    longrightleftharpoons: [
        'Macro',
        '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'
    ],
    longRightleftharpoons: [
        'Macro',
        '\\stackrel{\\textstyle{-}\\!\\!{\\rightharpoonup}}{\\smash{\\leftharpoondown}}'
    ],
    longLeftrightharpoons: [
        'Macro',
        '\\stackrel{\\textstyle\\vphantom{{-}}{\\rightharpoonup}}{\\smash{{\\leftharpoondown}\\!\\!{-}}}'
    ],
    longleftrightarrows: [
        'Macro',
        '\\stackrel{\\longrightarrow}{\\smash{\\longleftarrow}\\Rule{0px}{.25em}{0px}}'
    ],
    tripledash: [
        'Macro',
        '\\vphantom{-}\\raise2mu{\\kern2mu\\tiny\\text{-}\\kern1mu\\text{-}\\kern1mu\\text{-}\\kern2mu}'
    ],
    xleftrightarrow: ['xArrow', 0x2194, 6, 6],
    xrightleftharpoons: ['xArrow', 0x21CC, 5, 7],
    xRightleftharpoons: ['xArrow', 0x21CC, 5, 7],
    xLeftrightharpoons: ['xArrow', 0x21CC, 5, 7]
}, MhchemMethods);
exports.MhchemConfiguration = Configuration_js_1.Configuration.create('mhchem', { handler: { macro: ['mhchem'] } });
//# sourceMappingURL=MhchemConfiguration.js.map