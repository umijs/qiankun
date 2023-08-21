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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHTMLWrapper = exports.SPACE = exports.FONTSIZE = void 0;
var LENGTHS = __importStar(require("../../util/lengths.js"));
var Wrapper_js_1 = require("../common/Wrapper.js");
var BBox_js_1 = require("../../util/BBox.js");
exports.FONTSIZE = {
    '70.7%': 's',
    '70%': 's',
    '50%': 'ss',
    '60%': 'Tn',
    '85%': 'sm',
    '120%': 'lg',
    '144%': 'Lg',
    '173%': 'LG',
    '207%': 'hg',
    '249%': 'HG'
};
exports.SPACE = (_a = {},
    _a[LENGTHS.em(2 / 18)] = '1',
    _a[LENGTHS.em(3 / 18)] = '2',
    _a[LENGTHS.em(4 / 18)] = '3',
    _a[LENGTHS.em(5 / 18)] = '4',
    _a[LENGTHS.em(6 / 18)] = '5',
    _a);
var CHTMLWrapper = (function (_super) {
    __extends(CHTMLWrapper, _super);
    function CHTMLWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.chtml = null;
        return _this;
    }
    CHTMLWrapper.prototype.toCHTML = function (parent) {
        var e_1, _a;
        var chtml = this.standardCHTMLnode(parent);
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.toCHTML(chtml);
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
    CHTMLWrapper.prototype.standardCHTMLnode = function (parent) {
        this.markUsed();
        var chtml = this.createCHTMLnode(parent);
        this.handleStyles();
        this.handleVariant();
        this.handleScale();
        this.handleColor();
        this.handleSpace();
        this.handleAttributes();
        this.handlePWidth();
        return chtml;
    };
    CHTMLWrapper.prototype.markUsed = function () {
        this.jax.wrapperUsage.add(this.kind);
    };
    CHTMLWrapper.prototype.createCHTMLnode = function (parent) {
        var href = this.node.attributes.get('href');
        if (href) {
            parent = this.adaptor.append(parent, this.html('a', { href: href }));
        }
        this.chtml = this.adaptor.append(parent, this.html('mjx-' + this.node.kind));
        return this.chtml;
    };
    CHTMLWrapper.prototype.handleStyles = function () {
        if (!this.styles)
            return;
        var styles = this.styles.cssText;
        if (styles) {
            this.adaptor.setAttribute(this.chtml, 'style', styles);
            var family = this.styles.get('font-family');
            if (family) {
                this.adaptor.setStyle(this.chtml, 'font-family', 'MJXZERO, ' + family);
            }
        }
    };
    CHTMLWrapper.prototype.handleVariant = function () {
        if (this.node.isToken && this.variant !== '-explicitFont') {
            this.adaptor.setAttribute(this.chtml, 'class', (this.font.getVariant(this.variant) || this.font.getVariant('normal')).classes);
        }
    };
    CHTMLWrapper.prototype.handleScale = function () {
        this.setScale(this.chtml, this.bbox.rscale);
    };
    CHTMLWrapper.prototype.setScale = function (chtml, rscale) {
        var scale = (Math.abs(rscale - 1) < .001 ? 1 : rscale);
        if (chtml && scale !== 1) {
            var size = this.percent(scale);
            if (exports.FONTSIZE[size]) {
                this.adaptor.setAttribute(chtml, 'size', exports.FONTSIZE[size]);
            }
            else {
                this.adaptor.setStyle(chtml, 'fontSize', size);
            }
        }
        return chtml;
    };
    CHTMLWrapper.prototype.handleSpace = function () {
        var e_2, _a;
        try {
            for (var _b = __values([[this.bbox.L, 'space', 'marginLeft'],
                [this.bbox.R, 'rspace', 'marginRight']]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var data = _c.value;
                var _d = __read(data, 3), dimen = _d[0], name_1 = _d[1], margin = _d[2];
                if (dimen) {
                    var space = this.em(dimen);
                    if (exports.SPACE[space]) {
                        this.adaptor.setAttribute(this.chtml, name_1, exports.SPACE[space]);
                    }
                    else {
                        this.adaptor.setStyle(this.chtml, margin, space);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    CHTMLWrapper.prototype.handleColor = function () {
        var attributes = this.node.attributes;
        var mathcolor = attributes.getExplicit('mathcolor');
        var color = attributes.getExplicit('color');
        var mathbackground = attributes.getExplicit('mathbackground');
        var background = attributes.getExplicit('background');
        if (mathcolor || color) {
            this.adaptor.setStyle(this.chtml, 'color', mathcolor || color);
        }
        if (mathbackground || background) {
            this.adaptor.setStyle(this.chtml, 'backgroundColor', mathbackground || background);
        }
    };
    CHTMLWrapper.prototype.handleAttributes = function () {
        var e_3, _a, e_4, _b;
        var attributes = this.node.attributes;
        var defaults = attributes.getAllDefaults();
        var skip = CHTMLWrapper.skipAttributes;
        try {
            for (var _c = __values(attributes.getExplicitNames()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_2 = _d.value;
                if (skip[name_2] === false || (!(name_2 in defaults) && !skip[name_2] &&
                    !this.adaptor.hasAttribute(this.chtml, name_2))) {
                    this.adaptor.setAttribute(this.chtml, name_2, attributes.getExplicit(name_2));
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
        if (attributes.get('class')) {
            var names = attributes.get('class').trim().split(/ +/);
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_3 = names_1_1.value;
                    this.adaptor.addClass(this.chtml, name_3);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_b = names_1.return)) _b.call(names_1);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
    };
    CHTMLWrapper.prototype.handlePWidth = function () {
        if (this.bbox.pwidth) {
            if (this.bbox.pwidth === BBox_js_1.BBox.fullWidth) {
                this.adaptor.setAttribute(this.chtml, 'width', 'full');
            }
            else {
                this.adaptor.setStyle(this.chtml, 'width', this.bbox.pwidth);
            }
        }
    };
    CHTMLWrapper.prototype.setIndent = function (chtml, align, shift) {
        var adaptor = this.adaptor;
        if (align === 'center' || align === 'left') {
            var L = this.getBBox().L;
            adaptor.setStyle(chtml, 'margin-left', this.em(shift + L));
        }
        if (align === 'center' || align === 'right') {
            var R = this.getBBox().R;
            adaptor.setStyle(chtml, 'margin-right', this.em(-shift + R));
        }
    };
    CHTMLWrapper.prototype.drawBBox = function () {
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d, R = _a.R;
        var box = this.html('mjx-box', { style: {
                opacity: .25, 'margin-left': this.em(-w - R)
            } }, [
            this.html('mjx-box', { style: {
                    height: this.em(h),
                    width: this.em(w),
                    'background-color': 'red'
                } }),
            this.html('mjx-box', { style: {
                    height: this.em(d),
                    width: this.em(w),
                    'margin-left': this.em(-w),
                    'vertical-align': this.em(-d),
                    'background-color': 'green'
                } })
        ]);
        var node = this.chtml || this.parent.chtml;
        var size = this.adaptor.getAttribute(node, 'size');
        if (size) {
            this.adaptor.setAttribute(box, 'size', size);
        }
        var fontsize = this.adaptor.getStyle(node, 'fontSize');
        if (fontsize) {
            this.adaptor.setStyle(box, 'fontSize', fontsize);
        }
        this.adaptor.append(this.adaptor.parent(node), box);
        this.adaptor.setStyle(node, 'backgroundColor', '#FFEE00');
    };
    CHTMLWrapper.prototype.html = function (type, def, content) {
        if (def === void 0) { def = {}; }
        if (content === void 0) { content = []; }
        return this.jax.html(type, def, content);
    };
    CHTMLWrapper.prototype.text = function (text) {
        return this.jax.text(text);
    };
    CHTMLWrapper.prototype.char = function (n) {
        return this.font.charSelector(n).substr(1);
    };
    CHTMLWrapper.kind = 'unknown';
    CHTMLWrapper.autoStyle = true;
    return CHTMLWrapper;
}(Wrapper_js_1.CommonWrapper));
exports.CHTMLWrapper = CHTMLWrapper;
//# sourceMappingURL=Wrapper.js.map