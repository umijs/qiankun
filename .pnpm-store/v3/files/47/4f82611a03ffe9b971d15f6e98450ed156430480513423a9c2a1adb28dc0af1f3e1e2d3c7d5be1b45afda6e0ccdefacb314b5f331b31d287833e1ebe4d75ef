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
exports.ContextMenu = void 0;
var abstract_menu_js_1 = require("./abstract_menu.js");
var html_classes_js_1 = require("./html_classes.js");
var menu_store_js_1 = require("./menu_store.js");
var variable_pool_js_1 = require("./variable_pool.js");
var ContextMenu = (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(factory) {
        var _this = _super.call(this) || this;
        _this.factory = factory;
        _this.id = '';
        _this.moving = false;
        _this._store = new menu_store_js_1.MenuStore(_this);
        _this.widgets = [];
        _this.variablePool = new variable_pool_js_1.VariablePool();
        return _this;
    }
    ContextMenu.fromJson = function (factory, _a) {
        var pool = _a.pool, items = _a.items, _b = _a.id, id = _b === void 0 ? '' : _b;
        var ctxtMenu = new this(factory);
        ctxtMenu.id = id;
        var varParser = factory.get('variable');
        pool.forEach(function (x) { return varParser(factory, x, ctxtMenu.pool); });
        var itemList = factory.get('items')(factory, items, ctxtMenu);
        ctxtMenu.items = itemList;
        return ctxtMenu;
    };
    ContextMenu.prototype.generateHtml = function () {
        if (this.isPosted()) {
            this.unpost();
        }
        _super.prototype.generateHtml.call(this);
        this._frame = document.createElement('div');
        this._frame.classList.add(html_classes_js_1.HtmlClasses['MENUFRAME']);
        var styleString = 'left: 0px; top: 0px; z-index: 200; width: 100%; ' +
            'height: 100%; border: 0px; padding: 0px; margin: 0px;';
        this._frame.setAttribute('style', 'position: absolute; ' + styleString);
        var innerDiv = document.createElement('div');
        innerDiv.setAttribute('style', 'position: fixed; ' + styleString);
        this._frame.appendChild(innerDiv);
        innerDiv.addEventListener('mousedown', function (event) {
            this.unpost();
            this.unpostWidgets();
            this.stop(event);
        }.bind(this));
    };
    ContextMenu.prototype.display = function () {
        document.body.appendChild(this.frame);
        this.frame.appendChild(this.html);
        this.focus();
    };
    ContextMenu.prototype.escape = function (_event) {
        this.unpost();
        this.unpostWidgets();
    };
    ContextMenu.prototype.unpost = function () {
        _super.prototype.unpost.call(this);
        if (this.widgets.length > 0) {
            return;
        }
        this.frame.parentNode.removeChild(this.frame);
        var store = this.store;
        if (!this.moving) {
            store.insertTaborder();
        }
        store.active.focus();
    };
    ContextMenu.prototype.left = function (_event) {
        this.move_(this.store.previous());
    };
    ContextMenu.prototype.right = function (_event) {
        this.move_(this.store.next());
    };
    Object.defineProperty(ContextMenu.prototype, "frame", {
        get: function () {
            return this._frame;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ContextMenu.prototype, "store", {
        get: function () {
            return this._store;
        },
        enumerable: false,
        configurable: true
    });
    ContextMenu.prototype.post = function (numberOrEvent, isY) {
        if (typeof (isY) !== 'undefined') {
            if (!this.moving) {
                this.store.removeTaborder();
            }
            _super.prototype.post.call(this, numberOrEvent, isY);
            return;
        }
        var event = numberOrEvent;
        var node;
        if (event instanceof Event) {
            node = event.target;
            this.stop(event);
        }
        else {
            node = event;
        }
        var x;
        var y;
        if (event instanceof MouseEvent) {
            x = event.pageX, y = event.pageY;
            if (!x && !y && event.clientX) {
                x = event.clientX + document.body.scrollLeft +
                    document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop +
                    document.documentElement.scrollTop;
            }
        }
        if (!x && !y && node) {
            var offsetX = window.pageXOffset || document.documentElement.scrollLeft;
            var offsetY = window.pageYOffset || document.documentElement.scrollTop;
            var rect = node.getBoundingClientRect();
            x = (rect.right + rect.left) / 2 + offsetX;
            y = (rect.bottom + rect.top) / 2 + offsetY;
        }
        this.store.active = node;
        this.anchor = this.store.active;
        var menu = this.html;
        var margin = 5;
        if (x + menu.offsetWidth > document.body.offsetWidth - margin) {
            x = document.body.offsetWidth - menu.offsetWidth - margin;
        }
        this.post(x, y);
    };
    ContextMenu.prototype.registerWidget = function (widget) {
        this.widgets.push(widget);
    };
    ContextMenu.prototype.unregisterWidget = function (widget) {
        var index = this.widgets.indexOf(widget);
        if (index > -1) {
            this.widgets.splice(index, 1);
        }
        if (this.widgets.length === 0) {
            this.unpost();
        }
    };
    ContextMenu.prototype.unpostWidgets = function () {
        this.widgets.forEach(function (x) { return x.unpost(); });
    };
    ContextMenu.prototype.toJson = function () {
        return { type: '' };
    };
    ContextMenu.prototype.move_ = function (next) {
        if (this.anchor && next !== this.anchor) {
            this.moving = true;
            this.unpost();
            this.post(next);
            this.moving = false;
        }
    };
    return ContextMenu;
}(abstract_menu_js_1.AbstractMenu));
exports.ContextMenu = ContextMenu;
//# sourceMappingURL=context_menu.js.map