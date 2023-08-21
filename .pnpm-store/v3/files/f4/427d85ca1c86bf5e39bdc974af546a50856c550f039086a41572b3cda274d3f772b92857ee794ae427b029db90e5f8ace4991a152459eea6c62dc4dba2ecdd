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
exports.Combo = void 0;
var abstract_variable_item_js_1 = require("./abstract_variable_item.js");
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var key_navigatable_js_1 = require("./key_navigatable.js");
var Combo = (function (_super) {
    __extends(Combo, _super);
    function Combo(menu, content, variable, id) {
        var _this = _super.call(this, menu, 'combobox', content, id) || this;
        _this.role = 'combobox';
        _this.inputEvent = false;
        _this.variable = menu.pool.lookup(variable);
        _this.register();
        return _this;
    }
    Combo.fromJson = function (_factory, _a, menu) {
        var content = _a.content, variable = _a.variable, id = _a.id;
        return new this(menu, content, variable, id);
    };
    Combo.prototype.executeAction = function () {
        this.variable.setValue(this.input.value, menu_util_js_1.MenuUtil.getActiveElement(this));
    };
    Combo.prototype.space = function (event) {
        _super.prototype.space.call(this, event);
        menu_util_js_1.MenuUtil.close(this);
    };
    Combo.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.input.focus();
    };
    Combo.prototype.unfocus = function () {
        _super.prototype.unfocus.call(this);
        this.updateSpan();
    };
    Combo.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENUCOMBOBOX']);
    };
    Combo.prototype.generateSpan = function () {
        this.span = document.createElement('span');
        this.span.classList.add(html_classes_js_1.HtmlClasses['MENUINPUTBOX']);
        this.input = document.createElement('input');
        this.input.addEventListener('keydown', this.inputKey.bind(this));
        this.input.setAttribute('size', '10em');
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('tabindex', '-1');
        this.span.appendChild(this.input);
    };
    Combo.prototype.inputKey = function (_event) {
        this.bubbleKey();
        this.inputEvent = true;
    };
    Combo.prototype.keydown = function (event) {
        if (this.inputEvent &&
            event.keyCode !== key_navigatable_js_1.KEY.ESCAPE &&
            event.keyCode !== key_navigatable_js_1.KEY.RETURN) {
            this.inputEvent = false;
            event.stopPropagation();
            return;
        }
        _super.prototype.keydown.call(this, event);
        event.stopPropagation();
    };
    Combo.prototype.updateAria = function () { };
    Combo.prototype.updateSpan = function () {
        var initValue;
        try {
            initValue = this.variable.getValue(menu_util_js_1.MenuUtil.getActiveElement(this));
        }
        catch (e) {
            initValue = '';
        }
        this.input.value = initValue;
    };
    Combo.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Combo;
}(abstract_variable_item_js_1.AbstractVariableItem));
exports.Combo = Combo;
//# sourceMappingURL=item_combo.js.map