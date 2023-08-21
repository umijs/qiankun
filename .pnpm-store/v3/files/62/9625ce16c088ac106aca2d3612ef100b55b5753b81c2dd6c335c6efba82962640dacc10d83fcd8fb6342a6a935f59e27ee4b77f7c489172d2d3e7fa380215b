"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLDomStrings = void 0;
var Options_js_1 = require("../../util/Options.js");
var HTMLDomStrings = (function () {
    function HTMLDomStrings(options) {
        if (options === void 0) { options = null; }
        var CLASS = this.constructor;
        this.options = (0, Options_js_1.userOptions)((0, Options_js_1.defaultOptions)({}, CLASS.OPTIONS), options);
        this.init();
        this.getPatterns();
    }
    HTMLDomStrings.prototype.init = function () {
        this.strings = [];
        this.string = '';
        this.snodes = [];
        this.nodes = [];
        this.stack = [];
    };
    HTMLDomStrings.prototype.getPatterns = function () {
        var skip = (0, Options_js_1.makeArray)(this.options['skipHtmlTags']);
        var ignore = (0, Options_js_1.makeArray)(this.options['ignoreHtmlClass']);
        var process = (0, Options_js_1.makeArray)(this.options['processHtmlClass']);
        this.skipHtmlTags = new RegExp('^(?:' + skip.join('|') + ')$', 'i');
        this.ignoreHtmlClass = new RegExp('(?:^| )(?:' + ignore.join('|') + ')(?: |$)');
        this.processHtmlClass = new RegExp('(?:^| )(?:' + process + ')(?: |$)');
    };
    HTMLDomStrings.prototype.pushString = function () {
        if (this.string.match(/\S/)) {
            this.strings.push(this.string);
            this.nodes.push(this.snodes);
        }
        this.string = '';
        this.snodes = [];
    };
    HTMLDomStrings.prototype.extendString = function (node, text) {
        this.snodes.push([node, text.length]);
        this.string += text;
    };
    HTMLDomStrings.prototype.handleText = function (node, ignore) {
        if (!ignore) {
            this.extendString(node, this.adaptor.value(node));
        }
        return this.adaptor.next(node);
    };
    HTMLDomStrings.prototype.handleTag = function (node, ignore) {
        if (!ignore) {
            var text = this.options['includeHtmlTags'][this.adaptor.kind(node)];
            this.extendString(node, text);
        }
        return this.adaptor.next(node);
    };
    HTMLDomStrings.prototype.handleContainer = function (node, ignore) {
        this.pushString();
        var cname = this.adaptor.getAttribute(node, 'class') || '';
        var tname = this.adaptor.kind(node) || '';
        var process = this.processHtmlClass.exec(cname);
        var next = node;
        if (this.adaptor.firstChild(node) && !this.adaptor.getAttribute(node, 'data-MJX') &&
            (process || !this.skipHtmlTags.exec(tname))) {
            if (this.adaptor.next(node)) {
                this.stack.push([this.adaptor.next(node), ignore]);
            }
            next = this.adaptor.firstChild(node);
            ignore = (ignore || this.ignoreHtmlClass.exec(cname)) && !process;
        }
        else {
            next = this.adaptor.next(node);
        }
        return [next, ignore];
    };
    HTMLDomStrings.prototype.handleOther = function (node, _ignore) {
        this.pushString();
        return this.adaptor.next(node);
    };
    HTMLDomStrings.prototype.find = function (node) {
        var _a, _b;
        this.init();
        var stop = this.adaptor.next(node);
        var ignore = false;
        var include = this.options['includeHtmlTags'];
        while (node && node !== stop) {
            var kind = this.adaptor.kind(node);
            if (kind === '#text') {
                node = this.handleText(node, ignore);
            }
            else if (include.hasOwnProperty(kind)) {
                node = this.handleTag(node, ignore);
            }
            else if (kind) {
                _a = __read(this.handleContainer(node, ignore), 2), node = _a[0], ignore = _a[1];
            }
            else {
                node = this.handleOther(node, ignore);
            }
            if (!node && this.stack.length) {
                this.pushString();
                _b = __read(this.stack.pop(), 2), node = _b[0], ignore = _b[1];
            }
        }
        this.pushString();
        var result = [this.strings, this.nodes];
        this.init();
        return result;
    };
    HTMLDomStrings.OPTIONS = {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'annotation', 'annotation-xml'],
        includeHtmlTags: { br: '\n', wbr: '', '#comment': '' },
        ignoreHtmlClass: 'mathjax_ignore',
        processHtmlClass: 'mathjax_process'
    };
    return HTMLDomStrings;
}());
exports.HTMLDomStrings = HTMLDomStrings;
//# sourceMappingURL=HTMLDomStrings.js.map