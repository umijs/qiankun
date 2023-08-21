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
exports.AbstractEntry = void 0;
var menu_element_js_1 = require("./menu_element.js");
var html_classes_js_1 = require("./html_classes.js");
var AbstractEntry = (function (_super) {
    __extends(AbstractEntry, _super);
    function AbstractEntry(_menu, _type) {
        var _this = _super.call(this) || this;
        _this._menu = _menu;
        _this._type = _type;
        _this.className = html_classes_js_1.HtmlClasses['MENUITEM'];
        _this.role = 'menuitem';
        _this.hidden = false;
        return _this;
    }
    Object.defineProperty(AbstractEntry.prototype, "menu", {
        get: function () {
            return this._menu;
        },
        set: function (menu) {
            this._menu = menu;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractEntry.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    AbstractEntry.prototype.hide = function () {
        this.hidden = true;
        this.menu.generateMenu();
    };
    AbstractEntry.prototype.show = function () {
        this.hidden = false;
        this.menu.generateMenu();
    };
    AbstractEntry.prototype.isHidden = function () {
        return this.hidden;
    };
    return AbstractEntry;
}(menu_element_js_1.MenuElement));
exports.AbstractEntry = AbstractEntry;
//# sourceMappingURL=abstract_entry.js.map