"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorMethods = void 0;
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
function padding(colorPadding) {
    var pad = "+".concat(colorPadding);
    var unit = colorPadding.replace(/^.*?([a-z]*)$/, '$1');
    var pad2 = 2 * parseFloat(pad);
    return {
        width: "+".concat(pad2).concat(unit),
        height: pad,
        depth: pad,
        lspace: colorPadding,
    };
}
exports.ColorMethods = {};
exports.ColorMethods.Color = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    var color = colorModel.getColor(model, colorDef);
    var style = parser.itemFactory.create('style')
        .setProperties({ styles: { mathcolor: color } });
    parser.stack.env['color'] = color;
    parser.Push(style);
};
exports.ColorMethods.TextColor = function (parser, name) {
    var model = parser.GetBrackets(name, '');
    var colorDef = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    var color = colorModel.getColor(model, colorDef);
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
};
exports.ColorMethods.DefineColor = function (parser, name) {
    var cname = parser.GetArgument(name);
    var model = parser.GetArgument(name);
    var def = parser.GetArgument(name);
    var colorModel = parser.configuration.packageData.get('color').model;
    colorModel.defineColor(model, cname, def);
};
exports.ColorMethods.ColorBox = function (parser, name) {
    var cname = parser.GetArgument(name);
    var math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var colorModel = parser.configuration.packageData.get('color').model;
    var node = parser.create('node', 'mpadded', math, {
        mathbackground: colorModel.getColor('named', cname)
    });
    NodeUtil_js_1.default.setProperties(node, padding(parser.options.color.padding));
    parser.Push(node);
};
exports.ColorMethods.FColorBox = function (parser, name) {
    var fname = parser.GetArgument(name);
    var cname = parser.GetArgument(name);
    var math = ParseUtil_js_1.default.internalMath(parser, parser.GetArgument(name));
    var options = parser.options.color;
    var colorModel = parser.configuration.packageData.get('color').model;
    var node = parser.create('node', 'mpadded', math, {
        mathbackground: colorModel.getColor('named', cname),
        style: "border: ".concat(options.borderWidth, " solid ").concat(colorModel.getColor('named', fname))
    });
    NodeUtil_js_1.default.setProperties(node, padding(options.padding));
    parser.Push(node);
};
//# sourceMappingURL=ColorMethods.js.map