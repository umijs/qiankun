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
exports.CHTMLxml = exports.CHTMLannotationXML = exports.CHTMLannotation = exports.CHTMLsemantics = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var semantics_js_1 = require("../../common/Wrappers/semantics.js");
var semantics_js_2 = require("../../../core/MmlTree/MmlNodes/semantics.js");
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var CHTMLsemantics = (function (_super) {
    __extends(CHTMLsemantics, _super);
    function CHTMLsemantics() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLsemantics.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        if (this.childNodes.length) {
            this.childNodes[0].toCHTML(chtml);
        }
    };
    CHTMLsemantics.kind = semantics_js_2.MmlSemantics.prototype.kind;
    return CHTMLsemantics;
}((0, semantics_js_1.CommonSemanticsMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLsemantics = CHTMLsemantics;
var CHTMLannotation = (function (_super) {
    __extends(CHTMLannotation, _super);
    function CHTMLannotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLannotation.prototype.toCHTML = function (parent) {
        _super.prototype.toCHTML.call(this, parent);
    };
    CHTMLannotation.prototype.computeBBox = function () {
        return this.bbox;
    };
    CHTMLannotation.kind = semantics_js_2.MmlAnnotation.prototype.kind;
    return CHTMLannotation;
}(Wrapper_js_1.CHTMLWrapper));
exports.CHTMLannotation = CHTMLannotation;
var CHTMLannotationXML = (function (_super) {
    __extends(CHTMLannotationXML, _super);
    function CHTMLannotationXML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLannotationXML.kind = semantics_js_2.MmlAnnotationXML.prototype.kind;
    CHTMLannotationXML.styles = {
        'mjx-annotation-xml': {
            'font-family': 'initial',
            'line-height': 'normal'
        }
    };
    return CHTMLannotationXML;
}(Wrapper_js_1.CHTMLWrapper));
exports.CHTMLannotationXML = CHTMLannotationXML;
var CHTMLxml = (function (_super) {
    __extends(CHTMLxml, _super);
    function CHTMLxml() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLxml.prototype.toCHTML = function (parent) {
        this.chtml = this.adaptor.append(parent, this.adaptor.clone(this.node.getXML()));
    };
    CHTMLxml.prototype.computeBBox = function (bbox, _recompute) {
        if (_recompute === void 0) { _recompute = false; }
        var _a = this.jax.measureXMLnode(this.node.getXML()), w = _a.w, h = _a.h, d = _a.d;
        bbox.w = w;
        bbox.h = h;
        bbox.d = d;
    };
    CHTMLxml.prototype.getStyles = function () { };
    CHTMLxml.prototype.getScale = function () { };
    CHTMLxml.prototype.getVariant = function () { };
    CHTMLxml.kind = MmlNode_js_1.XMLNode.prototype.kind;
    CHTMLxml.autoStyle = false;
    return CHTMLxml;
}(Wrapper_js_1.CHTMLWrapper));
exports.CHTMLxml = CHTMLxml;
//# sourceMappingURL=semantics.js.map