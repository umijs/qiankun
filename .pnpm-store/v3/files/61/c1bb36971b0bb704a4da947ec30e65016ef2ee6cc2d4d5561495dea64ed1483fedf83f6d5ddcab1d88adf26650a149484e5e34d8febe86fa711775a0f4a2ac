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
exports.SVGxml = exports.SVGannotationXML = exports.SVGannotation = exports.SVGsemantics = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var semantics_js_1 = require("../../common/Wrappers/semantics.js");
var semantics_js_2 = require("../../../core/MmlTree/MmlNodes/semantics.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var SVGsemantics = (function (_super) {
    __extends(SVGsemantics, _super);
    function SVGsemantics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGsemantics.prototype.toSVG = function (parent) {
        var svg = this.standardSVGnode(parent);
        if (this.childNodes.length) {
            this.childNodes[0].toSVG(svg);
        }
    };
    SVGsemantics.kind = semantics_js_2.MmlSemantics.prototype.kind;
    return SVGsemantics;
}((0, semantics_js_1.CommonSemanticsMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGsemantics = SVGsemantics;
var SVGannotation = (function (_super) {
    __extends(SVGannotation, _super);
    function SVGannotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGannotation.prototype.toSVG = function (parent) {
        _super.prototype.toSVG.call(this, parent);
    };
    SVGannotation.prototype.computeBBox = function () {
        return this.bbox;
    };
    SVGannotation.kind = semantics_js_2.MmlAnnotation.prototype.kind;
    return SVGannotation;
}(Wrapper_js_1.SVGWrapper));
exports.SVGannotation = SVGannotation;
var SVGannotationXML = (function (_super) {
    __extends(SVGannotationXML, _super);
    function SVGannotationXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGannotationXML.kind = semantics_js_2.MmlAnnotationXML.prototype.kind;
    SVGannotationXML.styles = {
        'foreignObject[data-mjx-xml]': {
            'font-family': 'initial',
            'line-height': 'normal',
            overflow: 'visible'
        }
    };
    return SVGannotationXML;
}(Wrapper_js_1.SVGWrapper));
exports.SVGannotationXML = SVGannotationXML;
var SVGxml = (function (_super) {
    __extends(SVGxml, _super);
    function SVGxml() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGxml.prototype.toSVG = function (parent) {
        var xml = this.adaptor.clone(this.node.getXML());
        var em = this.jax.math.metrics.em * this.jax.math.metrics.scale;
        var scale = this.fixed(1 / em);
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d;
        this.element = this.adaptor.append(parent, this.svg('foreignObject', {
            'data-mjx-xml': true,
            y: this.jax.fixed(-h * em) + 'px',
            width: this.jax.fixed(w * em) + 'px',
            height: this.jax.fixed((h + d) * em) + 'px',
            transform: "scale(".concat(scale, ") matrix(1 0 0 -1 0 0)")
        }, [xml]));
    };
    SVGxml.prototype.computeBBox = function (bbox, _recompute) {
        if (_recompute === void 0) { _recompute = false; }
        var _a = this.jax.measureXMLnode(this.node.getXML()), w = _a.w, h = _a.h, d = _a.d;
        bbox.w = w;
        bbox.h = h;
        bbox.d = d;
    };
    SVGxml.prototype.getStyles = function () { };
    SVGxml.prototype.getScale = function () { };
    SVGxml.prototype.getVariant = function () { };
    SVGxml.kind = MmlNode_js_1.XMLNode.prototype.kind;
    SVGxml.autoStyle = false;
    return SVGxml;
}(Wrapper_js_1.SVGWrapper));
exports.SVGxml = SVGxml;
//# sourceMappingURL=semantics.js.map