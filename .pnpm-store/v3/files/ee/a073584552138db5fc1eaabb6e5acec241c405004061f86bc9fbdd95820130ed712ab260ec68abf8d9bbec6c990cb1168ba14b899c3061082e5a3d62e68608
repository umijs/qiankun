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
exports.SVGmenclose = void 0;
var Wrapper_js_1 = require("../Wrapper.js");
var menclose_js_1 = require("../../common/Wrappers/menclose.js");
var Notation = __importStar(require("../Notation.js"));
var menclose_js_2 = require("../../../core/MmlTree/MmlNodes/menclose.js");
var SVGmenclose = (function (_super) {
    __extends(SVGmenclose, _super);
    function SVGmenclose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SVGmenclose.prototype.toSVG = function (parent) {
        var e_1, _a;
        var svg = this.standardSVGnode(parent);
        var left = this.getBBoxExtenders()[3];
        var def = {};
        if (left > 0) {
            def.transform = 'translate(' + this.fixed(left) + ', 0)';
        }
        var block = this.adaptor.append(svg, this.svg('g', def));
        if (this.renderChild) {
            this.renderChild(this, block);
        }
        else {
            this.childNodes[0].toSVG(block);
        }
        try {
            for (var _b = __values(Object.keys(this.notations)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var name_1 = _c.value;
                var notation = this.notations[name_1];
                !notation.renderChild && notation.renderer(this, svg);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SVGmenclose.prototype.arrow = function (W, a, double, offset, dist) {
        if (offset === void 0) { offset = ''; }
        if (dist === void 0) { dist = 0; }
        var _a = this.getBBox(), w = _a.w, h = _a.h, d = _a.d;
        var dw = (W - w) / 2;
        var m = (h - d) / 2;
        var t = this.thickness;
        var t2 = t / 2;
        var _b = __read([t * this.arrowhead.x, t * this.arrowhead.y, t * this.arrowhead.dx], 3), x = _b[0], y = _b[1], dx = _b[2];
        var arrow = (double ?
            this.fill('M', w + dw, m, 'l', -(x + dx), y, 'l', dx, t2 - y, 'L', x - dw, m + t2, 'l', dx, y - t2, 'l', -(x + dx), -y, 'l', x + dx, -y, 'l', -dx, y - t2, 'L', w + dw - x, m - t2, 'l', -dx, t2 - y, 'Z') :
            this.fill('M', w + dw, m, 'l', -(x + dx), y, 'l', dx, t2 - y, 'L', -dw, m + t2, 'l', 0, -t, 'L', w + dw - x, m - t2, 'l', -dx, t2 - y, 'Z'));
        var transform = [];
        if (dist) {
            transform.push(offset === 'X' ? "translate(".concat(this.fixed(-dist), " 0)") : "translate(0 ".concat(this.fixed(dist), ")"));
        }
        if (a) {
            var A = this.jax.fixed(-a * 180 / Math.PI);
            transform.push("rotate(".concat(A, " ").concat(this.fixed(w / 2), " ").concat(this.fixed(m), ")"));
        }
        if (transform.length) {
            this.adaptor.setAttribute(arrow, 'transform', transform.join(' '));
        }
        return arrow;
    };
    SVGmenclose.prototype.line = function (pq) {
        var _a = __read(pq, 4), x1 = _a[0], y1 = _a[1], x2 = _a[2], y2 = _a[3];
        return this.svg('line', {
            x1: this.fixed(x1), y1: this.fixed(y1),
            x2: this.fixed(x2), y2: this.fixed(y2),
            'stroke-width': this.fixed(this.thickness)
        });
    };
    SVGmenclose.prototype.box = function (w, h, d, r) {
        if (r === void 0) { r = 0; }
        var t = this.thickness;
        var def = {
            x: this.fixed(t / 2), y: this.fixed(t / 2 - d),
            width: this.fixed(w - t), height: this.fixed(h + d - t),
            fill: 'none', 'stroke-width': this.fixed(t)
        };
        if (r) {
            def.rx = this.fixed(r);
        }
        return this.svg('rect', def);
    };
    SVGmenclose.prototype.ellipse = function (w, h, d) {
        var t = this.thickness;
        return this.svg('ellipse', {
            rx: this.fixed((w - t) / 2), ry: this.fixed((h + d - t) / 2),
            cx: this.fixed(w / 2), cy: this.fixed((h - d) / 2),
            'fill': 'none', 'stroke-width': this.fixed(t)
        });
    };
    SVGmenclose.prototype.path = function (join) {
        var _this = this;
        var P = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            P[_i - 1] = arguments[_i];
        }
        return this.svg('path', {
            d: P.map(function (x) { return (typeof x === 'string' ? x : _this.fixed(x)); }).join(' '),
            style: { 'stroke-width': this.fixed(this.thickness) },
            'stroke-linecap': 'round', 'stroke-linejoin': join,
            fill: 'none'
        });
    };
    SVGmenclose.prototype.fill = function () {
        var _this = this;
        var P = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            P[_i] = arguments[_i];
        }
        return this.svg('path', {
            d: P.map(function (x) { return (typeof x === 'string' ? x : _this.fixed(x)); }).join(' ')
        });
    };
    SVGmenclose.kind = menclose_js_2.MmlMenclose.prototype.kind;
    SVGmenclose.notations = new Map([
        Notation.Border('top'),
        Notation.Border('right'),
        Notation.Border('bottom'),
        Notation.Border('left'),
        Notation.Border2('actuarial', 'top', 'right'),
        Notation.Border2('madruwb', 'bottom', 'right'),
        Notation.DiagonalStrike('up'),
        Notation.DiagonalStrike('down'),
        ['horizontalstrike', {
                renderer: Notation.RenderLine('horizontal', 'Y'),
                bbox: function (node) { return [0, node.padding, 0, node.padding]; }
            }],
        ['verticalstrike', {
                renderer: Notation.RenderLine('vertical', 'X'),
                bbox: function (node) { return [node.padding, 0, node.padding, 0]; }
            }],
        ['box', {
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    node.adaptor.append(node.element, node.box(w, h, d));
                },
                bbox: Notation.fullBBox,
                border: Notation.fullBorder,
                remove: 'left right top bottom'
            }],
        ['roundedbox', {
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    var r = node.thickness + node.padding;
                    node.adaptor.append(node.element, node.box(w, h, d, r));
                },
                bbox: Notation.fullBBox
            }],
        ['circle', {
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    node.adaptor.append(node.element, node.ellipse(w, h, d));
                },
                bbox: Notation.fullBBox
            }],
        ['phasorangle', {
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    var a = node.getArgMod(1.75 * node.padding, h + d)[0];
                    var t = node.thickness / 2;
                    var HD = h + d;
                    var cos = Math.cos(a);
                    node.adaptor.append(node.element, node.path('mitre', 'M', w, t - d, 'L', t + cos * t, t - d, 'L', cos * HD + t, HD - d - t));
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
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    var t = node.thickness / 2;
                    var p = node.padding;
                    node.adaptor.append(node.element, node.path('round', 'M', t, t - d, 'a', p - t / 2, (h + d) / 2 - 4 * t, 0, '0,1', 0, h + d - 2 * t, 'L', w - t, h - t));
                },
                bbox: function (node) {
                    var p = node.padding;
                    var t = node.thickness;
                    return [p + t, p, p, 2 * p + t / 2];
                }
            }],
        ['radical', {
                renderer: function (node, child) {
                    node.msqrt.toSVG(child);
                    var left = node.sqrtTRBL()[3];
                    node.place(-left, 0, child);
                },
                init: function (node) {
                    node.msqrt = node.createMsqrt(node.childNodes[0]);
                },
                bbox: function (node) { return node.sqrtTRBL(); },
                renderChild: true
            }]
    ]);
    return SVGmenclose;
}((0, menclose_js_1.CommonMencloseMixin)(Wrapper_js_1.SVGWrapper)));
exports.SVGmenclose = SVGmenclose;
//# sourceMappingURL=menclose.js.map