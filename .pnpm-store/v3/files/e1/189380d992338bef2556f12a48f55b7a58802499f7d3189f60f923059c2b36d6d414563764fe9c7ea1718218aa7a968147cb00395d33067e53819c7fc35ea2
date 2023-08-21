"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = exports.isPercent = exports.unicodeString = exports.unicodeChars = exports.quotePattern = exports.sortLength = void 0;
function sortLength(a, b) {
    return a.length !== b.length ? b.length - a.length : a === b ? 0 : a < b ? -1 : 1;
}
exports.sortLength = sortLength;
function quotePattern(text) {
    return text.replace(/([\^$(){}+*?\-|\[\]\:\\])/g, '\\$1');
}
exports.quotePattern = quotePattern;
function unicodeChars(text) {
    return Array.from(text).map(function (c) { return c.codePointAt(0); });
}
exports.unicodeChars = unicodeChars;
function unicodeString(data) {
    return String.fromCodePoint.apply(String, __spreadArray([], __read(data), false));
}
exports.unicodeString = unicodeString;
function isPercent(x) {
    return !!x.match(/%\s*$/);
}
exports.isPercent = isPercent;
function split(x) {
    return x.trim().split(/\s+/);
}
exports.split = split;
//# sourceMappingURL=string.js.map