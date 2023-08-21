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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CHTMLmenclose = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var menclose_js_1 = require("../../common/Wrappers/menclose.js");
var Notation = __importStar(require("../Notation.js"));
var menclose_js_2 = require("../../../core/MmlTree/MmlNodes/menclose.js");
var lengths_js_1 = require("../../../util/lengths.js");
function Angle(x, y) {
    return Math.atan2(x, y).toFixed(3).replace(/\.?0+$/, '');
}
var ANGLE = Angle(Notation.ARROWDX, Notation.ARROWY);
var CHTMLmenclose = (function (_super) {
    __extends(CHTMLmenclose, _super);
    function CHTMLmenclose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CHTMLmenclose.prototype.toCHTML = function (parent) {
        var e_1, _a, e_2, _b;
        var adaptor = this.adaptor;
        var chtml = this.standardCHTMLnode(parent);
        var block = adaptor.append(chtml, this.html('mjx-box'));
        if (this.renderChild) {
            this.renderChild(this, block);
        }
        else {
            this.childNodes[0].toCHTML(block);
        }
        try {
            for (var _c = __values(Object.keys(this.notations)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var name_1 = _d.value;
                var notation = this.notations[name_1];
                !notation.renderChild && notation.renderer(this, block);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var pbox = this.getPadding();
        try {
            for (var _e = __values(Notation.sideNames), _f = _e.next(); !_f.done; _f = _e.next()) {
                var name_2 = _f.value;
                var i = Notation.sideIndex[name_2];
                pbox[i] > 0 && adaptor.setStyle(block, 'padding-' + name_2, this.em(pbox[i]));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    CHTMLmenclose.prototype.arrow = function (w, a, double, offset, dist) {
        if (offset === void 0) { offset = ''; }
        if (dist === void 0) { dist = 0; }
        var W = this.getBBox().w;
        var style = { width: this.em(w) };
        if (W !== w) {
            style.left = this.em((W - w) / 2);
        }
        if (a) {
            style.transform = 'rotate(' + this.fixed(a) + 'rad)';
        }
        var arrow = this.html('mjx-arrow', { style: style }, [
            this.html('mjx-aline'), this.html('mjx-rthead'), this.html('mjx-rbhead')
        ]);
        if (double) {
            this.adaptor.append(arrow, this.html('mjx-lthead'));
            this.adaptor.append(arrow, this.html('mjx-lbhead'));
            this.adaptor.setAttribute(arrow, 'double', 'true');
        }
        this.adjustArrow(arrow, double);
        this.moveArrow(arrow, offset, dist);
        return arrow;
    };
    CHTMLmenclose.prototype.adjustArrow = function (arrow, double) {
        var _this = this;
        var t = this.thickness;
        var head = this.arrowhead;
        if (head.x === Notation.ARROWX && head.y === Notation.ARROWY &&
            head.dx === Notation.ARROWDX && t === Notation.THICKNESS)
            return;
        var _a = __read([t * head.x, t * head.y].map(function (x) { return _this.em(x); }), 2), x = _a[0], y = _a[1];
        var a = Angle(head.dx, head.y);
        var _b = __read(this.adaptor.childNodes(arrow), 5), line = _b[0], rthead = _b[1], rbhead = _b[2], lthead = _b[3], lbhead = _b[4];
        this.adjustHead(rthead, [y, '0', '1px', x], a);
        this.adjustHead(rbhead, ['1px', '0', y, x], '-' + a);
        this.adjustHead(lthead, [y, x, '1px', '0'], '-' + a);
        this.adjustHead(lbhead, ['1px', x, y, '0'], a);
        this.adjustLine(line, t, head.x, double);
    };
    CHTMLmenclose.prototype.adjustHead = function (head, border, a) {
        if (head) {
            this.adaptor.setStyle(head, 'border-width', border.join(' '));
            this.adaptor.setStyle(head, 'transform', 'skewX(' + a + 'rad)');
        }
    };
    CHTMLmenclose.prototype.adjustLine = function (line, t, x, double) {
        this.adaptor.setStyle(line, 'borderTop', this.em(t) + ' solid');
        this.adaptor.setStyle(line, 'top', this.em(-t / 2));
        this.adaptor.setStyle(line, 'right', this.em(t * (x - 1)));
        if (double) {
            this.adaptor.setStyle(line, 'left', this.em(t * (x - 1)));
        }
    };
    CHTMLmenclose.prototype.moveArrow = function (arrow, offset, d) {
        if (!d)
            return;
        var transform = this.adaptor.getStyle(arrow, 'transform');
        this.adaptor.setStyle(arrow, 'transform', "translate".concat(offset, "(").concat(this.em(-d), ")").concat((transform ? ' ' + transform : '')));
    };
    CHTMLmenclose.prototype.adjustBorder = function (node) {
        if (this.thickness !== Notation.THICKNESS) {
            this.adaptor.setStyle(node, 'borderWidth', this.em(this.thickness));
        }
        return node;
    };
    CHTMLmenclose.prototype.adjustThickness = function (shape) {
        if (this.thickness !== Notation.THICKNESS) {
            this.adaptor.setStyle(shape, 'strokeWidth', this.fixed(this.thickness));
        }
        return shape;
    };
    CHTMLmenclose.prototype.fixed = function (m, n) {
        if (n === void 0) { n = 3; }
        if (Math.abs(m) < .0006) {
            return '0';
        }
        return m.toFixed(n).replace(/\.?0+$/, '');
    };
    CHTMLmenclose.prototype.em = function (m) {
        return _super.prototype.em.call(this, m);
    };
    CHTMLmenclose.kind = menclose_js_2.MmlMenclose.prototype.kind;
    CHTMLmenclose.styles = {
        'mjx-menclose': {
            position: 'relative'
        },
        'mjx-menclose > mjx-dstrike': {
            display: 'inline-block',
            left: 0, top: 0,
            position: 'absolute',
            'border-top': Notation.SOLID,
            'transform-origin': 'top left'
        },
        'mjx-menclose > mjx-ustrike': {
            display: 'inline-block',
            left: 0, bottom: 0,
            position: 'absolute',
            'border-top': Notation.SOLID,
            'transform-origin': 'bottom left'
        },
        'mjx-menclose > mjx-hstrike': {
            'border-top': Notation.SOLID,
            position: 'absolute',
            left: 0, right: 0, bottom: '50%',
            transform: 'translateY(' + (0, lengths_js_1.em)(Notation.THICKNESS / 2) + ')'
        },
        'mjx-menclose > mjx-vstrike': {
            'border-left': Notation.SOLID,
            position: 'absolute',
            top: 0, bottom: 0, right: '50%',
            transform: 'translateX(' + (0, lengths_js_1.em)(Notation.THICKNESS / 2) + ')'
        },
        'mjx-menclose > mjx-rbox': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            'border': Notation.SOLID,
            'border-radius': (0, lengths_js_1.em)(Notation.THICKNESS + Notation.PADDING)
        },
        'mjx-menclose > mjx-cbox': {
            position: 'absolute',
            top: 0, bottom: 0, right: 0, left: 0,
            'border': Notation.SOLID,
            'border-radius': '50%'
        },
        'mjx-menclose > mjx-arrow': {
            position: 'absolute',
            left: 0, bottom: '50%', height: 0, width: 0
        },
        'mjx-menclose > mjx-arrow > *': {
            display: 'block',
            position: 'absolute',
            'transform-origin': 'bottom',
            'border-left': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWX) + ' solid',
            'border-right': 0,
            'box-sizing': 'border-box'
        },
        'mjx-menclose > mjx-arrow > mjx-aline': {
            left: 0, top: (0, lengths_js_1.em)(-Notation.THICKNESS / 2),
            right: (0, lengths_js_1.em)(Notation.THICKNESS * (Notation.ARROWX - 1)), height: 0,
            'border-top': (0, lengths_js_1.em)(Notation.THICKNESS) + ' solid',
            'border-left': 0
        },
        'mjx-menclose > mjx-arrow[double] > mjx-aline': {
            left: (0, lengths_js_1.em)(Notation.THICKNESS * (Notation.ARROWX - 1)), height: 0,
        },
        'mjx-menclose > mjx-arrow > mjx-rthead': {
            transform: 'skewX(' + ANGLE + 'rad)',
            right: 0, bottom: '-1px',
            'border-bottom': '1px solid transparent',
            'border-top': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
        },
        'mjx-menclose > mjx-arrow > mjx-rbhead': {
            transform: 'skewX(-' + ANGLE + 'rad)',
            'transform-origin': 'top',
            right: 0, top: '-1px',
            'border-top': '1px solid transparent',
            'border-bottom': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
        },
        'mjx-menclose > mjx-arrow > mjx-lthead': {
            transform: 'skewX(-' + ANGLE + 'rad)',
            left: 0, bottom: '-1px',
            'border-left': 0,
            'border-right': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWX) + ' solid',
            'border-bottom': '1px solid transparent',
            'border-top': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
        },
        'mjx-menclose > mjx-arrow > mjx-lbhead': {
            transform: 'skewX(' + ANGLE + 'rad)',
            'transform-origin': 'top',
            left: 0, top: '-1px',
            'border-left': 0,
            'border-right': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWX) + ' solid',
            'border-top': '1px solid transparent',
            'border-bottom': (0, lengths_js_1.em)(Notation.THICKNESS * Notation.ARROWY) + ' solid transparent'
        },
        'mjx-menclose > dbox': {
            position: 'absolute',
            top: 0, bottom: 0, left: (0, lengths_js_1.em)(-1.5 * Notation.PADDING),
            width: (0, lengths_js_1.em)(3 * Notation.PADDING),
            border: (0, lengths_js_1.em)(Notation.THICKNESS) + ' solid',
            'border-radius': '50%',
            'clip-path': 'inset(0 0 0 ' + (0, lengths_js_1.em)(1.5 * Notation.PADDING) + ')',
            'box-sizing': 'border-box'
        }
    };
    CHTMLmenclose.notations = new Map([
        Notation.Border('top'),
        Notation.Border('right'),
        Notation.Border('bottom'),
        Notation.Border('left'),
        Notation.Border2('actuarial', 'top', 'right'),
        Notation.Border2('madruwb', 'bottom', 'right'),
        Notation.DiagonalStrike('up', 1),
        Notation.DiagonalStrike('down', -1),
        ['horizontalstrike', {
                renderer: Notation.RenderElement('hstrike', 'Y'),
                bbox: function (node) { return [0, node.padding, 0, node.padding]; }
            }],
        ['verticalstrike', {
                renderer: Notation.RenderElement('vstrike', 'X'),
                bbox: function (node) { return [node.padding, 0, node.padding, 0]; }
            }],
        ['box', {
                renderer: function (node, child) {
                    node.adaptor.setStyle(child, 'border', node.em(node.thickness) + ' solid');
                },
                bbox: Notation.fullBBox,
                border: Notation.fullBorder,
                remove: 'left right top bottom'
            }],
        ['roundedbox', {
                renderer: Notation.RenderElement('rbox'),
                bbox: Notation.fullBBox
            }],
        ['circle', {
                renderer: Notation.RenderElement('cbox'),
                bbox: Notation.fullBBox
            }],
        ['phasorangle', {
                renderer: function (node, child) {
                    var _a = node.getBBox(), h = _a.h, d = _a.d;
                    var _b = __read(node.getArgMod(1.75 * node.padding, h + d), 2), a = _b[0], W = _b[1];
                    var t = node.thickness * Math.sin(a) * .9;
                    node.adaptor.setStyle(child, 'border-bottom', node.em(node.thickness) + ' solid');
                    var strike = node.adjustBorder(node.html('mjx-ustrike', { style: {
                            width: node.em(W),
                            transform: 'translateX(' + node.em(t) + ') rotate(' + node.fixed(-a) + 'rad)',
                        } }));
                    node.adaptor.append(node.chtml, strike);
                },
                bbox: function (node) {
                    var p = node.padding / 2;
                    var t = node.thickness;
                    return [2 * p, p, p + t, 3 * p + t];
                },
                border: function (node) { return [0, 0, node.thickness, 0]; },
                remove: 'bottom'
            }],
        Notation.Arrow('up'),
        Notation.Arrow('down'),
        Notation.Arrow('left'),
        Notation.Arrow('right'),
        Notation.Arrow('updown'),
        Notation.Arrow('leftright'),
        Notation.DiagonalArrow('updiagonal'),
        Notation.DiagonalArrow('northeast'),
        Notation.DiagonalArrow('southeast'),
        Notation.DiagonalArrow('northwest'),
        Notation.DiagonalArrow('southwest'),
        Notation.DiagonalArrow('northeastsouthwest'),
        Notation.DiagonalArrow('northwestsoutheast'),
        ['longdiv', {
                renderer: function (node, child) {
                    var adaptor = node.adaptor;
                    adaptor.setStyle(child, 'border-top', node.em(node.thickness) + ' solid');
                    var arc = adaptor.append(node.chtml, node.html('dbox'));
                    var t = node.thickness;
                    var p = node.padding;
                    if (t !== Notation.THICKNESS) {
                        adaptor.setStyle(arc, 'border-width', node.em(t));
                    }
                    if (p !== Notation.PADDING) {
                        adaptor.setStyle(arc, 'left', node.em(-1.5 * p));
                        adaptor.setStyle(arc, 'width', node.em(3 * p));
                        adaptor.setStyle(arc, 'clip-path', 'inset(0 0 0 ' + node.em(1.5 * p) + ')');
                    }
                },
                bbox: function (node) {
                    var p = node.padding;
                    var t = node.thickness;
                    return [p + t, p, p, 2 * p + t / 2];
                }
            }],
        ['radical', {
                renderer: function (node, child) {
                    node.msqrt.toCHTML(child);
                    var TRBL = node.sqrtTRBL();
                    node.adaptor.setStyle(node.msqrt.chtml, 'margin', TRBL.map(function (x) { return node.em(-x); }).join(' '));
                },
                init: function (node) {
                    node.msqrt = node.createMsqrt(node.childNodes[0]);
                },
                bbox: function (node) { return node.sqrtTRBL(); },
                renderChild: true
            }]
    ]);
    return CHTMLmenclose;
}((0, menclose_js_1.CommonMencloseMixin)(Wrapper_js_1.CHTMLWrapper)));
exports.CHTMLmenclose = CHTMLmenclose;
//# sourceMappingURL=menclose.js.map