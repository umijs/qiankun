"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var HtmlMethods = {};
HtmlMethods.Href = function (parser, name) {
    var url = parser.GetArgument(name);
    var arg = GetArgumentMML(parser, name);
    NodeUtil_js_1.default.setAttribute(arg, 'href', url);
    parser.Push(arg);
};
HtmlMethods.Class = function (parser, name) {
    var CLASS = parser.GetArgument(name);
    var arg = GetArgumentMML(parser, name);
    var oldClass = NodeUtil_js_1.default.getAttribute(arg, 'class');
    if (oldClass) {
        CLASS = oldClass + ' ' + CLASS;
    }
    NodeUtil_js_1.default.setAttribute(arg, 'class', CLASS);
    parser.Push(arg);
};
HtmlMethods.Style = function (parser, name) {
    var style = parser.GetArgument(name);
    var arg = GetArgumentMML(parser, name);
    var oldStyle = NodeUtil_js_1.default.getAttribute(arg, 'style');
    if (oldStyle) {
        if (style.charAt(style.length - 1) !== ';') {
            style += ';';
        }
        style = oldStyle + ' ' + style;
    }
    NodeUtil_js_1.default.setAttribute(arg, 'style', style);
    parser.Push(arg);
};
HtmlMethods.Id = function (parser, name) {
    var ID = parser.GetArgument(name);
    var arg = GetArgumentMML(parser, name);
    NodeUtil_js_1.default.setAttribute(arg, 'id', ID);
    parser.Push(arg);
};
var GetArgumentMML = function (parser, name) {
    var arg = parser.ParseArg(name);
    if (!NodeUtil_js_1.default.isInferred(arg)) {
        return arg;
    }
    var children = NodeUtil_js_1.default.getChildren(arg);
    if (children.length === 1) {
        return children[0];
    }
    var mrow = parser.create('node', 'mrow');
    NodeUtil_js_1.default.copyChildren(arg, mrow);
    NodeUtil_js_1.default.copyAttributes(arg, mrow);
    return mrow;
};
exports.default = HtmlMethods;
//# sourceMappingURL=HtmlMethods.js.map