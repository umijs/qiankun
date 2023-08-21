"use strict";
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
exports.MathMLCompile = void 0;
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var Options_js_1 = require("../../util/Options.js");
var Entities = __importStar(require("../../util/Entities.js"));
var MathMLCompile = (function () {
    function MathMLCompile(options) {
        if (options === void 0) { options = {}; }
        var Class = this.constructor;
        this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, Class.OPTIONS), options);
    }
    MathMLCompile.prototype.setMmlFactory = function (mmlFactory) {
        this.factory = mmlFactory;
    };
    MathMLCompile.prototype.compile = function (node) {
        var mml = this.makeNode(node);
        mml.verifyTree(this.options['verify']);
        mml.setInheritedAttributes({}, false, 0, false);
        mml.walkTree(this.markMrows);
        return mml;
    };
    MathMLCompile.prototype.makeNode = function (node) {
        var e_1, _a;
        var adaptor = this.adaptor;
        var limits = false;
        var kind = adaptor.kind(node).replace(/^.*:/, '');
        var texClass = adaptor.getAttribute(node, 'data-mjx-texclass') || '';
        if (texClass) {
            texClass = this.filterAttribute('data-mjx-texclass', texClass) || '';
        }
        var type = texClass && kind === 'mrow' ? 'TeXAtom' : kind;
        try {
            for (var _b = __values(this.filterClassList(adaptor.allClasses(node))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                if (name_1.match(/^MJX-TeXAtom-/) && kind === 'mrow') {
                    texClass = name_1.substr(12);
                    type = 'TeXAtom';
                }
                else if (name_1 === 'MJX-fixedlimits') {
                    limits = true;
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
        this.factory.getNodeClass(type) || this.error('Unknown node type "' + type + '"');
        var mml = this.factory.create(type);
        if (type === 'TeXAtom' && texClass === 'OP' && !limits) {
            mml.setProperty('movesupsub', true);
            mml.attributes.setInherited('movablelimits', true);
        }
        if (texClass) {
            mml.texClass = MmlNode_js_1.TEXCLASS[texClass];
            mml.setProperty('texClass', mml.texClass);
        }
        this.addAttributes(mml, node);
        this.checkClass(mml, node);
        this.addChildren(mml, node);
        return mml;
    };
    MathMLCompile.prototype.addAttributes = function (mml, node) {
        var e_2, _a;
        var ignoreVariant = false;
        try {
            for (var _b = __values(this.adaptor.allAttributes(node)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var attr = _c.value;
                var name_2 = attr.name;
                var value = this.filterAttribute(name_2, attr.value);
                if (value === null || name_2 === 'xmlns') {
                    continue;
                }
                if (name_2.substr(0, 9) === 'data-mjx-') {
                    switch (name_2.substr(9)) {
                        case 'alternate':
                            mml.setProperty('variantForm', true);
                            break;
                        case 'variant':
                            mml.attributes.set('mathvariant', value);
                            ignoreVariant = true;
                            break;
                        case 'smallmatrix':
                            mml.setProperty('scriptlevel', 1);
                            mml.setProperty('useHeight', false);
                            break;
                        case 'accent':
                            mml.setProperty('mathaccent', value === 'true');
                            break;
                        case 'auto-op':
                            mml.setProperty('autoOP', value === 'true');
                            break;
                        case 'script-align':
                            mml.setProperty('scriptalign', value);
                            break;
                    }
                }
                else if (name_2 !== 'class') {
                    var val = value.toLowerCase();
                    if (val === 'true' || val === 'false') {
                        mml.attributes.set(name_2, val === 'true');
                    }
                    else if (!ignoreVariant || name_2 !== 'mathvariant') {
                        mml.attributes.set(name_2, value);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    MathMLCompile.prototype.filterAttribute = function (_name, value) {
        return value;
    };
    MathMLCompile.prototype.filterClassList = function (list) {
        return list;
    };
    MathMLCompile.prototype.addChildren = function (mml, node) {
        var e_3, _a;
        if (mml.arity === 0) {
            return;
        }
        var adaptor = this.adaptor;
        try {
            for (var _b = __values(adaptor.childNodes(node)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var name_3 = adaptor.kind(child);
                if (name_3 === '#comment') {
                    continue;
                }
                if (name_3 === '#text') {
                    this.addText(mml, child);
                }
                else if (mml.isKind('annotation-xml')) {
                    mml.appendChild(this.factory.create('XML').setXML(child, adaptor));
                }
                else {
                    var childMml = mml.appendChild(this.makeNode(child));
                    if (childMml.arity === 0 && adaptor.childNodes(child).length) {
                        if (this.options['fixMisplacedChildren']) {
                            this.addChildren(mml, child);
                        }
                        else {
                            childMml.mError('There should not be children for ' + childMml.kind + ' nodes', this.options['verify'], true);
                        }
                    }
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
    };
    MathMLCompile.prototype.addText = function (mml, child) {
        var text = this.adaptor.value(child);
        if ((mml.isToken || mml.getProperty('isChars')) && mml.arity) {
            if (mml.isToken) {
                text = Entities.translate(text);
                text = this.trimSpace(text);
            }
            mml.appendChild(this.factory.create('text').setText(text));
        }
        else if (text.match(/\S/)) {
            this.error('Unexpected text node "' + text + '"');
        }
    };
    MathMLCompile.prototype.checkClass = function (mml, node) {
        var e_4, _a;
        var classList = [];
        try {
            for (var _b = __values(this.filterClassList(this.adaptor.allClasses(node))), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_4 = _c.value;
                if (name_4.substr(0, 4) === 'MJX-') {
                    if (name_4 === 'MJX-variant') {
                        mml.setProperty('variantForm', true);
                    }
                    else if (name_4.substr(0, 11) !== 'MJX-TeXAtom') {
                        mml.attributes.set('mathvariant', this.fixCalligraphic(name_4.substr(3)));
                    }
                }
                else {
                    classList.push(name_4);
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
        if (classList.length) {
            mml.attributes.set('class', classList.join(' '));
        }
    };
    MathMLCompile.prototype.fixCalligraphic = function (variant) {
        return variant.replace(/caligraphic/, 'calligraphic');
    };
    MathMLCompile.prototype.markMrows = function (mml) {
        if (mml.isKind('mrow') && !mml.isInferred && mml.childNodes.length >= 2) {
            var first = mml.childNodes[0];
            var last = mml.childNodes[mml.childNodes.length - 1];
            if (first.isKind('mo') && first.attributes.get('fence') && first.attributes.get('stretchy') &&
                last.isKind('mo') && last.attributes.get('fence') && last.attributes.get('stretchy')) {
                if (first.childNodes.length) {
                    mml.setProperty('open', first.getText());
                }
                if (last.childNodes.length) {
                    mml.setProperty('close', last.getText());
                }
            }
        }
    };
    MathMLCompile.prototype.trimSpace = function (text) {
        return text.replace(/[\t\n\r]/g, ' ')
            .replace(/^ +/, '')
            .replace(/ +$/, '')
            .replace(/  +/g, ' ');
    };
    MathMLCompile.prototype.error = function (message) {
        throw new Error(message);
    };
    MathMLCompile.OPTIONS = {
        MmlFactory: null,
        fixMisplacedChildren: true,
        verify: __assign({}, MmlNode_js_1.AbstractMmlNode.verifyDefaults),
        translateEntities: true
    };
    return MathMLCompile;
}());
exports.MathMLCompile = MathMLCompile;
//# sourceMappingURL=MathMLCompile.js.map