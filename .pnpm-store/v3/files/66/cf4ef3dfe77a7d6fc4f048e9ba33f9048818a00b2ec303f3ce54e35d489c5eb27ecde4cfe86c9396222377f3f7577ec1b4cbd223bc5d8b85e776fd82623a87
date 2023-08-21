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
exports.FindTeX = void 0;
var FindMath_js_1 = require("../../core/FindMath.js");
var string_js_1 = require("../../util/string.js");
var MathItem_js_1 = require("../../core/MathItem.js");
var FindTeX = (function (_super) {
    __extends(FindTeX, _super);
    function FindTeX(options) {
        var _this = _super.call(this, options) || this;
        _this.getPatterns();
        return _this;
    }
    FindTeX.prototype.getPatterns = function () {
        var _this = this;
        var options = this.options;
        var starts = [], parts = [], subparts = [];
        this.end = {};
        this.env = this.sub = 0;
        var i = 1;
        options['inlineMath'].forEach(function (delims) { return _this.addPattern(starts, delims, false); });
        options['displayMath'].forEach(function (delims) { return _this.addPattern(starts, delims, true); });
        if (starts.length) {
            parts.push(starts.sort(string_js_1.sortLength).join('|'));
        }
        if (options['processEnvironments']) {
            parts.push('\\\\begin\\s*\\{([^}]*)\\}');
            this.env = i;
            i++;
        }
        if (options['processEscapes']) {
            subparts.push('\\\\([\\\\$])');
        }
        if (options['processRefs']) {
            subparts.push('(\\\\(?:eq)?ref\\s*\\{[^}]*\\})');
        }
        if (subparts.length) {
            parts.push('(' + subparts.join('|') + ')');
            this.sub = i;
        }
        this.start = new RegExp(parts.join('|'), 'g');
        this.hasPatterns = (parts.length > 0);
    };
    FindTeX.prototype.addPattern = function (starts, delims, display) {
        var _a = __read(delims, 2), open = _a[0], close = _a[1];
        starts.push((0, string_js_1.quotePattern)(open));
        this.end[open] = [close, display, this.endPattern(close)];
    };
    FindTeX.prototype.endPattern = function (end, endp) {
        return new RegExp((endp || (0, string_js_1.quotePattern)(end)) + '|\\\\(?:[a-zA-Z]|.)|[{}]', 'g');
    };
    FindTeX.prototype.findEnd = function (text, n, start, end) {
        var _a = __read(end, 3), close = _a[0], display = _a[1], pattern = _a[2];
        var i = pattern.lastIndex = start.index + start[0].length;
        var match, braces = 0;
        while ((match = pattern.exec(text))) {
            if ((match[1] || match[0]) === close && braces === 0) {
                return (0, MathItem_js_1.protoItem)(start[0], text.substr(i, match.index - i), match[0], n, start.index, match.index + match[0].length, display);
            }
            else if (match[0] === '{') {
                braces++;
            }
            else if (match[0] === '}' && braces) {
                braces--;
            }
        }
        return null;
    };
    FindTeX.prototype.findMathInString = function (math, n, text) {
        var start, match;
        this.start.lastIndex = 0;
        while ((start = this.start.exec(text))) {
            if (start[this.env] !== undefined && this.env) {
                var end = '\\\\end\\s*(\\{' + (0, string_js_1.quotePattern)(start[this.env]) + '\\})';
                match = this.findEnd(text, n, start, ['{' + start[this.env] + '}', true, this.endPattern(null, end)]);
                if (match) {
                    match.math = match.open + match.math + match.close;
                    match.open = match.close = '';
                }
            }
            else if (start[this.sub] !== undefined && this.sub) {
                var math_1 = start[this.sub];
                var end = start.index + start[this.sub].length;
                if (math_1.length === 2) {
                    match = (0, MathItem_js_1.protoItem)('', math_1.substr(1), '', n, start.index, end);
                }
                else {
                    match = (0, MathItem_js_1.protoItem)('', math_1, '', n, start.index, end, false);
                }
            }
            else {
                match = this.findEnd(text, n, start, this.end[start[0]]);
            }
            if (match) {
                math.push(match);
                this.start.lastIndex = match.end.n;
            }
        }
    };
    FindTeX.prototype.findMath = function (strings) {
        var math = [];
        if (this.hasPatterns) {
            for (var i = 0, m = strings.length; i < m; i++) {
                this.findMathInString(math, i, strings[i]);
            }
        }
        return math;
    };
    FindTeX.OPTIONS = {
        inlineMath: [
            ['\\(', '\\)']
        ],
        displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]']
        ],
        processEscapes: true,
        processEnvironments: true,
        processRefs: true,
    };
    return FindTeX;
}(FindMath_js_1.AbstractFindMath));
exports.FindTeX = FindTeX;
//# sourceMappingURL=FindTeX.js.map