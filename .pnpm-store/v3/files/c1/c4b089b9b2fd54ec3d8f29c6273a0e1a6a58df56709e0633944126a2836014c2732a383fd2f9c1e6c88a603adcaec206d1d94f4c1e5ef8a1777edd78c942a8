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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentMap = exports.CommandMap = exports.MacroMap = exports.DelimiterMap = exports.CharacterMap = exports.AbstractParseMap = exports.RegExpMap = exports.AbstractSymbolMap = exports.parseResult = void 0;
var Symbol_js_1 = require("./Symbol.js");
var MapHandler_js_1 = require("./MapHandler.js");
function parseResult(result) {
    return result === void 0 ? true : result;
}
exports.parseResult = parseResult;
var AbstractSymbolMap = (function () {
    function AbstractSymbolMap(_name, _parser) {
        this._name = _name;
        this._parser = _parser;
        MapHandler_js_1.MapHandler.register(this);
    }
    Object.defineProperty(AbstractSymbolMap.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    AbstractSymbolMap.prototype.parserFor = function (symbol) {
        return this.contains(symbol) ? this.parser : null;
    };
    AbstractSymbolMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var parser = this.parserFor(symbol);
        var mapped = this.lookup(symbol);
        return (parser && mapped) ? parseResult(parser(env, mapped)) : null;
    };
    Object.defineProperty(AbstractSymbolMap.prototype, "parser", {
        get: function () {
            return this._parser;
        },
        set: function (parser) {
            this._parser = parser;
        },
        enumerable: false,
        configurable: true
    });
    return AbstractSymbolMap;
}());
exports.AbstractSymbolMap = AbstractSymbolMap;
var RegExpMap = (function (_super) {
    __extends(RegExpMap, _super);
    function RegExpMap(name, parser, _regExp) {
        var _this = _super.call(this, name, parser) || this;
        _this._regExp = _regExp;
        return _this;
    }
    RegExpMap.prototype.contains = function (symbol) {
        return this._regExp.test(symbol);
    };
    RegExpMap.prototype.lookup = function (symbol) {
        return this.contains(symbol) ? symbol : null;
    };
    return RegExpMap;
}(AbstractSymbolMap));
exports.RegExpMap = RegExpMap;
var AbstractParseMap = (function (_super) {
    __extends(AbstractParseMap, _super);
    function AbstractParseMap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.map = new Map();
        return _this;
    }
    AbstractParseMap.prototype.lookup = function (symbol) {
        return this.map.get(symbol);
    };
    AbstractParseMap.prototype.contains = function (symbol) {
        return this.map.has(symbol);
    };
    AbstractParseMap.prototype.add = function (symbol, object) {
        this.map.set(symbol, object);
    };
    AbstractParseMap.prototype.remove = function (symbol) {
        this.map.delete(symbol);
    };
    return AbstractParseMap;
}(AbstractSymbolMap));
exports.AbstractParseMap = AbstractParseMap;
var CharacterMap = (function (_super) {
    __extends(CharacterMap, _super);
    function CharacterMap(name, parser, json) {
        var e_1, _a;
        var _this = _super.call(this, name, parser) || this;
        try {
            for (var _b = __values(Object.keys(json)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var value = json[key];
                var _d = __read((typeof (value) === 'string') ? [value, null] : value, 2), char = _d[0], attrs = _d[1];
                var character = new Symbol_js_1.Symbol(key, char, attrs);
                _this.add(key, character);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return _this;
    }
    return CharacterMap;
}(AbstractParseMap));
exports.CharacterMap = CharacterMap;
var DelimiterMap = (function (_super) {
    __extends(DelimiterMap, _super);
    function DelimiterMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DelimiterMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        return _super.prototype.parse.call(this, [env, '\\' + symbol]);
    };
    return DelimiterMap;
}(CharacterMap));
exports.DelimiterMap = DelimiterMap;
var MacroMap = (function (_super) {
    __extends(MacroMap, _super);
    function MacroMap(name, json, functionMap) {
        var e_2, _a;
        var _this = _super.call(this, name, null) || this;
        try {
            for (var _b = __values(Object.keys(json)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var value = json[key];
                var _d = __read((typeof (value) === 'string') ? [value] : value), func = _d[0], attrs = _d.slice(1);
                var character = new Symbol_js_1.Macro(key, functionMap[func], attrs);
                _this.add(key, character);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return _this;
    }
    MacroMap.prototype.parserFor = function (symbol) {
        var macro = this.lookup(symbol);
        return macro ? macro.func : null;
    };
    MacroMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var parser = this.parserFor(symbol);
        if (!macro || !parser) {
            return null;
        }
        return parseResult(parser.apply(void 0, __spreadArray([env, macro.symbol], __read(macro.args), false)));
    };
    return MacroMap;
}(AbstractParseMap));
exports.MacroMap = MacroMap;
var CommandMap = (function (_super) {
    __extends(CommandMap, _super);
    function CommandMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommandMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var parser = this.parserFor(symbol);
        if (!macro || !parser) {
            return null;
        }
        var saveCommand = env.currentCS;
        env.currentCS = '\\' + symbol;
        var result = parser.apply(void 0, __spreadArray([env, '\\' + macro.symbol], __read(macro.args), false));
        env.currentCS = saveCommand;
        return parseResult(result);
    };
    return CommandMap;
}(MacroMap));
exports.CommandMap = CommandMap;
var EnvironmentMap = (function (_super) {
    __extends(EnvironmentMap, _super);
    function EnvironmentMap(name, parser, json, functionMap) {
        var _this = _super.call(this, name, json, functionMap) || this;
        _this.parser = parser;
        return _this;
    }
    EnvironmentMap.prototype.parse = function (_a) {
        var _b = __read(_a, 2), env = _b[0], symbol = _b[1];
        var macro = this.lookup(symbol);
        var envParser = this.parserFor(symbol);
        if (!macro || !envParser) {
            return null;
        }
        return parseResult(this.parser(env, macro.symbol, envParser, macro.args));
    };
    return EnvironmentMap;
}(MacroMap));
exports.EnvironmentMap = EnvironmentMap;
//# sourceMappingURL=SymbolMap.js.map