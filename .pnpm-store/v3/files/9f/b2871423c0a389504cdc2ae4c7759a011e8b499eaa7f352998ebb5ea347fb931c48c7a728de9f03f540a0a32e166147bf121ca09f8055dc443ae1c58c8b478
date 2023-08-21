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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ParseUtil_js_1 = __importDefault(require("./ParseUtil.js"));
var Stack_js_1 = __importDefault(require("./Stack.js"));
var TexError_js_1 = __importDefault(require("./TexError.js"));
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var TexParser = (function () {
    function TexParser(_string, env, configuration) {
        var e_1, _a;
        this._string = _string;
        this.configuration = configuration;
        this.macroCount = 0;
        this.i = 0;
        this.currentCS = '';
        var inner = env.hasOwnProperty('isInner');
        var isInner = env['isInner'];
        delete env['isInner'];
        var ENV;
        if (env) {
            ENV = {};
            try {
                for (var _b = __values(Object.keys(env)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var id = _c.value;
                    ENV[id] = env[id];
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        this.configuration.pushParser(this);
        this.stack = new Stack_js_1.default(this.itemFactory, ENV, inner ? isInner : true);
        this.Parse();
        this.Push(this.itemFactory.create('stop'));
    }
    Object.defineProperty(TexParser.prototype, "options", {
        get: function () {
            return this.configuration.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TexParser.prototype, "itemFactory", {
        get: function () {
            return this.configuration.itemFactory;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TexParser.prototype, "tags", {
        get: function () {
            return this.configuration.tags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TexParser.prototype, "string", {
        get: function () {
            return this._string;
        },
        set: function (str) {
            this._string = str;
        },
        enumerable: false,
        configurable: true
    });
    TexParser.prototype.parse = function (kind, input) {
        return this.configuration.handlers.get(kind).parse(input);
    };
    TexParser.prototype.lookup = function (kind, symbol) {
        return this.configuration.handlers.get(kind).lookup(symbol);
    };
    TexParser.prototype.contains = function (kind, symbol) {
        return this.configuration.handlers.get(kind).contains(symbol);
    };
    TexParser.prototype.toString = function () {
        var e_2, _a;
        var str = '';
        try {
            for (var _b = __values(Array.from(this.configuration.handlers.keys())), _c = _b.next(); !_c.done; _c = _b.next()) {
                var config = _c.value;
                str += config + ': ' +
                    this.configuration.handlers.get(config) + '\n';
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return str;
    };
    TexParser.prototype.Parse = function () {
        var c;
        while (this.i < this.string.length) {
            c = this.getCodePoint();
            this.i += c.length;
            this.parse('character', [this, c]);
        }
    };
    TexParser.prototype.Push = function (arg) {
        if (arg instanceof MmlNode_js_1.AbstractMmlNode && arg.isInferred) {
            this.PushAll(arg.childNodes);
        }
        else {
            this.stack.Push(arg);
        }
    };
    TexParser.prototype.PushAll = function (args) {
        var e_3, _a;
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                this.stack.Push(arg);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    TexParser.prototype.mml = function () {
        if (!this.stack.Top().isKind('mml')) {
            return null;
        }
        var node = this.stack.Top().First;
        this.configuration.popParser();
        return node;
    };
    TexParser.prototype.convertDelimiter = function (c) {
        var symbol = this.lookup('delimiter', c);
        return symbol ? symbol.char : null;
    };
    TexParser.prototype.getCodePoint = function () {
        var code = this.string.codePointAt(this.i);
        return code === undefined ? '' : String.fromCodePoint(code);
    };
    TexParser.prototype.nextIsSpace = function () {
        return !!this.string.charAt(this.i).match(/\s/);
    };
    TexParser.prototype.GetNext = function () {
        while (this.nextIsSpace()) {
            this.i++;
        }
        return this.getCodePoint();
    };
    TexParser.prototype.GetCS = function () {
        var CS = this.string.slice(this.i).match(/^(([a-z]+) ?|[\uD800-\uDBFF].|.)/i);
        if (CS) {
            this.i += CS[0].length;
            return CS[2] || CS[1];
        }
        else {
            this.i++;
            return ' ';
        }
    };
    TexParser.prototype.GetArgument = function (_name, noneOK) {
        switch (this.GetNext()) {
            case '':
                if (!noneOK) {
                    throw new TexError_js_1.default('MissingArgFor', 'Missing argument for %1', this.currentCS);
                }
                return null;
            case '}':
                if (!noneOK) {
                    throw new TexError_js_1.default('ExtraCloseMissingOpen', 'Extra close brace or missing open brace');
                }
                return null;
            case '\\':
                this.i++;
                return '\\' + this.GetCS();
            case '{':
                var j = ++this.i, parens = 1;
                while (this.i < this.string.length) {
                    switch (this.string.charAt(this.i++)) {
                        case '\\':
                            this.i++;
                            break;
                        case '{':
                            parens++;
                            break;
                        case '}':
                            if (--parens === 0) {
                                return this.string.slice(j, this.i - 1);
                            }
                            break;
                    }
                }
                throw new TexError_js_1.default('MissingCloseBrace', 'Missing close brace');
        }
        var c = this.getCodePoint();
        this.i += c.length;
        return c;
    };
    TexParser.prototype.GetBrackets = function (_name, def) {
        if (this.GetNext() !== '[') {
            return def;
        }
        var j = ++this.i, parens = 0;
        while (this.i < this.string.length) {
            switch (this.string.charAt(this.i++)) {
                case '{':
                    parens++;
                    break;
                case '\\':
                    this.i++;
                    break;
                case '}':
                    if (parens-- <= 0) {
                        throw new TexError_js_1.default('ExtraCloseLooking', 'Extra close brace while looking for %1', '\']\'');
                    }
                    break;
                case ']':
                    if (parens === 0) {
                        return this.string.slice(j, this.i - 1);
                    }
                    break;
            }
        }
        throw new TexError_js_1.default('MissingCloseBracket', 'Could not find closing \']\' for argument to %1', this.currentCS);
    };
    TexParser.prototype.GetDelimiter = function (name, braceOK) {
        var c = this.GetNext();
        this.i += c.length;
        if (this.i <= this.string.length) {
            if (c === '\\') {
                c += this.GetCS();
            }
            else if (c === '{' && braceOK) {
                this.i--;
                c = this.GetArgument(name).trim();
            }
            if (this.contains('delimiter', c)) {
                return this.convertDelimiter(c);
            }
        }
        throw new TexError_js_1.default('MissingOrUnrecognizedDelim', 'Missing or unrecognized delimiter for %1', this.currentCS);
    };
    TexParser.prototype.GetDimen = function (name) {
        if (this.GetNext() === '{') {
            var dimen = this.GetArgument(name);
            var _a = __read(ParseUtil_js_1.default.matchDimen(dimen), 2), value = _a[0], unit = _a[1];
            if (value) {
                return value + unit;
            }
        }
        else {
            var dimen = this.string.slice(this.i);
            var _b = __read(ParseUtil_js_1.default.matchDimen(dimen, true), 3), value = _b[0], unit = _b[1], length_1 = _b[2];
            if (value) {
                this.i += length_1;
                return value + unit;
            }
        }
        throw new TexError_js_1.default('MissingDimOrUnits', 'Missing dimension or its units for %1', this.currentCS);
    };
    TexParser.prototype.GetUpTo = function (_name, token) {
        while (this.nextIsSpace()) {
            this.i++;
        }
        var j = this.i;
        var parens = 0;
        while (this.i < this.string.length) {
            var k = this.i;
            var c = this.GetNext();
            this.i += c.length;
            switch (c) {
                case '\\':
                    c += this.GetCS();
                    break;
                case '{':
                    parens++;
                    break;
                case '}':
                    if (parens === 0) {
                        throw new TexError_js_1.default('ExtraCloseLooking', 'Extra close brace while looking for %1', token);
                    }
                    parens--;
                    break;
            }
            if (parens === 0 && c === token) {
                return this.string.slice(j, k);
            }
        }
        throw new TexError_js_1.default('TokenNotFoundForCommand', 'Could not find %1 for %2', token, this.currentCS);
    };
    TexParser.prototype.ParseArg = function (name) {
        return new TexParser(this.GetArgument(name), this.stack.env, this.configuration).mml();
    };
    TexParser.prototype.ParseUpTo = function (name, token) {
        return new TexParser(this.GetUpTo(name, token), this.stack.env, this.configuration).mml();
    };
    TexParser.prototype.GetDelimiterArg = function (name) {
        var c = ParseUtil_js_1.default.trimSpaces(this.GetArgument(name));
        if (c === '') {
            return null;
        }
        if (this.contains('delimiter', c)) {
            return c;
        }
        throw new TexError_js_1.default('MissingOrUnrecognizedDelim', 'Missing or unrecognized delimiter for %1', this.currentCS);
    };
    TexParser.prototype.GetStar = function () {
        var star = (this.GetNext() === '*');
        if (star) {
            this.i++;
        }
        return star;
    };
    TexParser.prototype.create = function (kind) {
        var _a;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        return (_a = this.configuration.nodeFactory).create.apply(_a, __spreadArray([kind], __read(rest), false));
    };
    return TexParser;
}());
exports.default = TexParser;
//# sourceMappingURL=TexParser.js.map