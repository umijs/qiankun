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
exports.MmlMsup = exports.MmlMsub = exports.MmlMsubsup = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMsubsup = (function (_super) {
    __extends(MmlMsubsup, _super);
    function MmlMsubsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMsubsup.prototype, "kind", {
        get: function () {
            return 'msubsup';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsubsup.prototype, "arity", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsubsup.prototype, "base", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsubsup.prototype, "sub", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsubsup.prototype, "sup", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    MmlMsubsup.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var nodes = this.childNodes;
        nodes[0].setInheritedAttributes(attributes, display, level, prime);
        nodes[1].setInheritedAttributes(attributes, false, level + 1, prime || this.sub === 1);
        if (!nodes[2]) {
            return;
        }
        nodes[2].setInheritedAttributes(attributes, false, level + 1, prime || this.sub === 2);
    };
    MmlMsubsup.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults), { subscriptshift: '', superscriptshift: '' });
    return MmlMsubsup;
}(MmlNode_js_1.AbstractMmlBaseNode));
exports.MmlMsubsup = MmlMsubsup;
var MmlMsub = (function (_super) {
    __extends(MmlMsub, _super);
    function MmlMsub() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMsub.prototype, "kind", {
        get: function () {
            return 'msub';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsub.prototype, "arity", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    MmlMsub.defaults = __assign({}, MmlMsubsup.defaults);
    return MmlMsub;
}(MmlMsubsup));
exports.MmlMsub = MmlMsub;
var MmlMsup = (function (_super) {
    __extends(MmlMsup, _super);
    function MmlMsup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMsup.prototype, "kind", {
        get: function () {
            return 'msup';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsup.prototype, "arity", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsup.prototype, "sup", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMsup.prototype, "sub", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    MmlMsup.defaults = __assign({}, MmlMsubsup.defaults);
    return MmlMsup;
}(MmlMsubsup));
exports.MmlMsup = MmlMsup;
//# sourceMappingURL=msubsup.js.map