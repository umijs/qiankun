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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsciiMath = void 0;
var InputJax_js_1 = require("../core/InputJax.js");
var AsciiMath_js_1 = require("./asciimath/mathjax2/input/AsciiMath.js");
var Options_js_1 = require("../util/Options.js");
var FindAsciiMath_js_1 = require("./asciimath/FindAsciiMath.js");
var AsciiMath = (function (_super) {
    __extends(AsciiMath, _super);
    function AsciiMath(options) {
        var _this = this;
        var _a = __read((0, Options_js_1.separateOptions)(options, FindAsciiMath_js_1.FindAsciiMath.OPTIONS, AsciiMath.OPTIONS), 3), find = _a[1], am = _a[2];
        _this = _super.call(this, am) || this;
        _this.findAsciiMath = _this.options['FindAsciiMath'] || new FindAsciiMath_js_1.FindAsciiMath(find);
        return _this;
    }
    AsciiMath.prototype.compile = function (math, _document) {
        return AsciiMath_js_1.LegacyAsciiMath.Compile(math.math, math.display);
    };
    AsciiMath.prototype.findMath = function (strings) {
        return this.findAsciiMath.findMath(strings);
    };
    AsciiMath.NAME = 'AsciiMath';
    AsciiMath.OPTIONS = __assign(__assign({}, InputJax_js_1.AbstractInputJax.OPTIONS), { FindAsciiMath: null });
    return AsciiMath;
}(InputJax_js_1.AbstractInputJax));
exports.AsciiMath = AsciiMath;
//# sourceMappingURL=asciimath.js.map