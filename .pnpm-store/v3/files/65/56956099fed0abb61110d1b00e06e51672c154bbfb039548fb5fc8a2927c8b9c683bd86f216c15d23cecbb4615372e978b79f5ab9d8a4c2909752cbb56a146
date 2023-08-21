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
exports.CommonMpaddedMixin = void 0;
function CommonMpaddedMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.getDimens = function () {
            var values = this.node.attributes.getList('width', 'height', 'depth', 'lspace', 'voffset');
            var bbox = this.childNodes[0].getBBox();
            var w = bbox.w, h = bbox.h, d = bbox.d;
            var W = w, H = h, D = d, x = 0, y = 0, dx = 0;
            if (values.width !== '')
                w = this.dimen(values.width, bbox, 'w', 0);
            if (values.height !== '')
                h = this.dimen(values.height, bbox, 'h', 0);
            if (values.depth !== '')
                d = this.dimen(values.depth, bbox, 'd', 0);
            if (values.voffset !== '')
                y = this.dimen(values.voffset, bbox);
            if (values.lspace !== '')
                x = this.dimen(values.lspace, bbox);
            var align = this.node.attributes.get('data-align');
            if (align) {
                dx = this.getAlignX(w, bbox, align);
            }
            return [H, D, W, h - H, d - D, w - W, x, y, dx];
        };
        class_1.prototype.dimen = function (length, bbox, d, m) {
            if (d === void 0) { d = ''; }
            if (m === void 0) { m = null; }
            length = String(length);
            var match = length.match(/width|height|depth/);
            var size = (match ? bbox[match[0].charAt(0)] :
                (d ? bbox[d] : 0));
            var dimen = (this.length2em(length, size) || 0);
            if (length.match(/^[-+]/) && d) {
                dimen += size;
            }
            if (m != null) {
                dimen = Math.max(m, dimen);
            }
            return dimen;
        };
        class_1.prototype.computeBBox = function (bbox, recompute) {
            if (recompute === void 0) { recompute = false; }
            var _a = __read(this.getDimens(), 6), H = _a[0], D = _a[1], W = _a[2], dh = _a[3], dd = _a[4], dw = _a[5];
            bbox.w = W + dw;
            bbox.h = H + dh;
            bbox.d = D + dd;
            this.setChildPWidths(recompute, bbox.w);
        };
        class_1.prototype.getWrapWidth = function (_i) {
            return this.getBBox().w;
        };
        class_1.prototype.getChildAlign = function (_i) {
            return this.node.attributes.get('data-align') || 'left';
        };
        return class_1;
    }(Base));
}
exports.CommonMpaddedMixin = CommonMpaddedMixin;
//# sourceMappingURL=mpadded.js.map