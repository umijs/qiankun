"use strict";
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
exports.SafeMethods = void 0;
var lengths_js_1 = require("../../util/lengths.js");
exports.SafeMethods = {
    filterURL: function (safe, url) {
        var protocol = (url.match(/^\s*([a-z]+):/i) || [null, ''])[1].toLowerCase();
        var allow = safe.allow.URLs;
        return (allow === 'all' || (allow === 'safe' &&
            (safe.options.safeProtocols[protocol] || !protocol))) ? url : null;
    },
    filterClassList: function (safe, list) {
        var _this = this;
        var classes = list.trim().replace(/\s\s+/g, ' ').split(/ /);
        return classes.map(function (name) { return _this.filterClass(safe, name) || ''; }).join(' ').trim().replace(/\s\s+/g, '');
    },
    filterClass: function (safe, CLASS) {
        var allow = safe.allow.classes;
        return (allow === 'all' || (allow === 'safe' && CLASS.match(safe.options.classPattern))) ? CLASS : null;
    },
    filterID: function (safe, id) {
        var allow = safe.allow.cssIDs;
        return (allow === 'all' || (allow === 'safe' && id.match(safe.options.idPattern))) ? id : null;
    },
    filterStyles: function (safe, styles) {
        var e_1, _a, e_2, _b;
        if (safe.allow.styles === 'all')
            return styles;
        if (safe.allow.styles !== 'safe')
            return null;
        var adaptor = safe.adaptor;
        var options = safe.options;
        try {
            var div1 = adaptor.node('div', { style: styles });
            var div2 = adaptor.node('div');
            try {
                for (var _c = __values(Object.keys(options.safeStyles)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var style = _d.value;
                    if (options.styleParts[style]) {
                        try {
                            for (var _e = (e_2 = void 0, __values(['Top', 'Right', 'Bottom', 'Left'])), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var sufix = _f.value;
                                var name_1 = style + sufix;
                                var value = this.filterStyle(safe, name_1, div1);
                                if (value) {
                                    adaptor.setStyle(div2, name_1, value);
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    else {
                        var value = this.filterStyle(safe, style, div1);
                        if (value) {
                            adaptor.setStyle(div2, style, value);
                        }
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
            styles = adaptor.allStyles(div2);
        }
        catch (err) {
            styles = '';
        }
        return styles;
    },
    filterStyle: function (safe, style, div) {
        var value = safe.adaptor.getStyle(div, style);
        if (typeof value !== 'string' || value === '' || value.match(/^\s*calc/) ||
            (value.match(/javascript:/) && !safe.options.safeProtocols.javascript) ||
            (value.match(/data:/) && !safe.options.safeProtocols.data)) {
            return null;
        }
        var name = style.replace(/Top|Right|Left|Bottom/, '');
        if (!safe.options.safeStyles[style] && !safe.options.safeStyles[name]) {
            return null;
        }
        return this.filterStyleValue(safe, style, value, div);
    },
    filterStyleValue: function (safe, style, value, div) {
        var name = safe.options.styleLengths[style];
        if (!name) {
            return value;
        }
        if (typeof name !== 'string') {
            return this.filterStyleLength(safe, style, value);
        }
        var length = this.filterStyleLength(safe, name, safe.adaptor.getStyle(div, name));
        if (!length) {
            return null;
        }
        safe.adaptor.setStyle(div, name, length);
        return safe.adaptor.getStyle(div, style);
    },
    filterStyleLength: function (safe, style, value) {
        if (!value.match(/^(.+)(em|ex|ch|rem|px|mm|cm|in|pt|pc|%)$/))
            return null;
        var em = (0, lengths_js_1.length2em)(value, 1);
        var lengths = safe.options.styleLengths[style];
        var _a = __read((Array.isArray(lengths) ? lengths : [-safe.options.lengthMax, safe.options.lengthMax]), 2), m = _a[0], M = _a[1];
        return (m <= em && em <= M ? value : (em < m ? m : M).toFixed(3).replace(/\.?0+$/, '') + 'em');
    },
    filterFontSize: function (safe, size) {
        return this.filterStyleLength(safe, 'fontSize', size);
    },
    filterSizeMultiplier: function (safe, size) {
        var _a = __read(safe.options.scriptsizemultiplierRange || [-Infinity, Infinity], 2), m = _a[0], M = _a[1];
        return Math.min(M, Math.max(m, parseFloat(size))).toString();
    },
    filterScriptLevel: function (safe, level) {
        var _a = __read(safe.options.scriptlevelRange || [-Infinity, Infinity], 2), m = _a[0], M = _a[1];
        return Math.min(M, Math.max(m, parseInt(level))).toString();
    },
    filterData: function (safe, value, id) {
        return (id.match(safe.options.dataPattern) ? value : null);
    }
};
//# sourceMappingURL=SafeMethods.js.map