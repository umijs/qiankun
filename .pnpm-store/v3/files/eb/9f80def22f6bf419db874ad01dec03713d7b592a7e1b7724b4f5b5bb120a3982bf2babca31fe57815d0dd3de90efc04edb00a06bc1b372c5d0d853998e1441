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
exports.SubMenu = void 0;
var abstract_menu_js_1 = require("./abstract_menu.js");
var SubMenu = (function (_super) {
    __extends(SubMenu, _super);
    function SubMenu(_anchor) {
        var _this = _super.call(this) || this;
        _this._anchor = _anchor;
        _this.variablePool = _this.anchor.menu.pool;
        _this.setBaseMenu();
        return _this;
    }
    SubMenu.fromJson = function (factory, _a, anchor) {
        var its = _a.items;
        var submenu = new this(anchor);
        var itemList = factory.get('items')(factory, its, submenu);
        submenu.items = itemList;
        return submenu;
    };
    Object.defineProperty(SubMenu.prototype, "anchor", {
        get: function () {
            return this._anchor;
        },
        enumerable: false,
        configurable: true
    });
    SubMenu.prototype.post = function () {
        if (!this.anchor.menu.isPosted()) {
            return;
        }
        var mobileFlag = false;
        var rtlFlag = false;
        var margin = 5;
        var parent = this.anchor.html;
        var menu = this.html;
        var base = this.baseMenu.frame;
        var mw = parent.offsetWidth;
        var x = (mobileFlag ? 30 : mw - 2);
        var y = 0;
        while (parent && parent !== base) {
            x += parent.offsetLeft;
            y += parent.offsetTop;
            parent = parent.parentNode;
        }
        if (!mobileFlag) {
            if ((rtlFlag && x - mw - menu.offsetWidth > margin) ||
                (!rtlFlag && x + menu.offsetWidth >
                    document.body.offsetWidth - margin)) {
                x = Math.max(margin, x - mw - menu.offsetWidth + 6);
            }
        }
        _super.prototype.post.call(this, x, y);
    };
    SubMenu.prototype.display = function () {
        this.baseMenu.frame.appendChild(this.html);
    };
    SubMenu.prototype.setBaseMenu = function () {
        var menu = this;
        do {
            menu = menu.anchor.menu;
        } while (menu instanceof SubMenu);
        this.baseMenu = menu;
    };
    SubMenu.prototype.left = function (_event) {
        this.focused = null;
        this.anchor.focus();
    };
    SubMenu.prototype.toJson = function () {
        return { type: ''
        };
    };
    return SubMenu;
}(abstract_menu_js_1.AbstractMenu));
exports.SubMenu = SubMenu;
//# sourceMappingURL=sub_menu.js.map