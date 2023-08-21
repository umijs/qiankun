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
exports.MmlMtable = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var string_js_1 = require("../../../util/string.js");
var MmlMtable = (function (_super) {
    __extends(MmlMtable, _super);
    function MmlMtable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.properties = {
            useHeight: true
        };
        _this.texclass = MmlNode_js_1.TEXCLASS.ORD;
        return _this;
    }
    Object.defineProperty(MmlMtable.prototype, "kind", {
        get: function () {
            return 'mtable';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMtable.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlMtable.prototype.setInheritedAttributes = function (attributes, display, level, prime) {
        var e_1, _a;
        try {
            for (var indentAttributes_1 = __values(MmlNode_js_1.indentAttributes), indentAttributes_1_1 = indentAttributes_1.next(); !indentAttributes_1_1.done; indentAttributes_1_1 = indentAttributes_1.next()) {
                var name_1 = indentAttributes_1_1.value;
                if (attributes[name_1]) {
                    this.attributes.setInherited(name_1, attributes[name_1][1]);
                }
                if (this.attributes.getExplicit(name_1) !== undefined) {
                    delete (this.attributes.getAllAttributes())[name_1];
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (indentAttributes_1_1 && !indentAttributes_1_1.done && (_a = indentAttributes_1.return)) _a.call(indentAttributes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _super.prototype.setInheritedAttributes.call(this, attributes, display, level, prime);
    };
    MmlMtable.prototype.setChildInheritedAttributes = function (attributes, display, level, _prime) {
        var e_2, _a, e_3, _b;
        try {
            for (var _c = __values(this.childNodes), _d = _c.next(); !_d.done; _d = _c.next()) {
                var child = _d.value;
                if (!child.isKind('mtr')) {
                    this.replaceChild(this.factory.create('mtr'), child)
                        .appendChild(child);
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
        level = this.getProperty('scriptlevel') || level;
        display = !!(this.attributes.getExplicit('displaystyle') || this.attributes.getDefault('displaystyle'));
        attributes = this.addInheritedAttributes(attributes, {
            columnalign: this.attributes.get('columnalign'),
            rowalign: 'center'
        });
        var cramped = this.attributes.getExplicit('data-cramped');
        var ralign = (0, string_js_1.split)(this.attributes.get('rowalign'));
        try {
            for (var _e = __values(this.childNodes), _f = _e.next(); !_f.done; _f = _e.next()) {
                var child = _f.value;
                attributes.rowalign[1] = ralign.shift() || attributes.rowalign[1];
                child.setInheritedAttributes(attributes, display, level, !!cramped);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    MmlMtable.prototype.verifyChildren = function (options) {
        var mtr = null;
        var factory = this.factory;
        for (var i = 0; i < this.childNodes.length; i++) {
            var child = this.childNodes[i];
            if (child.isKind('mtr')) {
                mtr = null;
            }
            else {
                var isMtd = child.isKind('mtd');
                if (mtr) {
                    this.removeChild(child);
                    i--;
                }
                else {
                    mtr = this.replaceChild(factory.create('mtr'), child);
                }
                mtr.appendChild(isMtd ? child : factory.create('mtd', {}, [child]));
                if (!options['fixMtables']) {
                    child.parent.removeChild(child);
                    child.parent = this;
                    isMtd && mtr.appendChild(factory.create('mtd'));
                    var merror = child.mError('Children of ' + this.kind + ' must be mtr or mlabeledtr', options, isMtd);
                    mtr.childNodes[mtr.childNodes.length - 1].appendChild(merror);
                }
            }
        }
        _super.prototype.verifyChildren.call(this, options);
    };
    MmlMtable.prototype.setTeXclass = function (prev) {
        var e_4, _a;
        this.getPrevClass(prev);
        try {
            for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.setTeXclass(null);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return this;
    };
    MmlMtable.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlNode.defaults), { align: 'axis', rowalign: 'baseline', columnalign: 'center', groupalign: '{left}', alignmentscope: true, columnwidth: 'auto', width: 'auto', rowspacing: '1ex', columnspacing: '.8em', rowlines: 'none', columnlines: 'none', frame: 'none', framespacing: '0.4em 0.5ex', equalrows: false, equalcolumns: false, displaystyle: false, side: 'right', minlabelspacing: '0.8em' });
    return MmlMtable;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlMtable = MmlMtable;
//# sourceMappingURL=mtable.js.map