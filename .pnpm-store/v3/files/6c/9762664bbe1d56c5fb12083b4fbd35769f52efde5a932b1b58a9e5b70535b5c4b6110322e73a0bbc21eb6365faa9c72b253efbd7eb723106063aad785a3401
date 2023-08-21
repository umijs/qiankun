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
exports.JsonMmlVisitor = void 0;
var MmlVisitor_js_1 = require("./MmlVisitor.js");
var JsonMmlVisitor = (function (_super) {
    __extends(JsonMmlVisitor, _super);
    function JsonMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JsonMmlVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node);
    };
    JsonMmlVisitor.prototype.visitTextNode = function (node) {
        return { kind: node.kind, text: node.getText() };
    };
    JsonMmlVisitor.prototype.visitXMLNode = function (node) {
        return { kind: node.kind, xml: node.getXML() };
    };
    JsonMmlVisitor.prototype.visitDefault = function (node) {
        var json = {
            kind: node.kind.replace(/inferredM/, 'm'),
            texClass: node.texClass,
            attributes: this.getAttributes(node),
            inherited: this.getInherited(node),
            properties: this.getProperties(node),
            childNodes: this.getChildren(node)
        };
        if (node.isInferred) {
            json.isInferred = true;
        }
        if (node.isEmbellished) {
            json.isEmbellished = true;
        }
        if (node.isSpacelike) {
            json.isSpacelike = true;
        }
        return json;
    };
    JsonMmlVisitor.prototype.getChildren = function (node) {
        var e_1, _a;
        var children = [];
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                children.push(this.visitNode(child));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return children;
    };
    JsonMmlVisitor.prototype.getAttributes = function (node) {
        return Object.assign({}, node.attributes.getAllAttributes());
    };
    JsonMmlVisitor.prototype.getInherited = function (node) {
        return Object.assign({}, node.attributes.getAllInherited());
    };
    JsonMmlVisitor.prototype.getProperties = function (node) {
        return Object.assign({}, node.getAllProperties());
    };
    return JsonMmlVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.JsonMmlVisitor = JsonMmlVisitor;
//# sourceMappingURL=JsonMmlVisitor.js.map