"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorConfiguration = exports.ColorV2Methods = void 0;
var SymbolMap_js_1 = require("../SymbolMap.js");
var Configuration_js_1 = require("../Configuration.js");
exports.ColorV2Methods = {
    Color: function (parser, name) {
        var color = parser.GetArgument(name);
        var old = parser.stack.env['color'];
        parser.stack.env['color'] = color;
        var math = parser.ParseArg(name);
        if (old) {
            parser.stack.env['color'] = old;
        }
        else {
            delete parser.stack.env['color'];
        }
        var node = parser.create('node', 'mstyle', [math], { mathcolor: color });
        parser.Push(node);
    }
};
new SymbolMap_js_1.CommandMap('colorv2', { color: 'Color' }, exports.ColorV2Methods);
exports.ColorConfiguration = Configuration_js_1.Configuration.create('colorv2', { handler: { macro: ['colorv2'] } });
//# sourceMappingURL=ColorV2Configuration.js.map