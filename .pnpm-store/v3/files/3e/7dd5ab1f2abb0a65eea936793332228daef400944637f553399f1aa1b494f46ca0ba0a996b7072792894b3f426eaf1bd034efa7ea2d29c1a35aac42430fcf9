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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestMmlVisitor = void 0;
var SerializedMmlVisitor_js_1 = require("./SerializedMmlVisitor.js");
var TestMmlVisitor = (function (_super) {
    __extends(TestMmlVisitor, _super);
    function TestMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestMmlVisitor.prototype.visitDefault = function (node, space) {
        var e_1, _a;
        var kind = node.kind;
        var _b = __read((node.isToken || node.childNodes.length === 0 ? ['', ''] : ['\n', space]), 2), nl = _b[0], endspace = _b[1];
        var mml = space + '<' + kind + this.getAttributes(node) +
            this.getInherited(node) + this.getProperties(node) + '\n' + space + '   ' +
            this.attributeString({
                isEmbellished: node.isEmbellished,
                isSpacelike: node.isSpacelike,
                texClass: node.texClass
            }, '{', '}') +
            '>' + nl;
        space += '  ';
        try {
            for (var _c = __values(node.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                mml += this.visitNode(child, space) + nl;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        mml += endspace + '</' + kind + '>';
        return mml;
    };
    TestMmlVisitor.prototype.getAttributes = function (node) {
        return this.attributeString(node.attributes.getAllAttributes(), '', '');
    };
    TestMmlVisitor.prototype.getInherited = function (node) {
        return this.attributeString(node.attributes.getAllInherited(), '[', ']');
    };
    TestMmlVisitor.prototype.getProperties = function (node) {
        return this.attributeString(node.getAllProperties(), '[[', ']]');
    };
    TestMmlVisitor.prototype.attributeString = function (attributes, open, close) {
        var e_2, _a;
        var ATTR = '';
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                ATTR += ' ' + open + name_1 + '="' + this.quoteHTML(String(attributes[name_1])) + '"' + close;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return ATTR;
    };
    return TestMmlVisitor;
}(SerializedMmlVisitor_js_1.SerializedMmlVisitor));
exports.TestMmlVisitor = TestMmlVisitor;
//# sourceMappingURL=TestMmlVisitor.js.map