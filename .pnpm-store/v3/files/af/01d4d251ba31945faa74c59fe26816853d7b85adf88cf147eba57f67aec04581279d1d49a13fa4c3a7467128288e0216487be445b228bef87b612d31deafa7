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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractVisitor = void 0;
var Node_js_1 = require("./Node.js");
var AbstractVisitor = (function () {
    function AbstractVisitor(factory) {
        var e_1, _a;
        this.nodeHandlers = new Map();
        try {
            for (var _b = __values(factory.getKinds()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var kind = _c.value;
                var method = this[AbstractVisitor.methodName(kind)];
                if (method) {
                    this.nodeHandlers.set(kind, method);
                }
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
    AbstractVisitor.methodName = function (kind) {
        return 'visit' + (kind.charAt(0).toUpperCase() + kind.substr(1)).replace(/[^a-z0-9_]/ig, '_') + 'Node';
    };
    AbstractVisitor.prototype.visitTree = function (tree) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.visitNode.apply(this, __spreadArray([tree], __read(args), false));
    };
    AbstractVisitor.prototype.visitNode = function (node) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var handler = this.nodeHandlers.get(node.kind) || this.visitDefault;
        return handler.call.apply(handler, __spreadArray([this, node], __read(args), false));
    };
    AbstractVisitor.prototype.visitDefault = function (node) {
        var e_2, _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (node instanceof Node_js_1.AbstractNode) {
            try {
                for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this.visitNode.apply(this, __spreadArray([child], __read(args), false));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    AbstractVisitor.prototype.setNodeHandler = function (kind, handler) {
        this.nodeHandlers.set(kind, handler);
    };
    AbstractVisitor.prototype.removeNodeHandler = function (kind) {
        this.nodeHandlers.delete(kind);
    };
    return AbstractVisitor;
}());
exports.AbstractVisitor = AbstractVisitor;
//# sourceMappingURL=Visitor.js.map