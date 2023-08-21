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
exports.MathChoice = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MathChoice = (function (_super) {
    __extends(MathChoice, _super);
    function MathChoice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MathChoice.prototype, "kind", {
        get: function () {
            return 'MathChoice';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MathChoice.prototype, "arity", {
        get: function () {
            return 4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MathChoice.prototype, "notParent", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MathChoice.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        var selection = (display ? 0 : Math.max(0, Math.min(level, 2)) + 1);
        var child = this.childNodes[selection] || this.factory.create('mrow');
        this.parent.replaceChild(child, this);
        child.setInheritedAttributes(attributes, display, level, prime);
    };
    MathChoice.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults);
    return MathChoice;
}(MmlNode_js_1.AbstractMmlBaseNode));
exports.MathChoice = MathChoice;
//# sourceMappingURL=mathchoice.js.map