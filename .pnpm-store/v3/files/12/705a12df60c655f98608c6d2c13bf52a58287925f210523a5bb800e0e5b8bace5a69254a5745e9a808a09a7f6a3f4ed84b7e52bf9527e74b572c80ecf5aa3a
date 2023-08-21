"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionConfiguration = exports.ActionMethods = void 0;
var Configuration_js_1 = require("../Configuration.js");
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var SymbolMap_js_1 = require("../SymbolMap.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
exports.ActionMethods = {};
exports.ActionMethods.Macro = BaseMethods_js_1.default.Macro;
exports.ActionMethods.Toggle = function (parser, name) {
    var children = [];
    var arg;
    while ((arg = parser.GetArgument(name)) !== '\\endtoggle') {
        children.push(new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml());
    }
    parser.Push(parser.create('node', 'maction', children, { actiontype: 'toggle' }));
};
exports.ActionMethods.Mathtip = function (parser, name) {
    var arg = parser.ParseArg(name);
    var tip = parser.ParseArg(name);
    parser.Push(parser.create('node', 'maction', [arg, tip], { actiontype: 'tooltip' }));
};
new SymbolMap_js_1.CommandMap('action-macros', {
    toggle: 'Toggle',
    mathtip: 'Mathtip',
    texttip: ['Macro', '\\mathtip{#1}{\\text{#2}}', 2]
}, exports.ActionMethods);
exports.ActionConfiguration = Configuration_js_1.Configuration.create('action', { handler: { macro: ['action-macros'] } });
//# sourceMappingURL=ActionConfiguration.js.map