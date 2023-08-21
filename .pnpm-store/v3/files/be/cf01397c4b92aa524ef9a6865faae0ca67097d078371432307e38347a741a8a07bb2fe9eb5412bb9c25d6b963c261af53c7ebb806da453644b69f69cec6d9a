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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGmtd = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mtd_js_1 = require("../../common/Wrappers/mtd.js");
var mtd_js_2 = require("../../../core/MmlTree/MmlNodes/mtd.js");
var SVGmtd = (function (_super) {
    __extends(SVGmtd, _super);
    function SVGmtd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmtd.prototype.placeCell = function (x, y, W, H, D) {
        var bbox = this.getBBox();
        var h = Math.max(bbox.h, .75);
        var d = Math.max(bbox.d, .25);
        var calign = this.node.attributes.get('columnalign');
        var ralign = this.node.attributes.get('rowalign');
        var alignX = this.getAlignX(W, bbox, calign);
        var alignY = this.getAlignY(H, D, h, d, ralign);
        this.place(x + alignX, y + alignY);
        return [alignX, alignY];
    };
    SVGmtd.prototype.placeColor = function (x, y, W, H) {
        var adaptor = this.adaptor;
        var child = this.firstChild();
        if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-bgcolor')) {
            adaptor.setAttribute(child, 'x', this.fixed(x));
            adaptor.setAttribute(child, 'y', this.fixed(y));
            adaptor.setAttribute(child, 'width', this.fixed(W));
            adaptor.setAttribute(child, 'height', this.fixed(H));
        }
    };
    SVGmtd.kind = mtd_js_2.MmlMtd.prototype.kind;
    return SVGmtd;
}((0, mtd_js_1.CommonMtdMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGmtd = SVGmtd;
//# sourceMappingURL=mtd.js.map