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
exports.CommonMsubsupMixin = exports.CommonMsupMixin = exports.CommonMsubMixin = void 0;
function CommonMsubMixin(Base) {
    var _a;
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(class_1.prototype, "scriptChild", {
                get: function () {
                    return this.childNodes[this.node.sub];
                },
                enumerable: false,
                configurable: true
            });
            class_1.prototype.getOffset = function () {
                return [0, -this.getV()];
            };
            return class_1;
        }(Base)),
        _a.useIC = false,
        _a;
}
exports.CommonMsubMixin = CommonMsubMixin;
function CommonMsupMixin(Base) {
    return (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(class_2.prototype, "scriptChild", {
            get: function () {
                return this.childNodes[this.node.sup];
            },
            enumerable: false,
            configurable: true
        });
        class_2.prototype.getOffset = function () {
            var x = this.getAdjustedIc() - (this.baseRemoveIc ? 0 : this.baseIc);
            return [x, this.getU()];
        };
        return class_2;
    }(Base));
}
exports.CommonMsupMixin = CommonMsupMixin;
function CommonMsubsupMixin(Base) {
    var _a;
    return _a = (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.UVQ = null;
                return _this;
            }
            Object.defineProperty(class_3.prototype, "subChild", {
                get: function () {
                    return this.childNodes[this.node.sub];
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(class_3.prototype, "supChild", {
                get: function () {
                    return this.childNodes[this.node.sup];
                },
                enumerable: false,
                configurable: true
            });
            class_3.prototype.computeBBox = function (bbox, recompute) {
                if (recompute === void 0) { recompute = false; }
                var basebox = this.baseChild.getOuterBBox();
                var _a = __read([this.subChild.getOuterBBox(), this.supChild.getOuterBBox()], 2), subbox = _a[0], supbox = _a[1];
                bbox.empty();
                bbox.append(basebox);
                var w = this.getBaseWidth();
                var x = this.getAdjustedIc();
                var _b = __read(this.getUVQ(), 2), u = _b[0], v = _b[1];
                bbox.combine(subbox, w, v);
                bbox.combine(supbox, w + x, u);
                bbox.w += this.font.params.scriptspace;
                bbox.clean();
                this.setChildPWidths(recompute);
            };
            class_3.prototype.getUVQ = function (subbox, supbox) {
                if (subbox === void 0) { subbox = this.subChild.getOuterBBox(); }
                if (supbox === void 0) { supbox = this.supChild.getOuterBBox(); }
                var basebox = this.baseCore.getOuterBBox();
                if (this.UVQ)
                    return this.UVQ;
                var tex = this.font.params;
                var t = 3 * tex.rule_thickness;
                var subscriptshift = this.length2em(this.node.attributes.get('subscriptshift'), tex.sub2);
                var drop = this.baseCharZero(basebox.d * this.baseScale + tex.sub_drop * subbox.rscale);
                var _a = __read([this.getU(), Math.max(drop, subscriptshift)], 2), u = _a[0], v = _a[1];
                var q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
                if (q < t) {
                    v += t - q;
                    var p = (4 / 5) * tex.x_height - (u - supbox.d * supbox.rscale);
                    if (p > 0) {
                        u += p;
                        v -= p;
                    }
                }
                u = Math.max(this.length2em(this.node.attributes.get('superscriptshift'), u), u);
                v = Math.max(this.length2em(this.node.attributes.get('subscriptshift'), v), v);
                q = (u - supbox.d * supbox.rscale) - (subbox.h * subbox.rscale - v);
                this.UVQ = [u, -v, q];
                return this.UVQ;
            };
            return class_3;
        }(Base)),
        _a.useIC = false,
        _a;
}
exports.CommonMsubsupMixin = CommonMsubsupMixin;
//# sourceMappingURL=msubsup.js.map