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
exports.BitFieldClass = exports.BitField = void 0;
var BitField = (function () {
    function BitField() {
        this.bits = 0;
    }
    BitField.allocate = function () {
        var e_1, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                if (this.has(name_1)) {
                    throw new Error('Bit already allocated for ' + name_1);
                }
                if (this.next === BitField.MAXBIT) {
                    throw new Error('Maximum number of bits already allocated');
                }
                this.names.set(name_1, this.next);
                this.next <<= 1;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    BitField.has = function (name) {
        return this.names.has(name);
    };
    BitField.prototype.set = function (name) {
        this.bits |= this.getBit(name);
    };
    BitField.prototype.clear = function (name) {
        this.bits &= ~this.getBit(name);
    };
    BitField.prototype.isSet = function (name) {
        return !!(this.bits & this.getBit(name));
    };
    BitField.prototype.reset = function () {
        this.bits = 0;
    };
    BitField.prototype.getBit = function (name) {
        var bit = this.constructor.names.get(name);
        if (!bit) {
            throw new Error('Unknown bit-field name: ' + name);
        }
        return bit;
    };
    BitField.MAXBIT = 1 << 31;
    BitField.next = 1;
    BitField.names = new Map();
    return BitField;
}());
exports.BitField = BitField;
function BitFieldClass() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    var Bits = (function (_super) {
        __extends(Bits, _super);
        function Bits() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Bits;
    }(BitField));
    Bits.allocate.apply(Bits, __spreadArray([], __read(names), false));
    return Bits;
}
exports.BitFieldClass = BitFieldClass;
//# sourceMappingURL=BitField.js.map