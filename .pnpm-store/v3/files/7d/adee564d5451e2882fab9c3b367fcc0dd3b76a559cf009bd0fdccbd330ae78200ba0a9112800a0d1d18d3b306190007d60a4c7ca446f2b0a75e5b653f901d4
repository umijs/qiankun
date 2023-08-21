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
exports.SVGmath = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var math_js_1 = require("../../common/Wrappers/math.js");
var math_js_2 = require("../../../core/MmlTree/MmlNodes/math.js");
var BBox_js_1 = require("../../../util/BBox.js");
var SVGmath = (function (_super) {
    __extends(SVGmath, _super);
    function SVGmath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmath.prototype.toSVG = function (parent) {
        _super.prototype.toSVG.call(this, parent);
        var adaptor = this.adaptor;
        var display = (this.node.attributes.get('display') === 'block');
        if (display) {
            adaptor.setAttribute(this.jax.container, 'display', 'true');
            this.handleDisplay();
        }
        if (this.jax.document.options.internalSpeechTitles) {
            this.handleSpeech();
        }
    };
    SVGmath.prototype.handleDisplay = function () {
        var _a = __read(this.getAlignShift(), 2), align = _a[0], shift = _a[1];
        if (align !== 'center') {
            this.adaptor.setAttribute(this.jax.container, 'justify', align);
        }
        if (this.bbox.pwidth === BBox_js_1.BBox.fullWidth) {
            this.adaptor.setAttribute(this.jax.container, 'width', 'full');
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
                this.jax.minwidth = Math.max(0, L + w + R);
            }
        }
        else {
            this.jax.shift = shift;
        }
    };
    SVGmath.prototype.handleSpeech = function () {
        var e_1, _a;
        var adaptor = this.adaptor;
        var attributes = this.node.attributes;
        var speech = (attributes.get('aria-label') || attributes.get('data-semantic-speech'));
        if (speech) {
            var id = this.getTitleID();
            var label = this.svg('title', { id: id }, [this.text(speech)]);
            adaptor.insert(label, adaptor.firstChild(this.element));
            adaptor.setAttribute(this.element, 'aria-labeledby', id);
            adaptor.removeAttribute(this.element, 'aria-label');
            try {
                for (var _b = __values(this.childNodes[0].childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    adaptor.setAttribute(child.element, 'aria-hidden', 'true');
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    SVGmath.prototype.getTitleID = function () {
        return 'mjx-svg-title-' + String(this.jax.options.titleID++);
    };
    SVGmath.prototype.setChildPWidths = function (recompute, w, _clear) {
        if (w === void 0) { w = null; }
        if (_clear === void 0) { _clear = true; }
        return _super.prototype.setChildPWidths.call(this, recompute, this.parent ? w : this.metrics.containerWidth / this.jax.pxPerEm, false);
    };
    SVGmath.kind = math_js_2.MmlMath.prototype.kind;
    SVGmath.styles = {
        'mjx-container[jax="SVG"][display="true"]': {
            display: 'block',
            'text-align': 'center',
            margin: '1em 0'
        },
        'mjx-container[jax="SVG"][display="true"][width="full"]': {
            display: 'flex'
        },
        'mjx-container[jax="SVG"][justify="left"]': {
            'text-align': 'left'
        },
        'mjx-container[jax="SVG"][justify="right"]': {
            'text-align': 'right'
        }
    };
    return SVGmath;
}((0, math_js_1.CommonMathMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGmath = SVGmath;
//# sourceMappingURL=math.js.map