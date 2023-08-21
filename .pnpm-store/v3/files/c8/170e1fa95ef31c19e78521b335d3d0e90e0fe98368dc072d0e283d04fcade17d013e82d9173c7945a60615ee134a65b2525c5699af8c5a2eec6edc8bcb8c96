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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoverRegion = exports.LiveRegion = exports.ToolTip = exports.StringRegion = exports.DummyRegion = exports.AbstractRegion = void 0;
var StyleList_js_1 = require("../../util/StyleList.js");
var AbstractRegion = (function () {
    function AbstractRegion(document) {
        this.document = document;
        this.CLASS = this.constructor;
        this.AddStyles();
        this.AddElement();
    }
    AbstractRegion.prototype.AddStyles = function () {
        if (this.CLASS.styleAdded) {
            return;
        }
        var node = this.document.adaptor.node('style');
        node.innerHTML = this.CLASS.style.cssText;
        this.document.adaptor.head(this.document.adaptor.document).
            appendChild(node);
        this.CLASS.styleAdded = true;
    };
    AbstractRegion.prototype.AddElement = function () {
        var element = this.document.adaptor.node('div');
        element.classList.add(this.CLASS.className);
        element.style.backgroundColor = 'white';
        this.div = element;
        this.inner = this.document.adaptor.node('div');
        this.div.appendChild(this.inner);
        this.document.adaptor.
            body(this.document.adaptor.document).
            appendChild(this.div);
    };
    AbstractRegion.prototype.Show = function (node, highlighter) {
        this.position(node);
        this.highlight(highlighter);
        this.div.classList.add(this.CLASS.className + '_Show');
    };
    AbstractRegion.prototype.Hide = function () {
        this.div.classList.remove(this.CLASS.className + '_Show');
    };
    AbstractRegion.prototype.stackRegions = function (node) {
        var rect = node.getBoundingClientRect();
        var baseBottom = 0;
        var baseLeft = Number.POSITIVE_INFINITY;
        var regions = this.document.adaptor.document.getElementsByClassName(this.CLASS.className + '_Show');
        for (var i = 0, region = void 0; region = regions[i]; i++) {
            if (region !== this.div) {
                baseBottom = Math.max(region.getBoundingClientRect().bottom, baseBottom);
                baseLeft = Math.min(region.getBoundingClientRect().left, baseLeft);
            }
        }
        var bot = (baseBottom ? baseBottom : rect.bottom + 10) + window.pageYOffset;
        var left = (baseLeft < Number.POSITIVE_INFINITY ? baseLeft : rect.left) + window.pageXOffset;
        this.div.style.top = bot + 'px';
        this.div.style.left = left + 'px';
    };
    AbstractRegion.styleAdded = false;
    return AbstractRegion;
}());
exports.AbstractRegion = AbstractRegion;
var DummyRegion = (function (_super) {
    __extends(DummyRegion, _super);
    function DummyRegion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DummyRegion.prototype.Clear = function () { };
    DummyRegion.prototype.Update = function () { };
    DummyRegion.prototype.Hide = function () { };
    DummyRegion.prototype.Show = function () { };
    DummyRegion.prototype.AddElement = function () { };
    DummyRegion.prototype.AddStyles = function () { };
    DummyRegion.prototype.position = function () { };
    DummyRegion.prototype.highlight = function (_highlighter) { };
    return DummyRegion;
}(AbstractRegion));
exports.DummyRegion = DummyRegion;
var StringRegion = (function (_super) {
    __extends(StringRegion, _super);
    function StringRegion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringRegion.prototype.Clear = function () {
        this.Update('');
        this.inner.style.top = '';
        this.inner.style.backgroundColor = '';
    };
    StringRegion.prototype.Update = function (speech) {
        this.inner.textContent = '';
        this.inner.textContent = speech;
    };
    StringRegion.prototype.position = function (node) {
        this.stackRegions(node);
    };
    StringRegion.prototype.highlight = function (highlighter) {
        var color = highlighter.colorString();
        this.inner.style.backgroundColor = color.background;
        this.inner.style.color = color.foreground;
    };
    return StringRegion;
}(AbstractRegion));
exports.StringRegion = StringRegion;
var ToolTip = (function (_super) {
    __extends(ToolTip, _super);
    function ToolTip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolTip.className = 'MJX_ToolTip';
    ToolTip.style = new StyleList_js_1.CssStyles((_a = {},
        _a['.' + ToolTip.className] = {
            position: 'absolute', display: 'inline-block',
            height: '1px', width: '1px'
        },
        _a['.' + ToolTip.className + '_Show'] = {
            width: 'auto', height: 'auto', opacity: 1, 'text-align': 'center',
            'border-radius': '6px', padding: '0px 0px',
            'border-bottom': '1px dotted black', position: 'absolute',
            'z-index': 202
        },
        _a));
    return ToolTip;
}(StringRegion));
exports.ToolTip = ToolTip;
var LiveRegion = (function (_super) {
    __extends(LiveRegion, _super);
    function LiveRegion(document) {
        var _this = _super.call(this, document) || this;
        _this.document = document;
        _this.div.setAttribute('aria-live', 'assertive');
        return _this;
    }
    LiveRegion.className = 'MJX_LiveRegion';
    LiveRegion.style = new StyleList_js_1.CssStyles((_b = {},
        _b['.' + LiveRegion.className] = {
            position: 'absolute', top: '0', height: '1px', width: '1px',
            padding: '1px', overflow: 'hidden'
        },
        _b['.' + LiveRegion.className + '_Show'] = {
            top: '0', position: 'absolute', width: 'auto', height: 'auto',
            padding: '0px 0px', opacity: 1, 'z-index': '202',
            left: 0, right: 0, 'margin': '0 auto',
            'background-color': 'rgba(0, 0, 255, 0.2)', 'box-shadow': '0px 10px 20px #888',
            border: '2px solid #CCCCCC'
        },
        _b));
    return LiveRegion;
}(StringRegion));
exports.LiveRegion = LiveRegion;
var HoverRegion = (function (_super) {
    __extends(HoverRegion, _super);
    function HoverRegion(document) {
        var _this = _super.call(this, document) || this;
        _this.document = document;
        _this.inner.style.lineHeight = '0';
        return _this;
    }
    HoverRegion.prototype.position = function (node) {
        var nodeRect = node.getBoundingClientRect();
        var divRect = this.div.getBoundingClientRect();
        var xCenter = nodeRect.left + (nodeRect.width / 2);
        var left = xCenter - (divRect.width / 2);
        left = (left < 0) ? 0 : left;
        left = left + window.pageXOffset;
        var top;
        switch (this.document.options.a11y.align) {
            case 'top':
                top = nodeRect.top - divRect.height - 10;
                break;
            case 'bottom':
                top = nodeRect.bottom + 10;
                break;
            case 'center':
            default:
                var yCenter = nodeRect.top + (nodeRect.height / 2);
                top = yCenter - (divRect.height / 2);
        }
        top = top + window.pageYOffset;
        top = (top < 0) ? 0 : top;
        this.div.style.top = top + 'px';
        this.div.style.left = left + 'px';
    };
    HoverRegion.prototype.highlight = function (highlighter) {
        if (this.inner.firstChild &&
            !this.inner.firstChild.hasAttribute('sre-highlight')) {
            return;
        }
        var color = highlighter.colorString();
        this.inner.style.backgroundColor = color.background;
        this.inner.style.color = color.foreground;
    };
    HoverRegion.prototype.Show = function (node, highlighter) {
        this.div.style.fontSize = this.document.options.a11y.magnify;
        this.Update(node);
        _super.prototype.Show.call(this, node, highlighter);
    };
    HoverRegion.prototype.Clear = function () {
        this.inner.textContent = '';
        this.inner.style.top = '';
        this.inner.style.backgroundColor = '';
    };
    HoverRegion.prototype.Update = function (node) {
        this.Clear();
        var mjx = this.cloneNode(node);
        this.inner.appendChild(mjx);
    };
    HoverRegion.prototype.cloneNode = function (node) {
        var mjx = node.cloneNode(true);
        if (mjx.nodeName !== 'MJX-CONTAINER') {
            if (mjx.nodeName !== 'g') {
                mjx.style.marginLeft = mjx.style.marginRight = '0';
            }
            var container = node;
            while (container && container.nodeName !== 'MJX-CONTAINER') {
                container = container.parentNode;
            }
            if (mjx.nodeName !== 'MJX-MATH' && mjx.nodeName !== 'svg') {
                var child = container.firstChild;
                mjx = child.cloneNode(false).appendChild(mjx).parentNode;
                if (mjx.nodeName === 'svg') {
                    mjx.firstChild.setAttribute('transform', 'matrix(1 0 0 -1 0 0)');
                    var W = parseFloat(mjx.getAttribute('viewBox').split(/ /)[2]);
                    var w = parseFloat(mjx.getAttribute('width'));
                    var _a = node.getBBox(), x = _a.x, y = _a.y, width = _a.width, height = _a.height;
                    mjx.setAttribute('viewBox', [x, -(y + height), width, height].join(' '));
                    mjx.removeAttribute('style');
                    mjx.setAttribute('width', (w / W * width) + 'ex');
                    mjx.setAttribute('height', (w / W * height) + 'ex');
                    container.setAttribute('sre-highlight', 'false');
                }
            }
            mjx = container.cloneNode(false).appendChild(mjx).parentNode;
            mjx.style.margin = '0';
        }
        return mjx;
    };
    HoverRegion.className = 'MJX_HoverRegion';
    HoverRegion.style = new StyleList_js_1.CssStyles((_c = {},
        _c['.' + HoverRegion.className] = {
            position: 'absolute', height: '1px', width: '1px',
            padding: '1px', overflow: 'hidden'
        },
        _c['.' + HoverRegion.className + '_Show'] = {
            position: 'absolute', width: 'max-content', height: 'auto',
            padding: '0px 0px', opacity: 1, 'z-index': '202', 'margin': '0 auto',
            'background-color': 'rgba(0, 0, 255, 0.2)',
            'box-shadow': '0px 10px 20px #888', border: '2px solid #CCCCCC'
        },
        _c));
    return HoverRegion;
}(AbstractRegion));
exports.HoverRegion = HoverRegion;
//# sourceMappingURL=Region.js.map