"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = exports.MathJax = exports.Startup = void 0;
var global_js_1 = require("./global.js");
var PrioritizedList_js_1 = require("../util/PrioritizedList.js");
var Options_js_1 = require("../util/Options.js");
var Startup;
(function (Startup) {
    var extensions = new PrioritizedList_js_1.PrioritizedList();
    var visitor;
    var mathjax;
    Startup.constructors = {};
    Startup.input = [];
    Startup.output = null;
    Startup.handler = null;
    Startup.adaptor = null;
    Startup.elements = null;
    Startup.document = null;
    Startup.promise = new Promise(function (resolve, reject) {
        Startup.promiseResolve = resolve;
        Startup.promiseReject = reject;
    });
    Startup.pagePromise = new Promise(function (resolve, _reject) {
        var doc = global.document;
        if (!doc || !doc.readyState || doc.readyState === 'complete' || doc.readyState === 'interactive') {
            resolve();
        }
        else {
            var listener = function () { return resolve(); };
            doc.defaultView.addEventListener('load', listener, true);
            doc.defaultView.addEventListener('DOMContentLoaded', listener, true);
        }
    });
    function toMML(node) {
        return visitor.visitTree(node, Startup.document);
    }
    Startup.toMML = toMML;
    function registerConstructor(name, constructor) {
        Startup.constructors[name] = constructor;
    }
    Startup.registerConstructor = registerConstructor;
    function useHandler(name, force) {
        if (force === void 0) { force = false; }
        if (!exports.CONFIG.handler || force) {
            exports.CONFIG.handler = name;
        }
    }
    Startup.useHandler = useHandler;
    function useAdaptor(name, force) {
        if (force === void 0) { force = false; }
        if (!exports.CONFIG.adaptor || force) {
            exports.CONFIG.adaptor = name;
        }
    }
    Startup.useAdaptor = useAdaptor;
    function useInput(name, force) {
        if (force === void 0) { force = false; }
        if (!inputSpecified || force) {
            exports.CONFIG.input.push(name);
        }
    }
    Startup.useInput = useInput;
    function useOutput(name, force) {
        if (force === void 0) { force = false; }
        if (!exports.CONFIG.output || force) {
            exports.CONFIG.output = name;
        }
    }
    Startup.useOutput = useOutput;
    function extendHandler(extend, priority) {
        if (priority === void 0) { priority = 10; }
        extensions.add(extend, priority);
    }
    Startup.extendHandler = extendHandler;
    function defaultReady() {
        getComponents();
        makeMethods();
        Startup.pagePromise
            .then(function () { return exports.CONFIG.pageReady(); })
            .then(function () { return Startup.promiseResolve(); })
            .catch(function (err) { return Startup.promiseReject(err); });
    }
    Startup.defaultReady = defaultReady;
    function defaultPageReady() {
        return (exports.CONFIG.typeset && exports.MathJax.typesetPromise ?
            exports.MathJax.typesetPromise(exports.CONFIG.elements) :
            Promise.resolve());
    }
    Startup.defaultPageReady = defaultPageReady;
    function getComponents() {
        visitor = new exports.MathJax._.core.MmlTree.SerializedMmlVisitor.SerializedMmlVisitor();
        mathjax = exports.MathJax._.mathjax.mathjax;
        Startup.input = getInputJax();
        Startup.output = getOutputJax();
        Startup.adaptor = getAdaptor();
        if (Startup.handler) {
            mathjax.handlers.unregister(Startup.handler);
        }
        Startup.handler = getHandler();
        if (Startup.handler) {
            mathjax.handlers.register(Startup.handler);
            Startup.document = getDocument();
        }
    }
    Startup.getComponents = getComponents;
    function makeMethods() {
        var e_1, _a;
        if (Startup.input && Startup.output) {
            makeTypesetMethods();
        }
        var oname = (Startup.output ? Startup.output.name.toLowerCase() : '');
        try {
            for (var input_1 = __values(Startup.input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
                var jax = input_1_1.value;
                var iname = jax.name.toLowerCase();
                makeMmlMethods(iname, jax);
                makeResetMethod(iname, jax);
                if (Startup.output) {
                    makeOutputMethods(iname, oname, jax);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Startup.makeMethods = makeMethods;
    function makeTypesetMethods() {
        exports.MathJax.typeset = function (elements) {
            if (elements === void 0) { elements = null; }
            Startup.document.options.elements = elements;
            Startup.document.reset();
            Startup.document.render();
        };
        exports.MathJax.typesetPromise = function (elements) {
            if (elements === void 0) { elements = null; }
            Startup.document.options.elements = elements;
            Startup.document.reset();
            return mathjax.handleRetriesFor(function () {
                Startup.document.render();
            });
        };
        exports.MathJax.typesetClear = function (elements) {
            if (elements === void 0) { elements = null; }
            if (elements) {
                Startup.document.clearMathItemsWithin(elements);
            }
            else {
                Startup.document.clear();
            }
        };
    }
    Startup.makeTypesetMethods = makeTypesetMethods;
    function makeOutputMethods(iname, oname, input) {
        var name = iname + '2' + oname;
        exports.MathJax[name] =
            function (math, options) {
                if (options === void 0) { options = {}; }
                options.format = input.name;
                return Startup.document.convert(math, options);
            };
        exports.MathJax[name + 'Promise'] =
            function (math, options) {
                if (options === void 0) { options = {}; }
                options.format = input.name;
                return mathjax.handleRetriesFor(function () { return Startup.document.convert(math, options); });
            };
        exports.MathJax[oname + 'Stylesheet'] = function () { return Startup.output.styleSheet(Startup.document); };
        if ('getMetricsFor' in Startup.output) {
            exports.MathJax.getMetricsFor = function (node, display) {
                return Startup.output.getMetricsFor(node, display);
            };
        }
    }
    Startup.makeOutputMethods = makeOutputMethods;
    function makeMmlMethods(name, input) {
        var STATE = exports.MathJax._.core.MathItem.STATE;
        exports.MathJax[name + '2mml'] =
            function (math, options) {
                if (options === void 0) { options = {}; }
                options.end = STATE.CONVERT;
                options.format = input.name;
                return toMML(Startup.document.convert(math, options));
            };
        exports.MathJax[name + '2mmlPromise'] =
            function (math, options) {
                if (options === void 0) { options = {}; }
                options.end = STATE.CONVERT;
                options.format = input.name;
                return mathjax.handleRetriesFor(function () { return toMML(Startup.document.convert(math, options)); });
            };
    }
    Startup.makeMmlMethods = makeMmlMethods;
    function makeResetMethod(name, input) {
        exports.MathJax[name + 'Reset'] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return input.reset.apply(input, __spreadArray([], __read(args), false));
        };
    }
    Startup.makeResetMethod = makeResetMethod;
    function getInputJax() {
        var e_2, _a;
        var jax = [];
        try {
            for (var _b = __values(exports.CONFIG.input), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                var inputClass = Startup.constructors[name_1];
                if (inputClass) {
                    jax.push(new inputClass(exports.MathJax.config[name_1]));
                }
                else {
                    throw Error('Input Jax "' + name_1 + '" is not defined (has it been loaded?)');
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
        return jax;
    }
    Startup.getInputJax = getInputJax;
    function getOutputJax() {
        var name = exports.CONFIG.output;
        if (!name)
            return null;
        var outputClass = Startup.constructors[name];
        if (!outputClass) {
            throw Error('Output Jax "' + name + '" is not defined (has it been loaded?)');
        }
        return new outputClass(exports.MathJax.config[name]);
    }
    Startup.getOutputJax = getOutputJax;
    function getAdaptor() {
        var name = exports.CONFIG.adaptor;
        if (!name || name === 'none')
            return null;
        var adaptor = Startup.constructors[name];
        if (!adaptor) {
            throw Error('DOMAdaptor "' + name + '" is not defined (has it been loaded?)');
        }
        return adaptor(exports.MathJax.config[name]);
    }
    Startup.getAdaptor = getAdaptor;
    function getHandler() {
        var e_3, _a;
        var name = exports.CONFIG.handler;
        if (!name || name === 'none' || !Startup.adaptor)
            return null;
        var handlerClass = Startup.constructors[name];
        if (!handlerClass) {
            throw Error('Handler "' + name + '" is not defined (has it been loaded?)');
        }
        var handler = new handlerClass(Startup.adaptor, 5);
        try {
            for (var extensions_1 = __values(extensions), extensions_1_1 = extensions_1.next(); !extensions_1_1.done; extensions_1_1 = extensions_1.next()) {
                var extend = extensions_1_1.value;
                handler = extend.item(handler);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (extensions_1_1 && !extensions_1_1.done && (_a = extensions_1.return)) _a.call(extensions_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return handler;
    }
    Startup.getHandler = getHandler;
    function getDocument(root) {
        if (root === void 0) { root = null; }
        return mathjax.document(root || exports.CONFIG.document, __assign(__assign({}, exports.MathJax.config.options), { InputJax: Startup.input, OutputJax: Startup.output }));
    }
    Startup.getDocument = getDocument;
})(Startup = exports.Startup || (exports.Startup = {}));
exports.MathJax = global_js_1.MathJax;
if (typeof exports.MathJax._.startup === 'undefined') {
    (0, global_js_1.combineDefaults)(exports.MathJax.config, 'startup', {
        input: [],
        output: '',
        handler: null,
        adaptor: null,
        document: (typeof document === 'undefined' ? '' : document),
        elements: null,
        typeset: true,
        ready: Startup.defaultReady.bind(Startup),
        pageReady: Startup.defaultPageReady.bind(Startup)
    });
    (0, global_js_1.combineWithMathJax)({
        startup: Startup,
        options: {}
    });
    if (exports.MathJax.config.startup.invalidOption) {
        Options_js_1.OPTIONS.invalidOption = exports.MathJax.config.startup.invalidOption;
    }
    if (exports.MathJax.config.startup.optionError) {
        Options_js_1.OPTIONS.optionError = exports.MathJax.config.startup.optionError;
    }
}
exports.CONFIG = exports.MathJax.config.startup;
var inputSpecified = exports.CONFIG.input.length !== 0;
//# sourceMappingURL=startup.js.map