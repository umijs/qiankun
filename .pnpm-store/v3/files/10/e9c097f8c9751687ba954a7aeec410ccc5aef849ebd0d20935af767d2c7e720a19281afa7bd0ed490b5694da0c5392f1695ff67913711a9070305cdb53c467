"use strict";
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
exports.MenuStore = void 0;
var menu_util_js_1 = require("./menu_util.js");
var html_classes_js_1 = require("./html_classes.js");
var key_navigatable_js_1 = require("./key_navigatable.js");
var MenuStore = (function () {
    function MenuStore(menu) {
        this.menu = menu;
        this.store = [];
        this._active = null;
        this.counter = 0;
        this.attachedClass = html_classes_js_1.HtmlClasses['ATTACHED'] + '_' +
            menu_util_js_1.MenuUtil.counter();
        this.taborder = true;
        this.attrMap = {};
    }
    Object.defineProperty(MenuStore.prototype, "active", {
        get: function () {
            return this._active;
        },
        set: function (element) {
            do {
                if (this.store.indexOf(element) !== -1) {
                    this._active = element;
                    break;
                }
                element = element.parentNode;
            } while (element);
        },
        enumerable: false,
        configurable: true
    });
    MenuStore.prototype.next = function () {
        var length = this.store.length;
        if (length === 0) {
            this.active = null;
            return null;
        }
        var index = this.store.indexOf(this.active);
        index = index === -1 ? 0 : (index < length - 1 ? index + 1 : 0);
        this.active = this.store[index];
        return this.active;
    };
    MenuStore.prototype.previous = function () {
        var length = this.store.length;
        if (length === 0) {
            this.active = null;
            return null;
        }
        var last = length - 1;
        var index = this.store.indexOf(this.active);
        index = index === -1 ? last : (index === 0 ? last : index - 1);
        this.active = this.store[index];
        return this.active;
    };
    MenuStore.prototype.clear = function () {
        this.remove(this.store);
    };
    MenuStore.prototype.insert = function (elementOrList) {
        var e_1, _a;
        var elements = elementOrList instanceof HTMLElement ?
            [elementOrList] : elementOrList;
        try {
            for (var elements_1 = __values(elements), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                var element = elements_1_1.value;
                this.insertElement(element);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (elements_1_1 && !elements_1_1.done && (_a = elements_1.return)) _a.call(elements_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.sort();
    };
    MenuStore.prototype.remove = function (elementOrList) {
        var e_2, _a;
        var elements = elementOrList instanceof HTMLElement ?
            [elementOrList] : elementOrList;
        try {
            for (var elements_2 = __values(elements), elements_2_1 = elements_2.next(); !elements_2_1.done; elements_2_1 = elements_2.next()) {
                var element = elements_2_1.value;
                this.removeElement(element);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (elements_2_1 && !elements_2_1.done && (_a = elements_2.return)) _a.call(elements_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.sort();
    };
    MenuStore.prototype.inTaborder = function (flag) {
        if (this.taborder && !flag) {
            this.removeTaborder();
        }
        if (!this.taborder && flag) {
            this.insertTaborder();
        }
        this.taborder = flag;
    };
    MenuStore.prototype.insertTaborder = function () {
        if (this.taborder) {
            this.insertTaborder_();
        }
    };
    MenuStore.prototype.removeTaborder = function () {
        if (this.taborder) {
            this.removeTaborder_();
        }
    };
    MenuStore.prototype.insertElement = function (element) {
        if (element.classList.contains(this.attachedClass)) {
            return;
        }
        element.classList.add(this.attachedClass);
        if (this.taborder) {
            this.addTabindex(element);
        }
        this.addEvents(element);
    };
    MenuStore.prototype.removeElement = function (element) {
        if (!element.classList.contains(this.attachedClass)) {
            return;
        }
        element.classList.remove(this.attachedClass);
        if (this.taborder) {
            this.removeTabindex(element);
        }
        this.removeEvents(element);
    };
    MenuStore.prototype.sort = function () {
        var nodes = document.getElementsByClassName(this.attachedClass);
        this.store = [].slice.call(nodes);
    };
    MenuStore.prototype.insertTaborder_ = function () {
        this.store.forEach(function (x) { return x.setAttribute('tabindex', '0'); });
    };
    MenuStore.prototype.removeTaborder_ = function () {
        this.store.forEach(function (x) { return x.setAttribute('tabindex', '-1'); });
    };
    MenuStore.prototype.addTabindex = function (element) {
        if (element.hasAttribute('tabindex')) {
            element.setAttribute(html_classes_js_1.HtmlAttrs['OLDTAB'], element.getAttribute('tabindex'));
        }
        element.setAttribute('tabindex', '0');
    };
    MenuStore.prototype.removeTabindex = function (element) {
        if (element.hasAttribute(html_classes_js_1.HtmlAttrs['OLDTAB'])) {
            element.setAttribute('tabindex', element.getAttribute(html_classes_js_1.HtmlAttrs['OLDTAB']));
            element.removeAttribute(html_classes_js_1.HtmlAttrs['OLDTAB']);
        }
        else {
            element.removeAttribute('tabindex');
        }
    };
    MenuStore.prototype.addEvents = function (element) {
        if (element.hasAttribute(html_classes_js_1.HtmlAttrs['COUNTER'])) {
            return;
        }
        this.addEvent(element, 'contextmenu', this.menu.post.bind(this.menu));
        this.addEvent(element, 'keydown', this.keydown.bind(this));
        element.setAttribute(html_classes_js_1.HtmlAttrs['COUNTER'], this.counter.toString());
        this.counter++;
    };
    MenuStore.prototype.addEvent = function (element, name, func) {
        var attrName = html_classes_js_1.HtmlAttrs[name.toUpperCase() + 'FUNC'];
        this.attrMap[attrName + this.counter] = func;
        element.addEventListener(name, func);
    };
    MenuStore.prototype.removeEvents = function (element) {
        if (!element.hasAttribute(html_classes_js_1.HtmlAttrs['COUNTER'])) {
            return;
        }
        var counter = element.getAttribute(html_classes_js_1.HtmlAttrs['COUNTER']);
        this.removeEvent(element, 'contextmenu', counter);
        this.removeEvent(element, 'keydown', counter);
        element.removeAttribute(html_classes_js_1.HtmlAttrs['COUNTER']);
    };
    MenuStore.prototype.removeEvent = function (element, name, counter) {
        var attrName = html_classes_js_1.HtmlAttrs[name.toUpperCase() + 'FUNC'];
        var menuFunc = this.attrMap[attrName + counter];
        element.removeEventListener(name, menuFunc);
    };
    MenuStore.prototype.keydown = function (event) {
        if (event.keyCode === key_navigatable_js_1.KEY.SPACE) {
            this.menu.post(event);
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    };
    return MenuStore;
}());
exports.MenuStore = MenuStore;
//# sourceMappingURL=menu_store.js.map