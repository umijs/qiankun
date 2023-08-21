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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMathML = void 0;
var FindMath_js_1 = require("../../core/FindMath.js");
var NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
var FindMathML = (function (_super) {
    __extends(FindMathML, _super);
    function FindMathML() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindMathML.prototype.findMath = function (node) {
        var set = new Set();
        this.findMathNodes(node, set);
        this.findMathPrefixed(node, set);
        var html = this.adaptor.root(this.adaptor.document);
        if (this.adaptor.kind(html) === 'html' && set.size === 0) {
            this.findMathNS(node, set);
        }
        return this.processMath(set);
    };
    FindMathML.prototype.findMathNodes = function (node, set) {
        var e_1, _a;
        try {
            for (var _b = __values(this.adaptor.tags(node, 'math')), _c = _b.next(); !_c.done; _c = _b.next()) {
                var math = _c.value;
                set.add(math);
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
    FindMathML.prototype.findMathPrefixed = function (node, set) {
        var e_2, _a, e_3, _b;
        var html = this.adaptor.root(this.adaptor.document);
        try {
            for (var _c = __values(this.adaptor.allAttributes(html)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var attr = _d.value;
                if (attr.name.substr(0, 6) === 'xmlns:' && attr.value === NAMESPACE) {
                    var prefix = attr.name.substr(6);
                    try {
                        for (var _e = (e_3 = void 0, __values(this.adaptor.tags(node, prefix + ':math'))), _f = _e.next(); !_f.done; _f = _e.next()) {
                            var math = _f.value;
                            set.add(math);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    FindMathML.prototype.findMathNS = function (node, set) {
        var e_4, _a;
        try {
            for (var _b = __values(this.adaptor.tags(node, 'math', NAMESPACE)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var math = _c.value;
                set.add(math);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    FindMathML.prototype.processMath = function (set) {
        var e_5, _a;
        var math = [];
        try {
            for (var _b = __values(Array.from(set)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var mml = _c.value;
                var display = (this.adaptor.getAttribute(mml, 'display') === 'block' ||
                    this.adaptor.getAttribute(mml, 'mode') === 'display');
                var start = { node: mml, n: 0, delim: '' };
                var end = { node: mml, n: 0, delim: '' };
                math.push({ math: this.adaptor.outerHTML(mml), start: start, end: end, display: display });
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return math;
    };
    FindMathML.OPTIONS = {};
    return FindMathML;
}(FindMath_js_1.AbstractFindMath));
exports.FindMathML = FindMathML;
//# sourceMappingURL=FindMathML.js.map