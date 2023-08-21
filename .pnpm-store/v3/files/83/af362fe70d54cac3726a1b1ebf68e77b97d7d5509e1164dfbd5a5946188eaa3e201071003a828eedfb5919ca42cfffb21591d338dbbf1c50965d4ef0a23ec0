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
exports.SVGWrapper = void 0;
var BBox_js_1 = require("../../util/BBox.js");
var Wrapper_js_1 = require("../common/Wrapper.js");
var svg_js_1 = require("../svg.js");
var SVGWrapper = (function (_super) {
    __extends(SVGWrapper, _super);
    function SVGWrapper() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = null;
        _this.dx = 0;
        return _this;
    }
    SVGWrapper.prototype.toSVG = function (parent) {
        this.addChildren(this.standardSVGnode(parent));
    };
    SVGWrapper.prototype.addChildren = function (parent) {
        var e_1, _a;
        var x = 0;
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.toSVG(parent);
                var bbox = child.getOuterBBox();
                if (child.element) {
                    child.place(x + bbox.L * bbox.rscale, 0);
                }
                x += (bbox.L + bbox.w + bbox.R) * bbox.rscale;
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
    SVGWrapper.prototype.standardSVGnode = function (parent) {
        var svg = this.createSVGnode(parent);
        this.handleStyles();
        this.handleScale();
        this.handleBorder();
        this.handleColor();
        this.handleAttributes();
        return svg;
    };
    SVGWrapper.prototype.createSVGnode = function (parent) {
        this.element = this.svg('g', { 'data-mml-node': this.node.kind });
        var href = this.node.attributes.get('href');
        if (href) {
            parent = this.adaptor.append(parent, this.svg('a', { href: href }));
            var _a = this.getOuterBBox(), h = _a.h, d = _a.d, w = _a.w;
            this.adaptor.append(this.element, this.svg('rect', {
                'data-hitbox': true, fill: 'none', stroke: 'none', 'pointer-events': 'all',
                width: this.fixed(w), height: this.fixed(h + d), y: this.fixed(-d)
            }));
        }
        this.adaptor.append(parent, this.element);
        return this.element;
    };
    SVGWrapper.prototype.handleStyles = function () {
        var _this = this;
        if (!this.styles)
            return;
        var styles = this.styles.cssText;
        if (styles) {
            this.adaptor.setAttribute(this.element, 'style', styles);
        }
        BBox_js_1.BBox.StyleAdjust.forEach(function (_a) {
            var _b = __read(_a, 3), name = _b[0], lr = _b[2];
            if (lr !== 0)
                return;
            var x = _this.styles.get(name);
            if (x) {
                _this.dx += _this.length2em(x, 1, _this.bbox.rscale);
            }
        });
    };
    SVGWrapper.prototype.handleScale = function () {
        if (this.bbox.rscale !== 1) {
            var scale = 'scale(' + this.fixed(this.bbox.rscale / 1000, 3) + ')';
            this.adaptor.setAttribute(this.element, 'transform', scale);
        }
    };
    SVGWrapper.prototype.handleColor = function () {
        var _a;
        var adaptor = this.adaptor;
        var attributes = this.node.attributes;
        var mathcolor = attributes.getExplicit('mathcolor');
        var color = attributes.getExplicit('color');
        var mathbackground = attributes.getExplicit('mathbackground');
        var background = attributes.getExplicit('background');
        var bgcolor = (((_a = this.styles) === null || _a === void 0 ? void 0 : _a.get('background-color')) || '');
        if (mathcolor || color) {
            adaptor.setAttribute(this.element, 'fill', mathcolor || color);
            adaptor.setAttribute(this.element, 'stroke', mathcolor || color);
        }
        if (mathbackground || background || bgcolor) {
            var _b = this.getOuterBBox(), h = _b.h, d = _b.d, w = _b.w;
            var rect = this.svg('rect', {
                fill: mathbackground || background || bgcolor,
                x: this.fixed(-this.dx), y: this.fixed(-d),
                width: this.fixed(w),
                height: this.fixed(h + d),
                'data-bgcolor': true
            });
            var child = adaptor.firstChild(this.element);
            if (child) {
                adaptor.insert(rect, child);
            }
            else {
                adaptor.append(this.element, rect);
            }
        }
    };
    SVGWrapper.prototype.handleBorder = function () {
        var e_2, _a, e_3, _b;
        if (!this.styles)
            return;
        var width = Array(4).fill(0);
        var style = Array(4);
        var color = Array(4);
        try {
            for (var _c = __values([['Top', 0], ['Right', 1], ['Bottom', 2], ['Left', 3]]), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), name_1 = _e[0], i = _e[1];
                var key = 'border' + name_1;
                var w_1 = this.styles.get(key + 'Width');
                if (!w_1)
                    continue;
                width[i] = Math.max(0, this.length2em(w_1, 1, this.bbox.rscale));
                style[i] = this.styles.get(key + 'Style') || 'solid';
                color[i] = this.styles.get(key + 'Color') || 'currentColor';
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
        var f = SVGWrapper.borderFuzz;
        var bbox = this.getOuterBBox();
        var _f = __read([bbox.h + f, bbox.d + f, bbox.w + f], 3), h = _f[0], d = _f[1], w = _f[2];
        var outerRT = [w, h];
        var outerLT = [-f, h];
        var outerRB = [w, -d];
        var outerLB = [-f, -d];
        var innerRT = [w - width[1], h - width[0]];
        var innerLT = [-f + width[3], h - width[0]];
        var innerRB = [w - width[1], -d + width[2]];
        var innerLB = [-f + width[3], -d + width[2]];
        var paths = [
            [outerLT, outerRT, innerRT, innerLT],
            [outerRB, outerRT, innerRT, innerRB],
            [outerLB, outerRB, innerRB, innerLB],
            [outerLB, outerLT, innerLT, innerLB]
        ];
        var adaptor = this.adaptor;
        var child = adaptor.firstChild(this.element);
        try {
            for (var _g = __values([0, 1, 2, 3]), _h = _g.next(); !_h.done; _h = _g.next()) {
                var i = _h.value;
                if (!width[i])
                    continue;
                var path = paths[i];
                if (style[i] === 'dashed' || style[i] === 'dotted') {
                    this.addBorderBroken(path, color[i], style[i], width[i], i);
                }
                else {
                    this.addBorderSolid(path, color[i], child);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    SVGWrapper.prototype.addBorderSolid = function (path, color, child) {
        var _this = this;
        var border = this.svg('polygon', {
            points: path.map(function (_a) {
                var _b = __read(_a, 2), x = _b[0], y = _b[1];
                return "".concat(_this.fixed(x - _this.dx), ",").concat(_this.fixed(y));
            }).join(' '),
            stroke: 'none',
            fill: color
        });
        if (child) {
            this.adaptor.insert(border, child);
        }
        else {
            this.adaptor.append(this.element, border);
        }
    };
    SVGWrapper.prototype.addBorderBroken = function (path, color, style, t, i) {
        var dot = (style === 'dotted');
        var t2 = t / 2;
        var _a = __read([[t2, -t2, -t2, -t2], [-t2, t2, -t2, -t2], [t2, t2, -t2, t2], [t2, t2, t2, -t2]][i], 4), tx1 = _a[0], ty1 = _a[1], tx2 = _a[2], ty2 = _a[3];
        var _b = __read(path, 2), A = _b[0], B = _b[1];
        var x1 = A[0] + tx1 - this.dx, y1 = A[1] + ty1;
        var x2 = B[0] + tx2 - this.dx, y2 = B[1] + ty2;
        var W = Math.abs(i % 2 ? y2 - y1 : x2 - x1);
        var n = (dot ? Math.ceil(W / (2 * t)) : Math.ceil((W - t) / (4 * t)));
        var m = W / (4 * n + 1);
        var line = this.svg('line', {
            x1: this.fixed(x1), y1: this.fixed(y1),
            x2: this.fixed(x2), y2: this.fixed(y2),
            'stroke-width': this.fixed(t), stroke: color, 'stroke-linecap': dot ? 'round' : 'square',
            'stroke-dasharray': dot ? [1, this.fixed(W / n - .002)].join(' ') : [this.fixed(m), this.fixed(3 * m)].join(' ')
        });
        var adaptor = this.adaptor;
        var child = adaptor.firstChild(this.element);
        if (child) {
            adaptor.insert(line, child);
        }
        else {
            adaptor.append(this.element, line);
        }
    };
    SVGWrapper.prototype.handleAttributes = function () {
        var e_4, _a, e_5, _b;
        var attributes = this.node.attributes;
        var defaults = attributes.getAllDefaults();
        var skip = SVGWrapper.skipAttributes;
        try {
            for (var _c = __values(attributes.getExplicitNames()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_2 = _d.value;
                if (skip[name_2] === false || (!(name_2 in defaults) && !skip[name_2] &&
                    !this.adaptor.hasAttribute(this.element, name_2))) {
                    this.adaptor.setAttribute(this.element, name_2, attributes.getExplicit(name_2));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        if (attributes.get('class')) {
            var names = attributes.get('class').trim().split(/ +/);
            try {
                for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                    var name_3 = names_1_1.value;
                    this.adaptor.addClass(this.element, name_3);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (names_1_1 && !names_1_1.done && (_b = names_1.return)) _b.call(names_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
    };
    SVGWrapper.prototype.place = function (x, y, element) {
        if (element === void 0) { element = null; }
        x += this.dx;
        if (!(x || y))
            return;
        if (!element) {
            element = this.element;
            y = this.handleId(y);
        }
        var translate = "translate(".concat(this.fixed(x), ",").concat(this.fixed(y), ")");
        var transform = this.adaptor.getAttribute(element, 'transform') || '';
        this.adaptor.setAttribute(element, 'transform', translate + (transform ? ' ' + transform : ''));
    };
    SVGWrapper.prototype.handleId = function (y) {
        if (!this.node.attributes || !this.node.attributes.get('id')) {
            return y;
        }
        var adaptor = this.adaptor;
        var h = this.getBBox().h;
        var children = adaptor.childNodes(this.element);
        children.forEach(function (child) { return adaptor.remove(child); });
        var g = this.svg('g', { 'data-idbox': true, transform: "translate(0,".concat(this.fixed(-h), ")") }, children);
        adaptor.append(this.element, this.svg('text', { 'data-id-align': true }, [this.text('')]));
        adaptor.append(this.element, g);
        return y + h;
    };
    SVGWrapper.prototype.firstChild = function () {
        var adaptor = this.adaptor;
        var child = adaptor.firstChild(this.element);
        if (child && adaptor.kind(child) === 'text' && adaptor.getAttribute(child, 'data-id-align')) {
            child = adaptor.firstChild(adaptor.next(child));
        }
        if (child && adaptor.kind(child) === 'rect' && adaptor.getAttribute(child, 'data-hitbox')) {
            child = adaptor.next(child);
        }
        return child;
    };
    SVGWrapper.prototype.placeChar = function (n, x, y, parent, variant) {
        var e_6, _a;
        if (variant === void 0) { variant = null; }
        if (variant === null) {
            variant = this.variant;
        }
        var C = n.toString(16).toUpperCase();
        var _b = __read(this.getVariantChar(variant, n), 4), w = _b[2], data = _b[3];
        if ('p' in data) {
            var path = (data.p ? 'M' + data.p + 'Z' : '');
            this.place(x, y, this.adaptor.append(parent, this.charNode(variant, C, path)));
        }
        else if ('c' in data) {
            var g = this.adaptor.append(parent, this.svg('g', { 'data-c': C }));
            this.place(x, y, g);
            x = 0;
            try {
                for (var _c = __values(this.unicodeChars(data.c, variant)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var n_1 = _d.value;
                    x += this.placeChar(n_1, x, y, g, variant);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        else if (data.unknown) {
            var char = String.fromCodePoint(n);
            var text = this.adaptor.append(parent, this.jax.unknownText(char, variant));
            this.place(x, y, text);
            return this.jax.measureTextNodeWithCache(text, char, variant).w;
        }
        return w;
    };
    SVGWrapper.prototype.charNode = function (variant, C, path) {
        var cache = this.jax.options.fontCache;
        return (cache !== 'none' ? this.useNode(variant, C, path) : this.pathNode(C, path));
    };
    SVGWrapper.prototype.pathNode = function (C, path) {
        return this.svg('path', { 'data-c': C, d: path });
    };
    SVGWrapper.prototype.useNode = function (variant, C, path) {
        var use = this.svg('use', { 'data-c': C });
        var id = '#' + this.jax.fontCache.cachePath(variant, C, path);
        this.adaptor.setAttribute(use, 'href', id, svg_js_1.XLINKNS);
        return use;
    };
    SVGWrapper.prototype.drawBBox = function () {
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d;
        var box = this.svg('g', { style: {
                opacity: .25
            } }, [
            this.svg('rect', {
                fill: 'red',
                height: this.fixed(h),
                width: this.fixed(w)
            }),
            this.svg('rect', {
                fill: 'green',
                height: this.fixed(d),
                width: this.fixed(w),
                y: this.fixed(-d)
            })
        ]);
        var node = this.element || this.parent.element;
        this.adaptor.append(node, box);
    };
    SVGWrapper.prototype.html = function (type, def, content) {
        if (def === void 0) { def = {}; }
        if (content === void 0) { content = []; }
        return this.jax.html(type, def, content);
    };
    SVGWrapper.prototype.svg = function (type, def, content) {
        if (def === void 0) { def = {}; }
        if (content === void 0) { content = []; }
        return this.jax.svg(type, def, content);
    };
    SVGWrapper.prototype.text = function (text) {
        return this.jax.text(text);
    };
    SVGWrapper.prototype.fixed = function (x, n) {
        if (n === void 0) { n = 1; }
        return this.jax.fixed(x * 1000, n);
    };
    SVGWrapper.kind = 'unknown';
    SVGWrapper.borderFuzz = 0.005;
    return SVGWrapper;
}(Wrapper_js_1.CommonWrapper));
exports.SVGWrapper = SVGWrapper;
//# sourceMappingURL=Wrapper.js.map