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
exports.Label = void 0;
var abstract_item_js_1 = require("./abstract_item.js");
var html_classes_js_1 = require("./html_classes.js");
var Label = (function (_super) {
    __extends(Label, _super);
    function Label(menu, content, id) {
        return _super.call(this, menu, 'label', content, id) || this;
    }
    Label.fromJson = function (_factory, _a, menu) {
        var content = _a.content, id = _a.id;
        return new this(menu, content, id);
    };
    Label.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.classList.add(html_classes_js_1.HtmlClasses['MENULABEL']);
    };
    Label.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Label;
}(abstract_item_js_1.AbstractItem));
exports.Label = Label;
//# sourceMappingURL=item_label.js.map