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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyMmlVisitor = void 0;
var MmlVisitor_js_1 = require("./MmlVisitor.js");
var MML = MathJax.ElementJax.mml;
var LegacyMmlVisitor = (function (_super) {
    __extends(LegacyMmlVisitor, _super);
    function LegacyMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LegacyMmlVisitor.prototype.visitTree = function (node) {
        var root = MML.mrow();
        this.visitNode(node, root);
        root = root.data[0];
        root.parent = null;
        return root;
    };
    LegacyMmlVisitor.prototype.visitTextNode = function (node, parent) {
        parent.Append(MML.chars(node.getText()));
    };
    LegacyMmlVisitor.prototype.visitXMLNode = function (node, parent) {
        parent.Append(MML.xml(node.getXML()));
    };
    LegacyMmlVisitor.prototype.visitInferredMrowNode = function (node, parent) {
        var e_1, _a;
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                this.visitNode(child, parent);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    LegacyMmlVisitor.prototype.visitDefault = function (node, parent) {
        var e_2, _a;
        var mml = MML[node.kind]();
        this.addAttributes(node, mml);
        this.addProperties(node, mml);
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                this.visitNode(child, mml);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        parent.Append(mml);
    };
    LegacyMmlVisitor.prototype.addAttributes = function (node, mml) {
        var e_3, _a;
        var attributes = node.attributes;
        var names = attributes.getExplicitNames();
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                mml[name_1] = attributes.getExplicit(name_1);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    LegacyMmlVisitor.prototype.addProperties = function (node, mml) {
        var e_4, _a;
        var names = node.getPropertyNames();
        try {
            for (var names_2 = __values(names), names_2_1 = names_2.next(); !names_2_1.done; names_2_1 = names_2.next()) {
                var name_2 = names_2_1.value;
                mml[name_2] = node.getProperty(name_2);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (names_2_1 && !names_2_1.done && (_a = names_2.return)) _a.call(names_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    return LegacyMmlVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.LegacyMmlVisitor = LegacyMmlVisitor;
//# sourceMappingURL=LegacyMmlVisitor.js.map