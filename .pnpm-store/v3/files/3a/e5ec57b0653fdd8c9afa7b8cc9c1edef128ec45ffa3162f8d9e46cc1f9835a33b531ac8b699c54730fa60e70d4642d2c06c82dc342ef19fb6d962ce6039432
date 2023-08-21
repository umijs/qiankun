"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.LiteParser = exports.PATTERNS = void 0;
var Entities = __importStar(require("../../util/Entities.js"));
var Element_js_1 = require("./Element.js");
var Text_js_1 = require("./Text.js");
var PATTERNS;
(function (PATTERNS) {
    PATTERNS.TAGNAME = '[a-z][^\\s\\n>]*';
    PATTERNS.ATTNAME = '[a-z][^\\s\\n>=]*';
    PATTERNS.VALUE = "(?:'[^']*'|\"[^\"]*\"|[^\\s\\n]+)";
    PATTERNS.VALUESPLIT = "(?:'([^']*)'|\"([^\"]*)\"|([^\\s\\n]+))";
    PATTERNS.SPACE = '(?:\\s|\\n)+';
    PATTERNS.OPTIONALSPACE = '(?:\\s|\\n)*';
    PATTERNS.ATTRIBUTE = PATTERNS.ATTNAME + '(?:' + PATTERNS.OPTIONALSPACE + '=' + PATTERNS.OPTIONALSPACE + PATTERNS.VALUE + ')?';
    PATTERNS.ATTRIBUTESPLIT = '(' + PATTERNS.ATTNAME + ')(?:' + PATTERNS.OPTIONALSPACE + '=' + PATTERNS.OPTIONALSPACE + PATTERNS.VALUESPLIT + ')?';
    PATTERNS.TAG = '(<(?:' + PATTERNS.TAGNAME + '(?:' + PATTERNS.SPACE + PATTERNS.ATTRIBUTE + ')*'
        + PATTERNS.OPTIONALSPACE + '/?|/' + PATTERNS.TAGNAME + '|!--[^]*?--|![^]*?)(?:>|$))';
    PATTERNS.tag = new RegExp(PATTERNS.TAG, 'i');
    PATTERNS.attr = new RegExp(PATTERNS.ATTRIBUTE, 'i');
    PATTERNS.attrsplit = new RegExp(PATTERNS.ATTRIBUTESPLIT, 'i');
})(PATTERNS = exports.PATTERNS || (exports.PATTERNS = {}));
var LiteParser = (function () {
    function LiteParser() {
    }
    LiteParser.prototype.parseFromString = function (text, _format, adaptor) {
        if (_format === void 0) { _format = 'text/html'; }
        if (adaptor === void 0) { adaptor = null; }
        var root = adaptor.createDocument();
        var node = adaptor.body(root);
        var parts = text.replace(/<\?.*?\?>/g, '').split(PATTERNS.tag);
        while (parts.length) {
            var text_1 = parts.shift();
            var tag = parts.shift();
            if (text_1) {
                this.addText(adaptor, node, text_1);
            }
            if (tag && tag.charAt(tag.length - 1) === '>') {
                if (tag.charAt(1) === '!') {
                    this.addComment(adaptor, node, tag);
                }
                else if (tag.charAt(1) === '/') {
                    node = this.closeTag(adaptor, node, tag);
                }
                else {
                    node = this.openTag(adaptor, node, tag, parts);
                }
            }
        }
        this.checkDocument(adaptor, root);
        return root;
    };
    LiteParser.prototype.addText = function (adaptor, node, text) {
        text = Entities.translate(text);
        return adaptor.append(node, adaptor.text(text));
    };
    LiteParser.prototype.addComment = function (adaptor, node, comment) {
        return adaptor.append(node, new Text_js_1.LiteComment(comment));
    };
    LiteParser.prototype.closeTag = function (adaptor, node, tag) {
        var kind = tag.slice(2, tag.length - 1).toLowerCase();
        while (adaptor.parent(node) && adaptor.kind(node) !== kind) {
            node = adaptor.parent(node);
        }
        return adaptor.parent(node);
    };
    LiteParser.prototype.openTag = function (adaptor, node, tag, parts) {
        var PCDATA = this.constructor.PCDATA;
        var SELF_CLOSING = this.constructor.SELF_CLOSING;
        var kind = tag.match(/<(.*?)[\s\n>\/]/)[1].toLowerCase();
        var child = adaptor.node(kind);
        var attributes = tag.replace(/^<.*?[\s\n>]/, '').split(PATTERNS.attrsplit);
        if (attributes.pop().match(/>$/) || attributes.length < 5) {
            this.addAttributes(adaptor, child, attributes);
            adaptor.append(node, child);
            if (!SELF_CLOSING[kind] && !tag.match(/\/>$/)) {
                if (PCDATA[kind]) {
                    this.handlePCDATA(adaptor, child, kind, parts);
                }
                else {
                    node = child;
                }
            }
        }
        return node;
    };
    LiteParser.prototype.addAttributes = function (adaptor, node, attributes) {
        var CDATA_ATTR = this.constructor.CDATA_ATTR;
        while (attributes.length) {
            var _a = __read(attributes.splice(0, 5), 5), name_1 = _a[1], v1 = _a[2], v2 = _a[3], v3 = _a[4];
            var value = v1 || v2 || v3 || '';
            if (!CDATA_ATTR[name_1]) {
                value = Entities.translate(value);
            }
            adaptor.setAttribute(node, name_1, value);
        }
    };
    LiteParser.prototype.handlePCDATA = function (adaptor, node, kind, parts) {
        var pcdata = [];
        var etag = '</' + kind + '>';
        var ptag = '';
        while (parts.length && ptag !== etag) {
            pcdata.push(ptag);
            pcdata.push(parts.shift());
            ptag = parts.shift();
        }
        adaptor.append(node, adaptor.text(pcdata.join('')));
    };
    LiteParser.prototype.checkDocument = function (adaptor, root) {
        var e_1, _a, e_2, _b;
        var node = this.getOnlyChild(adaptor, adaptor.body(root));
        if (!node)
            return;
        try {
            for (var _c = __values(adaptor.childNodes(adaptor.body(root))), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                if (child === node) {
                    break;
                }
                if (child instanceof Text_js_1.LiteComment && child.value.match(/^<!DOCTYPE/)) {
                    root.type = child.value;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        switch (adaptor.kind(node)) {
            case 'html':
                try {
                    for (var _e = __values(node.children), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var child = _f.value;
                        switch (adaptor.kind(child)) {
                            case 'head':
                                root.head = child;
                                break;
                            case 'body':
                                root.body = child;
                                break;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                root.root = node;
                adaptor.remove(node);
                if (adaptor.parent(root.body) !== node) {
                    adaptor.append(node, root.body);
                }
                if (adaptor.parent(root.head) !== node) {
                    adaptor.insert(root.head, root.body);
                }
                break;
            case 'head':
                root.head = adaptor.replace(node, root.head);
                break;
            case 'body':
                root.body = adaptor.replace(node, root.body);
                break;
        }
    };
    LiteParser.prototype.getOnlyChild = function (adaptor, body) {
        var e_3, _a;
        var node = null;
        try {
            for (var _b = __values(adaptor.childNodes(body)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child instanceof Element_js_1.LiteElement) {
                    if (node)
                        return null;
                    node = child;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return node;
    };
    LiteParser.prototype.serialize = function (adaptor, node, xml) {
        var _this = this;
        if (xml === void 0) { xml = false; }
        var SELF_CLOSING = this.constructor.SELF_CLOSING;
        var CDATA = this.constructor.CDATA_ATTR;
        var tag = adaptor.kind(node);
        var attributes = adaptor.allAttributes(node).map(function (x) { return x.name + '="' + (CDATA[x.name] ? x.value : _this.protectAttribute(x.value)) + '"'; }).join(' ');
        var content = this.serializeInner(adaptor, node, xml);
        var html = '<' + tag + (attributes ? ' ' + attributes : '')
            + ((!xml || content) && !SELF_CLOSING[tag] ? ">".concat(content, "</").concat(tag, ">") : xml ? '/>' : '>');
        return html;
    };
    LiteParser.prototype.serializeInner = function (adaptor, node, xml) {
        var _this = this;
        if (xml === void 0) { xml = false; }
        var PCDATA = this.constructor.PCDATA;
        if (PCDATA.hasOwnProperty(node.kind)) {
            return adaptor.childNodes(node).map(function (x) { return adaptor.value(x); }).join('');
        }
        return adaptor.childNodes(node).map(function (x) {
            var kind = adaptor.kind(x);
            return (kind === '#text' ? _this.protectHTML(adaptor.value(x)) :
                kind === '#comment' ? x.value :
                    _this.serialize(adaptor, x, xml));
        }).join('');
    };
    LiteParser.prototype.protectAttribute = function (text) {
        if (typeof text !== 'string') {
            text = String(text);
        }
        return text.replace(/"/g, '&quot;');
    };
    LiteParser.prototype.protectHTML = function (text) {
        return text.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };
    LiteParser.SELF_CLOSING = {
        area: true,
        base: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        menuitem: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    };
    LiteParser.PCDATA = {
        option: true,
        textarea: true,
        fieldset: true,
        title: true,
        style: true,
        script: true
    };
    LiteParser.CDATA_ATTR = {
        style: true,
        datafld: true,
        datasrc: true,
        href: true,
        src: true,
        longdesc: true,
        usemap: true,
        cite: true,
        datetime: true,
        action: true,
        axis: true,
        profile: true,
        content: true,
        scheme: true
    };
    return LiteParser;
}());
exports.LiteParser = LiteParser;
//# sourceMappingURL=Parser.js.map