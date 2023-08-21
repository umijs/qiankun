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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHTMLmo = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mo_js_1 = require("../../common/Wrappers/mo.js");
var mo_js_2 = require("../../../core/MmlTree/MmlNodes/mo.js");
var CHTMLmo = (function (_super) {
    __extends(CHTMLmo, _super);
    function CHTMLmo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmo.prototype.toCHTML = function (parent) {
        var e_1, _a;
        var attributes = this.node.attributes;
        var symmetric = attributes.get('symmetric') && this.stretch.dir !== 2;
        var stretchy = this.stretch.dir !== 0;
        if (stretchy && this.size === null) {
            this.getStretchedVariant([]);
        }
        var chtml = this.standardCHTMLnode(parent);
        if (stretchy && this.size < 0) {
            this.stretchHTML(chtml);
        }
        else {
            if (symmetric || attributes.get('largeop')) {
                var u = this.em(this.getCenterOffset());
                if (u !== '0') {
                    this.adaptor.setStyle(chtml, 'verticalAlign', u);
                }
            }
            if (this.node.getProperty('mathaccent')) {
                this.adaptor.setStyle(chtml, 'width', '0');
                this.adaptor.setStyle(chtml, 'margin-left', this.em(this.getAccentOffset()));
            }
            try {
                for (var _b = __values(this.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.toCHTML(chtml);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    CHTMLmo.prototype.stretchHTML = function (chtml) {
        var c = this.getText().codePointAt(0);
        this.font.delimUsage.add(c);
        this.childNodes[0].markUsed();
        var delim = this.stretch;
        var stretch = delim.stretch;
        var content = [];
        if (stretch[0]) {
            content.push(this.html('mjx-beg', {}, [this.html('mjx-c')]));
        }
        content.push(this.html('mjx-ext', {}, [this.html('mjx-c')]));
        if (stretch.length === 4) {
            content.push(this.html('mjx-mid', {}, [this.html('mjx-c')]), this.html('mjx-ext', {}, [this.html('mjx-c')]));
        }
        if (stretch[2]) {
            content.push(this.html('mjx-end', {}, [this.html('mjx-c')]));
        }
        var styles = {};
        var _a = this.bbox, h = _a.h, d = _a.d, w = _a.w;
        if (delim.dir === 1) {
            content.push(this.html('mjx-mark'));
            styles.height = this.em(h + d);
            styles.verticalAlign = this.em(-d);
        }
        else {
            styles.width = this.em(w);
        }
        var dir = mo_js_1.DirectionVH[delim.dir];
        var properties = { class: this.char(delim.c || c), style: styles };
        var html = this.html('mjx-stretchy-' + dir, properties, content);
        this.adaptor.append(chtml, html);
    };
    CHTMLmo.kind = mo_js_2.MmlMo.prototype.kind;
    CHTMLmo.styles = {
        'mjx-stretchy-h': {
            display: 'inline-table',
            width: '100%'
        },
        'mjx-stretchy-h > *': {
            display: 'table-cell',
            width: 0
        },
        'mjx-stretchy-h > * > mjx-c': {
            display: 'inline-block',
            transform: 'scalex(1.0000001)'
        },
        'mjx-stretchy-h > * > mjx-c::before': {
            display: 'inline-block',
            width: 'initial'
        },
        'mjx-stretchy-h > mjx-ext': {
            '/* IE */ overflow': 'hidden',
            '/* others */ overflow': 'clip visible',
            width: '100%'
        },
        'mjx-stretchy-h > mjx-ext > mjx-c::before': {
            transform: 'scalex(500)'
        },
        'mjx-stretchy-h > mjx-ext > mjx-c': {
            width: 0
        },
        'mjx-stretchy-h > mjx-beg > mjx-c': {
            'margin-right': '-.1em'
        },
        'mjx-stretchy-h > mjx-end > mjx-c': {
            'margin-left': '-.1em'
        },
        'mjx-stretchy-v': {
            display: 'inline-block'
        },
        'mjx-stretchy-v > *': {
            display: 'block'
        },
        'mjx-stretchy-v > mjx-beg': {
            height: 0
        },
        'mjx-stretchy-v > mjx-end > mjx-c': {
            display: 'block'
        },
        'mjx-stretchy-v > * > mjx-c': {
            transform: 'scaley(1.0000001)',
            'transform-origin': 'left center',
            overflow: 'hidden'
        },
        'mjx-stretchy-v > mjx-ext': {
            display: 'block',
            height: '100%',
            'box-sizing': 'border-box',
            border: '0px solid transparent',
            '/* IE */ overflow': 'hidden',
            '/* others */ overflow': 'visible clip',
        },
        'mjx-stretchy-v > mjx-ext > mjx-c::before': {
            width: 'initial',
            'box-sizing': 'border-box'
        },
        'mjx-stretchy-v > mjx-ext > mjx-c': {
            transform: 'scaleY(500) translateY(.075em)',
            overflow: 'visible'
        },
        'mjx-mark': {
            display: 'inline-block',
            height: '0px'
        }
    };
    return CHTMLmo;
}((0, mo_js_1.CommonMoMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmo = CHTMLmo;
//# sourceMappingURL=mo.js.map