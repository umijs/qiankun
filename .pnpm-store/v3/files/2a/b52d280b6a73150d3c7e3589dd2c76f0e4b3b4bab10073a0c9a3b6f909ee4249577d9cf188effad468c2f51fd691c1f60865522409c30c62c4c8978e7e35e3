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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
exports.SafeHandler = exports.SafeMathDocumentMixin = void 0;
var safe_js_1 = require("./safe.js");
function SafeMathDocumentMixin(BaseDocument) {
    var _a;
    return _a = (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var e_1, _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
                _this.safe = new _this.options.SafeClass(_this, _this.options.safeOptions);
                var ProcessBits = _this.constructor.ProcessBits;
                if (!ProcessBits.has('safe')) {
                    ProcessBits.allocate('safe');
                }
                try {
                    for (var _b = __values(_this.inputJax), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var jax = _c.value;
                        if (jax.name.match(/MathML/)) {
                            jax.mathml.filterAttribute = _this.safe.mmlAttribute.bind(_this.safe);
                            jax.mathml.filterClassList = _this.safe.mmlClassList.bind(_this.safe);
                        }
                        else if (jax.name.match(/TeX/)) {
                            jax.postFilters.add(_this.sanitize.bind(jax), -5.5);
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
                return _this;
            }
            class_1.prototype.sanitize = function (data) {
                data.math.root = this.parseOptions.root;
                data.document.safe.sanitize(data.math, data.document);
            };
            return class_1;
        }(BaseDocument)),
        _a.OPTIONS = __assign(__assign({}, BaseDocument.OPTIONS), { safeOptions: __assign({}, safe_js_1.Safe.OPTIONS), SafeClass: safe_js_1.Safe }),
        _a;
}
exports.SafeMathDocumentMixin = SafeMathDocumentMixin;
function SafeHandler(handler) {
    handler.documentClass = SafeMathDocumentMixin(handler.documentClass);
    return handler;
}
exports.SafeHandler = SafeHandler;
//# sourceMappingURL=SafeHandler.js.map