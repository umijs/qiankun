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
exports.MmlMover = exports.MmlMunder = exports.MmlMunderover = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMunderover = (function (_super) {
    __extends(MmlMunderover, _super);
    function MmlMunderover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMunderover.prototype, "kind", {
        get: function () {
            return 'munderover';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunderover.prototype, "arity", {
        get: function () {
            return 3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunderover.prototype, "base", {
        get: function () {
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunderover.prototype, "under", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunderover.prototype, "over", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunderover.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlMunderover.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        var nodes = this.childNodes;
        nodes[0].setInheritedAttributes(attributes, display, level, prime || !!nodes[this.over]);
        var force = !!(!display && nodes[0].coreMO().attributes.get('movablelimits'));
        var ACCENTS = this.constructor.ACCENTS;
        nodes[1].setInheritedAttributes(attributes, false, this.getScriptlevel(ACCENTS[1], force, level), prime || this.under === 1);
        this.setInheritedAccent(1, ACCENTS[1], display, level, prime, force);
        if (!nodes[2]) {
            return;
        }
        nodes[2].setInheritedAttributes(attributes, false, this.getScriptlevel(ACCENTS[2], force, level), prime || this.under === 2);
        this.setInheritedAccent(2, ACCENTS[2], display, level, prime, force);
    };
    MmlMunderover.prototype.getScriptlevel = function (accent, force, level) {
        if (force || !this.attributes.get(accent)) {
            level++;
        }
        return level;
    };
    MmlMunderover.prototype.setInheritedAccent = function (n, accent, display, level, prime, force) {
        var node = this.childNodes[n];
        if (this.attributes.getExplicit(accent) == null && node.isEmbellished) {
            var value = node.coreMO().attributes.get('accent');
            this.attributes.setInherited(accent, value);
            if (value !== this.attributes.getDefault(accent)) {
                node.setInheritedAttributes({}, display, this.getScriptlevel(accent, force, level), prime);
            }
        }
    };
    MmlMunderover.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlBaseNode.defaults), { accent: false, accentunder: false, align: 'center' });
    MmlMunderover.ACCENTS = ['', 'accentunder', 'accent'];
    return MmlMunderover;
}(MmlNode_js_1.AbstractMmlBaseNode));
exports.MmlMunderover = MmlMunderover;
var MmlMunder = (function (_super) {
    __extends(MmlMunder, _super);
    function MmlMunder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMunder.prototype, "kind", {
        get: function () {
            return 'munder';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMunder.prototype, "arity", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    MmlMunder.defaults = __assign({}, MmlMunderover.defaults);
    return MmlMunder;
}(MmlMunderover));
exports.MmlMunder = MmlMunder;
var MmlMover = (function (_super) {
    __extends(MmlMover, _super);
    function MmlMover() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMover.prototype, "kind", {
        get: function () {
            return 'mover';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMover.prototype, "arity", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMover.prototype, "over", {
        get: function () {
            return 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMover.prototype, "under", {
        get: function () {
            return 2;
        },
        enumerable: false,
        configurable: true
    });
    MmlMover.defaults = __assign({}, MmlMunderover.defaults);
    MmlMover.ACCENTS = ['', 'accent', 'accentunder'];
    return MmlMover;
}(MmlMunderover));
exports.MmlMover = MmlMover;
//# sourceMappingURL=munderover.js.map