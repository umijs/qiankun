"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MJContextMenu = void 0;
var context_menu_js_1 = require("mj-context-menu/js/context_menu.js");
var item_submenu_js_1 = require("mj-context-menu/js/item_submenu.js");
var MJContextMenu = (function (_super) {
    __extends(MJContextMenu, _super);
    function MJContextMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mathItem = null;
        _this.annotation = '';
        _this.annotationTypes = {};
        return _this;
    }
    MJContextMenu.prototype.post = function (x, y) {
        if (this.mathItem) {
            if (y !== undefined) {
                var input = this.mathItem.inputJax.name;
                var original = this.findID('Show', 'Original');
                original.content = (input === 'MathML' ? 'Original MathML' : input + ' Commands');
                var clipboard = this.findID('Copy', 'Original');
                clipboard.content = original.content;
                var semantics = this.findID('Settings', 'semantics');
                input === 'MathML' ? semantics.disable() : semantics.enable();
                this.getAnnotationMenu();
                this.dynamicSubmenus();
            }
            _super.prototype.post.call(this, x, y);
        }
    };
    MJContextMenu.prototype.unpost = function () {
        _super.prototype.unpost.call(this);
        this.mathItem = null;
    };
    MJContextMenu.prototype.findID = function () {
        var e_1, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        var menu = this;
        var item = null;
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                if (menu) {
                    item = menu.find(name_1);
                    menu = (item instanceof item_submenu_js_1.Submenu ? item.submenu : null);
                }
                else {
                    item = null;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return item;
    };
    MJContextMenu.prototype.getAnnotationMenu = function () {
        var _this = this;
        var annotations = this.getAnnotations(this.getSemanticNode());
        this.createAnnotationMenu('Show', annotations, function () { return _this.showAnnotation.post(); });
        this.createAnnotationMenu('Copy', annotations, function () { return _this.copyAnnotation(); });
    };
    MJContextMenu.prototype.getSemanticNode = function () {
        var node = this.mathItem.root;
        while (node && !node.isKind('semantics')) {
            if (node.isToken || node.childNodes.length !== 1)
                return null;
            node = node.childNodes[0];
        }
        return node;
    };
    MJContextMenu.prototype.getAnnotations = function (node) {
        var e_2, _a;
        var annotations = [];
        if (!node)
            return annotations;
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child.isKind('annotation')) {
                    var match = this.annotationMatch(child);
                    if (match) {
                        var value = child.childNodes.reduce(function (text, chars) { return text + chars.toString(); }, '');
                        annotations.push([match, value]);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return annotations;
    };
    MJContextMenu.prototype.annotationMatch = function (child) {
        var e_3, _a;
        var encoding = child.attributes.get('encoding');
        try {
            for (var _b = __values(Object.keys(this.annotationTypes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var type = _c.value;
                if (this.annotationTypes[type].indexOf(encoding) >= 0) {
                    return type;
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
    MJContextMenu.prototype.createAnnotationMenu = function (id, annotations, action) {
        var _this = this;
        var menu = this.findID(id, 'Annotation');
        menu.submenu = this.factory.get('subMenu')(this.factory, {
            items: annotations.map(function (_a) {
                var _b = __read(_a, 2), type = _b[0], value = _b[1];
                return {
                    type: 'command',
                    id: type,
                    content: type,
                    action: function () {
                        _this.annotation = value;
                        action();
                    }
                };
            }),
            id: 'annotations'
        }, menu);
        if (annotations.length) {
            menu.enable();
        }
        else {
            menu.disable();
        }
    };
    MJContextMenu.prototype.dynamicSubmenus = function () {
        var e_4, _a;
        try {
            for (var _b = __values(MJContextMenu.DynamicSubmenus), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), id = _d[0], method = _d[1];
                var menu = this.find(id);
                if (!menu)
                    continue;
                var sub = method(this, menu);
                menu.submenu = sub;
                if (sub.items.length) {
                    menu.enable();
                }
                else {
                    menu.disable();
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    MJContextMenu.DynamicSubmenus = new Map();
    return MJContextMenu;
}(context_menu_js_1.ContextMenu));
exports.MJContextMenu = MJContextMenu;
//# sourceMappingURL=MJContextMenu.js.map