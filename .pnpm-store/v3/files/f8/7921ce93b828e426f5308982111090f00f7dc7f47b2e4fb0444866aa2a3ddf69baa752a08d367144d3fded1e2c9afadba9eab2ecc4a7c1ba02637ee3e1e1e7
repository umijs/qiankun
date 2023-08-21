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
exports.TeXAtom = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var mo_js_1 = require("./mo.js");
var TeXAtom = (function (_super) {
    __extends(TeXAtom, _super);
    function TeXAtom(factory, attributes, children) {
        var _this = _super.call(this, factory, attributes, children) || this;
        _this.texclass = MmlNode_js_1.TEXCLASS.ORD;
        _this.setProperty('texClass', _this.texClass);
        return _this;
    }
    Object.defineProperty(TeXAtom.prototype, "kind", {
        get: function () {
            return 'TeXAtom';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TeXAtom.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TeXAtom.prototype, "notParent", {
        get: function () {
            return this.childNodes[0] && this.childNodes[0].childNodes.length === 1;
        },
        enumerable: false,
        configurable: true
    });
    TeXAtom.prototype.setTeXclass = function (prev) {
        this.childNodes[0].setTeXclass(null);
        return this.adjustTeXclass(prev);
    };
    TeXAtom.prototype.adjustTeXclass = function (prev) {
        return prev;
    };
    TeXAtom.defaults = __assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults);
    return TeXAtom;
}(MmlNode_js_1.AbstractMmlBaseNode));
exports.TeXAtom = TeXAtom;
TeXAtom.prototype.adjustTeXclass = mo_js_1.MmlMo.prototype.adjustTeXclass;
//# sourceMappingURL=TeXAtom.js.map