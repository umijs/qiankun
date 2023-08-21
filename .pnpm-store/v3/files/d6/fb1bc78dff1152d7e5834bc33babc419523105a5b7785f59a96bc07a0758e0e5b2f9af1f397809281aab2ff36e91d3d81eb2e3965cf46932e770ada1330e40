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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLMathItem = void 0;
var MathItem_js_1 = require("../../core/MathItem.js");
var HTMLMathItem = (function (_super) {
    __extends(HTMLMathItem, _super);
    function HTMLMathItem(math, jax, display, start, end) {
        if (display === void 0) { display = true; }
        if (start === void 0) { start = { node: null, n: 0, delim: '' }; }
        if (end === void 0) { end = { node: null, n: 0, delim: '' }; }
        return _super.call(this, math, jax, display, start, end) || this;
    }
    Object.defineProperty(HTMLMathItem.prototype, "adaptor", {
        get: function () {
            return this.inputJax.adaptor;
        },
        enumerable: false,
        configurable: true
    });
    HTMLMathItem.prototype.updateDocument = function (_html) {
        if (this.state() < MathItem_js_1.STATE.INSERTED) {
            if (this.inputJax.processStrings) {
                var node = this.start.node;
                if (node === this.end.node) {
                    if (this.end.n && this.end.n < this.adaptor.value(this.end.node).length) {
                        this.adaptor.split(this.end.node, this.end.n);
                    }
                    if (this.start.n) {
                        node = this.adaptor.split(this.start.node, this.start.n);
                    }
                    this.adaptor.replace(this.typesetRoot, node);
                }
                else {
                    if (this.start.n) {
                        node = this.adaptor.split(node, this.start.n);
                    }
                    while (node !== this.end.node) {
                        var next = this.adaptor.next(node);
                        this.adaptor.remove(node);
                        node = next;
                    }
                    this.adaptor.insert(this.typesetRoot, node);
                    if (this.end.n < this.adaptor.value(node).length) {
                        this.adaptor.split(node, this.end.n);
                    }
                    this.adaptor.remove(node);
                }
            }
            else {
                this.adaptor.replace(this.typesetRoot, this.start.node);
            }
            this.start.node = this.end.node = this.typesetRoot;
            this.start.n = this.end.n = 0;
            this.state(MathItem_js_1.STATE.INSERTED);
        }
    };
    HTMLMathItem.prototype.updateStyleSheet = function (document) {
        document.addStyleSheet();
    };
    HTMLMathItem.prototype.removeFromDocument = function (restore) {
        if (restore === void 0) { restore = false; }
        if (this.state() >= MathItem_js_1.STATE.TYPESET) {
            var adaptor = this.adaptor;
            var node = this.start.node;
            var math = adaptor.text('');
            if (restore) {
                var text = this.start.delim + this.math + this.end.delim;
                if (this.inputJax.processStrings) {
                    math = adaptor.text(text);
                }
                else {
                    var doc = adaptor.parse(text, 'text/html');
                    math = adaptor.firstChild(adaptor.body(doc));
                }
            }
            if (adaptor.parent(node)) {
                adaptor.replace(math, node);
            }
            this.start.node = this.end.node = math;
            this.start.n = this.end.n = 0;
        }
    };
    return HTMLMathItem;
}(MathItem_js_1.AbstractMathItem));
exports.HTMLMathItem = HTMLMathItem;
//# sourceMappingURL=HTMLMathItem.js.map