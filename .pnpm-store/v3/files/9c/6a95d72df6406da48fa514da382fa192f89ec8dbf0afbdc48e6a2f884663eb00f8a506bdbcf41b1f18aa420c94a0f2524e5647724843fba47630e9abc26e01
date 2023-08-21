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
exports.MmlMath = void 0;
var MmlNode_js_1 = require("../MmlNode.js");
var MmlMath = (function (_super) {
    __extends(MmlMath, _super);
    function MmlMath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(MmlMath.prototype, "kind", {
        get: function () {
            return 'math';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MmlMath.prototype, "linebreakContainer", {
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    MmlMath.prototype.setChildInheritedAttributes = function (attributes, display, level, prime) {
        if (this.attributes.get('mode') === 'display') {
            this.attributes.setInherited('display', 'block');
        }
        attributes = this.addInheritedAttributes(attributes, this.attributes.getAllAttributes());
        display = (!!this.attributes.get('displaystyle') ||
            (!this.attributes.get('displaystyle') && this.attributes.get('display') === 'block'));
        this.attributes.setInherited('displaystyle', display);
        level = (this.attributes.get('scriptlevel') ||
            this.constructor.defaults['scriptlevel']);
        _super.prototype.setChildInheritedAttributes.call(this, attributes, display, level, prime);
    };
    MmlMath.defaults = __assign(__assign({}, MmlNode_js_1.AbstractMmlLayoutNode.defaults), { mathvariant: 'normal', mathsize: 'normal', mathcolor: '', mathbackground: 'transparent', dir: 'ltr', scriptlevel: 0, displaystyle: false, display: 'inline', maxwidth: '', overflow: 'linebreak', altimg: '', 'altimg-width': '', 'altimg-height': '', 'altimg-valign': '', alttext: '', cdgroup: '', scriptsizemultiplier: 1 / Math.sqrt(2), scriptminsize: '8px', infixlinebreakstyle: 'before', lineleading: '1ex', linebreakmultchar: '\u2062', indentshift: 'auto', indentalign: 'auto', indenttarget: '', indentalignfirst: 'indentalign', indentshiftfirst: 'indentshift', indentalignlast: 'indentalign', indentshiftlast: 'indentshift' });
    return MmlMath;
}(MmlNode_js_1.AbstractMmlLayoutNode));
exports.MmlMath = MmlMath;
//# sourceMappingURL=math.js.map