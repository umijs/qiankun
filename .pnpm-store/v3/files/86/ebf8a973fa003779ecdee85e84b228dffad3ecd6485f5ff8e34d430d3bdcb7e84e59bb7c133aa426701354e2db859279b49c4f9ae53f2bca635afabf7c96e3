"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = void 0;
var menu_util_js_1 = require("./menu_util.js");
var Variable = (function () {
    function Variable(_name, getter, setter) {
        this._name = _name;
        this.getter = getter;
        this.setter = setter;
        this.items = [];
    }
    Variable.fromJson = function (_factory, _a, pool) {
        var name = _a.name, getter = _a.getter, setter = _a.setter;
        var variable = new this(name, getter, setter);
        pool.insert(variable);
    };
    Object.defineProperty(Variable.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Variable.prototype.getValue = function (node) {
        try {
            return this.getter(node);
        }
        catch (e) {
            menu_util_js_1.MenuUtil.error(e, 'Command of variable ' + this.name + ' failed.');
            return null;
        }
    };
    Variable.prototype.setValue = function (value, node) {
        try {
            this.setter(value, node);
        }
        catch (e) {
            menu_util_js_1.MenuUtil.error(e, 'Command of variable ' + this.name + ' failed.');
        }
        this.update();
    };
    Variable.prototype.register = function (item) {
        if (this.items.indexOf(item) === -1) {
            this.items.push(item);
        }
    };
    Variable.prototype.unregister = function (item) {
        var index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    };
    Variable.prototype.update = function () {
        this.items.forEach(function (x) { return x.update(); });
    };
    Variable.prototype.registerCallback = function (func) {
        this.items.forEach(function (x) { return x.registerCallback(func); });
    };
    Variable.prototype.unregisterCallback = function (func) {
        this.items.forEach(function (x) { return x.unregisterCallback(func); });
    };
    Variable.prototype.toJson = function () {
        return { type: 'variable',
            name: this.name,
            getter: this.getter.toString(),
            setter: this.setter.toString() };
    };
    return Variable;
}());
exports.Variable = Variable;
//# sourceMappingURL=variable.js.map