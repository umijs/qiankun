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
exports.MmlMfenced = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMfenced = (function (_super) {
    __extends(MmlMfenced, _super);
    function MmlMfenced() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.texclass = MmlNode_js_1.TEXCLASS.INNER;
        _this.separators = [];
        _this.open = null;
        _this.close = null;
        return _this;
    }
    Object.defineProperty(MmlMfenced.prototype, "kind", {
        get: function () {
            return 'mfenced';
        },
        enumerable: false,
        configurable: true
    });
    MmlMfenced.prototype.setTeXclass = function (prev) {
        this.getPrevClass(prev);
        if (this.open) {
            prev = this.open.setTeXclass(prev);
        }
        if (this.childNodes[0]) {
            prev = this.childNodes[0].setTeXclass(prev);
        }
        for (var i = 1, m = this.childNodes.length; i < m; i++) {
            if (this.separators[i - 1]) {
                prev = this.separators[i - 1].setTeXclass(prev);
            }
            if (this.childNodes[i]) {
                prev = this.childNodes[i].setTeXclass(prev);
            }
        }
        if (this.close) {
            prev = this.close.setTeXclass(prev);
        }
        this.updateTeXclass(this.open);
        return prev;
    };
    MmlMfenced.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var e_1, _a;
        this.addFakeNodes();
        try {
            for (var _b = __values([this.open, this.close].concat(this.separators)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                if (child) {
                    child.setInheritedAttributes(attributes, display, level, prime);
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
        _super.prototype.setChildInheritedAttributes.call(this, attributes, display, level, prime);
    };
    MmlMfenced.prototype.addFakeNodes = function () {
        var e_2, _a;
        var _b = this.attributes.getList('open', 'close', 'separators'), open = _b.open, close = _b.close, separators = _b.separators;
        open = open.replace(/[ \t\n\r]/g, '');
        close = close.replace(/[ \t\n\r]/g, '');
        separators = separators.replace(/[ \t\n\r]/g, '');
        if (open) {
            this.open = this.fakeNode(open, { fence: true, form: 'prefix' }, MmlNode_js_1.TEXCLASS.OPEN);
        }
        if (separators) {
            while (separators.length < this.childNodes.length - 1) {
                separators += separators.charAt(separators.length - 1);
            }
            var i = 0;
            try {
                for (var _c = __values(this.childNodes.slice(1)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var child = _d.value;
                    if (child) {
                        this.separators.push(this.fakeNode(separators.charAt(i++)));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (close) {
            this.close = this.fakeNode(close, { fence: true, form: 'postfix' }, MmlNode_js_1.TEXCLASS.CLOSE);
        }
    };
    MmlMfenced.prototype.fakeNode = function (c, properties, texClass) {
        if (properties === void 0) { properties = {}; }
        if (texClass === void 0) { texClass = null; }
        var text = this.factory.create('text').setText(c);
        var node = this.factory.create('mo', properties, [text]);
        node.texClass = texClass;
        node.parent = this;
        return node;
    };
    MmlMfenced.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlNode.defaults), { open: '(', close: ')', separators: ',' });
    return MmlMfenced;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlMfenced = MmlMfenced;
//# sourceMappingURL=mfenced.js.map