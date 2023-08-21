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
exports.MmlMstyle = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var Attributes_js_1 = require("../Attributes.js");
var MmlMstyle = (function (_super) {
    __extends(MmlMstyle, _super);
    function MmlMstyle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMstyle.prototype, "kind", {
        get: function () {
            return 'mstyle';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMstyle.prototype, "notParent", {
        get: function () {
            return this.childNodes[0] && this.childNodes[0].childNodes.length === 1;
        },
        enumerable: false,
        configurable: true
    });
    MmlMstyle.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var scriptlevel = this.attributes.getExplicit('scriptlevel');
        if (scriptlevel != null) {
            scriptlevel = scriptlevel.toString();
            if (scriptlevel.match(/^\s*[-+]/)) {
                level += parseInt(scriptlevel);
            }
            else {
                level = parseInt(scriptlevel);
            }
            prime = false;
        }
        var displaystyle = this.attributes.getExplicit('displaystyle');
        if (displaystyle != null) {
            display = (displaystyle === true);
            prime = false;
        }
        var cramped = this.attributes.getExplicit('data-cramped');
        if (cramped != null) {
            prime = cramped;
        }
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        this.childNodes[0].setInheritedAttributes(attributes, display, level, prime);
    };
    MmlMstyle.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlLayoutNode.defaults), { scriptlevel: Attributes_js_1.INHERIT, displaystyle: Attributes_js_1.INHERIT, scriptsizemultiplier: 1 / Math.sqrt(2), scriptminsize: '8px', mathbackground: Attributes_js_1.INHERIT, mathcolor: Attributes_js_1.INHERIT, dir: Attributes_js_1.INHERIT, infixlinebreakstyle: 'before' });
    return MmlMstyle;
}(MmlNode_js_1.AbstractMmlLayoutNode));
exports.MmlMstyle = MmlMstyle;
//# sourceMappingURL=mstyle.js.map