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
exports.linkedomAdaptor = exports.LinkedomAdaptor = void 0;
var HTMLAdaptor_js_1 = require("./HTMLAdaptor.js");
var NodeMixin_js_1 = require("./NodeMixin.js");
var LinkedomAdaptor = (function (_super) {
    __extends(LinkedomAdaptor, _super);
    function LinkedomAdaptor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinkedomAdaptor.prototype.parse = function (text, format) {
        if (format === void 0) { format = 'text/html'; }
        if (!text.match(/^(?:\s|\n)*</))
            text = '<html>' + text + '</html>';
        return this.parser.parseFromString(text, format);
    };
    LinkedomAdaptor.prototype.serializeXML = function (node) {
        return this.outerHTML(node);
    };
    return LinkedomAdaptor;
}((0, NodeMixin_js_1.NodeMixin)(HTMLAdaptor_js_1.HTMLAdaptor)));
exports.LinkedomAdaptor = LinkedomAdaptor;
function linkedomAdaptor(parseHTML, options) {
    if (options === void 0) { options = null; }
    var window = parseHTML('<html></html>');
    window.constructor.prototype.HTMLCollection = (function () {
        function HTMLCollection() {
        }
        return HTMLCollection;
    }());
    return new LinkedomAdaptor(window, options);
}
exports.linkedomAdaptor = linkedomAdaptor;
//# sourceMappingURL=linkedomAdaptor.js.map