"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newState = exports.STATE = exports.AbstractMathItem = exports.protoItem = void 0;
function protoItem(open, math, close, n, start, end, display) {
    if (display === void 0) { display = null; }
    var item = { open: open, math: math, close: close,
        n: n, start: { n: start }, end: { n: end }, display: display };
    return item;
}
exports.protoItem = protoItem;
var AbstractMathItem = (function () {
    function AbstractMathItem(math, jax, display, start, end) {
        if (display === void 0) { display = true; }
        if (start === void 0) { start = { i: 0, n: 0, delim: '' }; }
        if (end === void 0) { end = { i: 0, n: 0, delim: '' }; }
        this.root = null;
        this.typesetRoot = null;
        this.metrics = {};
        this.inputData = {};
        this.outputData = {};
        this._state = exports.STATE.UNPROCESSED;
        this.math = math;
        this.inputJax = jax;
        this.display = display;
        this.start = start;
        this.end = end;
        this.root = null;
        this.typesetRoot = null;
        this.metrics = {};
        this.inputData = {};
        this.outputData = {};
    }
    Object.defineProperty(AbstractMathItem.prototype, "isEscaped", {
        get: function () {
            return this.display === null;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMathItem.prototype.render = function (document) {
        document.renderActions.renderMath(this, document);
    };
    AbstractMathItem.prototype.rerender = function (document, start) {
        if (start === void 0) { start = exports.STATE.RERENDER; }
        if (this.state() >= start) {
            this.state(start - 1);
        }
        document.renderActions.renderMath(this, document, start);
    };
    AbstractMathItem.prototype.convert = function (document, end) {
        if (end === void 0) { end = exports.STATE.LAST; }
        document.renderActions.renderConvert(this, document, end);
    };
    AbstractMathItem.prototype.compile = function (document) {
        if (this.state() < exports.STATE.COMPILED) {
            this.root = this.inputJax.compile(this, document);
            this.state(exports.STATE.COMPILED);
        }
    };
    AbstractMathItem.prototype.typeset = function (document) {
        if (this.state() < exports.STATE.TYPESET) {
            this.typesetRoot = document.outputJax[this.isEscaped ? 'escaped' : 'typeset'](this, document);
            this.state(exports.STATE.TYPESET);
        }
    };
    AbstractMathItem.prototype.updateDocument = function (_document) { };
    AbstractMathItem.prototype.removeFromDocument = function (_restore) {
        if (_restore === void 0) { _restore = false; }
    };
    AbstractMathItem.prototype.setMetrics = function (em, ex, cwidth, lwidth, scale) {
        this.metrics = {
            em: em, ex: ex,
            containerWidth: cwidth,
            lineWidth: lwidth,
            scale: scale
        };
    };
    AbstractMathItem.prototype.state = function (state, restore) {
        if (state === void 0) { state = null; }
        if (restore === void 0) { restore = false; }
        if (state != null) {
            if (state < exports.STATE.INSERTED && this._state >= exports.STATE.INSERTED) {
                this.removeFromDocument(restore);
            }
            if (state < exports.STATE.TYPESET && this._state >= exports.STATE.TYPESET) {
                this.outputData = {};
            }
            if (state < exports.STATE.COMPILED && this._state >= exports.STATE.COMPILED) {
                this.inputData = {};
            }
            this._state = state;
        }
        return this._state;
    };
    AbstractMathItem.prototype.reset = function (restore) {
        if (restore === void 0) { restore = false; }
        this.state(exports.STATE.UNPROCESSED, restore);
    };
    return AbstractMathItem;
}());
exports.AbstractMathItem = AbstractMathItem;
exports.STATE = {
    UNPROCESSED: 0,
    FINDMATH: 10,
    COMPILED: 20,
    CONVERT: 100,
    METRICS: 110,
    RERENDER: 125,
    TYPESET: 150,
    INSERTED: 200,
    LAST: 10000
};
function newState(name, state) {
    if (name in exports.STATE) {
        throw Error('State ' + name + ' already exists');
    }
    exports.STATE[name] = state;
}
exports.newState = newState;
//# sourceMappingURL=MathItem.js.map