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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
exports.AddCSS = exports.CHTMLFontData = void 0;
var FontData_js_1 = require("../common/FontData.js");
var Usage_js_1 = require("./Usage.js");
var lengths_js_1 = require("../../util/lengths.js");
__exportStar(require("../common/FontData.js"), exports);
var CHTMLFontData = (function (_super) {
    __extends(CHTMLFontData, _super);
    function CHTMLFontData() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.charUsage = new Usage_js_1.Usage();
        _this.delimUsage = new Usage_js_1.Usage();
        return _this;
    }
    CHTMLFontData.charOptions = function (font, n) {
        return _super.charOptions.call(this, font, n);
    };
    CHTMLFontData.prototype.adaptiveCSS = function (adapt) {
        this.options.adaptiveCSS = adapt;
    };
    CHTMLFontData.prototype.clearCache = function () {
        if (this.options.adaptiveCSS) {
            this.charUsage.clear();
            this.delimUsage.clear();
        }
    };
    CHTMLFontData.prototype.createVariant = function (name, inherit, link) {
        if (inherit === void 0) { inherit = null; }
        if (link === void 0) { link = null; }
        _super.prototype.createVariant.call(this, name, inherit, link);
        var CLASS = this.constructor;
        this.variant[name].classes = CLASS.defaultVariantClasses[name];
        this.variant[name].letter = CLASS.defaultVariantLetters[name];
    };
    CHTMLFontData.prototype.defineChars = function (name, chars) {
        var e_1, _a;
        _super.prototype.defineChars.call(this, name, chars);
        var letter = this.variant[name].letter;
        try {
            for (var _b = __values(Object.keys(chars)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var n = _c.value;
                var options = CHTMLFontData.charOptions(chars, parseInt(n));
                if (options.f === undefined) {
                    options.f = letter;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Object.defineProperty(CHTMLFontData.prototype, "styles", {
        get: function () {
            var CLASS = this.constructor;
            var styles = __assign({}, CLASS.defaultStyles);
            this.addFontURLs(styles, CLASS.defaultFonts, this.options.fontURL);
            if (this.options.adaptiveCSS) {
                this.updateStyles(styles);
            }
            else {
                this.allStyles(styles);
            }
            return styles;
        },
        enumerable: false,
        configurable: true
    });
    CHTMLFontData.prototype.updateStyles = function (styles) {
        var e_2, _a, e_3, _b;
        try {
            for (var _c = __values(this.delimUsage.update()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var N = _d.value;
                this.addDelimiterStyles(styles, N, this.delimiters[N]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var _e = __values(this.charUsage.update()), _f = _e.next(); !_f.done; _f = _e.next()) {
                var _g = __read(_f.value, 2), name_1 = _g[0], N = _g[1];
                var variant = this.variant[name_1];
                this.addCharStyles(styles, variant.letter, N, variant.chars[N]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return styles;
    };
    CHTMLFontData.prototype.allStyles = function (styles) {
        var e_4, _a, e_5, _b, e_6, _c;
        try {
            for (var _d = __values(Object.keys(this.delimiters)), _e = _d.next(); !_e.done; _e = _d.next()) {
                var n = _e.value;
                var N = parseInt(n);
                this.addDelimiterStyles(styles, N, this.delimiters[N]);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_4) throw e_4.error; }
        }
        try {
            for (var _f = __values(Object.keys(this.variant)), _g = _f.next(); !_g.done; _g = _f.next()) {
                var name_2 = _g.value;
                var variant = this.variant[name_2];
                var vletter = variant.letter;
                try {
                    for (var _h = (e_6 = void 0, __values(Object.keys(variant.chars))), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var n = _j.value;
                        var N = parseInt(n);
                        var char = variant.chars[N];
                        if ((char[3] || {}).smp)
                            continue;
                        if (char.length < 4) {
                            char[3] = {};
                        }
                        this.addCharStyles(styles, vletter, N, char);
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    CHTMLFontData.prototype.addFontURLs = function (styles, fonts, url) {
        var e_7, _a;
        try {
            for (var _b = __values(Object.keys(fonts)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_3 = _c.value;
                var font = __assign({}, fonts[name_3]);
                font.src = font.src.replace(/%%URL%%/, url);
                styles[name_3] = font;
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    CHTMLFontData.prototype.addDelimiterStyles = function (styles, n, data) {
        var c = this.charSelector(n);
        if (data.c && data.c !== n) {
            c = this.charSelector(data.c);
            styles['.mjx-stretched mjx-c' + c + '::before'] = {
                content: this.charContent(data.c)
            };
        }
        if (!data.stretch)
            return;
        if (data.dir === 1) {
            this.addDelimiterVStyles(styles, c, data);
        }
        else {
            this.addDelimiterHStyles(styles, c, data);
        }
    };
    CHTMLFontData.prototype.addDelimiterVStyles = function (styles, c, data) {
        var HDW = data.HDW;
        var _a = __read(data.stretch, 4), beg = _a[0], ext = _a[1], end = _a[2], mid = _a[3];
        var Hb = this.addDelimiterVPart(styles, c, 'beg', beg, HDW);
        this.addDelimiterVPart(styles, c, 'ext', ext, HDW);
        var He = this.addDelimiterVPart(styles, c, 'end', end, HDW);
        var css = {};
        if (mid) {
            var Hm = this.addDelimiterVPart(styles, c, 'mid', mid, HDW);
            css.height = '50%';
            styles['mjx-stretchy-v' + c + ' > mjx-mid'] = {
                'margin-top': this.em(-Hm / 2),
                'margin-bottom': this.em(-Hm / 2)
            };
        }
        if (Hb) {
            css['border-top-width'] = this.em0(Hb - .03);
        }
        if (He) {
            css['border-bottom-width'] = this.em0(He - .03);
            styles['mjx-stretchy-v' + c + ' > mjx-end'] = { 'margin-top': this.em(-He) };
        }
        if (Object.keys(css).length) {
            styles['mjx-stretchy-v' + c + ' > mjx-ext'] = css;
        }
    };
    CHTMLFontData.prototype.addDelimiterVPart = function (styles, c, part, n, HDW) {
        if (!n)
            return 0;
        var data = this.getDelimiterData(n);
        var dw = (HDW[2] - data[2]) / 2;
        var css = { content: this.charContent(n) };
        if (part !== 'ext') {
            css.padding = this.padding(data, dw);
        }
        else {
            css.width = this.em0(HDW[2]);
            if (dw) {
                css['padding-left'] = this.em0(dw);
            }
        }
        styles['mjx-stretchy-v' + c + ' mjx-' + part + ' mjx-c::before'] = css;
        return data[0] + data[1];
    };
    CHTMLFontData.prototype.addDelimiterHStyles = function (styles, c, data) {
        var _a = __read(data.stretch, 4), beg = _a[0], ext = _a[1], end = _a[2], mid = _a[3];
        var HDW = data.HDW;
        this.addDelimiterHPart(styles, c, 'beg', beg, HDW);
        this.addDelimiterHPart(styles, c, 'ext', ext, HDW);
        this.addDelimiterHPart(styles, c, 'end', end, HDW);
        if (mid) {
            this.addDelimiterHPart(styles, c, 'mid', mid, HDW);
            styles['mjx-stretchy-h' + c + ' > mjx-ext'] = { width: '50%' };
        }
    };
    CHTMLFontData.prototype.addDelimiterHPart = function (styles, c, part, n, HDW) {
        if (!n)
            return;
        var data = this.getDelimiterData(n);
        var options = data[3];
        var css = { content: (options && options.c ? '"' + options.c + '"' : this.charContent(n)) };
        css.padding = this.padding(HDW, 0, -HDW[2]);
        styles['mjx-stretchy-h' + c + ' mjx-' + part + ' mjx-c::before'] = css;
    };
    CHTMLFontData.prototype.addCharStyles = function (styles, vletter, n, data) {
        var options = data[3];
        var letter = (options.f !== undefined ? options.f : vletter);
        var selector = 'mjx-c' + this.charSelector(n) + (letter ? '.TEX-' + letter : '');
        styles[selector + '::before'] = {
            padding: this.padding(data, 0, options.ic || 0),
            content: (options.c != null ? '"' + options.c + '"' : this.charContent(n))
        };
    };
    CHTMLFontData.prototype.getDelimiterData = function (n) {
        return this.getChar('-smallop', n);
    };
    CHTMLFontData.prototype.em = function (n) {
        return (0, lengths_js_1.em)(n);
    };
    CHTMLFontData.prototype.em0 = function (n) {
        return (0, lengths_js_1.em)(Math.max(0, n));
    };
    CHTMLFontData.prototype.padding = function (_a, dw, ic) {
        var _b = __read(_a, 3), h = _b[0], d = _b[1], w = _b[2];
        if (dw === void 0) { dw = 0; }
        if (ic === void 0) { ic = 0; }
        return [h, w + ic, d, dw].map(this.em0).join(' ');
    };
    CHTMLFontData.prototype.charContent = function (n) {
        return '"' + (n >= 0x20 && n <= 0x7E && n !== 0x22 && n !== 0x27 && n !== 0x5C ?
            String.fromCharCode(n) : '\\' + n.toString(16).toUpperCase()) + '"';
    };
    CHTMLFontData.prototype.charSelector = function (n) {
        return '.mjx-c' + n.toString(16).toUpperCase();
    };
    CHTMLFontData.OPTIONS = __assign(__assign({}, FontData_js_1.FontData.OPTIONS), { fontURL: 'js/output/chtml/fonts/tex-woff-v2' });
    CHTMLFontData.JAX = 'CHTML';
    CHTMLFontData.defaultVariantClasses = {};
    CHTMLFontData.defaultVariantLetters = {};
    CHTMLFontData.defaultStyles = {
        'mjx-c::before': {
            display: 'block',
            width: 0
        }
    };
    CHTMLFontData.defaultFonts = {
        '@font-face /* 0 */': {
            'font-family': 'MJXZERO',
            src: 'url("%%URL%%/MathJax_Zero.woff") format("woff")'
        }
    };
    return CHTMLFontData;
}(FontData_js_1.FontData));
exports.CHTMLFontData = CHTMLFontData;
function AddCSS(font, options) {
    var e_8, _a;
    try {
        for (var _b = __values(Object.keys(options)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var c = _c.value;
            var n = parseInt(c);
            Object.assign(FontData_js_1.FontData.charOptions(font, n), options[n]);
        }
    }
    catch (e_8_1) { e_8 = { error: e_8_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_8) throw e_8.error; }
    }
    return font;
}
exports.AddCSS = AddCSS;
//# sourceMappingURL=FontData.js.map