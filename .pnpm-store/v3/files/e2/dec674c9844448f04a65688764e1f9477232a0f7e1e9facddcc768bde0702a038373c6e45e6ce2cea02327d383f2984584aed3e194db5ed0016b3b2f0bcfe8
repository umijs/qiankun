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
exports.SVGmunderover = exports.SVGmover = exports.SVGmunder = void 0;
var msubsup_js_1 = require("./msubsup.js");
var munderover_js_1 = require("../../common/Wrappers/munderover.js");
var munderover_js_2 = require("../../common/Wrappers/munderover.js");
var munderover_js_3 = require("../../common/Wrappers/munderover.js");
var munderover_js_4 = require("../../../core/MmlTree/MmlNodes/munderover.js");
var SVGmunder = (function (_super) {
    __extends(SVGmunder, _super);
    function SVGmunder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmunder.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.scriptChild], 2), base = _a[0], script = _a[1];
        var _b = __read([base.getOuterBBox(), script.getOuterBBox()], 2), bbox = _b[0], sbox = _b[1];
        base.toSVG(svg);
        script.toSVG(svg);
        var delta = (this.isLineBelow ? 0 : this.getDelta(true));
        var v = this.getUnderKV(bbox, sbox)[1];
        var _c = __read(this.getDeltaW([bbox, sbox], [0, -delta]), 2), bx = _c[0], sx = _c[1];
        base.place(bx, 0);
        script.place(sx, v);
    };
    SVGmunder.kind = munderover_js_4.MmlMunder.prototype.kind;
    return SVGmunder;
}((0, munderover_js_1.CommonMunderMixin)(msubsup_js_1.SVGmsub)));
exports.SVGmunder = SVGmunder;
var SVGmover = (function (_super) {
    __extends(SVGmover, _super);
    function SVGmover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmover.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.scriptChild], 2), base = _a[0], script = _a[1];
        var _b = __read([base.getOuterBBox(), script.getOuterBBox()], 2), bbox = _b[0], sbox = _b[1];
        base.toSVG(svg);
        script.toSVG(svg);
        var delta = (this.isLineAbove ? 0 : this.getDelta());
        var u = this.getOverKU(bbox, sbox)[1];
        var _c = __read(this.getDeltaW([bbox, sbox], [0, delta]), 2), bx = _c[0], sx = _c[1];
        base.place(bx, 0);
        script.place(sx, u);
    };
    SVGmover.kind = munderover_js_4.MmlMover.prototype.kind;
    return SVGmover;
}((0, munderover_js_2.CommonMoverMixin)(msubsup_js_1.SVGmsup)));
exports.SVGmover = SVGmover;
var SVGmunderover = (function (_super) {
    __extends(SVGmunderover, _super);
    function SVGmunderover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmunderover.prototype.toSVG = function (parent) {
        if (this.hasMovableLimits()) {
            _super.prototype.toSVG.call(this, parent);
            return;
        }
        var svg = this.standardSVGnode(parent);
        var _a = __read([this.baseChild, this.overChild, this.underChild], 3), base = _a[0], over = _a[1], under = _a[2];
        var _b = __read([base.getOuterBBox(), over.getOuterBBox(), under.getOuterBBox()], 3), bbox = _b[0], obox = _b[1], ubox = _b[2];
        base.toSVG(svg);
        under.toSVG(svg);
        over.toSVG(svg);
        var delta = this.getDelta();
        var u = this.getOverKU(bbox, obox)[1];
        var v = this.getUnderKV(bbox, ubox)[1];
        var _c = __read(this.getDeltaW([bbox, ubox, obox], [0, this.isLineBelow ? 0 : -delta, this.isLineAbove ? 0 : delta]), 3), bx = _c[0], ux = _c[1], ox = _c[2];
        base.place(bx, 0);
        under.place(ux, v);
        over.place(ox, u);
    };
    SVGmunderover.kind = munderover_js_4.MmlMunderover.prototype.kind;
    return SVGmunderover;
}((0, munderover_js_3.CommonMunderoverMixin)(msubsup_js_1.SVGmsubsup)));
exports.SVGmunderover = SVGmunderover;
//# sourceMappingURL=munderover.js.map