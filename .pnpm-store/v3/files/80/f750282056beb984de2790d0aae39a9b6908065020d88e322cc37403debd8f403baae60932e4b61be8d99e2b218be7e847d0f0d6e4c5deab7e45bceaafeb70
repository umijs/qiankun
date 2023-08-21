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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultlinedItem = void 0;
var AmsItems_js_1 = require("../ams/AmsItems.js");
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var TexConstants_js_1 = require("../TexConstants.js");
var MultlinedItem = (function (_super) {
    __extends(MultlinedItem, _super);
    function MultlinedItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MultlinedItem.prototype, "kind", {
        get: function () {
            return 'multlined';
        },
        enumerable: false,
        configurable: true
    });
    MultlinedItem.prototype.EndTable = function () {
        if (this.Size() || this.row.length) {
            this.EndEntry();
            this.EndRow();
        }
        if (this.table.length > 1) {
            var options = this.factory.configuration.options.mathtools;
            var gap = options.multlinegap;
            var firstskip = options['firstline-afterskip'] || gap;
            var lastskip = options['lastline-preskip'] || gap;
            var first = NodeUtil_js_1.default.getChildren(this.table[0])[0];
            if (NodeUtil_js_1.default.getAttribute(first, 'columnalign') !== TexConstants_js_1.TexConstant.Align.RIGHT) {
                first.appendChild(this.create('node', 'mspace', [], { width: firstskip }));
            }
            var last = NodeUtil_js_1.default.getChildren(this.table[this.table.length - 1])[0];
            if (NodeUtil_js_1.default.getAttribute(last, 'columnalign') !== TexConstants_js_1.TexConstant.Align.LEFT) {
                var top_1 = NodeUtil_js_1.default.getChildren(last)[0];
                top_1.childNodes.unshift(null);
                var space = this.create('node', 'mspace', [], { width: lastskip });
                NodeUtil_js_1.default.setChild(top_1, 0, space);
            }
        }
        _super.prototype.EndTable.call(this);
    };
    return MultlinedItem;
}(AmsItems_js_1.MultlineItem));
exports.MultlinedItem = MultlinedItem;
//# sourceMappingURL=MathtoolsItems.js.map