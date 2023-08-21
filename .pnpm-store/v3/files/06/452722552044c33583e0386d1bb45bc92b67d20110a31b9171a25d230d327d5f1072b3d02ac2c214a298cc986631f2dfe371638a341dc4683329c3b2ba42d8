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
exports.CloseButton = void 0;
var abstract_postable_js_1 = require("./abstract_postable.js");
var html_classes_js_1 = require("./html_classes.js");
var CloseButton = (function (_super) {
    __extends(CloseButton, _super);
    function CloseButton(element) {
        var _this = _super.call(this) || this;
        _this.element = element;
        _this.className = html_classes_js_1.HtmlClasses['MENUCLOSE'];
        _this.role = 'button';
        return _this;
    }
    CloseButton.prototype.generateHtml = function () {
        var html = document.createElement('span');
        html.classList.add(this.className);
        html.setAttribute('role', this.role);
        html.setAttribute('tabindex', '0');
        var content = document.createElement('span');
        content.textContent = '\u00D7';
        html.appendChild(content);
        this.html = html;
    };
    CloseButton.prototype.display = function () { };
    CloseButton.prototype.unpost = function () {
        _super.prototype.unpost.call(this);
        this.element.unpost();
    };
    CloseButton.prototype.keydown = function (event) {
        this.bubbleKey();
        _super.prototype.keydown.call(this, event);
    };
    CloseButton.prototype.space = function (event) {
        this.unpost();
        this.stop(event);
    };
    CloseButton.prototype.mousedown = function (event) {
        this.unpost();
        this.stop(event);
    };
    return CloseButton;
}(abstract_postable_js_1.AbstractPostable));
exports.CloseButton = CloseButton;
//# sourceMappingURL=close_button.js.map