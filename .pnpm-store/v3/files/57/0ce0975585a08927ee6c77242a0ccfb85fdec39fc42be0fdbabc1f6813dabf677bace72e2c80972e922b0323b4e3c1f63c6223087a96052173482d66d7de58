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
exports.MmlMo = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var OperatorDictionary_js_1 = require("../OperatorDictionary.js");
var string_js_1 = require("../../../util/string.js");
var MmlMo = (function (_super) {
    __extends(MmlMo, _super);
    function MmlMo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._texClass = null;
        _this.lspace = 5 / 18;
        _this.rspace = 5 / 18;
        return _this;
    }
    Object.defineProperty(MmlMo.prototype, "texClass", {
        get: function () {
            if (this._texClass === null) {
                var mo = this.getText();
                var _a = __read(this.handleExplicitForm(this.getForms()), 3), form1 = _a[0], form2 = _a[1], form3 = _a[2];
                var OPTABLE_1 = this.constructor.OPTABLE;
                var def = OPTABLE_1[form1][mo] || OPTABLE_1[form2][mo] || OPTABLE_1[form3][mo];
                return def ? def[2] : MmlNode_js_1.TEXCLASS.REL;
            }
            return this._texClass;
        },
        set: function (value) {
            this._texClass = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMo.prototype, "kind", {
        get: function () {
            return 'mo';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMo.prototype, "isEmbellished", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMo.prototype, "hasNewLine", {
        get: function () {
            return this.attributes.get('linebreak') === 'newline';
        },
        enumerable: false,
        configurable: true
    });
    MmlMo.prototype.coreParent = function () {
        var embellished = this;
        var parent = this;
        var math = this.factory.getNodeClass('math');
        while (parent && parent.isEmbellished && parent.coreMO() === this && !(parent instanceof math)) {
            embellished = parent;
            parent = parent.parent;
        }
        return embellished;
    };
    MmlMo.prototype.coreText = function (parent) {
        if (!parent) {
            return '';
        }
        if (parent.isEmbellished) {
            return parent.coreMO().getText();
        }
        while ((((parent.isKind('mrow') ||
            (parent.isKind('TeXAtom') && parent.texClass !== MmlNode_js_1.TEXCLASS.VCENTER) ||
            parent.isKind('mstyle') ||
            parent.isKind('mphantom')) && parent.childNodes.length === 1) ||
            parent.isKind('munderover')) && parent.childNodes[0]) {
            parent = parent.childNodes[0];
        }
        return (parent.isToken ? parent.getText() : '');
    };
    MmlMo.prototype.hasSpacingAttributes = function () {
        return this.attributes.isSet('lspace') ||
            this.attributes.isSet('rspace');
    };
    Object.defineProperty(MmlMo.prototype, "isAccent", {
        get: function () {
            var accent = false;
            var node = this.coreParent().parent;
            if (node) {
                var key = (node.isKind('mover') ?
                    (node.childNodes[node.over].coreMO() ?
                        'accent' : '') :
                    node.isKind('munder') ?
                        (node.childNodes[node.under].coreMO() ?
                            'accentunder' : '') :
                        node.isKind('munderover') ?
                            (this === node.childNodes[node.over].coreMO() ?
                                'accent' :
                                this === node.childNodes[node.under].coreMO() ?
                                    'accentunder' : '') :
                            '');
                if (key) {
                    var value = node.attributes.getExplicit(key);
                    accent = (value !== undefined ? accent : this.attributes.get('accent'));
                }
            }
            return accent;
        },
        enumerable: false,
        configurable: true
    });
    MmlMo.prototype.setTeXclass = function (prev) {
        var _a = this.attributes.getList('form', 'fence'), form = _a.form, fence = _a.fence;
        if (this.getProperty('texClass') === undefined &&
            (this.attributes.isSet('lspace') || this.attributes.isSet('rspace'))) {
            return null;
        }
        if (fence && this.texClass === MmlNode_js_1.TEXCLASS.REL) {
            if (form === 'prefix') {
                this.texClass = MmlNode_js_1.TEXCLASS.OPEN;
            }
            if (form === 'postfix') {
                this.texClass = MmlNode_js_1.TEXCLASS.CLOSE;
            }
        }
        return this.adjustTeXclass(prev);
    };
    MmlMo.prototype.adjustTeXclass = function (prev) {
        var texClass = this.texClass;
        var prevClass = this.prevClass;
        if (texClass === MmlNode_js_1.TEXCLASS.NONE) {
            return prev;
        }
        if (prev) {
            if (prev.getProperty('autoOP') && (texClass === MmlNode_js_1.TEXCLASS.BIN || texClass === MmlNode_js_1.TEXCLASS.REL)) {
                prevClass = prev.texClass = MmlNode_js_1.TEXCLASS.ORD;
            }
            prevClass = this.prevClass = (prev.texClass || MmlNode_js_1.TEXCLASS.ORD);
            this.prevLevel = this.attributes.getInherited('scriptlevel');
        }
        else {
            prevClass = this.prevClass = MmlNode_js_1.TEXCLASS.NONE;
        }
        if (texClass === MmlNode_js_1.TEXCLASS.BIN &&
            (prevClass === MmlNode_js_1.TEXCLASS.NONE || prevClass === MmlNode_js_1.TEXCLASS.BIN || prevClass === MmlNode_js_1.TEXCLASS.OP ||
                prevClass === MmlNode_js_1.TEXCLASS.REL || prevClass === MmlNode_js_1.TEXCLASS.OPEN || prevClass === MmlNode_js_1.TEXCLASS.PUNCT)) {
            this.texClass = MmlNode_js_1.TEXCLASS.ORD;
        }
        else if (prevClass === MmlNode_js_1.TEXCLASS.BIN &&
            (texClass === MmlNode_js_1.TEXCLASS.REL || texClass === MmlNode_js_1.TEXCLASS.CLOSE || texClass === MmlNode_js_1.TEXCLASS.PUNCT)) {
            prev.texClass = this.prevClass = MmlNode_js_1.TEXCLASS.ORD;
        }
        else if (texClass === MmlNode_js_1.TEXCLASS.BIN) {
            var child = this;
            var parent_1 = this.parent;
            while (parent_1 && parent_1.parent && parent_1.isEmbellished &&
                (parent_1.childNodes.length === 1 ||
                    (!parent_1.isKind('mrow') && parent_1.core() === child))) {
                child = parent_1;
                parent_1 = parent_1.parent;
            }
            if (parent_1.childNodes[parent_1.childNodes.length - 1] === child) {
                this.texClass = MmlNode_js_1.TEXCLASS.ORD;
            }
        }
        return this;
    };
    MmlMo.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        if (attributes === void 0) { attributes = {}; }
        if (display === void 0) { display = false; }
        if (level === void 0) { level = 0; }
        if (prime === void 0) { prime = false; }
        _super.prototype.setInheritedAttributes.call(this, attributes, display, level, prime);
        var mo = this.getText();
        this.checkOperatorTable(mo);
        this.checkPseudoScripts(mo);
        this.checkPrimes(mo);
        this.checkMathAccent(mo);
    };
    MmlMo.prototype.checkOperatorTable = function (mo) {
        var e_1, _a;
        var _b = __read(this.handleExplicitForm(this.getForms()), 3), form1 = _b[0], form2 = _b[1], form3 = _b[2];
        this.attributes.setInherited('form', form1);
        var OPTABLE = this.constructor.OPTABLE;
        var def = OPTABLE[form1][mo] || OPTABLE[form2][mo] || OPTABLE[form3][mo];
        if (def) {
            if (this.getProperty('texClass') === undefined) {
                this.texClass = def[2];
            }
            try {
                for (var _c = __values(Object.keys(def[3] || {})), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_1 = _d.value;
                    this.attributes.setInherited(name_1, def[3][name_1]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.lspace = (def[0] + 1) / 18;
            this.rspace = (def[1] + 1) / 18;
        }
        else {
            var range = (0, OperatorDictionary_js_1.getRange)(mo);
            if (range) {
                if (this.getProperty('texClass') === undefined) {
                    this.texClass = range[2];
                }
                var spacing = this.constructor.MMLSPACING[range[2]];
                this.lspace = (spacing[0] + 1) / 18;
                this.rspace = (spacing[1] + 1) / 18;
            }
        }
    };
    MmlMo.prototype.getForms = function () {
        var core = this;
        var parent = this.parent;
        var Parent = this.Parent;
        while (Parent && Parent.isEmbellished) {
            core = parent;
            parent = Parent.parent;
            Parent = Parent.Parent;
        }
        if (parent && parent.isKind('mrow') && parent.nonSpaceLength() !== 1) {
            if (parent.firstNonSpace() === core) {
                return ['prefix', 'infix', 'postfix'];
            }
            if (parent.lastNonSpace() === core) {
                return ['postfix', 'infix', 'prefix'];
            }
        }
        return ['infix', 'prefix', 'postfix'];
    };
    MmlMo.prototype.handleExplicitForm = function (forms) {
        if (this.attributes.isSet('form')) {
            var form_1 = this.attributes.get('form');
            forms = [form_1].concat(forms.filter(function (name) { return (name !== form_1); }));
        }
        return forms;
    };
    MmlMo.prototype.checkPseudoScripts = function (mo) {
        var PSEUDOSCRIPTS = this.constructor.pseudoScripts;
        if (!mo.match(PSEUDOSCRIPTS))
            return;
        var parent = this.coreParent().Parent;
        var isPseudo = !parent || !(parent.isKind('msubsup') && !parent.isKind('msub'));
        this.setProperty('pseudoscript', isPseudo);
        if (isPseudo) {
            this.attributes.setInherited('lspace', 0);
            this.attributes.setInherited('rspace', 0);
        }
    };
    MmlMo.prototype.checkPrimes = function (mo) {
        var PRIMES = this.constructor.primes;
        if (!mo.match(PRIMES))
            return;
        var REMAP = this.constructor.remapPrimes;
        var primes = (0, string_js_1.unicodeString)((0, string_js_1.unicodeChars)(mo).map(function (c) { return REMAP[c]; }));
        this.setProperty('primes', primes);
    };
    MmlMo.prototype.checkMathAccent = function (mo) {
        var parent = this.Parent;
        if (this.getProperty('mathaccent') !== undefined || !parent || !parent.isKind('munderover'))
            return;
        var base = parent.childNodes[0];
        if (base.isEmbellished && base.coreMO() === this)
            return;
        var MATHACCENT = this.constructor.mathaccents;
        if (mo.match(MATHACCENT)) {
            this.setProperty('mathaccent', true);
        }
    };
    MmlMo.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlTokenNode.defaults), { form: 'infix', fence: false, separator: false, lspace: 'thickmathspace', rspace: 'thickmathspace', stretchy: false, symmetric: false, maxsize: 'infinity', minsize: '0em', largeop: false, movablelimits: false, accent: false, linebreak: 'auto', lineleading: '1ex', linebreakstyle: 'before', indentalign: 'auto', indentshift: '0', indenttarget: '', indentalignfirst: 'indentalign', indentshiftfirst: 'indentshift', indentalignlast: 'indentalign', indentshiftlast: 'indentshift' });
    MmlMo.MMLSPACING = OperatorDictionary_js_1.MMLSPACING;
    MmlMo.OPTABLE = OperatorDictionary_js_1.OPTABLE;
    MmlMo.pseudoScripts = new RegExp([
        '^["\'*`',
        '\u00AA',
        '\u00B0',
        '\u00B2-\u00B4',
        '\u00B9',
        '\u00BA',
        '\u2018-\u201F',
        '\u2032-\u2037\u2057',
        '\u2070\u2071',
        '\u2074-\u207F',
        '\u2080-\u208E',
        ']+$'
    ].join(''));
    MmlMo.primes = new RegExp([
        '^["\'`',
        '\u2018-\u201F',
        ']+$'
    ].join(''));
    MmlMo.remapPrimes = {
        0x0022: 0x2033,
        0x0027: 0x2032,
        0x0060: 0x2035,
        0x2018: 0x2035,
        0x2019: 0x2032,
        0x201A: 0x2032,
        0x201B: 0x2035,
        0x201C: 0x2036,
        0x201D: 0x2033,
        0x201E: 0x2033,
        0x201F: 0x2036,
    };
    MmlMo.mathaccents = new RegExp([
        '^[',
        '\u00B4\u0301\u02CA',
        '\u0060\u0300\u02CB',
        '\u00A8\u0308',
        '\u007E\u0303\u02DC',
        '\u00AF\u0304\u02C9',
        '\u02D8\u0306',
        '\u02C7\u030C',
        '\u005E\u0302\u02C6',
        '\u2192\u20D7',
        '\u02D9\u0307',
        '\u02DA\u030A',
        '\u20DB',
        '\u20DC',
        ']$'
    ].join(''));
    return MmlMo;
}(MmlNode_js_1.AbstractMmlTokenNode));
exports.MmlMo = MmlMo;
//# sourceMappingURL=mo.js.map