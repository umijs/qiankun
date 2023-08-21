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
exports.CHTMLTextNode = void 0;
var MmlNode_js_1 = require("../../../core/MmlTree/MmlNode.js");
var Wrapper_js_1 = require("../Wrapper.js");
var TextNode_js_1 = require("../../common/Wrappers/TextNode.js");
var CHTMLTextNode = (function (_super) {
    __extends(CHTMLTextNode, _super);
    function CHTMLTextNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLTextNode.prototype.toCHTML = function (parent) {
        var e_1, _a;
        this.markUsed();
        var adaptor = this.adaptor;
        var variant = this.parent.variant;
        var text = this.node.getText();
        if (text.length === 0)
            return;
        if (variant === '-explicitFont') {
            adaptor.append(parent, this.jax.unknownText(text, variant, this.getBBox().w));
        }
        else {
            var chars = this.remappedText(text, variant);
            try {
                for (var chars_1 = __values(chars), chars_1_1 = chars_1.next(); !chars_1_1.done; chars_1_1 = chars_1.next()) {
                    var n = chars_1_1.value;
                    var data = this.getVariantChar(variant, n)[3];
                    var font = (data.f ? ' TEX-' + data.f : '');
                    var node = (data.unknown ?
                        this.jax.unknownText(String.fromCodePoint(n), variant) :
                        this.html('mjx-c', { class: this.char(n) + font }));
                    adaptor.append(parent, node);
                    !data.unknown && this.font.charUsage.add([variant, n]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (chars_1_1 && !chars_1_1.done && (_a = chars_1.return)) _a.call(chars_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    CHTMLTextNode.kind = MmlNode_js_1.TextNode.prototype.kind;
    CHTMLTextNode.autoStyle = false;
    CHTMLTextNode.styles = {
        'mjx-c': {
            display: 'inline-block'
        },
        'mjx-utext': {
            display: 'inline-block',
            padding: '.75em 0 .2em 0'
        }
    };
    return CHTMLTextNode;
}((0, TextNode_js_1.CommonTextNodeMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLTextNode = CHTMLTextNode;
//# sourceMappingURL=TextNode.js.map