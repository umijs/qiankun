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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHTMLmfenced = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mfenced_js_1 = require("../../common/Wrappers/mfenced.js");
var mfenced_js_2 = require("../../../core/MmlTree/MmlNodes/mfenced.js");
var CHTMLmfenced = (function (_super) {
    __extends(CHTMLmfenced, _super);
    function CHTMLmfenced() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmfenced.prototype.toCHTML = function (parent) {
        var chtml = this.standardCHTMLnode(parent);
        this.mrow.toCHTML(chtml);
    };
    CHTMLmfenced.kind = mfenced_js_2.MmlMfenced.prototype.kind;
    return CHTMLmfenced;
}((0, mfenced_js_1.CommonMfencedMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmfenced = CHTMLmfenced;
//# sourceMappingURL=mfenced.js.map