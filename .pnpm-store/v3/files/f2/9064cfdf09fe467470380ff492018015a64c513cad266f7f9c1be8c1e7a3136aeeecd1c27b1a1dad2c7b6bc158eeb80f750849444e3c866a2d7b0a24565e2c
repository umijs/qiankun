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
exports.CHTMLmsqrt = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var msqrt_js_1 = require("../../common/Wrappers/msqrt.js");
var msqrt_js_2 = require("../../../core/MmlTree/MmlNodes/msqrt.js");
var CHTMLmsqrt = (function (_super) {
    __extends(CHTMLmsqrt, _super);
    function CHTMLmsqrt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmsqrt.prototype.toCHTML = function (parent) {
        var surd = this.childNodes[this.surd];
        var base = this.childNodes[this.base];
        var sbox = surd.getBBox();
        var bbox = base.getOuterBBox();
        var _a = __read(this.getPQ(sbox), 2), q = _a[1];
        var t = this.font.params.rule_thickness;
        var H = bbox.h + q + t;
        var CHTML = this.standardCHTMLnode(parent);
        var SURD, BASE, ROOT, root;
        if (this.root != null) {
            ROOT = this.adaptor.append(CHTML, this.html('mjx-root'));
            root = this.childNodes[this.root];
        }
        var SQRT = this.adaptor.append(CHTML, this.html('mjx-sqrt', {}, [
            SURD = this.html('mjx-surd'),
            BASE = this.html('mjx-box', { style: { paddingTop: this.em(q) } })
        ]));
        this.addRoot(ROOT, root, sbox, H);
        surd.toCHTML(SURD);
        base.toCHTML(BASE);
        if (surd.size < 0) {
            this.adaptor.addClass(SQRT, 'mjx-tall');
        }
    };
    CHTMLmsqrt.prototype.addRoot = function (_ROOT, _root, _sbox, _H) {
    };
    CHTMLmsqrt.kind = msqrt_js_2.MmlMsqrt.prototype.kind;
    CHTMLmsqrt.styles = {
        'mjx-root': {
            display: 'inline-block',
            'white-space': 'nowrap'
        },
        'mjx-surd': {
            display: 'inline-block',
            'vertical-align': 'top'
        },
        'mjx-sqrt': {
            display: 'inline-block',
            'padding-top': '.07em'
        },
        'mjx-sqrt > mjx-box': {
            'border-top': '.07em solid'
        },
        'mjx-sqrt.mjx-tall > mjx-box': {
            'padding-left': '.3em',
            'margin-left': '-.3em'
        }
    };
    return CHTMLmsqrt;
}((0, msqrt_js_1.CommonMsqrtMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmsqrt = CHTMLmsqrt;
//# sourceMappingURL=msqrt.js.map