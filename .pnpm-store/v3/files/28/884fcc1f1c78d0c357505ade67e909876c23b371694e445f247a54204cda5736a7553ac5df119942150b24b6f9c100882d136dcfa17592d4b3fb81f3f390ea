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
exports.SVGmerror = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var merror_js_1 = require("../../../core/MmlTree/MmlNodes/merror.js");
var SVGmerror = (function (_super) {
    __extends(SVGmerror, _super);
    function SVGmerror() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmerror.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        var _a = this.getBBox(), h = _a.h, d = _a.d, w = _a.w;
        this.adaptor.append(this.element, this.svg('rect', {
            'data-background': true,
            width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
        }));
        var title = this.node.attributes.get('title');
        if (title) {
            this.adaptor.append(this.element, this.svg('title', {}, [this.adaptor.text(title)]));
        }
        this.addChildren(svg);
    };
    SVGmerror.kind = merror_js_1.MmlMerror.prototype.kind;
    SVGmerror.styles = {
        'g[data-mml-node="merror"] > g': {
            fill: 'red',
            stroke: 'red'
        },
        'g[data-mml-node="merror"] > rect[data-background]': {
            fill: 'yellow',
            stroke: 'none'
        }
    };
    return SVGmerror;
}(Wrapper_js_1.SVGWrapper));
exports.SVGmerror = SVGmerror;
//# sourceMappingURL=merror.js.map