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
exports.Radio = void 0;
var abstract_variable_item_js_1 = require("./abstract_variable_item.js");
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var Radio = (function (_super) {
    __extends(Radio, _super);
    function Radio(menu, content, variable, id) {
        var _this = _super.call(this, menu, 'radio', content, id) || this;
        _this.role = 'menuitemradio';
        _this.variable = menu.pool.lookup(variable);
        _this.register();
        return _this;
    }
    Radio.fromJson = function (_factory, _a, menu) {
        var content = _a.content, variable = _a.variable, id = _a.id;
        return new this(menu, content, variable, id);
    };
    Radio.prototype.executeAction = function () {
        this.variable.setValue(this.id);
        menu_util_js_1.MenuUtil.close(this);
    };
    Radio.prototype.generateSpan = function () {
        this.span = document.createElement('span');
        this.span.textContent = '\u2713';
        this.span.classList.add(html_classes_js_1.HtmlClasses['MENURADIOCHECK']);
    };
    Radio.prototype.updateAria = function () {
        this.html.setAttribute('aria-checked', this.variable.getValue() === this.id ? 'true' : 'false');
    };
    Radio.prototype.updateSpan = function () {
        this.span.style.display =
            this.variable.getValue() === this.id ? '' : 'none';
    };
    Radio.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Radio;
}(abstract_variable_item_js_1.AbstractVariableItem));
exports.Radio = Radio;
//# sourceMappingURL=item_radio.js.map