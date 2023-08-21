"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BBox = void 0;
var lengths_js_1 = require("./lengths.js");
var BBox = (function () {
    function BBox(def) {
        if (def === void 0) { def = { w: 0, h: -lengths_js_1.BIGDIMEN, d: -lengths_js_1.BIGDIMEN }; }
        this.w = def.w || 0;
        this.h = ('h' in def ? def.h : -lengths_js_1.BIGDIMEN);
        this.d = ('d' in def ? def.d : -lengths_js_1.BIGDIMEN);
        this.L = this.R = this.ic = this.sk = this.dx = 0;
        this.scale = this.rscale = 1;
        this.pwidth = '';
    }
    BBox.zero = function () {
        return new BBox({ h: 0, d: 0, w: 0 });
    };
    BBox.empty = function () {
        return new BBox();
    };
    BBox.prototype.empty = function () {
        this.w = 0;
        this.h = this.d = -lengths_js_1.BIGDIMEN;
        return this;
    };
    BBox.prototype.clean = function () {
        if (this.w === -lengths_js_1.BIGDIMEN)
            this.w = 0;
        if (this.h === -lengths_js_1.BIGDIMEN)
            this.h = 0;
        if (this.d === -lengths_js_1.BIGDIMEN)
            this.d = 0;
    };
    BBox.prototype.rescale = function (scale) {
        this.w *= scale;
        this.h *= scale;
        this.d *= scale;
    };
    BBox.prototype.combine = function (cbox, x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var rscale = cbox.rscale;
        var w = x + rscale * (cbox.w + cbox.L + cbox.R);
        var h = y + rscale * cbox.h;
        var d = rscale * cbox.d - y;
        if (w > this.w)
            this.w = w;
        if (h > this.h)
            this.h = h;
        if (d > this.d)
            this.d = d;
    };
    BBox.prototype.append = function (cbox) {
        var scale = cbox.rscale;
        this.w += scale * (cbox.w + cbox.L + cbox.R);
        if (scale * cbox.h > this.h) {
            this.h = scale * cbox.h;
        }
        if (scale * cbox.d > this.d) {
            this.d = scale * cbox.d;
        }
    };
    BBox.prototype.updateFrom = function (cbox) {
        this.h = cbox.h;
        this.d = cbox.d;
        this.w = cbox.w;
        if (cbox.pwidth) {
            this.pwidth = cbox.pwidth;
        }
    };
    BBox.fullWidth = '100%';
    BBox.StyleAdjust = [
        ['borderTopWidth', 'h'],
        ['borderRightWidth', 'w'],
        ['borderBottomWidth', 'd'],
        ['borderLeftWidth', 'w', 0],
        ['paddingTop', 'h'],
        ['paddingRight', 'w'],
        ['paddingBottom', 'd'],
        ['paddingLeft', 'w', 0]
    ];
    return BBox;
}());
exports.BBox = BBox;
//# sourceMappingURL=BBox.js.map