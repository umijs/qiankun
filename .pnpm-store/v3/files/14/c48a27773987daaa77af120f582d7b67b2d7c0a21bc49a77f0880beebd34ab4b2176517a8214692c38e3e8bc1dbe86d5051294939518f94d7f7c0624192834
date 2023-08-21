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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MmlNone = exports.MmlMprescripts = exports.MmlMmultiscripts = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var msubsup_js_1 = require("./msubsup.js");
var MmlMmultiscripts = (function (_super) {
    __extends(MmlMmultiscripts, _super);
    function MmlMmultiscripts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMmultiscripts.prototype, "kind", {
        get: function () {
            return 'mmultiscripts';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMmultiscripts.prototype, "arity", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    MmlMmultiscripts.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        this.childNodes[0].setInheritedAttributes(attributes, display, level, prime);
        var prescripts = false;
        for (var i = 1, n = 0; i < this.childNodes.length; i++) {
            var child = this.childNodes[i];
            if (child.isKind('mprescripts')) {
                if (!prescripts) {
                    prescripts = true;
                    if (i % 2 === 0) {
                        var mrow = this.factory.create('mrow');
                        this.childNodes.splice(i, 0, mrow);
                        mrow.parent = this;
                        i++;
                    }
                }
            }
            else {
                var primestyle = prime || (n % 2 === 0);
                child.setInheritedAttributes(attributes, false, level + 1, primestyle);
                n++;
            }
        }
        if (this.childNodes.length % 2 === (prescripts ? 1 : 0)) {
            this.appendChild(this.factory.create('mrow'));
            this.childNodes[this.childNodes.length - 1].setInheritedAttributes(attributes, false, level + 1, prime);
        }
    };
    MmlMmultiscripts.prototype.verifyChildren = function (options) {
        var prescripts = false;
        var fix = options['fixMmultiscripts'];
        for (var i = 0; i < this.childNodes.length; i++) {
            var child = this.childNodes[i];
            if (child.isKind('mprescripts')) {
                if (prescripts) {
                    child.mError(child.kind + ' can only appear once in ' + this.kind, options, true);
                }
                else {
                    prescripts = true;
                    if (i % 2 === 0 && !fix) {
                        this.mError('There must be an equal number of prescripts of each type', options);
                    }
                }
            }
        }
        if (this.childNodes.length % 2 === (prescripts ? 1 : 0) && !fix) {
            this.mError('There must be an equal number of scripts of each type', options);
        }
        _super.prototype.verifyChildren.call(this, options);
    };
    MmlMmultiscripts.defaults = __assign({}, msubsup_js_1.MmlMsubsup.defaults);
    return MmlMmultiscripts;
}(msubsup_js_1.MmlMsubsup));
exports.MmlMmultiscripts = MmlMmultiscripts;
var MmlMprescripts = (function (_super) {
    __extends(MmlMprescripts, _super);
    function MmlMprescripts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMprescripts.prototype, "kind", {
        get: function () {
            return 'mprescripts';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMprescripts.prototype, "arity", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    MmlMprescripts.prototype.verifyTree = function (options) {
        _super.prototype.verifyTree.call(this, options);
        if (this.parent && !this.parent.isKind('mmultiscripts')) {
            this.mError(this.kind + ' must be a child of mmultiscripts', options, true);
        }
    };
    MmlMprescripts.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults);
    return MmlMprescripts;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlMprescripts = MmlMprescripts;
var MmlNone = (function (_super) {
    __extends(MmlNone, _super);
    function MmlNone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlNone.prototype, "kind", {
        get: function () {
            return 'none';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlNone.prototype, "arity", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    MmlNone.prototype.verifyTree = function (options) {
        _super.prototype.verifyTree.call(this, options);
        if (this.parent && !this.parent.isKind('mmultiscripts')) {
            this.mError(this.kind + ' must be a child of mmultiscripts', options, true);
        }
    };
    MmlNone.defaults = __assign({}, MmlNode_js_1.AbstractMmlNode.defaults);
    return MmlNone;
}(MmlNode_js_1.AbstractMmlNode));
exports.MmlNone = MmlNone;
//# sourceMappingURL=mmultiscripts.js.map