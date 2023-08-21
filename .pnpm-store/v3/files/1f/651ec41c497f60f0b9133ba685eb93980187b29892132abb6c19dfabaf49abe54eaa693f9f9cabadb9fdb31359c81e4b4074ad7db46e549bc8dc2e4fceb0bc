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
exports.XMLNode = exports.TextNode = exports.AbstractMmlEmptyNode = exports.AbstractMmlBaseNode = exports.AbstractMmlLayoutNode = exports.AbstractMmlTokenNode = exports.AbstractMmlNode = exports.indentAttributes = exports.TEXCLASSNAMES = exports.TEXCLASS = void 0;
var Attributes_js_1 = require("./Attributes.js");
var Node_js_1 = require("../Tree/Node.js");
exports.TEXCLASS = {
    ORD: 0,
    OP: 1,
    BIN: 2,
    REL: 3,
    OPEN: 4,
    CLOSE: 5,
    PUNCT: 6,
    INNER: 7,
    VCENTER: 8,
    NONE: -1
};
exports.TEXCLASSNAMES = ['ORD', 'OP', 'BIN', 'REL', 'OPEN', 'CLOSE', 'PUNCT', 'INNER', 'VCENTER'];
var TEXSPACELENGTH = ['', 'thinmathspace', 'mediummathspace', 'thickmathspace'];
var TEXSPACE = [
    [0, -1, 2, 3, 0, 0, 0, 1],
    [-1, -1, 0, 3, 0, 0, 0, 1],
    [2, 2, 0, 0, 2, 0, 0, 2],
    [3, 3, 0, 0, 3, 0, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, -1, 2, 3, 0, 0, 0, 1],
    [1, 1, 0, 1, 1, 1, 1, 1],
    [1, -1, 2, 3, 1, 0, 1, 1]
];
exports.indentAttributes = [
    'indentalign', 'indentalignfirst',
    'indentshift', 'indentshiftfirst'
];
var AbstractMmlNode = (function (_super) {
    __extends(AbstractMmlNode, _super);
    function AbstractMmlNode(factory, attributes, children) {
        if (attributes === void 0) { attributes = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, factory) || this;
        _this.prevClass = null;
        _this.prevLevel = null;
        _this.texclass = null;
        if (_this.arity < 0) {
            _this.childNodes = [factory.create('inferredMrow')];
            _this.childNodes[0].parent = _this;
        }
        _this.setChildren(children);
        _this.attributes = new Attributes_js_1.Attributes(factory.getNodeClass(_this.kind).defaults, factory.getNodeClass('math').defaults);
        _this.attributes.setList(attributes);
        return _this;
    }
    AbstractMmlNode.prototype.copy = function (keepIds) {
        var e_1, _a, e_2, _b;
        if (keepIds === void 0) { keepIds = false; }
        var node = this.factory.create(this.kind);
        node.properties = __assign({}, this.properties);
        if (this.attributes) {
            var attributes = this.attributes.getAllAttributes();
            try {
                for (var _c = __values(Object.keys(attributes)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_1 = _d.value;
                    if (name_1 !== 'id' || keepIds) {
                        node.attributes.set(name_1, attributes[name_1]);
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
        }
        if (this.childNodes && this.childNodes.length) {
            var children = this.childNodes;
            if (children.length === 1 && children[0].isInferred) {
                children = children[0].childNodes;
            }
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var child = children_1_1.value;
                    if (child) {
                        node.appendChild(child.copy());
                    }
                    else {
                        node.childNodes.push(null);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_b = children_1.return)) _b.call(children_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return node;
    };
    Object.defineProperty(AbstractMmlNode.prototype, "texClass", {
        get: function () {
            return this.texclass;
        },
        set: function (texClass) {
            this.texclass = texClass;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isToken", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isEmbellished", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isSpacelike", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "linebreakContainer", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "hasNewLine", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "arity", {
        get: function () {
            return Infinity;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "isInferred", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "Parent", {
        get: function () {
            var parent = this.parent;
            while (parent && parent.notParent) {
                parent = parent.Parent;
            }
            return parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlNode.prototype, "notParent", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlNode.prototype.setChildren = function (children) {
        if (this.arity < 0) {
            return this.childNodes[0].setChildren(children);
        }
        return _super.prototype.setChildren.call(this, children);
    };
    AbstractMmlNode.prototype.appendChild = function (child) {
        var e_3, _a;
        var _this = this;
        if (this.arity < 0) {
            this.childNodes[0].appendChild(child);
            return child;
        }
        if (child.isInferred) {
            if (this.arity === Infinity) {
                child.childNodes.forEach(function (node) { return _super.prototype.appendChild.call(_this, node); });
                return child;
            }
            var original = child;
            child = this.factory.create('mrow');
            child.setChildren(original.childNodes);
            child.attributes = original.attributes;
            try {
                for (var _b = __values(original.getPropertyNames()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_2 = _c.value;
                    child.setProperty(name_2, original.getProperty(name_2));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return _super.prototype.appendChild.call(this, child);
    };
    AbstractMmlNode.prototype.replaceChild = function (newChild, oldChild) {
        if (this.arity < 0) {
            this.childNodes[0].replaceChild(newChild, oldChild);
            return newChild;
        }
        return _super.prototype.replaceChild.call(this, newChild, oldChild);
    };
    AbstractMmlNode.prototype.core = function () {
        return this;
    };
    AbstractMmlNode.prototype.coreMO = function () {
        return this;
    };
    AbstractMmlNode.prototype.coreIndex = function () {
        return 0;
    };
    AbstractMmlNode.prototype.childPosition = function () {
        var e_4, _a;
        var child = this;
        var parent = child.parent;
        while (parent && parent.notParent) {
            child = parent;
            parent = parent.parent;
        }
        if (parent) {
            var i = 0;
            try {
                for (var _b = __values(parent.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var node = _c.value;
                    if (node === child) {
                        return i;
                    }
                    i++;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        }
        return null;
    };
    AbstractMmlNode.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        return (this.texClass != null ? this : prev);
    };
    AbstractMmlNode.prototype.updateTeXclass = function (core) {
        if (core) {
            this.prevClass = core.prevClass;
            this.prevLevel = core.prevLevel;
            core.prevClass = core.prevLevel = null;
            this.texClass = core.texClass;
        }
    };
    AbstractMmlNode.prototype.getPrevClass = function (prev) {
        if (prev) {
            this.prevClass = prev.texClass;
            this.prevLevel = prev.attributes.get('scriptlevel');
        }
    };
    AbstractMmlNode.prototype.texSpacing = function () {
        var prevClass = (this.prevClass != null ? this.prevClass : exports.TEXCLASS.NONE);
        var texClass = this.texClass || exports.TEXCLASS.ORD;
        if (prevClass === exports.TEXCLASS.NONE || texClass === exports.TEXCLASS.NONE) {
            return '';
        }
        if (prevClass === exports.TEXCLASS.VCENTER) {
            prevClass = exports.TEXCLASS.ORD;
        }
        if (texClass === exports.TEXCLASS.VCENTER) {
            texClass = exports.TEXCLASS.ORD;
        }
        var space = TEXSPACE[prevClass][texClass];
        if ((this.prevLevel > 0 || this.attributes.get('scriptlevel') > 0) && space >= 0) {
            return '';
        }
        return TEXSPACELENGTH[Math.abs(space)];
    };
    AbstractMmlNode.prototype.hasSpacingAttributes = function () {
        return this.isEmbellished && this.coreMO().hasSpacingAttributes();
    };
    AbstractMmlNode.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        var e_5, _a;
        if (attributes === void 0) { attributes = {}; }
        if (display === void 0) { display = false; }
        if (level === void 0) { level = 0; }
        if (prime === void 0) { prime = false; }
        var defaults = this.attributes.getAllDefaults();
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (defaults.hasOwnProperty(key) || AbstractMmlNode.alwaysInherit.hasOwnProperty(key)) {
                    var _d = __read(attributes[key], 2), node = _d[0], value = _d[1];
                    var noinherit = (AbstractMmlNode.noInherit[node] || {})[this.kind] || {};
                    if (!noinherit[key]) {
                        this.attributes.setInherited(key, value);
                    }
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
        var displaystyle = this.attributes.getExplicit('displaystyle');
        if (displaystyle === undefined) {
            this.attributes.setInherited('displaystyle', display);
        }
        var scriptlevel = this.attributes.getExplicit('scriptlevel');
        if (scriptlevel === undefined) {
            this.attributes.setInherited('scriptlevel', level);
        }
        if (prime) {
            this.setProperty('texprimestyle', prime);
        }
        var arity = this.arity;
        if (arity >= 0 && arity !== Infinity && ((arity === 1 && this.childNodes.length === 0) ||
            (arity !== 1 && this.childNodes.length !== arity))) {
            if (arity < this.childNodes.length) {
                this.childNodes = this.childNodes.slice(0, arity);
            }
            else {
                while (this.childNodes.length < arity) {
                    this.appendChild(this.factory.create('mrow'));
                }
            }
        }
        this.setChildInheritedAttributes(attributes, display, level, prime);
    };
    AbstractMmlNode.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var e_6, _a;
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.setInheritedAttributes(attributes, display, level, prime);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    AbstractMmlNode.prototype.addInheritedAttributes = function (current, attributes) {
        var e_7, _a;
        var updated = __assign({}, current);
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_3 = _c.value;
                if (name_3 !== 'displaystyle' && name_3 !== 'scriptlevel' && name_3 !== 'style') {
                    updated[name_3] = [this.kind, attributes[name_3]];
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        return updated;
    };
    AbstractMmlNode.prototype.inheritAttributesFrom = function (node) {
        var attributes = node.attributes;
        var display = attributes.get('displaystyle');
        var scriptlevel = attributes.get('scriptlevel');
        var defaults = (!attributes.isSet('mathsize') ? {} : {
            mathsize: ['math', attributes.get('mathsize')]
        });
        var prime = node.getProperty('texprimestyle') || false;
        this.setInheritedAttributes(defaults, display, scriptlevel, prime);
    };
    AbstractMmlNode.prototype.verifyTree = function (options) {
        if (options === void 0) { options = null; }
        if (options === null) {
            return;
        }
        this.verifyAttributes(options);
        var arity = this.arity;
        if (options['checkArity']) {
            if (arity >= 0 && arity !== Infinity &&
                ((arity === 1 && this.childNodes.length === 0) ||
                    (arity !== 1 && this.childNodes.length !== arity))) {
                this.mError('Wrong number of children for "' + this.kind + '" node', options, true);
            }
        }
        this.verifyChildren(options);
    };
    AbstractMmlNode.prototype.verifyAttributes = function (options) {
        var e_8, _a;
        if (options['checkAttributes']) {
            var attributes = this.attributes;
            var bad = [];
            try {
                for (var _b = __values(attributes.getExplicitNames()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var name_4 = _c.value;
                    if (name_4.substr(0, 5) !== 'data-' && attributes.getDefault(name_4) === undefined &&
                        !name_4.match(/^(?:class|style|id|(?:xlink:)?href)$/)) {
                        bad.push(name_4);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            if (bad.length) {
                this.mError('Unknown attributes for ' + this.kind + ' node: ' + bad.join(', '), options);
            }
        }
    };
    AbstractMmlNode.prototype.verifyChildren = function (options) {
        var e_9, _a;
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.verifyTree(options);
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    AbstractMmlNode.prototype.mError = function (message, options, short) {
        if (short === void 0) { short = false; }
        if (this.parent && this.parent.isKind('merror')) {
            return null;
        }
        var merror = this.factory.create('merror');
        merror.attributes.set('data-mjx-message', message);
        if (options['fullErrors'] || short) {
            var mtext = this.factory.create('mtext');
            var text = this.factory.create('text');
            text.setText(options['fullErrors'] ? message : this.kind);
            mtext.appendChild(text);
            merror.appendChild(mtext);
            this.parent.replaceChild(merror, this);
        }
        else {
            this.parent.replaceChild(merror, this);
            merror.appendChild(this);
        }
        return merror;
    };
    AbstractMmlNode.defaults = {
        mathbackground: Attributes_js_1.INHERIT,
        mathcolor: Attributes_js_1.INHERIT,
        mathsize: Attributes_js_1.INHERIT,
        dir: Attributes_js_1.INHERIT
    };
    AbstractMmlNode.noInherit = {
        mstyle: {
            mpadded: { width: true, height: true, depth: true, lspace: true, voffset: true },
            mtable: { width: true, height: true, depth: true, align: true }
        },
        maligngroup: {
            mrow: { groupalign: true },
            mtable: { groupalign: true }
        }
    };
    AbstractMmlNode.alwaysInherit = {
        scriptminsize: true,
        scriptsizemultiplier: true
    };
    AbstractMmlNode.verifyDefaults = {
        checkArity: true,
        checkAttributes: false,
        fullErrors: false,
        fixMmultiscripts: true,
        fixMtables: true
    };
    return AbstractMmlNode;
}(Node_js_1.AbstractNode));
exports.AbstractMmlNode = AbstractMmlNode;
var AbstractMmlTokenNode = (function (_super) {
    __extends(AbstractMmlTokenNode, _super);
    function AbstractMmlTokenNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlTokenNode.prototype, "isToken", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlTokenNode.prototype.getText = function () {
        var e_10, _a;
        var text = '';
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child instanceof TextNode) {
                    text += child.getText();
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_10) throw e_10.error; }
        }
        return text;
    };
    AbstractMmlTokenNode.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var e_11, _a;
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child instanceof AbstractMmlNode) {
                    child.setInheritedAttributes(attributes, display, level, prime);
                }
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    AbstractMmlTokenNode.prototype.walkTree = function (func, data) {
        var e_12, _a;
        func(this, data);
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child instanceof AbstractMmlNode) {
                    child.walkTree(func, data);
                }
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        return data;
    };
    AbstractMmlTokenNode.defaults = __assign(__assign({}, AbstractMmlNode.defaults), { mathvariant: 'normal', mathsize: Attributes_js_1.INHERIT });
    return AbstractMmlTokenNode;
}(AbstractMmlNode));
exports.AbstractMmlTokenNode = AbstractMmlTokenNode;
var AbstractMmlLayoutNode = (function (_super) {
    __extends(AbstractMmlLayoutNode, _super);
    function AbstractMmlLayoutNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "isSpacelike", {
        get: function () {
            return this.childNodes[0].isSpacelike;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "isEmbellished", {
        get: function () {
            return this.childNodes[0].isEmbellished;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlLayoutNode.prototype, "arity", {
        get: function () {
            return -1;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlLayoutNode.prototype.core = function () {
        return this.childNodes[0];
    };
    AbstractMmlLayoutNode.prototype.coreMO = function () {
        return this.childNodes[0].coreMO();
    };
    AbstractMmlLayoutNode.prototype.setTeXclass = function (prev) {
        prev = this.childNodes[0].setTeXclass(prev);
        this.updateTeXclass(this.childNodes[0]);
        return prev;
    };
    AbstractMmlLayoutNode.defaults = AbstractMmlNode.defaults;
    return AbstractMmlLayoutNode;
}(AbstractMmlNode));
exports.AbstractMmlLayoutNode = AbstractMmlLayoutNode;
var AbstractMmlBaseNode = (function (_super) {
    __extends(AbstractMmlBaseNode, _super);
    function AbstractMmlBaseNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlBaseNode.prototype, "isEmbellished", {
        get: function () {
            return this.childNodes[0].isEmbellished;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlBaseNode.prototype.core = function () {
        return this.childNodes[0];
    };
    AbstractMmlBaseNode.prototype.coreMO = function () {
        return this.childNodes[0].coreMO();
    };
    AbstractMmlBaseNode.prototype.setTeXclass = function (prev) {
        var e_13, _a;
        this.getPrevClass(prev);
        this.texClass = exports.TEXCLASS.ORD;
        var base = this.childNodes[0];
        if (base) {
            if (this.isEmbellished || base.isKind('mi')) {
                prev = base.setTeXclass(prev);
                this.updateTeXclass(this.core());
            }
            else {
                base.setTeXclass(null);
                prev = this;
            }
        }
        else {
            prev = this;
        }
        try {
            for (var _b = __values(this.childNodes.slice(1)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child) {
                    child.setTeXclass(null);
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        return prev;
    };
    AbstractMmlBaseNode.defaults = AbstractMmlNode.defaults;
    return AbstractMmlBaseNode;
}(AbstractMmlNode));
exports.AbstractMmlBaseNode = AbstractMmlBaseNode;
var AbstractMmlEmptyNode = (function (_super) {
    __extends(AbstractMmlEmptyNode, _super);
    function AbstractMmlEmptyNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isToken", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isEmbellished", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isSpacelike", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "linebreakContainer", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "hasNewLine", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "arity", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "isInferred", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "notParent", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "Parent", {
        get: function () {
            return this.parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "texClass", {
        get: function () {
            return exports.TEXCLASS.NONE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "prevClass", {
        get: function () {
            return exports.TEXCLASS.NONE;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "prevLevel", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlEmptyNode.prototype.hasSpacingAttributes = function () {
        return false;
    };
    Object.defineProperty(AbstractMmlEmptyNode.prototype, "attributes", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    AbstractMmlEmptyNode.prototype.core = function () {
        return this;
    };
    AbstractMmlEmptyNode.prototype.coreMO = function () {
        return this;
    };
    AbstractMmlEmptyNode.prototype.coreIndex = function () {
        return 0;
    };
    AbstractMmlEmptyNode.prototype.childPosition = function () {
        return 0;
    };
    AbstractMmlEmptyNode.prototype.setTeXclass = function (prev) {
        return prev;
    };
    AbstractMmlEmptyNode.prototype.texSpacing = function () {
        return '';
    };
    AbstractMmlEmptyNode.prototype.setInheritedAttributes = function (_attributes, _display, _level, _prime) { };
    AbstractMmlEmptyNode.prototype.inheritAttributesFrom = function (_node) { };
    AbstractMmlEmptyNode.prototype.verifyTree = function (_options) { };
    AbstractMmlEmptyNode.prototype.mError = function (_message, _options, _short) {
        if (_short === void 0) { _short = false; }
        return null;
    };
    return AbstractMmlEmptyNode;
}(Node_js_1.AbstractEmptyNode));
exports.AbstractMmlEmptyNode = AbstractMmlEmptyNode;
var TextNode = (function (_super) {
    __extends(TextNode, _super);
    function TextNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = '';
        return _this;
    }
    Object.defineProperty(TextNode.prototype, "kind", {
        get: function () {
            return 'text';
        },
        enumerable: false,
        configurable: true
    });
    TextNode.prototype.getText = function () {
        return this.text;
    };
    TextNode.prototype.setText = function (text) {
        this.text = text;
        return this;
    };
    TextNode.prototype.copy = function () {
        return this.factory.create(this.kind).setText(this.getText());
    };
    TextNode.prototype.toString = function () {
        return this.text;
    };
    return TextNode;
}(AbstractMmlEmptyNode));
exports.TextNode = TextNode;
var XMLNode = (function (_super) {
    __extends(XMLNode, _super);
    function XMLNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.xml = null;
        _this.adaptor = null;
        return _this;
    }
    Object.defineProperty(XMLNode.prototype, "kind", {
        get: function () {
            return 'XML';
        },
        enumerable: false,
        configurable: true
    });
    XMLNode.prototype.getXML = function () {
        return this.xml;
    };
    XMLNode.prototype.setXML = function (xml, adaptor) {
        if (adaptor === void 0) { adaptor = null; }
        this.xml = xml;
        this.adaptor = adaptor;
        return this;
    };
    XMLNode.prototype.getSerializedXML = function () {
        return this.adaptor.serializeXML(this.xml);
    };
    XMLNode.prototype.copy = function () {
        return this.factory.create(this.kind).setXML(this.adaptor.clone(this.xml));
    };
    XMLNode.prototype.toString = function () {
        return 'XML data';
    };
    return XMLNode;
}(AbstractMmlEmptyNode));
exports.XMLNode = XMLNode;
//# sourceMappingURL=MmlNode.js.map