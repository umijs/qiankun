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
exports.MmlMi = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMi = (function (_super) {
    __extends(MmlMi, _super);
    function MmlMi() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.texclass = MmlNode_js_1.TEXCLASS.ORD;
        return _this;
    }
    Object.defineProperty(MmlMi.prototype, "kind", {
        get: function () {
            return 'mi';
        },
        enumerable: false,
        configurable: true
    });
    MmlMi.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        if (attributes === void 0) { attributes = {}; }
        if (display === void 0) { display = false; }
        if (level === void 0) { level = 0; }
        if (prime === void 0) { prime = false; }
        _super.prototype.setInheritedAttributes.call(this, attributes, display, level, prime);
        var text = this.getText();
        if (text.match(MmlMi.singleCharacter) && !attributes.mathvariant) {
            this.attributes.setInherited('mathvariant', 'italic');
        }
    };
    MmlMi.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        var name = this.getText();
        if (name.length > 1 && name.match(MmlMi.operatorName) &&
            this.attributes.get('mathvariant') === 'normal' &&
            this.getProperty('autoOP') === undefined &&
            this.getProperty('texClass') === undefined) {
            this.texClass = MmlNode_js_1.TEXCLASS.OP;
            this.setProperty('autoOP', true);
        }
        return this;
    };
    MmlMi.defaults = __assign({}, MmlNode_js_1.AbstractMmlTokenNode.defaults);
    MmlMi.operatorName = /^[a-z][a-z0-9]*$/i;
    MmlMi.singleCharacter = /^[\uD800-\uDBFF]?.[\u0300-\u036F\u1AB0-\u1ABE\u1DC0-\u1DFF\u20D0-\u20EF]*$/;
    return MmlMi;
}(MmlNode_js_1.AbstractMmlTokenNode));
exports.MmlMi = MmlMi;
//# sourceMappingURL=mi.js.map