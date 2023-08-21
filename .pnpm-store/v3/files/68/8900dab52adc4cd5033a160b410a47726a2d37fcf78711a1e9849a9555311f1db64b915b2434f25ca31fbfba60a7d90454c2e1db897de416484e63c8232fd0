"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var item_command_js_1 = require("./item_command.js");
var context_menu_js_1 = require("./context_menu.js");
var variable_js_1 = require("./variable.js");
var item_checkbox_js_1 = require("./item_checkbox.js");
var item_combo_js_1 = require("./item_combo.js");
var item_label_js_1 = require("./item_label.js");
var item_radio_js_1 = require("./item_radio.js");
var item_submenu_js_1 = require("./item_submenu.js");
var item_rule_js_1 = require("./item_rule.js");
var item_slider_js_1 = require("./item_slider.js");
var sub_menu_js_1 = require("./sub_menu.js");
var selection_box_js_1 = require("./selection_box.js");
var parser_factory_js_1 = require("./parser_factory.js");
var Parser = (function () {
    function Parser(init) {
        var _this = this;
        if (init === void 0) { init = []; }
        this._initList = [
            ['command', item_command_js_1.Command.fromJson.bind(item_command_js_1.Command)],
            ['checkbox', item_checkbox_js_1.Checkbox.fromJson.bind(item_checkbox_js_1.Checkbox)],
            ['combo', item_combo_js_1.Combo.fromJson.bind(item_combo_js_1.Combo)],
            ['slider', item_slider_js_1.Slider.fromJson.bind(item_slider_js_1.Slider)],
            ['label', item_label_js_1.Label.fromJson.bind(item_label_js_1.Label)],
            ['radio', item_radio_js_1.Radio.fromJson.bind(item_radio_js_1.Radio)],
            ['rule', item_rule_js_1.Rule.fromJson.bind(item_rule_js_1.Rule)],
            ['submenu', item_submenu_js_1.Submenu.fromJson.bind(item_submenu_js_1.Submenu)],
            ['contextMenu', context_menu_js_1.ContextMenu.fromJson.bind(context_menu_js_1.ContextMenu)],
            ['subMenu', sub_menu_js_1.SubMenu.fromJson.bind(sub_menu_js_1.SubMenu)],
            ['variable', variable_js_1.Variable.fromJson.bind(variable_js_1.Variable)],
            ['items', this.items.bind(this)],
            ['selectionMenu', selection_box_js_1.SelectionMenu.fromJson.bind(selection_box_js_1.SelectionMenu)],
            ['selectionBox', selection_box_js_1.SelectionBox.fromJson.bind(selection_box_js_1.SelectionBox)]
        ];
        this._factory = new parser_factory_js_1.ParserFactory(this._initList);
        init.forEach(function (_a) {
            var _b = __read(_a, 2), x = _b[0], y = _b[1];
            return _this.factory.add(x, y);
        });
    }
    Object.defineProperty(Parser.prototype, "factory", {
        get: function () {
            return this._factory;
        },
        enumerable: false,
        configurable: true
    });
    Parser.prototype.items = function (_factory, its, ctxt) {
        var e_1, _a;
        var hidden = [];
        try {
            for (var its_1 = __values(its), its_1_1 = its_1.next(); !its_1_1.done; its_1_1 = its_1.next()) {
                var item = its_1_1.value;
                var entry = this.parse(item, ctxt);
                if (!entry) {
                    continue;
                }
                ctxt.items.push(entry);
                if (item.disabled) {
                    entry.disable();
                }
                if (item.hidden) {
                    hidden.push(entry);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (its_1_1 && !its_1_1.done && (_a = its_1.return)) _a.call(its_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        hidden.forEach(function (x) { return x.hide(); });
        return ctxt.items;
    };
    Parser.prototype.parse = function (_a) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var kind = _a.type, json = __rest(_a, ["type"]);
        var func = this.factory.get(kind);
        return func ? func.apply(void 0, __spread([this.factory, json], rest)) : null;
    };
    return Parser;
}());
exports.Parser = Parser;
//# sourceMappingURL=parse.js.map