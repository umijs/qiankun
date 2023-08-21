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
exports.MmlAnnotation = exports.MmlAnnotationXML = exports.MmlSemantics = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlSemantics = (function (_super) {
    __extends(MmlSemantics, _super);
    function MmlSemantics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlSemantics.prototype, "kind", {
        get: function () {
            return 'semantics';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlSemantics.prototype, "arity", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlSemantics.prototype, "notParent", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlSemantics.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults), { definitionUrl: null, encoding: null });
    return MmlSemantics;
}(MmlNode_js_1.AbstractMmlBaseNode));
exports.MmlSemantics = MmlSemantics;
var MmlAnnotationXML = (function (_super) {
    __extends(MmlAnnotationXML, _super);
    function MmlAnnotationXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlAnnotationXML.prototype, "kind", {
        get: function () {
            return 'annotation-xml';
        },
        enumerable: false,
        configurable: true
    });
    MmlAnnotationXML.prototype.setChildInheritedAttributes = function () { };
    MmlAnnotationXML.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlNode.defaults), { definitionUrl: null, encoding: null, cd: 'mathmlkeys', name: '', src: null });
    return MmlAnnotationXML;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlAnnotationXML = MmlAnnotationXML;
var MmlAnnotation = (function (_super) {
    __extends(MmlAnnotation, _super);
    function MmlAnnotation() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = {
            isChars: true
        };
        return _this;
    }
    Object.defineProperty(MmlAnnotation.prototype, "kind", {
        get: function () {
            return 'annotation';
        },
        enumerable: false,
        configurable: true
    });
    MmlAnnotation.defaults = __assign({}, MmlAnnotationXML.defaults);
    return MmlAnnotation;
}(MmlAnnotationXML));
exports.MmlAnnotation = MmlAnnotation;
//# sourceMappingURL=semantics.js.map