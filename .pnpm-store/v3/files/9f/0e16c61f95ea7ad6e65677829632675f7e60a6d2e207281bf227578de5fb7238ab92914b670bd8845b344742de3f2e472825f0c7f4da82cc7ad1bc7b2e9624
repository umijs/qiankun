"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractPostable = void 0;
var menu_element_js_1 = require("./menu_element.js");
var AbstractPostable = (function (_super) {
    __extends(AbstractPostable, _super);
    function AbstractPostable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.posted = false;
        return _this;
    }
    AbstractPostable.prototype.isPosted = function () {
        return this.posted;
    };
    AbstractPostable.prototype.post = function (x, y) {
        if (this.posted) {
            return;
        }
        if (typeof (x) !== 'undefined' && typeof (y) !== 'undefined') {
            this.html.setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px;');
        }
        this.display();
        this.posted = true;
    };
    AbstractPostable.prototype.unpost = function () {
        if (!this.posted) {
            return;
        }
        var html = this.html;
        if (html.parentNode) {
            html.parentNode.removeChild(html);
        }
        this.posted = false;
    };
    return AbstractPostable;
}(menu_element_js_1.MenuElement));
exports.AbstractPostable = AbstractPostable;
//# sourceMappingURL=abstract_postable.js.map