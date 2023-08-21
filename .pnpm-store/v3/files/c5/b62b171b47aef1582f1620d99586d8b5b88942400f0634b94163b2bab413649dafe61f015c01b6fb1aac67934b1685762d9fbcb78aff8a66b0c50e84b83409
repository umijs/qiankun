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
exports.SVGmmultiscripts = exports.AlignX = void 0;
var msubsup_js_1 = require("./msubsup.js");
var mmultiscripts_js_1 = require("../../common/Wrappers/mmultiscripts.js");
var mmultiscripts_js_2 = require("../../../core/MmlTree/MmlNodes/mmultiscripts.js");
var string_js_1 = require("../../../util/string.js");
function AlignX(align) {
    return {
        left: function (_w, _W) { return 0; },
        center: function (w, W) { return (W - w) / 2; },
        right: function (w, W) { return W - w; }
    }[align] || (function (_w, _W) { return 0; });
}
exports.AlignX = AlignX;
var SVGmmultiscripts = (function (_super) {
    __extends(SVGmmultiscripts, _super);
    function SVGmmultiscripts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmmultiscripts.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var data = this.scriptData;
        var scriptalign = this.node.getProperty('scriptalign') || 'right left';
        var _a = __read((0, string_js_1.split)(scriptalign + ' ' + scriptalign), 2), preAlign = _a[0], postAlign = _a[1];
        var sub = this.combinePrePost(data.sub, data.psub);
        var sup = this.combinePrePost(data.sup, data.psup);
        var _b = __read(this.getUVQ(sub, sup), 2), u = _b[0], v = _b[1];
        var x = 0;
        if (data.numPrescripts) {
            x = this.addScripts(.05, u, v, this.firstPrescript, data.numPrescripts, preAlign);
        }
        var base = this.baseChild;
        base.toSVG(svg);
        base.place(x, 0);
        x += base.getOuterBBox().w;
        if (data.numScripts) {
            this.addScripts(x, u, v, 1, data.numScripts, postAlign);
        }
    };
    SVGmmultiscripts.prototype.addScripts = function (x, u, v, i, n, align) {
        var adaptor = this.adaptor;
        var alignX = AlignX(align);
        var supRow = adaptor.append(this.element, this.svg('g'));
        var subRow = adaptor.append(this.element, this.svg('g'));
        this.place(x, u, supRow);
        this.place(x, v, subRow);
        var m = i + 2 * n;
        var dx = 0;
        while (i < m) {
            var _a = __read([this.childNodes[i++], this.childNodes[i++]], 2), sub = _a[0], sup = _a[1];
            var _b = __read([sub.getOuterBBox(), sup.getOuterBBox()], 2), subbox = _b[0], supbox = _b[1];
            var _c = __read([subbox.rscale, supbox.rscale], 2), subr = _c[0], supr = _c[1];
            var w = Math.max(subbox.w * subr, supbox.w * supr);
            sub.toSVG(subRow);
            sup.toSVG(supRow);
            sub.place(dx + alignX(subbox.w * subr, w), 0);
            sup.place(dx + alignX(supbox.w * supr, w), 0);
            dx += w;
        }
        return x + dx;
    };
    SVGmmultiscripts.kind = mmultiscripts_js_2.MmlMmultiscripts.prototype.kind;
    return SVGmmultiscripts;
}((0, mmultiscripts_js_1.CommonMmultiscriptsMixin)(msubsup_js_1.SVGmsubsup)));
exports.SVGmmultiscripts = SVGmmultiscripts;
//# sourceMappingURL=mmultiscripts.js.map