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
exports.Popup = void 0;
var abstract_postable_js_1 = require("./abstract_postable.js");
var Popup = (function (_super) {
    __extends(Popup, _super);
    function Popup(title, content) {
        var _this = _super.call(this) || this;
        _this.title = title;
        _this.window = null;
        _this.localSettings = {
            left: Math.round((screen.width - 400) / 2),
            top: Math.round((screen.height - 300) / 3)
        };
        _this.windowList = [];
        _this.mobileFlag = false;
        _this.active = null;
        _this.content = content || function () { return ''; };
        return _this;
    }
    Popup.fromJson = function () {
    };
    Popup.prototype.attachMenu = function (menu) {
        this.menu = menu;
    };
    Popup.prototype.post = function () {
        this.display();
    };
    Popup.prototype.display = function () {
        this.active = this.menu.store.active;
        var settings = [];
        for (var setting in Popup.popupSettings) {
            settings.push(setting + '=' + Popup.popupSettings[setting]);
        }
        for (var setting in this.localSettings) {
            settings.push(setting + '=' + this.localSettings[setting]);
        }
        this.window = window.open('', '_blank', settings.join(','));
        this.windowList.push(this.window);
        var doc = this.window.document;
        if (this.mobileFlag) {
            doc.open();
            doc.write('<html><head><meta name="viewport" ' +
                'content="width=device-width, initial-scale=1.0" /><title>' +
                this.title +
                '</title></head><body style="font-size:85%">');
            doc.write('<pre>' + this.generateContent() + '</pre>');
            doc.write('<hr><input type="button" value="' +
                'Close' + '" onclick="window.close()" />');
            doc.write('</body></html>');
            doc.close();
        }
        else {
            doc.open();
            doc.write('<html><head><title>' + this.title +
                '</title></head><body style="font-size:85%">');
            doc.write('<table><tr><td><pre>' + this.generateContent() +
                '</pre></td></tr></table>');
            doc.write('</body></html>');
            doc.close();
            setTimeout(this.resize.bind(this), 50);
        }
    };
    Popup.prototype.unpost = function () {
        this.windowList.forEach(function (x) { return x.close(); });
        this.window = null;
    };
    Popup.prototype.generateContent = function () {
        return this.content(this.active);
    };
    Popup.prototype.resize = function () {
        var table = this.window.document.body.firstChild;
        var H = (this.window.outerHeight - this.window.innerHeight) || 30;
        var W = (this.window.outerWidth - this.window.innerWidth) || 30;
        W = Math.max(140, Math.min(Math.floor(.5 * this.window.screen.width), table.offsetWidth + W + 25));
        H = Math.max(40, Math.min(Math.floor(.5 * this.window.screen.height), table.offsetHeight + H + 25));
        this.window.resizeTo(W, H);
        var bb = this.active.getBoundingClientRect();
        if (bb) {
            var x = Math.max(0, Math.min(bb.right - Math.floor(W / 2), this.window.screen.width - W - 20));
            var y = Math.max(0, Math.min(bb.bottom - Math.floor(H / 2), this.window.screen.height - H - 20));
            this.window.moveTo(x, y);
        }
        this.active = null;
    };
    Popup.prototype.toJson = function () {
        return { type: ''
        };
    };
    Popup.popupSettings = {
        status: 'no',
        toolbar: 'no',
        locationbar: 'no',
        menubar: 'no',
        directories: 'no',
        personalbar: 'no',
        resizable: 'yes',
        scrollbars: 'yes',
        width: 400,
        height: 300,
    };
    return Popup;
}(abstract_postable_js_1.AbstractPostable));
exports.Popup = Popup;
//# sourceMappingURL=popup.js.map