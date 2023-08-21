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
exports.Rule = void 0;
var abstract_entry_js_1 = require("./abstract_entry.js");
var html_classes_js_1 = require("./html_classes.js");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule(menu) {
        var _this = _super.call(this, menu, 'rule') || this;
        _this.className = html_classes_js_1.HtmlClasses['MENUITEM'];
        _this.role = 'separator';
        return _this;
    }
    Rule.fromJson = function (_factory, _a, menu) {
        return new this(menu);
    };
    Rule.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENURULE']);
        html.setAttribute('aria-orientation', 'vertical');
    };
    Rule.prototype.addEvents = function (_element) { };
    Rule.prototype.toJson = function () {
        return { type: 'rule' };
    };
    return Rule;
}(abstract_entry_js_1.AbstractEntry));
exports.Rule = Rule;
//# sourceMappingURL=item_rule.js.map