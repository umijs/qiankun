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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAsciiMath = void 0;
var FindMath_js_1 = require("../../core/FindMath.js");
var string_js_1 = require("../../util/string.js");
var MathItem_js_1 = require("../../core/MathItem.js");
var FindAsciiMath = (function (_super) {
    __extends(FindAsciiMath, _super);
    function FindAsciiMath(options) {
        var _this = _super.call(this, options) || this;
        _this.getPatterns();
        return _this;
    }
    FindAsciiMath.prototype.getPatterns = function () {
        var _this = this;
        var options = this.options;
        var starts = [];
        this.end = {};
        options['delimiters'].forEach(function (delims) { return _this.addPattern(starts, delims, false); });
        this.start = new RegExp(starts.join('|'), 'g');
        this.hasPatterns = (starts.length > 0);
    };
    FindAsciiMath.prototype.addPattern = function (starts, delims, display) {
        var _a = __read(delims, 2), open = _a[0], close = _a[1];
        starts.push((0, string_js_1.quotePattern)(open));
        this.end[open] = [close, display, new RegExp((0, string_js_1.quotePattern)(close), 'g')];
    };
    FindAsciiMath.prototype.findEnd = function (text, n, start, end) {
        var _a = __read(end, 3), display = _a[1], pattern = _a[2];
        var i = pattern.lastIndex = start.index + start[0].length;
        var match = pattern.exec(text);
        return (!match ? null : (0, MathItem_js_1.protoItem)(start[0], text.substr(i, match.index - i), match[0], n, start.index, match.index + match[0].length, display));
    };
    FindAsciiMath.prototype.findMathInString = function (math, n, text) {
        var start, match;
        this.start.lastIndex = 0;
        while ((start = this.start.exec(text))) {
            match = this.findEnd(text, n, start, this.end[start[0]]);
            if (match) {
                math.push(match);
                this.start.lastIndex = match.end.n;
            }
        }
    };
    FindAsciiMath.prototype.findMath = function (strings) {
        var math = [];
        if (this.hasPatterns) {
            for (var i = 0, m = strings.length; i < m; i++) {
                this.findMathInString(math, i, strings[i]);
            }
        }
        return math;
    };
    FindAsciiMath.OPTIONS = {
        delimiters: [['`', '`']],
    };
    return FindAsciiMath;
}(FindMath_js_1.AbstractFindMath));
exports.FindAsciiMath = FindAsciiMath;
//# sourceMappingURL=FindAsciiMath.js.map