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
exports.MmlVisitor = void 0;
var SerializedMmlVisitor_js_1 = require("../../core/MmlTree/SerializedMmlVisitor.js");
var Options_js_1 = require("../../util/Options.js");
var MmlVisitor = (function (_super) {
    __extends(MmlVisitor, _super);
    function MmlVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = {
            texHints: true,
            semantics: false,
        };
        _this.mathItem = null;
        return _this;
    }
    MmlVisitor.prototype.visitTree = function (node, math, options) {
        if (math === void 0) { math = null; }
        if (options === void 0) { options = {}; }
        this.mathItem = math;
        (0, Options_js_1.userOptions)(this.options, options);
        return this.visitNode(node, '');
    };
    MmlVisitor.prototype.visitTeXAtomNode = function (node, space) {
        if (this.options.texHints) {
            return _super.prototype.visitTeXAtomNode.call(this, node, space);
        }
        if (node.childNodes[0] && node.childNodes[0].childNodes.length === 1) {
            return this.visitNode(node.childNodes[0], space);
        }
        return space + '<mrow' + this.getAttributes(node) + '>\n'
            + this.childNodeMml(node, space + '  ', '\n')
            + space + '</mrow>';
    };
    MmlVisitor.prototype.visitMathNode = function (node, space) {
        if (!this.options.semantics || this.mathItem.inputJax.name !== 'TeX') {
            return _super.prototype.visitDefault.call(this, node, space);
        }
        var addRow = node.childNodes.length && node.childNodes[0].childNodes.length > 1;
        return space + '<math' + this.getAttributes(node) + '>\n'
            + space + '  <semantics>\n'
            + (addRow ? space + '    <mrow>\n' : '')
            + this.childNodeMml(node, space + (addRow ? '      ' : '    '), '\n')
            + (addRow ? space + '    </mrow>\n' : '')
            + space + '    <annotation encoding="application/x-tex">' + this.mathItem.math + '</annotation>\n'
            + space + '  </semantics>\n'
            + space + '</math>';
    };
    return MmlVisitor;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.MmlVisitor = MmlVisitor;
//# sourceMappingURL=MmlVisitor.js.map