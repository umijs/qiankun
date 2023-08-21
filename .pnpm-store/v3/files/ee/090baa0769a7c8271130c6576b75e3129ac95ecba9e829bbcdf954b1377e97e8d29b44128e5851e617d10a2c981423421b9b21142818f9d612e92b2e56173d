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
exports.CHTMLmsubsup = exports.CHTMLmsup = exports.CHTMLmsub = void 0;
var scriptbase_js_1 = require("./scriptbase.js");
var msubsup_js_1 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_2 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_3 = require("../../common/Wrappers/msubsup.js");
var msubsup_js_4 = require("../../../core/MmlTree/MmlNodes/msubsup.js");
var CHTMLmsub = (function (_super) {
    __extends(CHTMLmsub, _super);
    function CHTMLmsub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmsub.kind = msubsup_js_4.MmlMsub.prototype.kind;
    return CHTMLmsub;
}((0, msubsup_js_1.CommonMsubMixin)(scriptbase_js_1.CHTMLscriptbase)));
exports.CHTMLmsub = CHTMLmsub;
var CHTMLmsup = (function (_super) {
    __extends(CHTMLmsup, _super);
    function CHTMLmsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmsup.kind = msubsup_js_4.MmlMsup.prototype.kind;
    return CHTMLmsup;
}((0, msubsup_js_2.CommonMsupMixin)(scriptbase_js_1.CHTMLscriptbase)));
exports.CHTMLmsup = CHTMLmsup;
var CHTMLmsubsup = (function (_super) {
    __extends(CHTMLmsubsup, _super);
    function CHTMLmsubsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmsubsup.prototype.toCHTML = function (parent) {
        var adaptor = this.adaptor;
        var chtml = this.standardCHTMLnode(parent);
        var _a = __read([this.baseChild, this.supChild, this.subChild], 3), base = _a[0], sup = _a[1], sub = _a[2];
        var _b = __read(this.getUVQ(), 3), v = _b[1], q = _b[2];
        var style = { 'vertical-align': this.em(v) };
        base.toCHTML(chtml);
        var stack = adaptor.append(chtml, this.html('mjx-script', { style: style }));
        sup.toCHTML(stack);
        adaptor.append(stack, this.html('mjx-spacer', { style: { 'margin-top': this.em(q) } }));
        sub.toCHTML(stack);
        var ic = this.getAdjustedIc();
        if (ic) {
            adaptor.setStyle(sup.chtml, 'marginLeft', this.em(ic / sup.bbox.rscale));
        }
        if (this.baseRemoveIc) {
            adaptor.setStyle(stack, 'marginLeft', this.em(-this.baseIc));
        }
    };
    CHTMLmsubsup.kind = msubsup_js_4.MmlMsubsup.prototype.kind;
    CHTMLmsubsup.styles = {
        'mjx-script': {
            display: 'inline-block',
            'padding-right': '.05em',
            'padding-left': '.033em'
        },
        'mjx-script > mjx-spacer': {
            display: 'block'
        }
    };
    return CHTMLmsubsup;
}((0, msubsup_js_3.CommonMsubsupMixin)(scriptbase_js_1.CHTMLscriptbase)));
exports.CHTMLmsubsup = CHTMLmsubsup;
//# sourceMappingURL=msubsup.js.map