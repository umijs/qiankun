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
exports.CHTMLmath = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var math_js_1 = require("../../common/Wrappers/math.js");
var math_js_2 = require("../../../core/MmlTree/MmlNodes/math.js");
var BBox_js_1 = require("../../../util/BBox.js");
var CHTMLmath = (function (_super) {
    __extends(CHTMLmath, _super);
    function CHTMLmath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmath.prototype.toCHTML = function (parent) {
        _super.prototype.toCHTML.call(this, parent);
        var chtml = this.chtml;
        var adaptor = this.adaptor;
        var display = (this.node.attributes.get('display') === 'block');
        if (display) {
            adaptor.setAttribute(chtml, 'display', 'true');
            adaptor.setAttribute(parent, 'display', 'true');
            this.handleDisplay(parent);
        }
        else {
            this.handleInline(parent);
        }
        adaptor.addClass(chtml, 'MJX-TEX');
    };
    CHTMLmath.prototype.handleDisplay = function (parent) {
        var adaptor = this.adaptor;
        var _a = __read(this.getAlignShift(), 2), align = _a[0], shift = _a[1];
        if (align !== 'center') {
            adaptor.setAttribute(parent, 'justify', align);
        }
        if (this.bbox.pwidth === BBox_js_1.BBox.fullWidth) {
            adaptor.setAttribute(parent, 'width', 'full');
            if (this.jax.table) {
                var _b = this.jax.table.getOuterBBox(), L = _b.L, w = _b.w, R = _b.R;
                if (align === 'right') {
                    R = Math.max(R || -shift, -shift);
                }
                else if (align === 'left') {
                    L = Math.max(L || shift, shift);
                }
                else if (align === 'center') {
                    w += 2 * Math.abs(shift);
                }
                var W = this.em(Math.max(0, L + w + R));
                adaptor.setStyle(parent, 'min-width', W);
                adaptor.setStyle(this.jax.table.chtml, 'min-width', W);
            }
        }
        else {
            this.setIndent(this.chtml, align, shift);
        }
    };
    CHTMLmath.prototype.handleInline = function (parent) {
        var adaptor = this.adaptor;
        var margin = adaptor.getStyle(this.chtml, 'margin-right');
        if (margin) {
            adaptor.setStyle(this.chtml, 'margin-right', '');
            adaptor.setStyle(parent, 'margin-right', margin);
            adaptor.setStyle(parent, 'width', '0');
        }
    };
    CHTMLmath.prototype.setChildPWidths = function (recompute, w, clear) {
        if (w === void 0) { w = null; }
        if (clear === void 0) { clear = true; }
        return (this.parent ? _super.prototype.setChildPWidths.call(this, recompute, w, clear) : false);
    };
    CHTMLmath.kind = math_js_2.MmlMath.prototype.kind;
    CHTMLmath.styles = {
        'mjx-math': {
            'line-height': 0,
            'text-align': 'left',
            'text-indent': 0,
            'font-style': 'normal',
            'font-weight': 'normal',
            'font-size': '100%',
            'font-size-adjust': 'none',
            'letter-spacing': 'normal',
            'border-collapse': 'collapse',
            'word-wrap': 'normal',
            'word-spacing': 'normal',
            'white-space': 'nowrap',
            'direction': 'ltr',
            'padding': '1px 0'
        },
        'mjx-container[jax="CHTML"][display="true"]': {
            display: 'block',
            'text-align': 'center',
            margin: '1em 0'
        },
        'mjx-container[jax="CHTML"][display="true"][width="full"]': {
            display: 'flex'
        },
        'mjx-container[jax="CHTML"][display="true"] mjx-math': {
            padding: 0
        },
        'mjx-container[jax="CHTML"][justify="left"]': {
            'text-align': 'left'
        },
        'mjx-container[jax="CHTML"][justify="right"]': {
            'text-align': 'right'
        }
    };
    return CHTMLmath;
}((0, math_js_1.CommonMathMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmath = CHTMLmath;
//# sourceMappingURL=math.js.map