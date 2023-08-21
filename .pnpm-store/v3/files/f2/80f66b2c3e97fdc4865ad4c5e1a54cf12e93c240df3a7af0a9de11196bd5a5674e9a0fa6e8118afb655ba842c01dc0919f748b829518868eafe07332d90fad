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
exports.MmlMaligngroup = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var Attributes_js_1 = require("../Attributes.js");
var MmlMaligngroup = (function (_super) {
    __extends(MmlMaligngroup, _super);
    function MmlMaligngroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMaligngroup.prototype, "kind", {
        get: function () {
            return 'maligngroup';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMaligngroup.prototype, "isSpacelike", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlMaligngroup.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        _super.prototype.setChildInheritedAttributes.call(this, attributes, display, level, prime);
    };
    MmlMaligngroup.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlLayoutNode.defaults), { groupalign: Attributes_js_1.INHERIT });
    return MmlMaligngroup;
}(MmlNode_js_1.AbstractMmlLayoutNode));
exports.MmlMaligngroup = MmlMaligngroup;
//# sourceMappingURL=maligngroup.js.map