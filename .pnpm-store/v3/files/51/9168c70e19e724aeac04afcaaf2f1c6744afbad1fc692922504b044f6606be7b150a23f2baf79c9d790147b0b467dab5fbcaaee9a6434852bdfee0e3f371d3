"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVariableItem = void 0;
var abstract_item_js_1 = require("./abstract_item.js");
var AbstractVariableItem = (function (_super) {
    __extends(AbstractVariableItem, _super);
    function AbstractVariableItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractVariableItem.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        if (!this.span) {
            this.generateSpan();
        }
        html.appendChild(this.span);
        this.update();
    };
    AbstractVariableItem.prototype.register = function () {
        this.variable.register(this);
    };
    AbstractVariableItem.prototype.unregister = function () {
        this.variable.unregister(this);
    };
    AbstractVariableItem.prototype.update = function () {
        this.updateAria();
        if (this.span) {
            this.updateSpan();
        }
    };
    return AbstractVariableItem;
}(abstract_item_js_1.AbstractItem));
exports.AbstractVariableItem = AbstractVariableItem;
//# sourceMappingURL=abstract_variable_item.js.map