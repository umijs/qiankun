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
exports.ComplexityHandler = exports.ComplexityMathDocumentMixin = exports.ComplexityMathItemMixin = void 0;
var MathItem_js_1 = require("../core/MathItem.js");
var semantic_enrich_js_1 = require("./semantic-enrich.js");
var visitor_js_1 = require("./complexity/visitor.js");
var Options_js_1 = require("../util/Options.js");
(0, MathItem_js_1.newState)('COMPLEXITY', 40);
function ComplexityMathItemMixin(BaseMathItem, computeComplexity) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.complexity = function (document, force) {
            if (force === void 0) { force = false; }
            if (this.state() >= MathItem_js_1.STATE.COMPLEXITY)
                return;
            if (!this.isEscaped && (document.options.enableComplexity || force)) {
                this.enrich(document, true);
                computeComplexity(this.root);
            }
            this.state(MathItem_js_1.STATE.COMPLEXITY);
        };
        return class_1;
    }(BaseMathItem));
}
exports.ComplexityMathItemMixin = ComplexityMathItemMixin;
function ComplexityMathDocumentMixin(BaseDocument) {
    var _a;
    return _a = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
                var ProcessBits = _this.constructor.ProcessBits;
                if (!ProcessBits.has('complexity')) {
                    ProcessBits.allocate('complexity');
                }
                var visitorOptions = (0, Options_js_1.selectOptionsFromKeys)(_this.options, _this.options.ComplexityVisitor.OPTIONS);
                _this.complexityVisitor = new _this.options.ComplexityVisitor(_this.mmlFactory, visitorOptions);
                var computeComplexity = (function (node) { return _this.complexityVisitor.visitTree(node); });
                _this.options.MathItem =
                    ComplexityMathItemMixin(_this.options.MathItem, computeComplexity);
                return _this;
            }
            class_2.prototype.complexity = function () {
                var e_1, _a;
                if (!this.processed.isSet('complexity')) {
                    if (this.options.enableComplexity) {
                        try {
                            for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var math = _c.value;
                                math.complexity(this);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    this.processed.set('complexity');
                }
                return this;
            };
            class_2.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.COMPLEXITY) {
                    this.processed.clear('complexity');
                }
                return this;
            };
            return class_2;
        }(BaseDocument)),
        _a.OPTIONS = __assign(__assign(__assign({}, BaseDocument.OPTIONS), visitor_js_1.ComplexityVisitor.OPTIONS), { enableComplexity: true, ComplexityVisitor: visitor_js_1.ComplexityVisitor, renderActions: (0, Options_js_1.expandable)(__assign(__assign({}, BaseDocument.OPTIONS.renderActions), { complexity: [MathItem_js_1.STATE.COMPLEXITY] })) }),
        _a;
}
exports.ComplexityMathDocumentMixin = ComplexityMathDocumentMixin;
function ComplexityHandler(handler, MmlJax) {
    if (MmlJax === void 0) { MmlJax = null; }
    if (!handler.documentClass.prototype.enrich && MmlJax) {
        handler = (0, semantic_enrich_js_1.EnrichHandler)(handler, MmlJax);
    }
    handler.documentClass = ComplexityMathDocumentMixin(handler.documentClass);
    return handler;
}
exports.ComplexityHandler = ComplexityHandler;
//# sourceMappingURL=complexity.js.map