"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractInputJax = void 0;
var Options_js_1 = require("../util/Options.js");
var FunctionList_js_1 = require("../util/FunctionList.js");
var AbstractInputJax = (function () {
    function AbstractInputJax(options) {
        if (options === void 0) { options = {}; }
        this.adaptor = null;
        this.mmlFactory = null;
        var CLASS = this.constructor;
        this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), options);
        this.preFilters = new FunctionList_js_1.FunctionList();
        this.postFilters = new FunctionList_js_1.FunctionList();
    }
    Object.defineProperty(AbstractInputJax.prototype, "name", {
        get: function () {
            return this.constructor.NAME;
        },
        enumerable: false,
        configurable: true
    });
    AbstractInputJax.prototype.setAdaptor = function (adaptor) {
        this.adaptor = adaptor;
    };
    AbstractInputJax.prototype.setMmlFactory = function (mmlFactory) {
        this.mmlFactory = mmlFactory;
    };
    AbstractInputJax.prototype.initialize = function () {
    };
    AbstractInputJax.prototype.reset = function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
    };
    Object.defineProperty(AbstractInputJax.prototype, "processStrings", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    AbstractInputJax.prototype.findMath = function (_node, _options) {
        return [];
    };
    AbstractInputJax.prototype.executeFilters = function (filters, math, document, data) {
        var args = { math: math, document: document, data: data };
        filters.execute(args);
        return args.data;
    };
    AbstractInputJax.NAME = 'generic';
    AbstractInputJax.OPTIONS = {};
    return AbstractInputJax;
}());
exports.AbstractInputJax = AbstractInputJax;
//# sourceMappingURL=InputJax.js.map