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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGmsubsup = exports.SVGmsup = exports.SVGmsub = void 0;
var scriptbase_js_1 = require("./scriptbase.js");
var msubsup_js_1 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_2 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_3 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_4 = require("../../../core/MmlTree/MmlNodes/msubsup.js");
var SVGmsub = (function (_super) {
    __extends(SVGmsub, _super);
    function SVGmsub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmsub.kind = msubsup_js_4.MmlMsub.prototype.kind;
    return SVGmsub;
}((0, msubsup_js_1.CommonMsubMixin)(scriptbase_js_1.SVGscriptbase)));
exports.SVGmsub = SVGmsub;
var SVGmsup = (function (_super) {
    __extends(SVGmsup, _super);
    function SVGmsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmsup.kind = msubsup_js_4.MmlMsup.prototype.kind;
    return SVGmsup;
}((0, msubsup_js_2.CommonMsupMixin)(scriptbase_js_1.SVGscriptbase)));
exports.SVGmsup = SVGmsup;
var SVGmsubsup = (function (_super) {
    __extends(SVGmsubsup, _super);
    function SVGmsubsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmsubsup.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.supChild, this.subChild], 3), base = _a[0], sup = _a[1], sub = _a[2];
        var w = this.getBaseWidth();
        var x = this.getAdjustedIc();
        var _b = __read(this.getUVQ(), 2), u = _b[0], v = _b[1];
        base.toSVG(svg);
        sup.toSVG(svg);
        sub.toSVG(svg);
        sub.place(w, v);
        sup.place(w + x, u);
    };
    SVGmsubsup.kind = msubsup_js_4.MmlMsubsup.prototype.kind;
    return SVGmsubsup;
}((0, msubsup_js_3.CommonMsubsupMixin)(scriptbase_js_1.SVGscriptbase)));
exports.SVGmsubsup = SVGmsubsup;
//# sourceMappingURL=msubsup.js.map