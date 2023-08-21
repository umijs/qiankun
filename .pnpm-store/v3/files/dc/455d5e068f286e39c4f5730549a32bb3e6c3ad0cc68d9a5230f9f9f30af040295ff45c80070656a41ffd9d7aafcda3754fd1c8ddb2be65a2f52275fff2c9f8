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
exports.MenuElement = void 0;
var abstract_navigatable_js_1 = require("./abstract_navigatable.js");
var MenuElement = (function (_super) {
    __extends(MenuElement, _super);
    function MenuElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MenuElement.prototype.addAttributes = function (attributes) {
        for (var attr in attributes) {
            this.html.setAttribute(attr, attributes[attr]);
        }
    };
    Object.defineProperty(MenuElement.prototype, "html", {
        get: function () {
            if (!this._html) {
                this.generateHtml();
            }
            return this._html;
        },
        set: function (html) {
            this._html = html;
            this.addEvents(html);
        },
        enumerable: false,
        configurable: true
    });
    MenuElement.prototype.generateHtml = function () {
        var html = document.createElement('div');
        html.classList.add(this.className);
        html.setAttribute('role', this.role);
        this.html = html;
    };
    MenuElement.prototype.focus = function () {
        var html = this.html;
        html.setAttribute('tabindex', '0');
        html.focus();
    };
    MenuElement.prototype.unfocus = function () {
        var html = this.html;
        if (html.hasAttribute('tabindex')) {
            html.setAttribute('tabindex', '-1');
        }
        try {
            html.blur();
        }
        catch (e) {
        }
        html.blur();
    };
    return MenuElement;
}(abstract_navigatable_js_1.AbstractNavigatable));
exports.MenuElement = MenuElement;
//# sourceMappingURL=menu_element.js.map