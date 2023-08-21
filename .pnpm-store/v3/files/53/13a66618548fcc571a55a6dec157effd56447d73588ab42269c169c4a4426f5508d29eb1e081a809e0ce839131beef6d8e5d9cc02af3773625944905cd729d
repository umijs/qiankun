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
exports.Slider = void 0;
var abstract_variable_item_js_1 = require("./abstract_variable_item.js");
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var key_navigatable_js_1 = require("./key_navigatable.js");
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider(menu, content, variable, id) {
        var _this = _super.call(this, menu, 'slider', content, id) || this;
        _this.role = 'slider';
        _this.labelId = 'ctx_slideLabel' + menu_util_js_1.MenuUtil.counter();
        _this.valueId = 'ctx_slideValue' + menu_util_js_1.MenuUtil.counter();
        _this.inputEvent = false;
        _this.variable = menu.pool.lookup(variable);
        _this.register();
        return _this;
    }
    Slider.fromJson = function (_factory, _a, menu) {
        var content = _a.content, variable = _a.variable, id = _a.id;
        return new this(menu, content, variable, id);
    };
    Slider.prototype.executeAction = function () {
        this.variable.setValue(this.input.value, menu_util_js_1.MenuUtil.getActiveElement(this));
        this.update();
    };
    Slider.prototype.space = function (event) {
        _super.prototype.space.call(this, event);
        menu_util_js_1.MenuUtil.close(this);
    };
    Slider.prototype.focus = function () {
        _super.prototype.focus.call(this);
        this.input.focus();
    };
    Slider.prototype.unfocus = function () {
        _super.prototype.unfocus.call(this);
        this.updateSpan();
    };
    Slider.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENUSLIDER']);
        this.valueSpan = document.createElement('span');
        this.valueSpan.setAttribute('id', this.valueId);
        this.valueSpan.classList.add(html_classes_js_1.HtmlClasses['SLIDERVALUE']);
        this.html.appendChild(this.valueSpan);
    };
    Slider.prototype.generateSpan = function () {
        this.span = document.createElement('span');
        this.labelSpan = document.createElement('span');
        this.labelSpan.setAttribute('id', this.labelId);
        this.labelSpan.appendChild(this.html.childNodes[0]);
        this.html.appendChild(this.labelSpan);
        this.input = document.createElement('input');
        this.input.setAttribute('type', 'range');
        this.input.setAttribute('min', '0');
        this.input.setAttribute('max', '100');
        this.input.setAttribute('aria-valuemin', '0');
        this.input.setAttribute('aria-valuemax', '100');
        this.input.setAttribute('aria-labelledby', this.labelId);
        this.input.addEventListener('keydown', this.inputKey.bind(this));
        this.input.addEventListener('input', this.executeAction.bind(this));
        this.input.classList.add(html_classes_js_1.HtmlClasses['SLIDERBAR']);
        this.span.appendChild(this.input);
    };
    Slider.prototype.inputKey = function (_event) {
        this.inputEvent = true;
    };
    Slider.prototype.mousedown = function (event) {
        event.stopPropagation();
    };
    Slider.prototype.mouseup = function (_event) {
        event.stopPropagation();
    };
    Slider.prototype.keydown = function (event) {
        var code = event.keyCode;
        if (code === key_navigatable_js_1.KEY.UP || code === key_navigatable_js_1.KEY.DOWN) {
            event.preventDefault();
            _super.prototype.keydown.call(this, event);
            return;
        }
        if (this.inputEvent &&
            code !== key_navigatable_js_1.KEY.ESCAPE && code !== key_navigatable_js_1.KEY.RETURN) {
            this.inputEvent = false;
            event.stopPropagation();
            return;
        }
        _super.prototype.keydown.call(this, event);
        event.stopPropagation();
    };
    Slider.prototype.updateAria = function () {
        var value = this.variable.getValue();
        if (value && this.input) {
            this.input.setAttribute('aria-valuenow', value);
            this.input.setAttribute('aria-valuetext', value + '%');
        }
    };
    Slider.prototype.updateSpan = function () {
        var initValue;
        try {
            initValue = this.variable.getValue(menu_util_js_1.MenuUtil.getActiveElement(this));
            this.valueSpan.innerHTML = initValue + '%';
        }
        catch (e) {
            initValue = '';
        }
        this.input.value = initValue;
    };
    Slider.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Slider;
}(abstract_variable_item_js_1.AbstractVariableItem));
exports.Slider = Slider;
//# sourceMappingURL=item_slider.js.map