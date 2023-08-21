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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MmlVisitor = void 0;
var MmlFactory_js_1 = require("./MmlFactory.js");
var Visitor_js_1 = require("../Tree/Visitor.js");
var MmlVisitor = (function (_super) {
    __extends(MmlVisitor, _super);
    function MmlVisitor(factory) {
        if (factory === void 0) { factory = null; }
        if (!factory) {
            factory = new MmlFactory_js_1.MmlFactory();
        }
        return _super.call(this, factory) || this;
    }
    MmlVisitor.prototype.visitTextNode = function (_node) {
        var _args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _args[_i - 1] = arguments[_i];
        }
    };
    MmlVisitor.prototype.visitXMLNode = function (_node) {
        var _args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _args[_i - 1] = arguments[_i];
        }
    };
    return MmlVisitor;
}(Visitor_js_1.AbstractVisitor));
exports.MmlVisitor = MmlVisitor;
//# sourceMappingURL=MmlVisitor.js.map