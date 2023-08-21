"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtpfeilConfiguration = exports.ExtpfeilMethods = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var AmsMethods_js_1 = require("../ams/AmsMethods.js");
var NewcommandUtil_js_1 = __importDefault(require("../newcommand/NewcommandUtil.js"));
var NewcommandConfiguration_js_1 = require("../newcommand/NewcommandConfiguration.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
exports.ExtpfeilMethods = {};
exports.ExtpfeilMethods.xArrow = AmsMethods_js_1.AmsMethods.xArrow;
exports.ExtpfeilMethods.NewExtArrow = function (parser, name) {
    var cs = parser.GetArgument(name);
    var space = parser.GetArgument(name);
    var chr = parser.GetArgument(name);
    if (!cs.match(/^\\([a-z]+|.)$/i)) {
        throw new TexError_js_1.default('NewextarrowArg1', 'First argument to %1 must be a control sequence name', name);
    }
    if (!space.match(/^(\d+),(\d+)$/)) {
        throw new TexError_js_1.default('NewextarrowArg2', 'Second argument to %1 must be two integers separated by a comma', name);
    }
    if (!chr.match(/^(\d+|0x[0-9A-F]+)$/i)) {
        throw new TexError_js_1.default('NewextarrowArg3', 'Third argument to %1 must be a unicode character number', name);
    }
    cs = cs.substr(1);
    var spaces = space.split(',');
    NewcommandUtil_js_1.default.addMacro(parser, cs, exports.ExtpfeilMethods.xArrow, [parseInt(chr), parseInt(spaces[0]), parseInt(spaces[1])]);
};
new SymbolMap_js_1.CommandMap('extpfeil', {
    xtwoheadrightarrow: ['xArrow', 0x21A0, 12, 16],
    xtwoheadleftarrow: ['xArrow', 0x219E, 17, 13],
    xmapsto: ['xArrow', 0x21A6, 6, 7],
    xlongequal: ['xArrow', 0x003D, 7, 7],
    xtofrom: ['xArrow', 0x21C4, 12, 12],
    Newextarrow: 'NewExtArrow'
}, exports.ExtpfeilMethods);
var init = function (config) {
    NewcommandConfiguration_js_1.NewcommandConfiguration.init(config);
};
exports.ExtpfeilConfiguration = Configuration_js_1.Configuration.create('extpfeil', {
    handler: { macro: ['extpfeil'] },
    init: init
});
//# sourceMappingURL=ExtpfeilConfiguration.js.map