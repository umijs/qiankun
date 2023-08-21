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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializedMmlVisitor = exports.toEntity = exports.DATAMJX = void 0;
var MmlVisitor_js_1 = require("./MmlVisitor.js");
var MmlNode_js_1 = require("./MmlNode.js");
var mi_js_1 = require("./MmlNodes/mi.js");
exports.DATAMJX = 'data-mjx-';
var toEntity = function (c) { return '&#x' + c.codePointAt(0).toString(16).toUpperCase() + ';'; };
exports.toEntity = toEntity;
var SerializedMmlVisitor = (function (_super) {
    __extends(SerializedMmlVisitor, _super);
    function SerializedMmlVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SerializedMmlVisitor.prototype.visitTree = function (node) {
        return this.visitNode(node, '');
    };
    SerializedMmlVisitor.prototype.visitTextNode = function (node, _space) {
        return this.quoteHTML(node.getText());
    };
    SerializedMmlVisitor.prototype.visitXMLNode = function (node, space) {
        return space + node.getSerializedXML();
    };
    SerializedMmlVisitor.prototype.visitInferredMrowNode = function (node, space) {
        var e_1, _a;
        var mml = [];
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                mml.push(this.visitNode(child, space));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return mml.join('\n');
    };
    SerializedMmlVisitor.prototype.visitTeXAtomNode = function (node, space) {
        var children = this.childNodeMml(node, space + '  ', '\n');
        var mml = space + '<mrow' + this.getAttributes(node) + '>' +
            (children.match(/\S/) ? '\n' + children + space : '') + '</mrow>';
        return mml;
    };
    SerializedMmlVisitor.prototype.visitAnnotationNode = function (node, space) {
        return space + '<annotation' + this.getAttributes(node) + '>'
            + this.childNodeMml(node, '', '')
            + '</annotation>';
    };
    SerializedMmlVisitor.prototype.visitDefault = function (node, space) {
        var kind = node.kind;
        var _a = __read((node.isToken || node.childNodes.length === 0 ? ['', ''] : ['\n', space]), 2), nl = _a[0], endspace = _a[1];
        var children = this.childNodeMml(node, space + '  ', nl);
        return space + '<' + kind + this.getAttributes(node) + '>'
            + (children.match(/\S/) ? nl + children + endspace : '')
            + '</' + kind + '>';
    };
    SerializedMmlVisitor.prototype.childNodeMml = function (node, space, nl) {
        var e_2, _a;
        var mml = '';
        try {
            for (var _b = __values(node.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                mml += this.visitNode(child, space) + nl;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return mml;
    };
    SerializedMmlVisitor.prototype.getAttributes = function (node) {
        var e_3, _a;
        var attr = [];
        var defaults = this.constructor.defaultAttributes[node.kind] || {};
        var attributes = Object.assign({}, defaults, this.getDataAttributes(node), node.attributes.getAllAttributes());
        var variants = this.constructor.variants;
        if (attributes.hasOwnProperty('mathvariant') && variants.hasOwnProperty(attributes.mathvariant)) {
            attributes.mathvariant = variants[attributes.mathvariant];
        }
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                var value = String(attributes[name_1]);
                if (value === undefined)
                    continue;
                attr.push(name_1 + '="' + this.quoteHTML(value) + '"');
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return attr.length ? ' ' + attr.join(' ') : '';
    };
    SerializedMmlVisitor.prototype.getDataAttributes = function (node) {
        var data = {};
        var variant = node.attributes.getExplicit('mathvariant');
        var variants = this.constructor.variants;
        variant && variants.hasOwnProperty(variant) && this.setDataAttribute(data, 'variant', variant);
        node.getProperty('variantForm') && this.setDataAttribute(data, 'alternate', '1');
        node.getProperty('pseudoscript') && this.setDataAttribute(data, 'pseudoscript', 'true');
        node.getProperty('autoOP') === false && this.setDataAttribute(data, 'auto-op', 'false');
        var scriptalign = node.getProperty('scriptalign');
        scriptalign && this.setDataAttribute(data, 'script-align', scriptalign);
        var texclass = node.getProperty('texClass');
        if (texclass !== undefined) {
            var setclass = true;
            if (texclass === MmlNode_js_1.TEXCLASS.OP && node.isKind('mi')) {
                var name_2 = node.getText();
                setclass = !(name_2.length > 1 && name_2.match(mi_js_1.MmlMi.operatorName));
            }
            setclass && this.setDataAttribute(data, 'texclass', texclass < 0 ? 'NONE' : MmlNode_js_1.TEXCLASSNAMES[texclass]);
        }
        node.getProperty('scriptlevel') && node.getProperty('useHeight') === false &&
            this.setDataAttribute(data, 'smallmatrix', 'true');
        return data;
    };
    SerializedMmlVisitor.prototype.setDataAttribute = function (data, name, value) {
        data[exports.DATAMJX + name] = value;
    };
    SerializedMmlVisitor.prototype.quoteHTML = function (value) {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/[\uD800-\uDBFF]./g, exports.toEntity)
            .replace(/[\u0080-\uD7FF\uE000-\uFFFF]/g, exports.toEntity);
    };
    SerializedMmlVisitor.variants = {
        '-tex-calligraphic': 'script',
        '-tex-bold-calligraphic': 'bold-script',
        '-tex-oldstyle': 'normal',
        '-tex-bold-oldstyle': 'bold',
        '-tex-mathit': 'italic'
    };
    SerializedMmlVisitor.defaultAttributes = {
        math: {
            xmlns: 'http://www.w3.org/1998/Math/MathML'
        }
    };
    return SerializedMmlVisitor;
}(MmlVisitor_js_1.MmlVisitor));
exports.SerializedMmlVisitor = SerializedMmlVisitor;
//# sourceMappingURL=SerializedMmlVisitor.js.map