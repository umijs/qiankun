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
exports.Info = void 0;
var close_button_js_1 = require("./close_button.js");
var html_classes_js_1 = require("./html_classes.js");
var abstract_postable_js_1 = require("./abstract_postable.js");
var Info = (function (_super) {
    __extends(Info, _super);
    function Info(title, content, signature) {
        var _this = _super.call(this) || this;
        _this.title = title;
        _this.signature = signature;
        _this.className = html_classes_js_1.HtmlClasses['INFO'];
        _this.role = 'dialog';
        _this.contentDiv = _this.generateContent();
        _this.close = _this.generateClose();
        _this.content = content || function () { return ''; };
        return _this;
    }
    Info.prototype.attachMenu = function (menu) {
        this.menu = menu;
    };
    Info.prototype.generateHtml = function () {
        _super.prototype.generateHtml.call(this);
        var html = this.html;
        html.appendChild(this.generateTitle());
        html.appendChild(this.contentDiv);
        html.appendChild(this.generateSignature());
        html.appendChild(this.close.html);
        html.setAttribute('tabindex', '0');
    };
    Info.prototype.post = function () {
        _super.prototype.post.call(this);
        var doc = document.documentElement;
        var html = this.html;
        var H = window.innerHeight || doc.clientHeight || doc.scrollHeight || 0;
        var x = Math.floor((-html.offsetWidth) / 2);
        var y = Math.floor((H - html.offsetHeight) / 3);
        html.setAttribute('style', 'margin-left: ' + x + 'px; top: ' + y + 'px;');
        if (window.event instanceof MouseEvent) {
            html.classList.add(html_classes_js_1.HtmlClasses['MOUSEPOST']);
        }
        html.focus();
    };
    Info.prototype.display = function () {
        this.menu.registerWidget(this);
        this.contentDiv.innerHTML = this.content();
        var html = this.menu.html;
        if (html.parentNode) {
            html.parentNode.removeChild(html);
        }
        this.menu.frame.appendChild(this.html);
    };
    Info.prototype.click = function (_event) { };
    Info.prototype.keydown = function (event) {
        this.bubbleKey();
        _super.prototype.keydown.call(this, event);
    };
    Info.prototype.escape = function (_event) {
        this.unpost();
    };
    Info.prototype.unpost = function () {
        _super.prototype.unpost.call(this);
        this.html.classList.remove(html_classes_js_1.HtmlClasses['MOUSEPOST']);
        this.menu.unregisterWidget(this);
    };
    Info.prototype.generateClose = function () {
        var close = new close_button_js_1.CloseButton(this);
        var html = close.html;
        html.classList.add(html_classes_js_1.HtmlClasses['INFOCLOSE']);
        html.setAttribute('aria-label', 'Close Dialog Box');
        return close;
    };
    Info.prototype.generateTitle = function () {
        var span = document.createElement('span');
        span.innerHTML = this.title;
        span.classList.add(html_classes_js_1.HtmlClasses['INFOTITLE']);
        return span;
    };
    Info.prototype.generateContent = function () {
        var div = document.createElement('div');
        div.classList.add(html_classes_js_1.HtmlClasses['INFOCONTENT']);
        div.setAttribute('tabindex', '0');
        return div;
    };
    Info.prototype.generateSignature = function () {
        var span = document.createElement('span');
        span.innerHTML = this.signature;
        span.classList.add(html_classes_js_1.HtmlClasses['INFOSIGNATURE']);
        return span;
    };
    Info.prototype.toJson = function () {
        return { type: ''
        };
    };
    return Info;
}(abstract_postable_js_1.AbstractPostable));
exports.Info = Info;
//# sourceMappingURL=info.js.map