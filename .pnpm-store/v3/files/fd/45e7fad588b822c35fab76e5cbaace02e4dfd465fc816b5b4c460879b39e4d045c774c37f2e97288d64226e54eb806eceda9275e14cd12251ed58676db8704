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
exports.CHTMLmpadded = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mpadded_js_1 = require("../../common/Wrappers/mpadded.js");
var mpadded_js_2 = require("../../../core/MmlTree/MmlNodes/mpadded.js");
var CHTMLmpadded = (function (_super) {
    __extends(CHTMLmpadded, _super);
    function CHTMLmpadded() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmpadded.prototype.toCHTML = function (parent) {
        var e_1, _a;
        var chtml = this.standardCHTMLnode(parent);
        var content = [];
        var style = {};
        var _b = __read(this.getDimens(), 9), W = _b[2], dh = _b[3], dd = _b[4], dw = _b[5], x = _b[6], y = _b[7], dx = _b[8];
        if (dw) {
            style.width = this.em(W + dw);
        }
        if (dh || dd) {
            style.margin = this.em(dh) + ' 0 ' + this.em(dd);
        }
        if (x + dx || y) {
            style.position = 'relative';
            var rbox = this.html('mjx-rbox', {
                style: { left: this.em(x + dx), top: this.em(-y), 'max-width': style.width }
            });
            if (x + dx && this.childNodes[0].getBBox().pwidth) {
                this.adaptor.setAttribute(rbox, 'width', 'full');
                this.adaptor.setStyle(rbox, 'left', this.em(x));
            }
            content.push(rbox);
        }
        chtml = this.adaptor.append(chtml, this.html('mjx-block', { style: style }, content));
        try {
            for (var _c = __values(this.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                child.toCHTML(content[0] || chtml);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CHTMLmpadded.kind = mpadded_js_2.MmlMpadded.prototype.kind;
    CHTMLmpadded.styles = {
        'mjx-mpadded': {
            display: 'inline-block'
        },
        'mjx-rbox': {
            display: 'inline-block',
            position: 'relative'
        }
    };
    return CHTMLmpadded;
}((0, mpadded_js_1.CommonMpaddedMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmpadded = CHTMLmpadded;
//# sourceMappingURL=mpadded.js.map