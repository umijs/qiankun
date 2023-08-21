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
exports.HTMLDocument = void 0;
var MathDocument_js_1 = require("../../core/MathDocument.js");
var Options_js_1 = require("../../util/Options.js");
var HTMLMathItem_js_1 = require("./HTMLMathItem.js");
var HTMLMathList_js_1 = require("./HTMLMathList.js");
var HTMLDomStrings_js_1 = require("./HTMLDomStrings.js");
var MathItem_js_1 = require("../../core/MathItem.js");
var HTMLDocument = (function (_super) {
    __extends(HTMLDocument, _super);
    function HTMLDocument(document, adaptor, options) {
        var _this = this;
        var _a = __read((0, Options_js_1.separateOptions)(options, HTMLDomStrings_js_1.HTMLDomStrings.OPTIONS), 2), html = _a[0], dom = _a[1];
        _this = _super.call(this, document, adaptor, html) || this;
        _this.domStrings = _this.options['DomStrings'] || new HTMLDomStrings_js_1.HTMLDomStrings(dom);
        _this.domStrings.adaptor = adaptor;
        _this.styles = [];
        return _this;
    }
    HTMLDocument.prototype.findPosition = function (N, index, delim, nodes) {
        var e_1, _a;
        var adaptor = this.adaptor;
        try {
            for (var _b = __values(nodes[N]), _c = _b.next(); !_c.done; _c = _b.next()) {
                var list = _c.value;
                var _d = __read(list, 2), node = _d[0], n = _d[1];
                if (index <= n && adaptor.kind(node) === '#text') {
                    return { node: node, n: Math.max(index, 0), delim: delim };
                }
                index -= n;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return { node: null, n: 0, delim: delim };
    };
    HTMLDocument.prototype.mathItem = function (item, jax, nodes) {
        var math = item.math;
        var start = this.findPosition(item.n, item.start.n, item.open, nodes);
        var end = this.findPosition(item.n, item.end.n, item.close, nodes);
        return new this.options.MathItem(math, jax, item.display, start, end);
    };
    HTMLDocument.prototype.findMath = function (options) {
        var e_2, _a, e_3, _b, _c, e_4, _d, e_5, _e;
        if (!this.processed.isSet('findMath')) {
            this.adaptor.document = this.document;
            options = (0, Options_js_1.userOptions)({ elements: this.options.elements || [this.adaptor.body(this.document)] }, options);
            try {
                for (var _f = __values(this.adaptor.getElements(options['elements'], this.document)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var container = _g.value;
                    var _h = __read([null, null], 2), strings = _h[0], nodes = _h[1];
                    try {
                        for (var _j = (e_3 = void 0, __values(this.inputJax)), _k = _j.next(); !_k.done; _k = _j.next()) {
                            var jax = _k.value;
                            var list = new (this.options['MathList'])();
                            if (jax.processStrings) {
                                if (strings === null) {
                                    _c = __read(this.domStrings.find(container), 2), strings = _c[0], nodes = _c[1];
                                }
                                try {
                                    for (var _l = (e_4 = void 0, __values(jax.findMath(strings))), _m = _l.next(); !_m.done; _m = _l.next()) {
                                        var math = _m.value;
                                        list.push(this.mathItem(math, jax, nodes));
                                    }
                                }
                                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                finally {
                                    try {
                                        if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                                    }
                                    finally { if (e_4) throw e_4.error; }
                                }
                            }
                            else {
                                try {
                                    for (var _o = (e_5 = void 0, __values(jax.findMath(container))), _p = _o.next(); !_p.done; _p = _o.next()) {
                                        var math = _p.value;
                                        var item = new this.options.MathItem(math.math, jax, math.display, math.start, math.end);
                                        list.push(item);
                                    }
                                }
                                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                                finally {
                                    try {
                                        if (_p && !_p.done && (_e = _o.return)) _e.call(_o);
                                    }
                                    finally { if (e_5) throw e_5.error; }
                                }
                            }
                            this.math.merge(list);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_k && !_k.done && (_b = _j.return)) _b.call(_j);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.processed.set('findMath');
        }
        return this;
    };
    HTMLDocument.prototype.updateDocument = function () {
        if (!this.processed.isSet('updateDocument')) {
            this.addPageElements();
            this.addStyleSheet();
            _super.prototype.updateDocument.call(this);
            this.processed.set('updateDocument');
        }
        return this;
    };
    HTMLDocument.prototype.addPageElements = function () {
        var body = this.adaptor.body(this.document);
        var node = this.documentPageElements();
        if (node) {
            this.adaptor.append(body, node);
        }
    };
    HTMLDocument.prototype.addStyleSheet = function () {
        var sheet = this.documentStyleSheet();
        var adaptor = this.adaptor;
        if (sheet && !adaptor.parent(sheet)) {
            var head = adaptor.head(this.document);
            var styles = this.findSheet(head, adaptor.getAttribute(sheet, 'id'));
            if (styles) {
                adaptor.replace(sheet, styles);
            }
            else {
                adaptor.append(head, sheet);
            }
        }
    };
    HTMLDocument.prototype.findSheet = function (head, id) {
        var e_6, _a;
        if (id) {
            try {
                for (var _b = __values(this.adaptor.tags(head, 'style')), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var sheet = _c.value;
                    if (this.adaptor.getAttribute(sheet, 'id') === id) {
                        return sheet;
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        return null;
    };
    HTMLDocument.prototype.removeFromDocument = function (restore) {
        var e_7, _a;
        if (restore === void 0) { restore = false; }
        if (this.processed.isSet('updateDocument')) {
            try {
                for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var math = _c.value;
                    if (math.state() >= MathItem_js_1.STATE.INSERTED) {
                        math.state(MathItem_js_1.STATE.TYPESET, restore);
                    }
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        this.processed.clear('updateDocument');
        return this;
    };
    HTMLDocument.prototype.documentStyleSheet = function () {
        return this.outputJax.styleSheet(this);
    };
    HTMLDocument.prototype.documentPageElements = function () {
        return this.outputJax.pageElements(this);
    };
    HTMLDocument.prototype.addStyles = function (styles) {
        this.styles.push(styles);
    };
    HTMLDocument.prototype.getStyles = function () {
        return this.styles;
    };
    HTMLDocument.KIND = 'HTML';
    HTMLDocument.OPTIONS = __assign(__assign({}, MathDocument_js_1.AbstractMathDocument.OPTIONS), { renderActions: (0, Options_js_1.expandable)(__assign(__assign({}, MathDocument_js_1.AbstractMathDocument.OPTIONS.renderActions), { styles: [MathItem_js_1.STATE.INSERTED + 1, '', 'updateStyleSheet', false] })), MathList: HTMLMathList_js_1.HTMLMathList, MathItem: HTMLMathItem_js_1.HTMLMathItem, DomStrings: null });
    return HTMLDocument;
}(MathDocument_js_1.AbstractMathDocument));
exports.HTMLDocument = HTMLDocument;
//# sourceMappingURL=HTMLDocument.js.map