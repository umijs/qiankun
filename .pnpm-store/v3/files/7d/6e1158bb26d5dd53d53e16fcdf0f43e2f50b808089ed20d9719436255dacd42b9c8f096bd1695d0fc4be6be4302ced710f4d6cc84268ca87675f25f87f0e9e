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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMathDocument = exports.resetAllOptions = exports.resetOptions = exports.RenderList = void 0;
var Options_js_1 = require("../util/Options.js");
var InputJax_js_1 = require("./InputJax.js");
var OutputJax_js_1 = require("./OutputJax.js");
var MathList_js_1 = require("./MathList.js");
var MathItem_js_1 = require("./MathItem.js");
var MmlFactory_js_1 = require("../core/MmlTree/MmlFactory.js");
var BitField_js_1 = require("../util/BitField.js");
var PrioritizedList_js_1 = require("../util/PrioritizedList.js");
var RenderList = (function (_super) {
    __extends(RenderList, _super);
    function RenderList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RenderList.create = function (actions) {
        var e_1, _a;
        var list = new this();
        try {
            for (var _b = __values(Object.keys(actions)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var id = _c.value;
                var _d = __read(this.action(id, actions[id]), 2), action = _d[0], priority = _d[1];
                if (priority) {
                    list.add(action, priority);
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
        return list;
    };
    RenderList.action = function (id, action) {
        var _a, _b, _c, _d;
        var renderDoc, renderMath;
        var convert = true;
        var priority = action[0];
        if (action.length === 1 || typeof action[1] === 'boolean') {
            action.length === 2 && (convert = action[1]);
            _a = __read(this.methodActions(id), 2), renderDoc = _a[0], renderMath = _a[1];
        }
        else if (typeof action[1] === 'string') {
            if (typeof action[2] === 'string') {
                action.length === 4 && (convert = action[3]);
                var _e = __read(action.slice(1), 2), method1 = _e[0], method2 = _e[1];
                _b = __read(this.methodActions(method1, method2), 2), renderDoc = _b[0], renderMath = _b[1];
            }
            else {
                action.length === 3 && (convert = action[2]);
                _c = __read(this.methodActions(action[1]), 2), renderDoc = _c[0], renderMath = _c[1];
            }
        }
        else {
            action.length === 4 && (convert = action[3]);
            _d = __read(action.slice(1), 2), renderDoc = _d[0], renderMath = _d[1];
        }
        return [{ id: id, renderDoc: renderDoc, renderMath: renderMath, convert: convert }, priority];
    };
    RenderList.methodActions = function (method1, method2) {
        if (method2 === void 0) { method2 = method1; }
        return [
            function (document) { method1 && document[method1](); return false; },
            function (math, document) { method2 && math[method2](document); return false; }
        ];
    };
    RenderList.prototype.renderDoc = function (document, start) {
        var e_2, _a;
        if (start === void 0) { start = MathItem_js_1.STATE.UNPROCESSED; }
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.priority >= start) {
                    if (item.item.renderDoc(document))
                        return;
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
    };
    RenderList.prototype.renderMath = function (math, document, start) {
        var e_3, _a;
        if (start === void 0) { start = MathItem_js_1.STATE.UNPROCESSED; }
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.priority >= start) {
                    if (item.item.renderMath(math, document))
                        return;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    RenderList.prototype.renderConvert = function (math, document, end) {
        var e_4, _a;
        if (end === void 0) { end = MathItem_js_1.STATE.LAST; }
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.priority > end)
                    return;
                if (item.item.convert) {
                    if (item.item.renderMath(math, document))
                        return;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    RenderList.prototype.findID = function (id) {
        var e_5, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.item.id === id) {
                    return item.item;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return null;
    };
    return RenderList;
}(PrioritizedList_js_1.PrioritizedList));
exports.RenderList = RenderList;
exports.resetOptions = {
    all: false,
    processed: false,
    inputJax: null,
    outputJax: null
};
exports.resetAllOptions = {
    all: true,
    processed: true,
    inputJax: [],
    outputJax: []
};
var DefaultInputJax = (function (_super) {
    __extends(DefaultInputJax, _super);
    function DefaultInputJax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultInputJax.prototype.compile = function (_math) {
        return null;
    };
    return DefaultInputJax;
}(InputJax_js_1.AbstractInputJax));
var DefaultOutputJax = (function (_super) {
    __extends(DefaultOutputJax, _super);
    function DefaultOutputJax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefaultOutputJax.prototype.typeset = function (_math, _document) {
        if (_document === void 0) { _document = null; }
        return null;
    };
    DefaultOutputJax.prototype.escaped = function (_math, _document) {
        return null;
    };
    return DefaultOutputJax;
}(OutputJax_js_1.AbstractOutputJax));
var DefaultMathList = (function (_super) {
    __extends(DefaultMathList, _super);
    function DefaultMathList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DefaultMathList;
}(MathList_js_1.AbstractMathList));
var DefaultMathItem = (function (_super) {
    __extends(DefaultMathItem, _super);
    function DefaultMathItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DefaultMathItem;
}(MathItem_js_1.AbstractMathItem));
var AbstractMathDocument = (function () {
    function AbstractMathDocument(document, adaptor, options) {
        var _this = this;
        var CLASS = this.constructor;
        this.document = document;
        this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), options);
        this.math = new (this.options['MathList'] || DefaultMathList)();
        this.renderActions = RenderList.create(this.options['renderActions']);
        this.processed = new AbstractMathDocument.ProcessBits();
        this.outputJax = this.options['OutputJax'] || new DefaultOutputJax();
        var inputJax = this.options['InputJax'] || [new DefaultInputJax()];
        if (!Array.isArray(inputJax)) {
            inputJax = [inputJax];
        }
        this.inputJax = inputJax;
        this.adaptor = adaptor;
        this.outputJax.setAdaptor(adaptor);
        this.inputJax.map(function (jax) { return jax.setAdaptor(adaptor); });
        this.mmlFactory = this.options['MmlFactory'] || new MmlFactory_js_1.MmlFactory();
        this.inputJax.map(function (jax) { return jax.setMmlFactory(_this.mmlFactory); });
        this.outputJax.initialize();
        this.inputJax.map(function (jax) { return jax.initialize(); });
    }
    Object.defineProperty(AbstractMathDocument.prototype, "kind", {
        get: function () {
            return this.constructor.KIND;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMathDocument.prototype.addRenderAction = function (id) {
        var action = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            action[_i - 1] = arguments[_i];
        }
        var _a = __read(RenderList.action(id, action), 2), fn = _a[0], p = _a[1];
        this.renderActions.add(fn, p);
    };
    AbstractMathDocument.prototype.removeRenderAction = function (id) {
        var action = this.renderActions.findID(id);
        if (action) {
            this.renderActions.remove(action);
        }
    };
    AbstractMathDocument.prototype.render = function () {
        this.renderActions.renderDoc(this);
        return this;
    };
    AbstractMathDocument.prototype.rerender = function (start) {
        if (start === void 0) { start = MathItem_js_1.STATE.RERENDER; }
        this.state(start - 1);
        this.render();
        return this;
    };
    AbstractMathDocument.prototype.convert = function (math, options) {
        if (options === void 0) { options = {}; }
        var _a = (0, Options_js_1.userOptions)({
            format: this.inputJax[0].name, display: true, end: MathItem_js_1.STATE.LAST,
            em: 16, ex: 8, containerWidth: null, lineWidth: 1000000, scale: 1, family: ''
        }, options), format = _a.format, display = _a.display, end = _a.end, ex = _a.ex, em = _a.em, containerWidth = _a.containerWidth, lineWidth = _a.lineWidth, scale = _a.scale, family = _a.family;
        if (containerWidth === null) {
            containerWidth = 80 * ex;
        }
        var jax = this.inputJax.reduce(function (jax, ijax) { return (ijax.name === format ? ijax : jax); }, null);
        var mitem = new this.options.MathItem(math, jax, display);
        mitem.start.node = this.adaptor.body(this.document);
        mitem.setMetrics(em, ex, containerWidth, lineWidth, scale);
        if (this.outputJax.options.mtextInheritFont) {
            mitem.outputData.mtextFamily = family;
        }
        if (this.outputJax.options.merrorInheritFont) {
            mitem.outputData.merrorFamily = family;
        }
        mitem.convert(this, end);
        return (mitem.typesetRoot || mitem.root);
    };
    AbstractMathDocument.prototype.findMath = function (_options) {
        if (_options === void 0) { _options = null; }
        this.processed.set('findMath');
        return this;
    };
    AbstractMathDocument.prototype.compile = function () {
        var e_6, _a, e_7, _b;
        if (!this.processed.isSet('compile')) {
            var recompile = [];
            try {
                for (var _c = __values(this.math), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var math = _d.value;
                    this.compileMath(math);
                    if (math.inputData.recompile !== undefined) {
                        recompile.push(math);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
            try {
                for (var recompile_1 = __values(recompile), recompile_1_1 = recompile_1.next(); !recompile_1_1.done; recompile_1_1 = recompile_1.next()) {
                    var math = recompile_1_1.value;
                    var data = math.inputData.recompile;
                    math.state(data.state);
                    math.inputData.recompile = data;
                    this.compileMath(math);
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (recompile_1_1 && !recompile_1_1.done && (_b = recompile_1.return)) _b.call(recompile_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
            this.processed.set('compile');
        }
        return this;
    };
    AbstractMathDocument.prototype.compileMath = function (math) {
        try {
            math.compile(this);
        }
        catch (err) {
            if (err.retry || err.restart) {
                throw err;
            }
            this.options['compileError'](this, math, err);
            math.inputData['error'] = err;
        }
    };
    AbstractMathDocument.prototype.compileError = function (math, err) {
        math.root = this.mmlFactory.create('math', null, [
            this.mmlFactory.create('merror', { 'data-mjx-error': err.message, title: err.message }, [
                this.mmlFactory.create('mtext', null, [
                    this.mmlFactory.create('text').setText('Math input error')
                ])
            ])
        ]);
        if (math.display) {
            math.root.attributes.set('display', 'block');
        }
        math.inputData.error = err.message;
    };
    AbstractMathDocument.prototype.typeset = function () {
        var e_8, _a;
        if (!this.processed.isSet('typeset')) {
            try {
                for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var math = _c.value;
                    try {
                        math.typeset(this);
                    }
                    catch (err) {
                        if (err.retry || err.restart) {
                            throw err;
                        }
                        this.options['typesetError'](this, math, err);
                        math.outputData['error'] = err;
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            this.processed.set('typeset');
        }
        return this;
    };
    AbstractMathDocument.prototype.typesetError = function (math, err) {
        math.typesetRoot = this.adaptor.node('mjx-container', {
            class: 'MathJax mjx-output-error',
            jax: this.outputJax.name,
        }, [
            this.adaptor.node('span', {
                'data-mjx-error': err.message,
                title: err.message,
                style: {
                    color: 'red',
                    'background-color': 'yellow',
                    'line-height': 'normal'
                }
            }, [
                this.adaptor.text('Math output error')
            ])
        ]);
        if (math.display) {
            this.adaptor.setAttributes(math.typesetRoot, {
                style: {
                    display: 'block',
                    margin: '1em 0',
                    'text-align': 'center'
                }
            });
        }
        math.outputData.error = err.message;
    };
    AbstractMathDocument.prototype.getMetrics = function () {
        if (!this.processed.isSet('getMetrics')) {
            this.outputJax.getMetrics(this);
            this.processed.set('getMetrics');
        }
        return this;
    };
    AbstractMathDocument.prototype.updateDocument = function () {
        var e_9, _a;
        if (!this.processed.isSet('updateDocument')) {
            try {
                for (var _b = __values(this.math.reversed()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var math = _c.value;
                    math.updateDocument(this);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
            this.processed.set('updateDocument');
        }
        return this;
    };
    AbstractMathDocument.prototype.removeFromDocument = function (_restore) {
        if (_restore === void 0) { _restore = false; }
        return this;
    };
    AbstractMathDocument.prototype.state = function (state, restore) {
        var e_10, _a;
        if (restore === void 0) { restore = false; }
        try {
            for (var _b = __values(this.math), _c = _b.next(); !_c.done; _c = _b.next()) {
                var math = _c.value;
                math.state(state, restore);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        if (state < MathItem_js_1.STATE.INSERTED) {
            this.processed.clear('updateDocument');
        }
        if (state < MathItem_js_1.STATE.TYPESET) {
            this.processed.clear('typeset');
            this.processed.clear('getMetrics');
        }
        if (state < MathItem_js_1.STATE.COMPILED) {
            this.processed.clear('compile');
        }
        return this;
    };
    AbstractMathDocument.prototype.reset = function (options) {
        var _a;
        if (options === void 0) { options = { processed: true }; }
        options = (0, Options_js_1.userOptions)(Object.assign({}, exports.resetOptions), options);
        options.all && Object.assign(options, exports.resetAllOptions);
        options.processed && this.processed.reset();
        options.inputJax && this.inputJax.forEach(function (jax) { return jax.reset.apply(jax, __spreadArray([], __read(options.inputJax), false)); });
        options.outputJax && (_a = this.outputJax).reset.apply(_a, __spreadArray([], __read(options.outputJax), false));
        return this;
    };
    AbstractMathDocument.prototype.clear = function () {
        this.reset();
        this.math.clear();
        return this;
    };
    AbstractMathDocument.prototype.concat = function (list) {
        this.math.merge(list);
        return this;
    };
    AbstractMathDocument.prototype.clearMathItemsWithin = function (containers) {
        var _a;
        var items = this.getMathItemsWithin(containers);
        (_a = this.math).remove.apply(_a, __spreadArray([], __read(items), false));
        return items;
    };
    AbstractMathDocument.prototype.getMathItemsWithin = function (elements) {
        var e_11, _a, e_12, _b;
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        var adaptor = this.adaptor;
        var items = [];
        var containers = adaptor.getElements(elements, this.document);
        try {
            ITEMS: for (var _c = __values(this.math), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                try {
                    for (var containers_1 = (e_12 = void 0, __values(containers)), containers_1_1 = containers_1.next(); !containers_1_1.done; containers_1_1 = containers_1.next()) {
                        var container = containers_1_1.value;
                        if (item.start.node && adaptor.contains(container, item.start.node)) {
                            items.push(item);
                            continue ITEMS;
                        }
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (containers_1_1 && !containers_1_1.done && (_b = containers_1.return)) _b.call(containers_1);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_11) throw e_11.error; }
        }
        return items;
    };
    AbstractMathDocument.KIND = 'MathDocument';
    AbstractMathDocument.OPTIONS = {
        OutputJax: null,
        InputJax: null,
        MmlFactory: null,
        MathList: DefaultMathList,
        MathItem: DefaultMathItem,
        compileError: function (doc, math, err) {
            doc.compileError(math, err);
        },
        typesetError: function (doc, math, err) {
            doc.typesetError(math, err);
        },
        renderActions: (0, Options_js_1.expandable)({
            find: [MathItem_js_1.STATE.FINDMATH, 'findMath', '', false],
            compile: [MathItem_js_1.STATE.COMPILED],
            metrics: [MathItem_js_1.STATE.METRICS, 'getMetrics', '', false],
            typeset: [MathItem_js_1.STATE.TYPESET],
            update: [MathItem_js_1.STATE.INSERTED, 'updateDocument', false]
        })
    };
    AbstractMathDocument.ProcessBits = (0, BitField_js_1.BitFieldClass)('findMath', 'compile', 'getMetrics', 'typeset', 'updateDocument');
    return AbstractMathDocument;
}());
exports.AbstractMathDocument = AbstractMathDocument;
//# sourceMappingURL=MathDocument.js.map