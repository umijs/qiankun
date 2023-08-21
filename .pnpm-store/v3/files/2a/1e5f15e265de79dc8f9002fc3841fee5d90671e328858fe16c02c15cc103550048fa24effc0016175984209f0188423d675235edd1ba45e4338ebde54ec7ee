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
exports.MmlMenclose = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMenclose = (function (_super) {
    __extends(MmlMenclose, _super);
    function MmlMenclose() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.texclass = MmlNode_js_1.TEXCLASS.ORD;
        return _this;
    }
    Object.defineProperty(MmlMenclose.prototype, "kind", {
        get: function () {
            return 'menclose';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMenclose.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMenclose.prototype, "linebreakContininer", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlMenclose.prototype.setTeXclass = function (prev) {
        prev = this.childNodes[0].setTeXclass(prev);
        this.updateTeXclass(this.childNodes[0]);
        return prev;
    };
    MmlMenclose.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlNode.defaults), { notation: 'longdiv' });
    return MmlMenclose;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlMenclose = MmlMenclose;
//# sourceMappingURL=menclose.js.map