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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathJax = exports.combineWithMathJax = exports.combineDefaults = exports.combineConfig = exports.isObject = void 0;
var version_js_1 = require("./version.js");
function isObject(x) {
    return typeof x === 'object' && x !== null;
}
exports.isObject = isObject;
function combineConfig(dst, src) {
    var e_1, _a;
    try {
        for (var _b = __values(Object.keys(src)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var id = _c.value;
            if (id === '__esModule')
                continue;
            if (isObject(dst[id]) && isObject(src[id]) &&
                !(src[id] instanceof Promise)) {
                combineConfig(dst[id], src[id]);
            }
            else if (src[id] !== null && src[id] !== undefined) {
                dst[id] = src[id];
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
    return dst;
}
exports.combineConfig = combineConfig;
function combineDefaults(dst, name, src) {
    var e_2, _a;
    if (!dst[name]) {
        dst[name] = {};
    }
    dst = dst[name];
    try {
        for (var _b = __values(Object.keys(src)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var id = _c.value;
            if (isObject(dst[id]) && isObject(src[id])) {
                combineDefaults(dst, id, src[id]);
            }
            else if (dst[id] == null && src[id] != null) {
                dst[id] = src[id];
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
    return dst;
}
exports.combineDefaults = combineDefaults;
function combineWithMathJax(config) {
    return combineConfig(exports.MathJax, config);
}
exports.combineWithMathJax = combineWithMathJax;
if (typeof global.MathJax === 'undefined') {
    global.MathJax = {};
}
if (!global.MathJax.version) {
    global.MathJax = {
        version: version_js_1.VERSION,
        _: {},
        config: global.MathJax
    };
}
exports.MathJax = global.MathJax;
//# sourceMappingURL=global.js.map