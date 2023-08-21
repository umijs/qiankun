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
exports.SelectableInfo = void 0;
var info_js_1 = require("mj-context-menu/js/info.js");
var html_classes_js_1 = require("mj-context-menu/js/html_classes.js");
var SelectableInfo = (function (_super) {
    __extends(SelectableInfo, _super);
    function SelectableInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectableInfo.prototype.addEvents = function (element) {
        var _this = this;
        element.addEventListener('keypress', function (event) {
            if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
                _this.selectAll();
                _this.stop(event);
            }
        });
    };
    SelectableInfo.prototype.selectAll = function () {
        var selection = document.getSelection();
        selection.selectAllChildren(this.html.querySelector('pre'));
    };
    SelectableInfo.prototype.copyToClipboard = function () {
        this.selectAll();
        try {
            document.execCommand('copy');
        }
        catch (err) {
            alert('Can\'t copy to clipboard: ' + err.message);
        }
        document.getSelection().removeAllRanges();
    };
    SelectableInfo.prototype.generateHtml = function () {
        var _this = this;
        _super.prototype.generateHtml.call(this);
        var footer = this.html.querySelector('span.' + html_classes_js_1.HtmlClasses['INFOSIGNATURE']);
        var button = footer.appendChild(document.createElement('input'));
        button.type = 'button';
        button.value = 'Copy to Clipboard';
        button.addEventListener('click', function (_event) { return _this.copyToClipboard(); });
    };
    return SelectableInfo;
}(info_js_1.Info));
exports.SelectableInfo = SelectableInfo;
//# sourceMappingURL=SelectableInfo.js.map