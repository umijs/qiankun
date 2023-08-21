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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHTMLscriptbase = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var scriptbase_js_1 = require("../../common/Wrappers/scriptbase.js");
var CHTMLscriptbase = (function (_super) {
    __extends(CHTMLscriptbase, _super);
    function CHTMLscriptbase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLscriptbase.prototype.toCHTML = function (parent) {
        this.chtml = this.standardCHTMLnode(parent);
        var _a = __read(this.getOffset(), 2), x = _a[0], v = _a[1];
        var dx = x - (this.baseRemoveIc ? this.baseIc : 0);
        var style = { 'vertical-align': this.em(v) };
        if (dx) {
            style['margin-left'] = this.em(dx);
        }
        this.baseChild.toCHTML(this.chtml);
        this.scriptChild.toCHTML(this.adaptor.append(this.chtml, this.html('mjx-script', { style: style })));
    };
    CHTMLscriptbase.prototype.setDeltaW = function (nodes, dx) {
        for (var i = 0; i < dx.length; i++) {
            if (dx[i]) {
                this.adaptor.setStyle(nodes[i], 'paddingLeft', this.em(dx[i]));
            }
        }
    };
    CHTMLscriptbase.prototype.adjustOverDepth = function (over, overbox) {
        if (overbox.d >= 0)
            return;
        this.adaptor.setStyle(over, 'marginBottom', this.em(overbox.d * overbox.rscale));
    };
    CHTMLscriptbase.prototype.adjustUnderDepth = function (under, underbox) {
        var e_1, _a;
        if (underbox.d >= 0)
            return;
        var adaptor = this.adaptor;
        var v = this.em(underbox.d);
        var box = this.html('mjx-box', { style: { 'margin-bottom': v, 'vertical-align': v } });
        try {
            for (var _b = __values(adaptor.childNodes(adaptor.firstChild(under))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                adaptor.append(box, child);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        adaptor.append(adaptor.firstChild(under), box);
    };
    CHTMLscriptbase.prototype.adjustBaseHeight = function (base, basebox) {
        if (this.node.attributes.get('accent')) {
            var minH = this.font.params.x_height * basebox.scale;
            if (basebox.h < minH) {
                this.adaptor.setStyle(base, 'paddingTop', this.em(minH - basebox.h));
                basebox.h = minH;
            }
        }
    };
    CHTMLscriptbase.kind = 'scriptbase';
    return CHTMLscriptbase;
}((0, scriptbase_js_1.CommonScriptbaseMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLscriptbase = CHTMLscriptbase;
//# sourceMappingURL=scriptbase.js.map