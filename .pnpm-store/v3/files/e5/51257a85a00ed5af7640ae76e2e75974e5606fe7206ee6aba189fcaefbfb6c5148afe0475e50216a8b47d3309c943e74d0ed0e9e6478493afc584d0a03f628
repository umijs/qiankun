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
exports.MathML = void 0;
var InputJax_js_1 = require("../core/InputJax.js");
var Options_js_1 = require("../util/Options.js");
var FunctionList_js_1 = require("../util/FunctionList.js");
var FindMathML_js_1 = require("./mathml/FindMathML.js");
var MathMLCompile_js_1 = require("./mathml/MathMLCompile.js");
var MathML = (function (_super) {
    __extends(MathML, _super);
    function MathML(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        var _a = __read((0, Options_js_1.separateOptions)(options, FindMathML_js_1.FindMathML.OPTIONS, MathMLCompile_js_1.MathMLCompile.OPTIONS), 3), mml = _a[0], find = _a[1], compile = _a[2];
        _this = _super.call(this, mml) || this;
        _this.findMathML = _this.options['FindMathML'] || new FindMathML_js_1.FindMathML(find);
        _this.mathml = _this.options['MathMLCompile'] || new MathMLCompile_js_1.MathMLCompile(compile);
        _this.mmlFilters = new FunctionList_js_1.FunctionList();
        return _this;
    }
    MathML.prototype.setAdaptor = function (adaptor) {
        _super.prototype.setAdaptor.call(this, adaptor);
        this.findMathML.adaptor = adaptor;
        this.mathml.adaptor = adaptor;
    };
    MathML.prototype.setMmlFactory = function (mmlFactory) {
        _super.prototype.setMmlFactory.call(this, mmlFactory);
        this.mathml.setMmlFactory(mmlFactory);
    };
    Object.defineProperty(MathML.prototype, "processStrings", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    MathML.prototype.compile = function (math, document) {
        var mml = math.start.node;
        if (!mml || !math.end.node || this.options['forceReparse'] || this.adaptor.kind(mml) === '#text') {
            var mathml = this.executeFilters(this.preFilters, math, document, (math.math || '<math></math>').trim());
            var doc = this.checkForErrors(this.adaptor.parse(mathml, 'text/' + this.options['parseAs']));
            var body = this.adaptor.body(doc);
            if (this.adaptor.childNodes(body).length !== 1) {
                this.error('MathML must consist of a single element');
            }
            mml = this.adaptor.remove(this.adaptor.firstChild(body));
            if (this.adaptor.kind(mml).replace(/^[a-z]+:/, '') !== 'math') {
                this.error('MathML must be formed by a <math> element, not <' + this.adaptor.kind(mml) + '>');
            }
        }
        mml = this.executeFilters(this.mmlFilters, math, document, mml);
        return this.executeFilters(this.postFilters, math, document, this.mathml.compile(mml));
    };
    MathML.prototype.checkForErrors = function (doc) {
        var err = this.adaptor.tags(this.adaptor.body(doc), 'parsererror')[0];
        if (err) {
            if (this.adaptor.textContent(err) === '') {
                this.error('Error processing MathML');
            }
            this.options['parseError'].call(this, err);
        }
        return doc;
    };
    MathML.prototype.error = function (message) {
        throw new Error(message);
    };
    MathML.prototype.findMath = function (node) {
        return this.findMathML.findMath(node);
    };
    MathML.NAME = 'MathML';
    MathML.OPTIONS = (0, Options_js_1.defaultOptions)({
        parseAs: 'html',
        forceReparse: false,
        FindMathML: null,
        MathMLCompile: null,
        parseError: function (node) {
            this.error(this.adaptor.textContent(node).replace(/\n.*/g, ''));
        }
    }, InputJax_js_1.AbstractInputJax.OPTIONS);
    return MathML;
}(InputJax_js_1.AbstractInputJax));
exports.MathML = MathML;
//# sourceMappingURL=mathml.js.map