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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrichHandler = exports.EnrichedMathDocumentMixin = exports.EnrichedMathItemMixin = void 0;
var mathjax_js_1 = require("../mathjax.js");
var MathItem_js_1 = require("../core/MathItem.js");
var SerializedMmlVisitor_js_1 = require("../core/MmlTree/SerializedMmlVisitor.js");
var Options_js_1 = require("../util/Options.js");
var sre_js_1 = __importDefault(require("./sre.js"));
var currentSpeech = 'none';
(0, MathItem_js_1.newState)('ENRICHED', 30);
(0, MathItem_js_1.newState)('ATTACHSPEECH', 155);
function EnrichedMathItemMixin(BaseMathItem, MmlJax, toMathML) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        class_1.prototype.serializeMml = function (node) {
            if ('outerHTML' in node) {
                return node.outerHTML;
            }
            if (typeof Element !== 'undefined' && typeof window !== 'undefined' && node instanceof Element) {
                var div = window.document.createElement('div');
                div.appendChild(node);
                return div.innerHTML;
            }
            return node.toString();
        };
        class_1.prototype.enrich = function (document, force) {
            if (force === void 0) { force = false; }
            if (this.state() >= MathItem_js_1.STATE.ENRICHED)
                return;
            if (!this.isEscaped && (document.options.enableEnrichment || force)) {
                if (document.options.sre.speech !== currentSpeech) {
                    currentSpeech = document.options.sre.speech;
                    mathjax_js_1.mathjax.retryAfter(sre_js_1.default.setupEngine(document.options.sre).then(function () { return sre_js_1.default.sreReady(); }));
                }
                var math = new document.options.MathItem('', MmlJax);
                try {
                    var mml = this.inputData.originalMml = toMathML(this.root);
                    math.math = this.serializeMml(sre_js_1.default.toEnriched(mml));
                    math.display = this.display;
                    math.compile(document);
                    this.root = math.root;
                    this.inputData.enrichedMml = math.math;
                }
                catch (err) {
                    document.options.enrichError(document, this, err);
                }
            }
            this.state(MathItem_js_1.STATE.ENRICHED);
        };
        class_1.prototype.attachSpeech = function (document) {
            var e_1, _a;
            if (this.state() >= MathItem_js_1.STATE.ATTACHSPEECH)
                return;
            var attributes = this.root.attributes;
            var speech = (attributes.get('aria-label') ||
                this.getSpeech(this.root));
            if (speech) {
                var adaptor = document.adaptor;
                var node = this.typesetRoot;
                adaptor.setAttribute(node, 'aria-label', speech);
                try {
                    for (var _b = __values(adaptor.childNodes(node)), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        adaptor.setAttribute(child, 'aria-hidden', 'true');
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
            this.state(MathItem_js_1.STATE.ATTACHSPEECH);
        };
        class_1.prototype.getSpeech = function (node) {
            var e_2, _a;
            var attributes = node.attributes;
            if (!attributes)
                return '';
            var speech = attributes.getExplicit('data-semantic-speech');
            if (!attributes.getExplicit('data-semantic-parent') && speech) {
                return speech;
            }
            try {
                for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    var value = this.getSpeech(child);
                    if (value != null) {
                        return value;
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
            return '';
        };
        return class_1;
    }(BaseMathItem));
}
exports.EnrichedMathItemMixin = EnrichedMathItemMixin;
function EnrichedMathDocumentMixin(BaseDocument, MmlJax) {
    var _a;
    return _a = (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
                MmlJax.setMmlFactory(_this.mmlFactory);
                var ProcessBits = _this.constructor.ProcessBits;
                if (!ProcessBits.has('enriched')) {
                    ProcessBits.allocate('enriched');
                    ProcessBits.allocate('attach-speech');
                }
                var visitor = new SerializedMmlVisitor_js_1.SerializedMmlVisitor(_this.mmlFactory);
                var toMathML = (function (node) { return visitor.visitTree(node); });
                _this.options.MathItem =
                    EnrichedMathItemMixin(_this.options.MathItem, MmlJax, toMathML);
                return _this;
            }
            class_2.prototype.attachSpeech = function () {
                var e_3, _a;
                if (!this.processed.isSet('attach-speech')) {
                    try {
                        for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var math = _c.value;
                            math.attachSpeech(this);
                        }
                    }
                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_3) throw e_3.error; }
                    }
                    this.processed.set('attach-speech');
                }
                return this;
            };
            class_2.prototype.enrich = function () {
                var e_4, _a;
                if (!this.processed.isSet('enriched')) {
                    if (this.options.enableEnrichment) {
                        try {
                            for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                                var math = _c.value;
                                math.enrich(this);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                    this.processed.set('enriched');
                }
                return this;
            };
            class_2.prototype.enrichError = function (_doc, _math, err) {
                console.warn('Enrichment error:', err);
            };
            class_2.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.ENRICHED) {
                    this.processed.clear('enriched');
                }
                return this;
            };
            return class_2;
        }(BaseDocument)),
        _a.OPTIONS = __assign(__assign({}, BaseDocument.OPTIONS), { enableEnrichment: true, enrichError: function (doc, math, err) { return doc.enrichError(doc, math, err); }, renderActions: (0, Options_js_1.expandable)(__assign(__assign({}, BaseDocument.OPTIONS.renderActions), { enrich: [MathItem_js_1.STATE.ENRICHED], attachSpeech: [MathItem_js_1.STATE.ATTACHSPEECH] })), sre: (0, Options_js_1.expandable)({
                speech: 'none',
                domain: 'mathspeak',
                style: 'default',
                locale: 'en'
            }) }),
        _a;
}
exports.EnrichedMathDocumentMixin = EnrichedMathDocumentMixin;
function EnrichHandler(handler, MmlJax) {
    MmlJax.setAdaptor(handler.adaptor);
    handler.documentClass =
        EnrichedMathDocumentMixin(handler.documentClass, MmlJax);
    return handler;
}
exports.EnrichHandler = EnrichHandler;
//# sourceMappingURL=semantic-enrich.js.map