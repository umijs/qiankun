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
exports.AbstractMathList = void 0;
var LinkedList_js_1 = require("../util/LinkedList.js");
var AbstractMathList = (function (_super) {
    __extends(AbstractMathList, _super);
    function AbstractMathList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractMathList.prototype.isBefore = function (a, b) {
        return (a.start.i < b.start.i || (a.start.i === b.start.i && a.start.n < b.start.n));
    };
    return AbstractMathList;
}(LinkedList_js_1.LinkedList));
exports.AbstractMathList = AbstractMathList;
//# sourceMappingURL=MathList.js.map