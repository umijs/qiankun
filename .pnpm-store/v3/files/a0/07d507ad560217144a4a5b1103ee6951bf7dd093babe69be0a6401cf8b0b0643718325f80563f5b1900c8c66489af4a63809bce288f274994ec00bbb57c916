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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractEmptyNode = exports.AbstractNode = void 0;
var AbstractNode = (function () {
    function AbstractNode(factory, properties, children) {
        var e_1, _a;
        if (properties === void 0) { properties = {}; }
        if (children === void 0) { children = []; }
        this.factory = factory;
        this.parent = null;
        this.properties = {};
        this.childNodes = [];
        try {
            for (var _b = __values(Object.keys(properties)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                this.setProperty(name_1, properties[name_1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (children.length) {
            this.setChildren(children);
        }
    }
    Object.defineProperty(AbstractNode.prototype, "kind", {
        get: function () {
            return 'unknown';
        },
        enumerable: false,
        configurable: true
    });
    AbstractNode.prototype.setProperty = function (name, value) {
        this.properties[name] = value;
    };
    AbstractNode.prototype.getProperty = function (name) {
        return this.properties[name];
    };
    AbstractNode.prototype.getPropertyNames = function () {
        return Object.keys(this.properties);
    };
    AbstractNode.prototype.getAllProperties = function () {
        return this.properties;
    };
    AbstractNode.prototype.removeProperty = function () {
        var e_2, _a;
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_2 = names_1_1.value;
                delete this.properties[name_2];
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AbstractNode.prototype.isKind = function (kind) {
        return this.factory.nodeIsKind(this, kind);
    };
    AbstractNode.prototype.setChildren = function (children) {
        var e_3, _a;
        this.childNodes = [];
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                this.appendChild(child);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    AbstractNode.prototype.appendChild = function (child) {
        this.childNodes.push(child);
        child.parent = this;
        return child;
    };
    AbstractNode.prototype.replaceChild = function (newChild, oldChild) {
        var i = this.childIndex(oldChild);
        if (i !== null) {
            this.childNodes[i] = newChild;
            newChild.parent = this;
            oldChild.parent = null;
        }
        return newChild;
    };
    AbstractNode.prototype.removeChild = function (child) {
        var i = this.childIndex(child);
        if (i !== null) {
            this.childNodes.splice(i, 1);
            child.parent = null;
        }
        return child;
    };
    AbstractNode.prototype.childIndex = function (node) {
        var i = this.childNodes.indexOf(node);
        return (i === -1 ? null : i);
    };
    AbstractNode.prototype.copy = function () {
        var e_4, _a;
        var node = this.factory.create(this.kind);
        node.properties = __assign({}, this.properties);
        try {
            for (var _b = __values(this.childNodes || []), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child) {
                    node.appendChild(child.copy());
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
        return node;
    };
    AbstractNode.prototype.findNodes = function (kind) {
        var nodes = [];
        this.walkTree(function (node) {
            if (node.isKind(kind)) {
                nodes.push(node);
            }
        });
        return nodes;
    };
    AbstractNode.prototype.walkTree = function (func, data) {
        var e_5, _a;
        func(this, data);
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child) {
                    child.walkTree(func, data);
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
        return data;
    };
    AbstractNode.prototype.toString = function () {
        return this.kind + '(' + this.childNodes.join(',') + ')';
    };
    return AbstractNode;
}());
exports.AbstractNode = AbstractNode;
var AbstractEmptyNode = (function (_super) {
    __extends(AbstractEmptyNode, _super);
    function AbstractEmptyNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractEmptyNode.prototype.setChildren = function (_children) {
    };
    AbstractEmptyNode.prototype.appendChild = function (child) {
        return child;
    };
    AbstractEmptyNode.prototype.replaceChild = function (_newChild, oldChild) {
        return oldChild;
    };
    AbstractEmptyNode.prototype.childIndex = function (_node) {
        return null;
    };
    AbstractEmptyNode.prototype.walkTree = function (func, data) {
        func(this, data);
        return data;
    };
    AbstractEmptyNode.prototype.toString = function () {
        return this.kind;
    };
    return AbstractEmptyNode;
}(AbstractNode));
exports.AbstractEmptyNode = AbstractEmptyNode;
//# sourceMappingURL=Node.js.map