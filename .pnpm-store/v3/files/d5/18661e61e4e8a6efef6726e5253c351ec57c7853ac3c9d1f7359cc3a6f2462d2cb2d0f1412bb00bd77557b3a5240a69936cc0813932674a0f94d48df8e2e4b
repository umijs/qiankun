"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
exports.FontData = exports.NOSTRETCH = exports.H = exports.V = void 0;
var Options_js_1 = require("../../util/Options.js");
exports.V = 1;
exports.H = 2;
exports.NOSTRETCH = { dir: 0 };
var FontData = (function () {
    function FontData(options) {
        var e_1, _a, e_2, _b;
        if (options === void 0) { options = null; }
        this.variant = {};
        this.delimiters = {};
        this.cssFontMap = {};
        this.remapChars = {};
        this.skewIcFactor = .75;
        var CLASS = this.constructor;
        this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), options);
        this.params = __assign({}, CLASS.defaultParams);
        this.sizeVariants = __spreadArray([], __read(CLASS.defaultSizeVariants), false);
        this.stretchVariants = __spreadArray([], __read(CLASS.defaultStretchVariants), false);
        this.cssFontMap = __assign({}, CLASS.defaultCssFonts);
        try {
            for (var _c = __values(Object.keys(this.cssFontMap)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_1 = _d.value;
                if (this.cssFontMap[name_1][0] === 'unknown') {
                    this.cssFontMap[name_1][0] = this.options.unknownFamily;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.cssFamilyPrefix = CLASS.defaultCssFamilyPrefix;
        this.createVariants(CLASS.defaultVariants);
        this.defineDelimiters(CLASS.defaultDelimiters);
        try {
            for (var _e = __values(Object.keys(CLASS.defaultChars)), _f = _e.next(); !_f.done; _f = _e.next()) {
                var name_2 = _f.value;
                this.defineChars(name_2, CLASS.defaultChars[name_2]);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.defineRemap('accent', CLASS.defaultAccentMap);
        this.defineRemap('mo', CLASS.defaultMoMap);
        this.defineRemap('mn', CLASS.defaultMnMap);
    }
    FontData.charOptions = function (font, n) {
        var char = font[n];
        if (char.length === 3) {
            char[3] = {};
        }
        return char[3];
    };
    Object.defineProperty(FontData.prototype, "styles", {
        get: function () {
            return this._styles;
        },
        set: function (style) {
            this._styles = style;
        },
        enumerable: false,
        configurable: true
    });
    FontData.prototype.createVariant = function (name, inherit, link) {
        if (inherit === void 0) { inherit = null; }
        if (link === void 0) { link = null; }
        var variant = {
            linked: [],
            chars: (inherit ? Object.create(this.variant[inherit].chars) : {})
        };
        if (link && this.variant[link]) {
            Object.assign(variant.chars, this.variant[link].chars);
            this.variant[link].linked.push(variant.chars);
            variant.chars = Object.create(variant.chars);
        }
        this.remapSmpChars(variant.chars, name);
        this.variant[name] = variant;
    };
    FontData.prototype.remapSmpChars = function (chars, name) {
        var e_3, _a, e_4, _b;
        var CLASS = this.constructor;
        if (CLASS.VariantSmp[name]) {
            var SmpRemap = CLASS.SmpRemap;
            var SmpGreek = [null, null, CLASS.SmpRemapGreekU, CLASS.SmpRemapGreekL];
            try {
                for (var _c = __values(CLASS.SmpRanges), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var _e = __read(_d.value, 3), i = _e[0], lo = _e[1], hi = _e[2];
                    var base = CLASS.VariantSmp[name][i];
                    if (!base)
                        continue;
                    for (var n = lo; n <= hi; n++) {
                        if (n === 0x3A2)
                            continue;
                        var smp = base + n - lo;
                        chars[n] = this.smpChar(SmpRemap[smp] || smp);
                    }
                    if (SmpGreek[i]) {
                        try {
                            for (var _f = (e_4 = void 0, __values(Object.keys(SmpGreek[i]).map(function (x) { return parseInt(x); }))), _g = _f.next(); !_g.done; _g = _f.next()) {
                                var n = _g.value;
                                chars[n] = this.smpChar(base + SmpGreek[i][n]);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        if (name === 'bold') {
            chars[0x3DC] = this.smpChar(0x1D7CA);
            chars[0x3DD] = this.smpChar(0x1D7CB);
        }
    };
    FontData.prototype.smpChar = function (n) {
        return [, , , { smp: n }];
    };
    FontData.prototype.createVariants = function (variants) {
        var e_5, _a;
        try {
            for (var variants_1 = __values(variants), variants_1_1 = variants_1.next(); !variants_1_1.done; variants_1_1 = variants_1.next()) {
                var variant = variants_1_1.value;
                this.createVariant(variant[0], variant[1], variant[2]);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (variants_1_1 && !variants_1_1.done && (_a = variants_1.return)) _a.call(variants_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
    };
    FontData.prototype.defineChars = function (name, chars) {
        var e_6, _a;
        var variant = this.variant[name];
        Object.assign(variant.chars, chars);
        try {
            for (var _b = __values(variant.linked), _c = _b.next(); !_c.done; _c = _b.next()) {
                var link = _c.value;
                Object.assign(link, chars);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    FontData.prototype.defineDelimiters = function (delims) {
        Object.assign(this.delimiters, delims);
    };
    FontData.prototype.defineRemap = function (name, remap) {
        if (!this.remapChars.hasOwnProperty(name)) {
            this.remapChars[name] = {};
        }
        Object.assign(this.remapChars[name], remap);
    };
    FontData.prototype.getDelimiter = function (n) {
        return this.delimiters[n];
    };
    FontData.prototype.getSizeVariant = function (n, i) {
        if (this.delimiters[n].variants) {
            i = this.delimiters[n].variants[i];
        }
        return this.sizeVariants[i];
    };
    FontData.prototype.getStretchVariant = function (n, i) {
        return this.stretchVariants[this.delimiters[n].stretchv ? this.delimiters[n].stretchv[i] : 0];
    };
    FontData.prototype.getChar = function (name, n) {
        return this.variant[name].chars[n];
    };
    FontData.prototype.getVariant = function (name) {
        return this.variant[name];
    };
    FontData.prototype.getCssFont = function (variant) {
        return this.cssFontMap[variant] || ['serif', false, false];
    };
    FontData.prototype.getFamily = function (family) {
        return (this.cssFamilyPrefix ? this.cssFamilyPrefix + ', ' + family : family);
    };
    FontData.prototype.getRemappedChar = function (name, c) {
        var map = this.remapChars[name] || {};
        return map[c];
    };
    FontData.OPTIONS = {
        unknownFamily: 'serif'
    };
    FontData.JAX = 'common';
    FontData.NAME = '';
    FontData.defaultVariants = [
        ['normal'],
        ['bold', 'normal'],
        ['italic', 'normal'],
        ['bold-italic', 'italic', 'bold'],
        ['double-struck', 'bold'],
        ['fraktur', 'normal'],
        ['bold-fraktur', 'bold', 'fraktur'],
        ['script', 'italic'],
        ['bold-script', 'bold-italic', 'script'],
        ['sans-serif', 'normal'],
        ['bold-sans-serif', 'bold', 'sans-serif'],
        ['sans-serif-italic', 'italic', 'sans-serif'],
        ['sans-serif-bold-italic', 'bold-italic', 'bold-sans-serif'],
        ['monospace', 'normal']
    ];
    FontData.defaultCssFonts = {
        normal: ['unknown', false, false],
        bold: ['unknown', false, true],
        italic: ['unknown', true, false],
        'bold-italic': ['unknown', true, true],
        'double-struck': ['unknown', false, true],
        fraktur: ['unknown', false, false],
        'bold-fraktur': ['unknown', false, true],
        script: ['cursive', false, false],
        'bold-script': ['cursive', false, true],
        'sans-serif': ['sans-serif', false, false],
        'bold-sans-serif': ['sans-serif', false, true],
        'sans-serif-italic': ['sans-serif', true, false],
        'sans-serif-bold-italic': ['sans-serif', true, true],
        monospace: ['monospace', false, false]
    };
    FontData.defaultCssFamilyPrefix = '';
    FontData.VariantSmp = {
        bold: [0x1D400, 0x1D41A, 0x1D6A8, 0x1D6C2, 0x1D7CE],
        italic: [0x1D434, 0x1D44E, 0x1D6E2, 0x1D6FC],
        'bold-italic': [0x1D468, 0x1D482, 0x1D71C, 0x1D736],
        script: [0x1D49C, 0x1D4B6],
        'bold-script': [0x1D4D0, 0x1D4EA],
        fraktur: [0x1D504, 0x1D51E],
        'double-struck': [0x1D538, 0x1D552, , , 0x1D7D8],
        'bold-fraktur': [0x1D56C, 0x1D586],
        'sans-serif': [0x1D5A0, 0x1D5BA, , , 0x1D7E2],
        'bold-sans-serif': [0x1D5D4, 0x1D5EE, 0x1D756, 0x1D770, 0x1D7EC],
        'sans-serif-italic': [0x1D608, 0x1D622],
        'sans-serif-bold-italic': [0x1D63C, 0x1D656, 0x1D790, 0x1D7AA],
        'monospace': [0x1D670, 0x1D68A, , , 0x1D7F6]
    };
    FontData.SmpRanges = [
        [0, 0x41, 0x5A],
        [1, 0x61, 0x7A],
        [2, 0x391, 0x3A9],
        [3, 0x3B1, 0x3C9],
        [4, 0x30, 0x39]
    ];
    FontData.SmpRemap = {
        0x1D455: 0x210E,
        0x1D49D: 0x212C,
        0x1D4A0: 0x2130,
        0x1D4A1: 0x2131,
        0x1D4A3: 0x210B,
        0x1D4A4: 0x2110,
        0x1D4A7: 0x2112,
        0x1D4A8: 0x2133,
        0x1D4AD: 0x211B,
        0x1D4BA: 0x212F,
        0x1D4BC: 0x210A,
        0x1D4C4: 0x2134,
        0x1D506: 0x212D,
        0x1D50B: 0x210C,
        0x1D50C: 0x2111,
        0x1D515: 0x211C,
        0x1D51D: 0x2128,
        0x1D53A: 0x2102,
        0x1D53F: 0x210D,
        0x1D545: 0x2115,
        0x1D547: 0x2119,
        0x1D548: 0x211A,
        0x1D549: 0x211D,
        0x1D551: 0x2124,
    };
    FontData.SmpRemapGreekU = {
        0x2207: 0x19,
        0x03F4: 0x11
    };
    FontData.SmpRemapGreekL = {
        0x3D1: 0x1B,
        0x3D5: 0x1D,
        0x3D6: 0x1F,
        0x3F0: 0x1C,
        0x3F1: 0x1E,
        0x3F5: 0x1A,
        0x2202: 0x19
    };
    FontData.defaultAccentMap = {
        0x0300: '\u02CB',
        0x0301: '\u02CA',
        0x0302: '\u02C6',
        0x0303: '\u02DC',
        0x0304: '\u02C9',
        0x0306: '\u02D8',
        0x0307: '\u02D9',
        0x0308: '\u00A8',
        0x030A: '\u02DA',
        0x030C: '\u02C7',
        0x2192: '\u20D7',
        0x2032: '\'',
        0x2033: '\'\'',
        0x2034: '\'\'\'',
        0x2035: '`',
        0x2036: '``',
        0x2037: '```',
        0x2057: '\'\'\'\'',
        0x20D0: '\u21BC',
        0x20D1: '\u21C0',
        0x20D6: '\u2190',
        0x20E1: '\u2194',
        0x20F0: '*',
        0x20DB: '...',
        0x20DC: '....',
        0x20EC: '\u21C1',
        0x20ED: '\u21BD',
        0x20EE: '\u2190',
        0x20EF: '\u2192'
    };
    FontData.defaultMoMap = {
        0x002D: '\u2212'
    };
    FontData.defaultMnMap = {
        0x002D: '\u2212'
    };
    FontData.defaultParams = {
        x_height: .442,
        quad: 1,
        num1: .676,
        num2: .394,
        num3: .444,
        denom1: .686,
        denom2: .345,
        sup1: .413,
        sup2: .363,
        sup3: .289,
        sub1: .15,
        sub2: .247,
        sup_drop: .386,
        sub_drop: .05,
        delim1: 2.39,
        delim2: 1.0,
        axis_height: .25,
        rule_thickness: .06,
        big_op_spacing1: .111,
        big_op_spacing2: .167,
        big_op_spacing3: .2,
        big_op_spacing4: .6,
        big_op_spacing5: .1,
        surd_height: .075,
        scriptspace: .05,
        nulldelimiterspace: .12,
        delimiterfactor: 901,
        delimitershortfall: .3,
        min_rule_thickness: 1.25,
        separation_factor: 1.75,
        extra_ic: .033
    };
    FontData.defaultDelimiters = {};
    FontData.defaultChars = {};
    FontData.defaultSizeVariants = [];
    FontData.defaultStretchVariants = [];
    return FontData;
}());
exports.FontData = FontData;
//# sourceMappingURL=FontData.js.map