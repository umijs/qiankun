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
exports.Attributes = exports.INHERIT = void 0;
exports.INHERIT = '_inherit_';
var Attributes = (function () {
    function Attributes(defaults, global) {
        this.global = global;
        this.defaults = Object.create(global);
        this.inherited = Object.create(this.defaults);
        this.attributes = Object.create(this.inherited);
        Object.assign(this.defaults, defaults);
    }
    Attributes.prototype.set = function (name, value) {
        this.attributes[name] = value;
    };
    Attributes.prototype.setList = function (list) {
        Object.assign(this.attributes, list);
    };
    Attributes.prototype.get = function (name) {
        var value = this.attributes[name];
        if (value === exports.INHERIT) {
            value = this.global[name];
        }
        return value;
    };
    Attributes.prototype.getExplicit = function (name) {
        if (!this.attributes.hasOwnProperty(name)) {
            return undefined;
        }
        return this.attributes[name];
    };
    Attributes.prototype.getList = function () {
        var e_1, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        var values = {};
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                values[name_1] = this.get(name_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return values;
    };
    Attributes.prototype.setInherited = function (name, value) {
        this.inherited[name] = value;
    };
    Attributes.prototype.getInherited = function (name) {
        return this.inherited[name];
    };
    Attributes.prototype.getDefault = function (name) {
        return this.defaults[name];
    };
    Attributes.prototype.isSet = function (name) {
        return this.attributes.hasOwnProperty(name) || this.inherited.hasOwnProperty(name);
    };
    Attributes.prototype.hasDefault = function (name) {
        return (name in this.defaults);
    };
    Attributes.prototype.getExplicitNames = function () {
        return Object.keys(this.attributes);
    };
    Attributes.prototype.getInheritedNames = function () {
        return Object.keys(this.inherited);
    };
    Attributes.prototype.getDefaultNames = function () {
        return Object.keys(this.defaults);
    };
    Attributes.prototype.getGlobalNames = function () {
        return Object.keys(this.global);
    };
    Attributes.prototype.getAllAttributes = function () {
        return this.attributes;
    };
    Attributes.prototype.getAllInherited = function () {
        return this.inherited;
    };
    Attributes.prototype.getAllDefaults = function () {
        return this.defaults;
    };
    Attributes.prototype.getAllGlobals = function () {
        return this.global;
    };
    return Attributes;
}());
exports.Attributes = Attributes;
//# sourceMappingURL=Attributes.js.map