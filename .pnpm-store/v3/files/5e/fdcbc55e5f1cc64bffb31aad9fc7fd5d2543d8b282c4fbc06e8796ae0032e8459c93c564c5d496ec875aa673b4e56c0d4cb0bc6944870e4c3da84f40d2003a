"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelConfiguration = exports.CancelMethods = void 0;
var Configuration_js_1 = require("../Configuration.js");
var TexConstants_js_1 = require("../TexConstants.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var EncloseConfiguration_js_1 = require("../enclose/EncloseConfiguration.js");
exports.CancelMethods = {};
exports.CancelMethods.Cancel = function (parser, name, notation) {
    var attr = parser.GetBrackets(name, '');
    var math = parser.ParseArg(name);
    var def = ParseUtil_js_1.default.keyvalOptions(attr, EncloseConfiguration_js_1.ENCLOSE_OPTIONS);
    def['notation'] = notation;
    parser.Push(parser.create('node', 'menclose', [math], def));
};
exports.CancelMethods.CancelTo = function (parser, name) {
    var attr = parser.GetBrackets(name, '');
    var value = parser.ParseArg(name);
    var math = parser.ParseArg(name);
    var def = ParseUtil_js_1.default.keyvalOptions(attr, EncloseConfiguration_js_1.ENCLOSE_OPTIONS);
    def['notation'] = [TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE,
        TexConstants_js_1.TexConstant.Notation.UPDIAGONALARROW,
        TexConstants_js_1.TexConstant.Notation.NORTHEASTARROW].join(' ');
    value = parser.create('node', 'mpadded', [value], { depth: '-.1em', height: '+.1em', voffset: '.1em' });
    parser.Push(parser.create('node', 'msup', [parser.create('node', 'menclose', [math], def), value]));
};
new SymbolMap_js_1.CommandMap('cancel', {
    cancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE],
    bcancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.DOWNDIAGONALSTRIKE],
    xcancel: ['Cancel', TexConstants_js_1.TexConstant.Notation.UPDIAGONALSTRIKE + ' ' +
            TexConstants_js_1.TexConstant.Notation.DOWNDIAGONALSTRIKE],
    cancelto: 'CancelTo'
}, exports.CancelMethods);
exports.CancelConfiguration = Configuration_js_1.Configuration.create('cancel', { handler: { macro: ['cancel'] } });
//# sourceMappingURL=CancelConfiguration.js.map