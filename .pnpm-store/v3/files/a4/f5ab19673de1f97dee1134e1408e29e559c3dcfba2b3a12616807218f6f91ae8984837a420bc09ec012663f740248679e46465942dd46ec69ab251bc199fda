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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.LazyHandler = exports.LazyMathDocumentMixin = exports.LazyMathItemMixin = exports.LAZYID = exports.LazyList = void 0;
var MathItem_js_1 = require("../../core/MathItem.js");
var Retries_js_1 = require("../../util/Retries.js");
var LazyList = (function () {
    function LazyList() {
        this.id = 0;
        this.items = new Map();
    }
    LazyList.prototype.add = function (math) {
        var id = String(this.id++);
        this.items.set(id, math);
        return id;
    };
    LazyList.prototype.get = function (id) {
        return this.items.get(id);
    };
    LazyList.prototype.delete = function (id) {
        return this.items.delete(id);
    };
    return LazyList;
}());
exports.LazyList = LazyList;
(0, MathItem_js_1.newState)('LAZYALWAYS', MathItem_js_1.STATE.FINDMATH + 3);
exports.LAZYID = 'data-mjx-lazy';
function LazyMathItemMixin(BaseMathItem) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
            _this.lazyCompile = true;
            _this.lazyTypeset = true;
            _this.lazyTex = false;
            if (!_this.end.node) {
                _this.lazyCompile = _this.lazyTypeset = false;
            }
            return _this;
        }
        class_1.prototype.compile = function (document) {
            if (!this.lazyCompile) {
                _super.prototype.compile.call(this, document);
                return;
            }
            if (this.state() < MathItem_js_1.STATE.COMPILED) {
                this.lazyTex = (this.inputJax.name === 'TeX');
                this.root = document.mmlFactory.create('math');
                this.state(MathItem_js_1.STATE.COMPILED);
            }
        };
        class_1.prototype.state = function (state, restore) {
            if (state === void 0) { state = null; }
            if (restore === void 0) { restore = false; }
            if (restore !== null)
                _super.prototype.state.call(this, state, restore);
            return _super.prototype.state.call(this);
        };
        class_1.prototype.typeset = function (document) {
            var _a;
            if (!this.lazyTypeset) {
                _super.prototype.typeset.call(this, document);
                return;
            }
            if (this.state() < MathItem_js_1.STATE.TYPESET) {
                var adaptor = document.adaptor;
                if (!this.lazyMarker) {
                    var id = document.lazyList.add(this);
                    this.lazyMarker = adaptor.node('mjx-lazy', (_a = {}, _a[exports.LAZYID] = id, _a));
                    this.typesetRoot = adaptor.node('mjx-container', {}, [this.lazyMarker]);
                }
                this.state(MathItem_js_1.STATE.TYPESET);
            }
        };
        class_1.prototype.updateDocument = function (document) {
            _super.prototype.updateDocument.call(this, document);
            if (this.lazyTypeset) {
                document.lazyObserver.observe(this.lazyMarker);
            }
        };
        return class_1;
    }(BaseMathItem));
}
exports.LazyMathItemMixin = LazyMathItemMixin;
function LazyMathDocumentMixin(BaseDocument) {
    var _a;
    return _a = (function (_super) {
            __extends(BaseClass, _super);
            function BaseClass() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
                _this.lazyAlwaysContainers = null;
                _this.lazyAlwaysIndex = 0;
                _this.lazyPromise = Promise.resolve();
                _this.lazyIdle = false;
                _this.lazySet = new Set();
                _this.options.MathItem =
                    LazyMathItemMixin(_this.options.MathItem);
                var ProcessBits = _this.constructor.ProcessBits;
                !ProcessBits.has('lazyAlways') && ProcessBits.allocate('lazyAlways');
                _this.lazyObserver = new IntersectionObserver(_this.lazyObserve.bind(_this), { rootMargin: _this.options.lazyMargin });
                _this.lazyList = new LazyList();
                var callback = _this.lazyHandleSet.bind(_this);
                _this.lazyProcessSet = (window && window.requestIdleCallback ?
                    function () { return window.requestIdleCallback(callback); } :
                    function () { return setTimeout(callback, 10); });
                if (window) {
                    var done_1 = false;
                    var handler = function () {
                        !done_1 && _this.lazyTypesetAll();
                        done_1 = true;
                    };
                    window.matchMedia('print').addListener(handler);
                    window.addEventListener('beforeprint', handler);
                }
                return _this;
            }
            BaseClass.prototype.lazyAlways = function () {
                var e_1, _a;
                if (!this.lazyAlwaysContainers || this.processed.isSet('lazyAlways'))
                    return;
                try {
                    for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var item = _c.value;
                        var math = item;
                        if (math.lazyTypeset && this.lazyIsAlways(math)) {
                            math.lazyCompile = math.lazyTypeset = false;
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
                this.processed.set('lazyAlways');
            };
            BaseClass.prototype.lazyIsAlways = function (math) {
                if (math.state() < MathItem_js_1.STATE.LAZYALWAYS) {
                    math.state(MathItem_js_1.STATE.LAZYALWAYS);
                    var node = math.start.node;
                    var adaptor = this.adaptor;
                    var start = this.lazyAlwaysIndex;
                    var end = this.lazyAlwaysContainers.length;
                    do {
                        var container = this.lazyAlwaysContainers[this.lazyAlwaysIndex];
                        if (adaptor.contains(container, node))
                            return true;
                        if (++this.lazyAlwaysIndex >= end) {
                            this.lazyAlwaysIndex = 0;
                        }
                    } while (this.lazyAlwaysIndex !== start);
                }
                return false;
            };
            BaseClass.prototype.state = function (state, restore) {
                if (restore === void 0) { restore = false; }
                _super.prototype.state.call(this, state, restore);
                if (state < MathItem_js_1.STATE.LAZYALWAYS) {
                    this.processed.clear('lazyAlways');
                }
                return this;
            };
            BaseClass.prototype.lazyTypesetAll = function () {
                return __awaiter(this, void 0, void 0, function () {
                    var state, _a, _b, item, math, fontCache;
                    var e_2, _c;
                    var _this = this;
                    return __generator(this, function (_d) {
                        state = MathItem_js_1.STATE.LAST;
                        try {
                            for (_a = __values(this.math), _b = _a.next(); !_b.done; _b = _a.next()) {
                                item = _b.value;
                                math = item;
                                if (!math.lazyCompile && !math.lazyTypeset)
                                    continue;
                                if (math.lazyCompile) {
                                    math.state(MathItem_js_1.STATE.COMPILED - 1);
                                    state = MathItem_js_1.STATE.COMPILED;
                                }
                                else {
                                    math.state(MathItem_js_1.STATE.TYPESET - 1);
                                    if (MathItem_js_1.STATE.TYPESET < state)
                                        state = MathItem_js_1.STATE.TYPESET;
                                }
                                math.lazyCompile = math.lazyTypeset = false;
                                math.lazyMarker && this.lazyObserver.unobserve(math.lazyMarker);
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        if (state === MathItem_js_1.STATE.LAST)
                            return [2, Promise.resolve()];
                        this.state(state - 1, null);
                        fontCache = this.outputJax.options.fontCache;
                        if (fontCache)
                            this.outputJax.options.fontCache = 'none';
                        this.reset();
                        return [2, (0, Retries_js_1.handleRetriesFor)(function () { return _this.render(); }).then(function () {
                                if (fontCache)
                                    _this.outputJax.options.fontCache = fontCache;
                            })];
                    });
                });
            };
            BaseClass.prototype.lazyObserve = function (entries) {
                var e_3, _a;
                try {
                    for (var entries_1 = __values(entries), entries_1_1 = entries_1.next(); !entries_1_1.done; entries_1_1 = entries_1.next()) {
                        var entry = entries_1_1.value;
                        var id = this.adaptor.getAttribute(entry.target, exports.LAZYID);
                        var math = this.lazyList.get(id);
                        if (!math)
                            continue;
                        if (!entry.isIntersecting) {
                            this.lazySet.delete(id);
                            continue;
                        }
                        this.lazySet.add(id);
                        if (!this.lazyIdle) {
                            this.lazyIdle = true;
                            this.lazyProcessSet();
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (entries_1_1 && !entries_1_1.done && (_a = entries_1.return)) _a.call(entries_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            };
            BaseClass.prototype.lazyHandleSet = function () {
                var _this = this;
                var set = this.lazySet;
                this.lazySet = new Set();
                this.lazyPromise = this.lazyPromise.then(function () {
                    var state = _this.compileEarlierItems(set) ? MathItem_js_1.STATE.COMPILED : MathItem_js_1.STATE.TYPESET;
                    state = _this.resetStates(set, state);
                    _this.state(state - 1, null);
                    return (0, Retries_js_1.handleRetriesFor)(function () {
                        _this.render();
                        _this.lazyIdle = false;
                    });
                });
            };
            BaseClass.prototype.resetStates = function (set, state) {
                var e_4, _a;
                try {
                    for (var _b = __values(set.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var id = _c.value;
                        var math = this.lazyList.get(id);
                        if (math.lazyCompile) {
                            math.state(MathItem_js_1.STATE.COMPILED - 1);
                            state = MathItem_js_1.STATE.COMPILED;
                        }
                        else {
                            math.state(MathItem_js_1.STATE.TYPESET - 1);
                        }
                        math.lazyCompile = math.lazyTypeset = false;
                        math.lazyMarker && this.lazyObserver.unobserve(math.lazyMarker);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return state;
            };
            BaseClass.prototype.compileEarlierItems = function (set) {
                var e_5, _a;
                var math = this.earliestTex(set);
                if (!math)
                    return false;
                var compile = false;
                try {
                    for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var item = _c.value;
                        var earlier = item;
                        if (earlier === math || !(earlier === null || earlier === void 0 ? void 0 : earlier.lazyCompile) || !earlier.lazyTex) {
                            break;
                        }
                        earlier.lazyCompile = false;
                        earlier.lazyMarker && this.lazyObserver.unobserve(earlier.lazyMarker);
                        earlier.state(MathItem_js_1.STATE.COMPILED - 1);
                        compile = true;
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                return compile;
            };
            BaseClass.prototype.earliestTex = function (set) {
                var e_6, _a;
                var min = null;
                var minMath = null;
                try {
                    for (var _b = __values(set.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var id = _c.value;
                        var math = this.lazyList.get(id);
                        if (!math.lazyTex)
                            continue;
                        if (min === null || parseInt(id) < min) {
                            min = parseInt(id);
                            minMath = math;
                        }
                    }
                }
                catch (e_6_1) { e_6 = { error: e_6_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_6) throw e_6.error; }
                }
                return minMath;
            };
            BaseClass.prototype.clearMathItemsWithin = function (containers) {
                var e_7, _a;
                var items = _super.prototype.clearMathItemsWithin.call(this, containers);
                try {
                    for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                        var math = items_1_1.value;
                        var marker = math.lazyMarker;
                        if (marker) {
                            this.lazyObserver.unobserve(marker);
                            this.lazyList.delete(this.adaptor.getAttribute(marker, exports.LAZYID));
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
                return items;
            };
            BaseClass.prototype.render = function () {
                var always = this.options.lazyAlwaysTypeset;
                this.lazyAlwaysContainers = !always ? null :
                    this.adaptor.getElements(Array.isArray(always) ? always : [always], this.document);
                this.lazyAlwaysIndex = 0;
                _super.prototype.render.call(this);
                return this;
            };
            return BaseClass;
        }(BaseDocument)),
        _a.OPTIONS = __assign(__assign({}, BaseDocument.OPTIONS), { lazyMargin: '200px', lazyAlwaysTypeset: null, renderActions: __assign(__assign({}, BaseDocument.OPTIONS.renderActions), { lazyAlways: [MathItem_js_1.STATE.LAZYALWAYS, 'lazyAlways', '', false] }) }),
        _a;
}
exports.LazyMathDocumentMixin = LazyMathDocumentMixin;
function LazyHandler(handler) {
    if (typeof IntersectionObserver !== 'undefined') {
        handler.documentClass =
            LazyMathDocumentMixin(handler.documentClass);
    }
    return handler;
}
exports.LazyHandler = LazyHandler;
//# sourceMappingURL=LazyHandler.js.map