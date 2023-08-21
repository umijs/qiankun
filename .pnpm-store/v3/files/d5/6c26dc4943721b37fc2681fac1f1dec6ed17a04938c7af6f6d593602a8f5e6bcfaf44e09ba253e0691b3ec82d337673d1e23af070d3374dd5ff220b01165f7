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
exports.Submenu = void 0;
var abstract_item_js_1 = require("./abstract_item.js");
var html_classes_js_1 = require("./html_classes.js");
var Submenu = (function (_super) {
    __extends(Submenu, _super);
    function Submenu(menu, content, id) {
        var _this = _super.call(this, menu, 'submenu', content, id) || this;
        _this._submenu = null;
        return _this;
    }
    Submenu.fromJson = function (factory, _a, menu) {
        var content = _a.content, submenu = _a.menu, id = _a.id;
        var item = new this(menu, content, id);
        var sm = factory.get('subMenu')(factory, submenu, item);
        item.submenu = sm;
        return item;
    };
    Object.defineProperty(Submenu.prototype, "submenu", {
        get: function () {
            return this._submenu;
        },
        set: function (menu) {
            this._submenu = menu;
        },
        enumerable: false,
        configurable: true
    });
    Submenu.prototype.mouseover = function (event) {
        this.focus();
        this.stop(event);
    };
    Submenu.prototype.mouseout = function (event) {
        this.stop(event);
    };
    Submenu.prototype.unfocus = function () {
        if (!this.submenu.isPosted()) {
            _super.prototype.unfocus.call(this);
            return;
        }
        if (this.menu.focused !== this) {
            _super.prototype.unfocus.call(this);
            this.menu.unpostSubmenus();
            return;
        }
        this.html.setAttribute('tabindex', '-1');
        this.html.blur();
    };
    Submenu.prototype.focus = function () {
        _super.prototype.focus.call(this);
        if (!this.submenu.isPosted() && !this.disabled) {
            this.submenu.post();
        }
    };
    Submenu.prototype.executeAction = function () {
        this.submenu.isPosted() ? this.submenu.unpost() : this.submenu.post();
    };
    Submenu.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        this.span = document.createElement('span');
        this.span.textContent = '\u25BA';
        this.span.classList.add(html_classes_js_1.HtmlClasses['MENUARROW']);
        html.appendChild(this.span);
        html.setAttribute('aria-haspopup', 'true');
    };
    Submenu.prototype.left = function (event) {
        if (this.submenu.isPosted()) {
            this.submenu.unpost();
        }
        else {
            _super.prototype.left.call(this, event);
        }
    };
    Submenu.prototype.right = function (event) {
        if (!this.submenu.isPosted()) {
            this.submenu.post();
        }
        else {
            this.submenu.down(event);
        }
    };
    Submenu.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Submenu;
}(abstract_item_js_1.AbstractItem));
exports.Submenu = Submenu;
//# sourceMappingURL=item_submenu.js.map