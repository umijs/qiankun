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
exports.AbstractItem = void 0;
var abstract_entry_js_1 = require("./abstract_entry.js");
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var AbstractItem = (function (_super) {
    __extends(AbstractItem, _super);
    function AbstractItem(menu, type, _content, id) {
        var _this = _super.call(this, menu, type) || this;
        _this._content = _content;
        _this.disabled = false;
        _this.callbacks = [];
        _this._id = id ? id : _content;
        return _this;
    }
    Object.defineProperty(AbstractItem.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (content) {
            this._content = content;
            this.generateHtml();
            if (this.menu) {
                this.menu.generateHtml();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractItem.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    AbstractItem.prototype.press = function () {
        if (!this.disabled) {
            this.executeAction();
            this.executeCallbacks_();
        }
    };
    AbstractItem.prototype.executeAction = function () { };
    AbstractItem.prototype.registerCallback = function (func) {
        if (this.callbacks.indexOf(func) === -1) {
            this.callbacks.push(func);
        }
    };
    AbstractItem.prototype.unregisterCallback = function (func) {
        var index = this.callbacks.indexOf(func);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    };
    AbstractItem.prototype.mousedown = function (event) {
        this.press();
        this.stop(event);
    };
    AbstractItem.prototype.mouseover = function (event) {
        this.focus();
        this.stop(event);
    };
    AbstractItem.prototype.mouseout = function (event) {
        this.deactivate();
        this.stop(event);
    };
    AbstractItem.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.setAttribute('aria-disabled', 'false');
        html.textContent = this.content;
    };
    AbstractItem.prototype.activate = function () {
        if (!this.disabled) {
            this.html.classList.add(html_classes_js_1.HtmlClasses['MENUACTIVE']);
        }
    };
    AbstractItem.prototype.deactivate = function () {
        this.html.classList.remove(html_classes_js_1.HtmlClasses['MENUACTIVE']);
    };
    AbstractItem.prototype.focus = function () {
        this.menu.focused = this;
        _super.prototype.focus.call(this);
        this.activate();
    };
    AbstractItem.prototype.unfocus = function () {
        this.deactivate();
        _super.prototype.unfocus.call(this);
    };
    AbstractItem.prototype.escape = function (_event) {
        menu_util_js_1.MenuUtil.close(this);
    };
    AbstractItem.prototype.up = function (event) {
        this.menu.up(event);
    };
    AbstractItem.prototype.down = function (event) {
        this.menu.down(event);
    };
    AbstractItem.prototype.left = function (event) {
        this.menu.left(event);
    };
    AbstractItem.prototype.right = function (event) {
        this.menu.right(event);
    };
    AbstractItem.prototype.space = function (_event) {
        this.press();
    };
    AbstractItem.prototype.disable = function () {
        this.disabled = true;
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENUDISABLED']);
        html.setAttribute('aria-disabled', 'true');
    };
    AbstractItem.prototype.enable = function () {
        this.disabled = false;
        var html = this.html;
        html.classList.remove(html_classes_js_1.HtmlClasses['MENUDISABLED']);
        html.removeAttribute('aria-disabled');
    };
    AbstractItem.prototype.executeCallbacks_ = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.callbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var func = _c.value;
                try {
                    func(this);
                }
                catch (e) {
                    menu_util_js_1.MenuUtil.error(e, 'Callback for menu entry ' + this.id +
                        ' failed.');
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
    return AbstractItem;
}(abstract_entry_js_1.AbstractEntry));
exports.AbstractItem = AbstractItem;
//# sourceMappingURL=abstract_item.js.map