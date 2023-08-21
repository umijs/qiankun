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
exports.SubHandlers = exports.SubHandler = exports.MapHandler = void 0;
var PrioritizedList_js_1 = require("../../util/PrioritizedList.js");
var FunctionList_js_1 = require("../../util/FunctionList.js");
var MapHandler;
(function (MapHandler) {
    var maps = new Map();
    MapHandler.register = function (map) {
        maps.set(map.name, map);
    };
    MapHandler.getMap = function (name) {
        return maps.get(name);
    };
})(MapHandler = exports.MapHandler || (exports.MapHandler = {}));
var SubHandler = (function () {
    function SubHandler() {
        this._configuration = new PrioritizedList_js_1.PrioritizedList();
        this._fallback = new FunctionList_js_1.FunctionList();
    }
    SubHandler.prototype.add = function (maps, fallback, priority) {
        var e_1, _a;
        if (priority === void 0) { priority = PrioritizedList_js_1.PrioritizedList.DEFAULTPRIORITY; }
        try {
            for (var _b = __values(maps.slice().reverse()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                var map = MapHandler.getMap(name_1);
                if (!map) {
                    this.warn('Configuration ' + name_1 + ' not found! Omitted.');
                    return;
                }
                this._configuration.add(map, priority);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (fallback) {
            this._fallback.add(fallback, priority);
        }
    };
    SubHandler.prototype.parse = function (input) {
        var e_2, _a;
        try {
            for (var _b = __values(this._configuration), _c = _b.next(); !_c.done; _c = _b.next()) {
                var map = _c.value.item;
                var result = map.parse(input);
                if (result) {
                    return result;
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
        var _d = __read(input, 2), env = _d[0], symbol = _d[1];
        Array.from(this._fallback)[0].item(env, symbol);
    };
    SubHandler.prototype.lookup = function (symbol) {
        var map = this.applicable(symbol);
        return map ? map.lookup(symbol) : null;
    };
    SubHandler.prototype.contains = function (symbol) {
        return this.applicable(symbol) ? true : false;
    };
    SubHandler.prototype.toString = function () {
        var e_3, _a;
        var names = [];
        try {
            for (var _b = __values(this._configuration), _c = _b.next(); !_c.done; _c = _b.next()) {
                var map = _c.value.item;
                names.push(map.name);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return names.join(', ');
    };
    SubHandler.prototype.applicable = function (symbol) {
        var e_4, _a;
        try {
            for (var _b = __values(this._configuration), _c = _b.next(); !_c.done; _c = _b.next()) {
                var map = _c.value.item;
                if (map.contains(symbol)) {
                    return map;
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
        return null;
    };
    SubHandler.prototype.retrieve = function (name) {
        var e_5, _a;
        try {
            for (var _b = __values(this._configuration), _c = _b.next(); !_c.done; _c = _b.next()) {
                var map = _c.value.item;
                if (map.name === name) {
                    return map;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return null;
    };
    SubHandler.prototype.warn = function (message) {
        console.log('TexParser Warning: ' + message);
    };
    return SubHandler;
}());
exports.SubHandler = SubHandler;
var SubHandlers = (function () {
    function SubHandlers() {
        this.map = new Map();
    }
    SubHandlers.prototype.add = function (handlers, fallbacks, priority) {
        var e_6, _a;
        if (priority === void 0) { priority = PrioritizedList_js_1.PrioritizedList.DEFAULTPRIORITY; }
        try {
            for (var _b = __values(Object.keys(handlers)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var name_2 = key;
                var subHandler = this.get(name_2);
                if (!subHandler) {
                    subHandler = new SubHandler();
                    this.set(name_2, subHandler);
                }
                subHandler.add(handlers[name_2], fallbacks[name_2], priority);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    SubHandlers.prototype.set = function (name, subHandler) {
        this.map.set(name, subHandler);
    };
    SubHandlers.prototype.get = function (name) {
        return this.map.get(name);
    };
    SubHandlers.prototype.retrieve = function (name) {
        var e_7, _a;
        try {
            for (var _b = __values(this.map.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var handler = _c.value;
                var map = handler.retrieve(name);
                if (map) {
                    return map;
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return null;
    };
    SubHandlers.prototype.keys = function () {
        return this.map.keys();
    };
    return SubHandlers;
}());
exports.SubHandlers = SubHandlers;
//# sourceMappingURL=MapHandler.js.map