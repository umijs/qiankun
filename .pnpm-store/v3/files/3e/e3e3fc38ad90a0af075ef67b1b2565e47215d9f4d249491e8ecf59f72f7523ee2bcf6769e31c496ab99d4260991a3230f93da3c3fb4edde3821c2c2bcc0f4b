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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHTMLmfrac = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var mfrac_js_1 = require("../../common/Wrappers/mfrac.js");
var mfrac_js_2 = require("../../../core/MmlTree/MmlNodes/mfrac.js");
var CHTMLmfrac = (function (_super) {
    __extends(CHTMLmfrac, _super);
    function CHTMLmfrac() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmfrac.prototype.toCHTML = function (parent) {
        this.standardCHTMLnode(parent);
        var _a = this.node.attributes.getList('linethickness', 'bevelled'), linethickness = _a.linethickness, bevelled = _a.bevelled;
        var display = this.isDisplay();
        if (bevelled) {
            this.makeBevelled(display);
        }
        else {
            var thickness = this.length2em(String(linethickness), .06);
            if (thickness === 0) {
                this.makeAtop(display);
            }
            else {
                this.makeFraction(display, thickness);
            }
        }
    };
    CHTMLmfrac.prototype.makeFraction = function (display, t) {
        var _a = this.node.attributes.getList('numalign', 'denomalign'), numalign = _a.numalign, denomalign = _a.denomalign;
        var withDelims = this.node.getProperty('withDelims');
        var attr = (display ? { type: 'd' } : {});
        var fattr = (withDelims ? __assign(__assign({}, attr), { delims: 'true' }) : __assign({}, attr));
        var nattr = (numalign !== 'center' ? { align: numalign } : {});
        var dattr = (denomalign !== 'center' ? { align: denomalign } : {});
        var dsattr = __assign({}, attr), nsattr = __assign({}, attr);
        var tex = this.font.params;
        if (t !== .06) {
            var a = tex.axis_height;
            var tEm = this.em(t);
            var _b = this.getTUV(display, t), T = _b.T, u = _b.u, v = _b.v;
            var m = (display ? this.em(3 * t) : tEm) + ' -.1em';
            attr.style = { height: tEm, 'border-top': tEm + ' solid', margin: m };
            var nh = this.em(Math.max(0, u));
            nsattr.style = { height: nh, 'vertical-align': '-' + nh };
            dsattr.style = { height: this.em(Math.max(0, v)) };
            fattr.style = { 'vertical-align': this.em(a - T) };
        }
        var num, den;
        this.adaptor.append(this.chtml, this.html('mjx-frac', fattr, [
            num = this.html('mjx-num', nattr, [this.html('mjx-nstrut', nsattr)]),
            this.html('mjx-dbox', {}, [
                this.html('mjx-dtable', {}, [
                    this.html('mjx-line', attr),
                    this.html('mjx-row', {}, [
                        den = this.html('mjx-den', dattr, [this.html('mjx-dstrut', dsattr)])
                    ])
                ])
            ])
        ]));
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    };
    CHTMLmfrac.prototype.makeAtop = function (display) {
        var _a = this.node.attributes.getList('numalign', 'denomalign'), numalign = _a.numalign, denomalign = _a.denomalign;
        var withDelims = this.node.getProperty('withDelims');
        var attr = (display ? { type: 'd', atop: true } : { atop: true });
        var fattr = (withDelims ? __assign(__assign({}, attr), { delims: true }) : __assign({}, attr));
        var nattr = (numalign !== 'center' ? { align: numalign } : {});
        var dattr = (denomalign !== 'center' ? { align: denomalign } : {});
        var _b = this.getUVQ(display), v = _b.v, q = _b.q;
        nattr.style = { 'padding-bottom': this.em(q) };
        fattr.style = { 'vertical-align': this.em(-v) };
        var num, den;
        this.adaptor.append(this.chtml, this.html('mjx-frac', fattr, [
            num = this.html('mjx-num', nattr),
            den = this.html('mjx-den', dattr)
        ]));
        this.childNodes[0].toCHTML(num);
        this.childNodes[1].toCHTML(den);
    };
    CHTMLmfrac.prototype.makeBevelled = function (display) {
        var adaptor = this.adaptor;
        adaptor.setAttribute(this.chtml, 'bevelled', 'ture');
        var num = adaptor.append(this.chtml, this.html('mjx-num'));
        this.childNodes[0].toCHTML(num);
        this.bevel.toCHTML(this.chtml);
        var den = adaptor.append(this.chtml, this.html('mjx-den'));
        this.childNodes[1].toCHTML(den);
        var _a = this.getBevelData(display), u = _a.u, v = _a.v, delta = _a.delta, nbox = _a.nbox, dbox = _a.dbox;
        if (u) {
            adaptor.setStyle(num, 'verticalAlign', this.em(u / nbox.scale));
        }
        if (v) {
            adaptor.setStyle(den, 'verticalAlign', this.em(v / dbox.scale));
        }
        var dx = this.em(-delta / 2);
        adaptor.setStyle(this.bevel.chtml, 'marginLeft', dx);
        adaptor.setStyle(this.bevel.chtml, 'marginRight', dx);
    };
    CHTMLmfrac.kind = mfrac_js_2.MmlMfrac.prototype.kind;
    CHTMLmfrac.styles = {
        'mjx-frac': {
            display: 'inline-block',
            'vertical-align': '0.17em',
            padding: '0 .22em'
        },
        'mjx-frac[type="d"]': {
            'vertical-align': '.04em'
        },
        'mjx-frac[delims]': {
            padding: '0 .1em'
        },
        'mjx-frac[atop]': {
            padding: '0 .12em'
        },
        'mjx-frac[atop][delims]': {
            padding: '0'
        },
        'mjx-dtable': {
            display: 'inline-table',
            width: '100%'
        },
        'mjx-dtable > *': {
            'font-size': '2000%'
        },
        'mjx-dbox': {
            display: 'block',
            'font-size': '5%'
        },
        'mjx-num': {
            display: 'block',
            'text-align': 'center'
        },
        'mjx-den': {
            display: 'block',
            'text-align': 'center'
        },
        'mjx-mfrac[bevelled] > mjx-num': {
            display: 'inline-block'
        },
        'mjx-mfrac[bevelled] > mjx-den': {
            display: 'inline-block'
        },
        'mjx-den[align="right"], mjx-num[align="right"]': {
            'text-align': 'right'
        },
        'mjx-den[align="left"], mjx-num[align="left"]': {
            'text-align': 'left'
        },
        'mjx-nstrut': {
            display: 'inline-block',
            height: '.054em',
            width: 0,
            'vertical-align': '-.054em'
        },
        'mjx-nstrut[type="d"]': {
            height: '.217em',
            'vertical-align': '-.217em',
        },
        'mjx-dstrut': {
            display: 'inline-block',
            height: '.505em',
            width: 0
        },
        'mjx-dstrut[type="d"]': {
            height: '.726em',
        },
        'mjx-line': {
            display: 'block',
            'box-sizing': 'border-box',
            'min-height': '1px',
            height: '.06em',
            'border-top': '.06em solid',
            margin: '.06em -.1em',
            overflow: 'hidden'
        },
        'mjx-line[type="d"]': {
            margin: '.18em -.1em'
        }
    };
    return CHTMLmfrac;
}((0, mfrac_js_1.CommonMfracMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmfrac = CHTMLmfrac;
//# sourceMappingURL=mfrac.js.map