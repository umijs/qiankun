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
exports.SVGmfrac = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mfrac_js_1 = require("../../common/Wrappers/mfrac.js");
var mfrac_js_2 = require("../../../core/MmlTree/MmlNodes/mfrac.js");
var SVGmfrac = (function (_super) {
    __extends(SVGmfrac, _super);
    function SVGmfrac() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmfrac.prototype.toSVG = function (parent) {
        this.standardSVGnode(parent);
        var _a = this.node.attributes.getList('linethickness', 'bevelled'), linethickness = _a.linethickness, bevelled = _a.bevelled;
        var display = this.isDisplay();
        if (bevelled) {
            this.makeBevelled(display);
        }
        else {
            var thickness = this.length2em(String(linethickness), .06);
            if (thickness === 0) {
                this.makeAtop(display);
            }
            else {
                this.makeFraction(display, thickness);
            }
        }
    };
    SVGmfrac.prototype.makeFraction = function (display, t) {
        var svg = this.element;
        var _a = this.node.attributes.getList('numalign', 'denomalign'), numalign = _a.numalign, denomalign = _a.denomalign;
        var _b = __read(this.childNodes, 2), num = _b[0], den = _b[1];
        var nbox = num.getOuterBBox();
        var dbox = den.getOuterBBox();
        var tex = this.font.params;
        var a = tex.axis_height;
        var d = .1;
        var pad = (this.node.getProperty('withDelims') ? 0 : tex.nulldelimiterspace);
        var W = Math.max((nbox.L + nbox.w + nbox.R) * nbox.rscale, (dbox.L + dbox.w + dbox.R) * dbox.rscale);
        var nx = this.getAlignX(W, nbox, numalign) + d + pad;
        var dx = this.getAlignX(W, dbox, denomalign) + d + pad;
        var _c = this.getTUV(display, t), T = _c.T, u = _c.u, v = _c.v;
        num.toSVG(svg);
        num.place(nx, a + T + Math.max(nbox.d * nbox.rscale, u));
        den.toSVG(svg);
        den.place(dx, a - T - Math.max(dbox.h * dbox.rscale, v));
        this.adaptor.append(svg, this.svg('rect', {
            width: this.fixed(W + 2 * d), height: this.fixed(t),
            x: this.fixed(pad), y: this.fixed(a - t / 2)
        }));
    };
    SVGmfrac.prototype.makeAtop = function (display) {
        var svg = this.element;
        var _a = this.node.attributes.getList('numalign', 'denomalign'), numalign = _a.numalign, denomalign = _a.denomalign;
        var _b = __read(this.childNodes, 2), num = _b[0], den = _b[1];
        var nbox = num.getOuterBBox();
        var dbox = den.getOuterBBox();
        var tex = this.font.params;
        var pad = (this.node.getProperty('withDelims') ? 0 : tex.nulldelimiterspace);
        var W = Math.max((nbox.L + nbox.w + nbox.R) * nbox.rscale, (dbox.L + dbox.w + dbox.R) * dbox.rscale);
        var nx = this.getAlignX(W, nbox, numalign) + pad;
        var dx = this.getAlignX(W, dbox, denomalign) + pad;
        var _c = this.getUVQ(display), u = _c.u, v = _c.v;
        num.toSVG(svg);
        num.place(nx, u);
        den.toSVG(svg);
        den.place(dx, -v);
    };
    SVGmfrac.prototype.makeBevelled = function (display) {
        var svg = this.element;
        var _a = __read(this.childNodes, 2), num = _a[0], den = _a[1];
        var _b = this.getBevelData(display), u = _b.u, v = _b.v, delta = _b.delta, nbox = _b.nbox, dbox = _b.dbox;
        var w = (nbox.L + nbox.w + nbox.R) * nbox.rscale;
        num.toSVG(svg);
        this.bevel.toSVG(svg);
        den.toSVG(svg);
        num.place(nbox.L * nbox.rscale, u);
        this.bevel.place(w - delta / 2, 0);
        den.place(w + this.bevel.getOuterBBox().w + dbox.L * dbox.rscale - delta, v);
    };
    SVGmfrac.kind = mfrac_js_2.MmlMfrac.prototype.kind;
    return SVGmfrac;
}((0, mfrac_js_1.CommonMfracMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGmfrac = SVGmfrac;
//# sourceMappingURL=mfrac.js.map