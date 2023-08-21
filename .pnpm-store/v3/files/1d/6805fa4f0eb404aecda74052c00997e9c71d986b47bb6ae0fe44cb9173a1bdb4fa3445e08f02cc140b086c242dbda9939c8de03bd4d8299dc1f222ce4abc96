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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMfracMixin = void 0;
function CommonMfracMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
            _this.bevel = null;
            _this.pad = (_this.node.getProperty('withDelims') ? 0 : _this.font.params.nulldelimiterspace);
            if (_this.node.attributes.get('bevelled')) {
                var H = _this.getBevelData(_this.isDisplay()).H;
                var bevel = _this.bevel = _this.createMo('/');
                bevel.node.attributes.set('symmetric', true);
                bevel.canStretch(1);
                bevel.getStretchedVariant([H], true);
            }
            return _this;
        }
        class_1.prototype.computeBBox = function (bbox, recompute) {
            if (recompute === void 0) { recompute = false; }
            bbox.empty();
            var _a = this.node.attributes.getList('linethickness', 'bevelled'), linethickness = _a.linethickness, bevelled = _a.bevelled;
            var display = this.isDisplay();
            var w = null;
            if (bevelled) {
                this.getBevelledBBox(bbox, display);
            }
            else {
                var thickness = this.length2em(String(linethickness), .06);
                w = -2 * this.pad;
                if (thickness === 0) {
                    this.getAtopBBox(bbox, display);
                }
                else {
                    this.getFractionBBox(bbox, display, thickness);
                    w -= .2;
                }
                w += bbox.w;
            }
            bbox.clean();
            this.setChildPWidths(recompute, w);
        };
        class_1.prototype.getFractionBBox = function (bbox, display, t) {
            var nbox = this.childNodes[0].getOuterBBox();
            var dbox = this.childNodes[1].getOuterBBox();
            var tex = this.font.params;
            var a = tex.axis_height;
            var _a = this.getTUV(display, t), T = _a.T, u = _a.u, v = _a.v;
            bbox.combine(nbox, 0, a + T + Math.max(nbox.d * nbox.rscale, u));
            bbox.combine(dbox, 0, a - T - Math.max(dbox.h * dbox.rscale, v));
            bbox.w += 2 * this.pad + .2;
        };
        class_1.prototype.getTUV = function (display, t) {
            var tex = this.font.params;
            var a = tex.axis_height;
            var T = (display ? 3.5 : 1.5) * t;
            return { T: (display ? 3.5 : 1.5) * t,
                u: (display ? tex.num1 : tex.num2) - a - T,
                v: (display ? tex.denom1 : tex.denom2) + a - T };
        };
        class_1.prototype.getAtopBBox = function (bbox, display) {
            var _a = this.getUVQ(display), u = _a.u, v = _a.v, nbox = _a.nbox, dbox = _a.dbox;
            bbox.combine(nbox, 0, u);
            bbox.combine(dbox, 0, -v);
            bbox.w += 2 * this.pad;
        };
        class_1.prototype.getUVQ = function (display) {
            var nbox = this.childNodes[0].getOuterBBox();
            var dbox = this.childNodes[1].getOuterBBox();
            var tex = this.font.params;
            var _a = __read((display ? [tex.num1, tex.denom1] : [tex.num3, tex.denom2]), 2), u = _a[0], v = _a[1];
            var p = (display ? 7 : 3) * tex.rule_thickness;
            var q = (u - nbox.d * nbox.scale) - (dbox.h * dbox.scale - v);
            if (q < p) {
                u += (p - q) / 2;
                v += (p - q) / 2;
                q = p;
            }
            return { u: u, v: v, q: q, nbox: nbox, dbox: dbox };
        };
        class_1.prototype.getBevelledBBox = function (bbox, display) {
            var _a = this.getBevelData(display), u = _a.u, v = _a.v, delta = _a.delta, nbox = _a.nbox, dbox = _a.dbox;
            var lbox = this.bevel.getOuterBBox();
            bbox.combine(nbox, 0, u);
            bbox.combine(lbox, bbox.w - delta / 2, 0);
            bbox.combine(dbox, bbox.w - delta / 2, v);
        };
        class_1.prototype.getBevelData = function (display) {
            var nbox = this.childNodes[0].getOuterBBox();
            var dbox = this.childNodes[1].getOuterBBox();
            var delta = (display ? .4 : .15);
            var H = Math.max(nbox.scale * (nbox.h + nbox.d), dbox.scale * (dbox.h + dbox.d)) + 2 * delta;
            var a = this.font.params.axis_height;
            var u = nbox.scale * (nbox.d - nbox.h) / 2 + a + delta;
            var v = dbox.scale * (dbox.d - dbox.h) / 2 + a - delta;
            return { H: H, delta: delta, u: u, v: v, nbox: nbox, dbox: dbox };
        };
        class_1.prototype.canStretch = function (_direction) {
            return false;
        };
        class_1.prototype.isDisplay = function () {
            var _a = this.node.attributes.getList('displaystyle', 'scriptlevel'), displaystyle = _a.displaystyle, scriptlevel = _a.scriptlevel;
            return displaystyle && scriptlevel === 0;
        };
        class_1.prototype.getWrapWidth = function (i) {
            var attributes = this.node.attributes;
            if (attributes.get('bevelled')) {
                return this.childNodes[i].getOuterBBox().w;
            }
            var w = this.getBBox().w;
            var thickness = this.length2em(attributes.get('linethickness'));
            return w - (thickness ? .2 : 0) - 2 * this.pad;
        };
        class_1.prototype.getChildAlign = function (i) {
            var attributes = this.node.attributes;
            return (attributes.get('bevelled') ? 'left' : attributes.get(['numalign', 'denomalign'][i]));
        };
        return class_1;
    }(Base));
}
exports.CommonMfracMixin = CommonMfracMixin;
//# sourceMappingURL=mfrac.js.map