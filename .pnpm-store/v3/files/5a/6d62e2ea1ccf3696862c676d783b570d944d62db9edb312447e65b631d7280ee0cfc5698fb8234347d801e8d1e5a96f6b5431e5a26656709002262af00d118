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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMenu = void 0;
var abstract_postable_js_1 = require("./abstract_postable.js");
var abstract_item_js_1 = require("./abstract_item.js");
var html_classes_js_1 = require("./html_classes.js");
var item_submenu_js_1 = require("./item_submenu.js");
var AbstractMenu = (function (_super) {
    __extends(AbstractMenu, _super);
    function AbstractMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.className = html_classes_js_1.HtmlClasses['CONTEXTMENU'];
        _this.role = 'menu';
        _this._items = [];
        _this._baseMenu = null;
        return _this;
    }
    Object.defineProperty(AbstractMenu.prototype, "baseMenu", {
        get: function () {
            return this._baseMenu;
        },
        set: function (menu) {
            this._baseMenu = menu;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMenu.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (items) {
            this._items = items;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMenu.prototype, "pool", {
        get: function () {
            return this.variablePool;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMenu.prototype, "focused", {
        get: function () {
            return this._focused;
        },
        set: function (item) {
            if (this._focused === item) {
                return;
            }
            if (!this._focused) {
                this.unfocus();
            }
            var old = this._focused;
            this._focused = item;
            if (old) {
                old.unfocus();
            }
        },
        enumerable: false,
        configurable: true
    });
    AbstractMenu.prototype.up = function (_event) {
        var items = this.items.filter(function (x) { return (x instanceof abstract_item_js_1.AbstractItem) && (!x.isHidden()); });
        if (items.length === 0) {
            return;
        }
        if (!this.focused) {
            items[items.length - 1].focus();
            return;
        }
        var index = items.indexOf(this.focused);
        if (index === -1) {
            return;
        }
        index = index ? --index : items.length - 1;
        items[index].focus();
    };
    AbstractMenu.prototype.down = function (_event) {
        var items = this.items.filter(function (x) { return (x instanceof abstract_item_js_1.AbstractItem) && (!x.isHidden()); });
        if (items.length === 0) {
            return;
        }
        if (!this.focused) {
            items[0].focus();
            return;
        }
        var index = items.indexOf(this.focused);
        if (index === -1) {
            return;
        }
        index++;
        index = (index === items.length) ? 0 : index;
        items[index].focus();
    };
    AbstractMenu.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        this.generateMenu();
    };
    AbstractMenu.prototype.generateMenu = function () {
        var e_1, _a;
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENU']);
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (!item.isHidden()) {
                    html.appendChild(item.html);
                    continue;
                }
                var itemHtml = item.html;
                if (itemHtml.parentNode) {
                    itemHtml.parentNode.removeChild(itemHtml);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    AbstractMenu.prototype.post = function (x, y) {
        this.variablePool.update();
        _super.prototype.post.call(this, x, y);
    };
    AbstractMenu.prototype.unpostSubmenus = function () {
        var e_2, _a;
        var submenus = this.items.filter(function (x) { return x instanceof item_submenu_js_1.Submenu; });
        try {
            for (var submenus_1 = __values(submenus), submenus_1_1 = submenus_1.next(); !submenus_1_1.done; submenus_1_1 = submenus_1.next()) {
                var submenu = submenus_1_1.value;
                submenu.submenu.unpost();
                if (submenu !== this.focused) {
                    submenu.unfocus();
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (submenus_1_1 && !submenus_1_1.done && (_a = submenus_1.return)) _a.call(submenus_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AbstractMenu.prototype.unpost = function () {
        _super.prototype.unpost.call(this);
        this.unpostSubmenus();
        this.focused = null;
    };
    AbstractMenu.prototype.find = function (id) {
        var e_3, _a;
        try {
            for (var _b = __values(this.items), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                if (item.type === 'rule') {
                    continue;
                }
                if (item.id === id) {
                    return item;
                }
                if (item.type === 'submenu') {
                    var result = item.submenu.find(id);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return null;
    };
    return AbstractMenu;
}(abstract_postable_js_1.AbstractPostable));
exports.AbstractMenu = AbstractMenu;
//# sourceMappingURL=abstract_menu.js.map