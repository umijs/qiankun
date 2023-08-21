"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMixin = exports.NodeMixinOptions = void 0;
var Options_js_1 = require("../util/Options.js");
exports.NodeMixinOptions = {
    badCSS: true,
    badSizes: true,
};
function NodeMixin(Base, options) {
    var _a;
    if (options === void 0) { options = {}; }
    options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, exports.NodeMixinOptions), options);
    return _a = (function (_super) {
            __extends(NodeAdaptor, _super);
            function NodeAdaptor() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.call(this, args[0]) || this;
                var CLASS = _this.constructor;
                _this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), args[1]);
                return _this;
            }
            NodeAdaptor.prototype.fontSize = function (node) {
                return (options.badCSS ? this.options.fontSize : _super.prototype.fontSize.call(this, node));
            };
            NodeAdaptor.prototype.fontFamily = function (node) {
                return (options.badCSS ? this.options.fontFamily : _super.prototype.fontFamily.call(this, node));
            };
            NodeAdaptor.prototype.nodeSize = function (node, em, local) {
                if (em === void 0) { em = 1; }
                if (local === void 0) { local = null; }
                if (!options.badSizes) {
                    return _super.prototype.nodeSize.call(this, node, em, local);
                }
                var text = this.textContent(node);
                var non = Array.from(text.replace(NodeAdaptor.cjkPattern, '')).length;
                var CJK = Array.from(text).length - non;
                return [
                    CJK * this.options.cjkCharWidth + non * this.options.unknownCharWidth,
                    this.options.unknownCharHeight
                ];
            };
            NodeAdaptor.prototype.nodeBBox = function (node) {
                return (options.badSizes ? { left: 0, right: 0, top: 0, bottom: 0 } : _super.prototype.nodeBBox.call(this, node));
            };
            return NodeAdaptor;
        }(Base)),
        _a.OPTIONS = __assign(__assign({}, (options.badCSS ? {
            fontSize: 16,
            fontFamily: 'Times',
        } : {})), (options.badSizes ? {
            cjkCharWidth: 1,
            unknownCharWidth: .6,
            unknownCharHeight: .8,
        } : {})),
        _a.cjkPattern = new RegExp([
            '[',
            '\u1100-\u115F',
            '\u2329\u232A',
            '\u2E80-\u303E',
            '\u3040-\u3247',
            '\u3250-\u4DBF',
            '\u4E00-\uA4C6',
            '\uA960-\uA97C',
            '\uAC00-\uD7A3',
            '\uF900-\uFAFF',
            '\uFE10-\uFE19',
            '\uFE30-\uFE6B',
            '\uFF01-\uFF60\uFFE0-\uFFE6',
            "\uD82C\uDC00-\uD82C\uDC01",
            "\uD83C\uDE00-\uD83C\uDE51",
            "\uD840\uDC00-\uD8BF\uDFFD",
            ']'
        ].join(''), 'gu'),
        _a;
}
exports.NodeMixin = NodeMixin;
//# sourceMappingURL=NodeMixin.js.map