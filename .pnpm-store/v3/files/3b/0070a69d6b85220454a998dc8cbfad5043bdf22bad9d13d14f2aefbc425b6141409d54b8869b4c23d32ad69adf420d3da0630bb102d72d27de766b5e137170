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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeX = void 0;
var InputJax_js_1 = require("../core/InputJax.js");
var Options_js_1 = require("../util/Options.js");
var FindTeX_js_1 = require("./tex/FindTeX.js");
var FilterUtil_js_1 = __importDefault(require("./tex/FilterUtil.js"));
var NodeUtil_js_1 = __importDefault(require("./tex/NodeUtil.js"));
var TexParser_js_1 = __importDefault(require("./tex/TexParser.js"));
var TexError_js_1 = __importDefault(require("./tex/TexError.js"));
var ParseOptions_js_1 = __importDefault(require("./tex/ParseOptions.js"));
var Tags_js_1 = require("./tex/Tags.js");
var Configuration_js_1 = require("./tex/Configuration.js");
require("./tex/base/BaseConfiguration.js");
var TeX = (function (_super) {
    __extends(TeX, _super);
    function TeX(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = __read((0, Options_js_1.separateOptions)(options, TeX.OPTIONS, FindTeX_js_1.FindTeX.OPTIONS), 3), rest = _a[0], tex = _a[1], find = _a[2];
        _this = _super.call(this, tex) || this;
        _this.findTeX = _this.options['FindTeX'] || new FindTeX_js_1.FindTeX(find);
        var packages = _this.options.packages;
        var configuration = _this.configuration = TeX.configure(packages);
        var parseOptions = _this._parseOptions =
            new ParseOptions_js_1.default(configuration, [_this.options, Tags_js_1.TagsFactory.OPTIONS]);
        (0, Options_js_1.userOptions)(parseOptions.options, rest);
        configuration.config(_this);
        TeX.tags(parseOptions, configuration);
        _this.postFilters.add(FilterUtil_js_1.default.cleanSubSup, -6);
        _this.postFilters.add(FilterUtil_js_1.default.setInherited, -5);
        _this.postFilters.add(FilterUtil_js_1.default.moveLimits, -4);
        _this.postFilters.add(FilterUtil_js_1.default.cleanStretchy, -3);
        _this.postFilters.add(FilterUtil_js_1.default.cleanAttributes, -2);
        _this.postFilters.add(FilterUtil_js_1.default.combineRelations, -1);
        return _this;
    }
    TeX.configure = function (packages) {
        var configuration = new Configuration_js_1.ParserConfiguration(packages, ['tex']);
        configuration.init();
        return configuration;
    };
    TeX.tags = function (options, configuration) {
        Tags_js_1.TagsFactory.addTags(configuration.tags);
        Tags_js_1.TagsFactory.setDefault(options.options.tags);
        options.tags = Tags_js_1.TagsFactory.getDefault();
        options.tags.configuration = options;
    };
    TeX.prototype.setMmlFactory = function (mmlFactory) {
        _super.prototype.setMmlFactory.call(this, mmlFactory);
        this._parseOptions.nodeFactory.setMmlFactory(mmlFactory);
    };
    Object.defineProperty(TeX.prototype, "parseOptions", {
        get: function () {
            return this._parseOptions;
        },
        enumerable: false,
        configurable: true
    });
    TeX.prototype.reset = function (tag) {
        if (tag === void 0) { tag = 0; }
        this.parseOptions.tags.reset(tag);
    };
    TeX.prototype.compile = function (math, document) {
        this.parseOptions.clear();
        this.executeFilters(this.preFilters, math, document, this.parseOptions);
        var display = math.display;
        this.latex = math.math;
        var node;
        this.parseOptions.tags.startEquation(math);
        var globalEnv;
        try {
            var parser = new TexParser_js_1.default(this.latex, { display: display, isInner: false }, this.parseOptions);
            node = parser.mml();
            globalEnv = parser.stack.global;
        }
        catch (err) {
            if (!(err instanceof TexError_js_1.default)) {
                throw err;
            }
            this.parseOptions.error = true;
            node = this.options.formatError(this, err);
        }
        node = this.parseOptions.nodeFactory.create('node', 'math', [node]);
        if (globalEnv === null || globalEnv === void 0 ? void 0 : globalEnv.indentalign) {
            NodeUtil_js_1.default.setAttribute(node, 'indentalign', globalEnv.indentalign);
        }
        if (display) {
            NodeUtil_js_1.default.setAttribute(node, 'display', 'block');
        }
        this.parseOptions.tags.finishEquation(math);
        this.parseOptions.root = node;
        this.executeFilters(this.postFilters, math, document, this.parseOptions);
        this.mathNode = this.parseOptions.root;
        return this.mathNode;
    };
    TeX.prototype.findMath = function (strings) {
        return this.findTeX.findMath(strings);
    };
    TeX.prototype.formatError = function (err) {
        var message = err.message.replace(/\n.*/, '');
        return this.parseOptions.nodeFactory.create('error', message, err.id, this.latex);
    };
    TeX.NAME = 'TeX';
    TeX.OPTIONS = __assign(__assign({}, InputJax_js_1.AbstractInputJax.OPTIONS), { FindTeX: null, packages: ['base'], digits: /^(?:[0-9]+(?:\{,\}[0-9]{3})*(?:\.[0-9]*)?|\.[0-9]+)/, maxBuffer: 5 * 1024, formatError: function (jax, err) { return jax.formatError(err); } });
    return TeX;
}(InputJax_js_1.AbstractInputJax));
exports.TeX = TeX;
//# sourceMappingURL=tex.js.map