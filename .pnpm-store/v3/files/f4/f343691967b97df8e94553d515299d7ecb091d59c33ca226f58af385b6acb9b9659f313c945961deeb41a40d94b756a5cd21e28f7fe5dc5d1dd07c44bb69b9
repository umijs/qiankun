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
exports.CommonArrow = exports.CommonDiagonalArrow = exports.CommonDiagonalStrike = exports.CommonBorder2 = exports.CommonBorder = exports.arrowBBox = exports.diagonalArrowDef = exports.arrowDef = exports.arrowBBoxW = exports.arrowBBoxHD = exports.arrowHead = exports.fullBorder = exports.fullPadding = exports.fullBBox = exports.sideNames = exports.sideIndex = exports.SOLID = exports.PADDING = exports.THICKNESS = exports.ARROWY = exports.ARROWDX = exports.ARROWX = void 0;
exports.ARROWX = 4, exports.ARROWDX = 1, exports.ARROWY = 2;
exports.THICKNESS = .067;
exports.PADDING = .2;
exports.SOLID = exports.THICKNESS + 'em solid';
exports.sideIndex = { top: 0, right: 1, bottom: 2, left: 3 };
exports.sideNames = Object.keys(exports.sideIndex);
exports.fullBBox = (function (node) { return new Array(4).fill(node.thickness + node.padding); });
exports.fullPadding = (function (node) { return new Array(4).fill(node.padding); });
exports.fullBorder = (function (node) { return new Array(4).fill(node.thickness); });
var arrowHead = function (node) {
    return Math.max(node.padding, node.thickness * (node.arrowhead.x + node.arrowhead.dx + 1));
};
exports.arrowHead = arrowHead;
var arrowBBoxHD = function (node, TRBL) {
    if (node.childNodes[0]) {
        var _a = node.childNodes[0].getBBox(), h = _a.h, d = _a.d;
        TRBL[0] = TRBL[2] = Math.max(0, node.thickness * node.arrowhead.y - (h + d) / 2);
    }
    return TRBL;
};
exports.arrowBBoxHD = arrowBBoxHD;
var arrowBBoxW = function (node, TRBL) {
    if (node.childNodes[0]) {
        var w = node.childNodes[0].getBBox().w;
        TRBL[1] = TRBL[3] = Math.max(0, node.thickness * node.arrowhead.y - w / 2);
    }
    return TRBL;
};
exports.arrowBBoxW = arrowBBoxW;
exports.arrowDef = {
    up: [-Math.PI / 2, false, true, 'verticalstrike'],
    down: [Math.PI / 2, false, true, 'verticakstrike'],
    right: [0, false, false, 'horizontalstrike'],
    left: [Math.PI, false, false, 'horizontalstrike'],
    updown: [Math.PI / 2, true, true, 'verticalstrike uparrow downarrow'],
    leftright: [0, true, false, 'horizontalstrike leftarrow rightarrow']
};
exports.diagonalArrowDef = {
    updiagonal: [-1, 0, false, 'updiagonalstrike northeastarrow'],
    northeast: [-1, 0, false, 'updiagonalstrike updiagonalarrow'],
    southeast: [1, 0, false, 'downdiagonalstrike'],
    northwest: [1, Math.PI, false, 'downdiagonalstrike'],
    southwest: [-1, Math.PI, false, 'updiagonalstrike'],
    northeastsouthwest: [-1, 0, true, 'updiagonalstrike northeastarrow updiagonalarrow southwestarrow'],
    northwestsoutheast: [1, 0, true, 'downdiagonalstrike northwestarrow southeastarrow']
};
exports.arrowBBox = {
    up: function (node) { return (0, exports.arrowBBoxW)(node, [(0, exports.arrowHead)(node), 0, node.padding, 0]); },
    down: function (node) { return (0, exports.arrowBBoxW)(node, [node.padding, 0, (0, exports.arrowHead)(node), 0]); },
    right: function (node) { return (0, exports.arrowBBoxHD)(node, [0, (0, exports.arrowHead)(node), 0, node.padding]); },
    left: function (node) { return (0, exports.arrowBBoxHD)(node, [0, node.padding, 0, (0, exports.arrowHead)(node)]); },
    updown: function (node) { return (0, exports.arrowBBoxW)(node, [(0, exports.arrowHead)(node), 0, (0, exports.arrowHead)(node), 0]); },
    leftright: function (node) { return (0, exports.arrowBBoxHD)(node, [0, (0, exports.arrowHead)(node), 0, (0, exports.arrowHead)(node)]); }
};
var CommonBorder = function (render) {
    return function (side) {
        var i = exports.sideIndex[side];
        return [side, {
                renderer: render,
                bbox: function (node) {
                    var bbox = [0, 0, 0, 0];
                    bbox[i] = node.thickness + node.padding;
                    return bbox;
                },
                border: function (node) {
                    var bbox = [0, 0, 0, 0];
                    bbox[i] = node.thickness;
                    return bbox;
                }
            }];
    };
};
exports.CommonBorder = CommonBorder;
var CommonBorder2 = function (render) {
    return function (name, side1, side2) {
        var i1 = exports.sideIndex[side1];
        var i2 = exports.sideIndex[side2];
        return [name, {
                renderer: render,
                bbox: function (node) {
                    var t = node.thickness + node.padding;
                    var bbox = [0, 0, 0, 0];
                    bbox[i1] = bbox[i2] = t;
                    return bbox;
                },
                border: function (node) {
                    var bbox = [0, 0, 0, 0];
                    bbox[i1] = bbox[i2] = node.thickness;
                    return bbox;
                },
                remove: side1 + ' ' + side2
            }];
    };
};
exports.CommonBorder2 = CommonBorder2;
var CommonDiagonalStrike = function (render) {
    return function (name) {
        var cname = 'mjx-' + name.charAt(0) + 'strike';
        return [name + 'diagonalstrike', {
                renderer: render(cname),
                bbox: exports.fullBBox
            }];
    };
};
exports.CommonDiagonalStrike = CommonDiagonalStrike;
var CommonDiagonalArrow = function (render) {
    return function (name) {
        var _a = __read(exports.diagonalArrowDef[name], 4), c = _a[0], pi = _a[1], double = _a[2], remove = _a[3];
        return [name + 'arrow', {
                renderer: function (node, _child) {
                    var _a = __read(node.arrowAW(), 2), a = _a[0], W = _a[1];
                    var arrow = node.arrow(W, c * (a - pi), double);
                    render(node, arrow);
                },
                bbox: function (node) {
                    var _a = node.arrowData(), a = _a.a, x = _a.x, y = _a.y;
                    var _b = __read([node.arrowhead.x, node.arrowhead.y, node.arrowhead.dx], 3), ax = _b[0], ay = _b[1], adx = _b[2];
                    var _c = __read(node.getArgMod(ax + adx, ay), 2), b = _c[0], ar = _c[1];
                    var dy = y + (b > a ? node.thickness * ar * Math.sin(b - a) : 0);
                    var dx = x + (b > Math.PI / 2 - a ? node.thickness * ar * Math.sin(b + a - Math.PI / 2) : 0);
                    return [dy, dx, dy, dx];
                },
                remove: remove
            }];
    };
};
exports.CommonDiagonalArrow = CommonDiagonalArrow;
var CommonArrow = function (render) {
    return function (name) {
        var _a = __read(exports.arrowDef[name], 4), angle = _a[0], double = _a[1], isVertical = _a[2], remove = _a[3];
        return [name + 'arrow', {
                renderer: function (node, _child) {
                    var _a = node.getBBox(), w = _a.w, h = _a.h, d = _a.d;
                    var _b = __read((isVertical ? [h + d, 'X'] : [w, 'Y']), 2), W = _b[0], offset = _b[1];
                    var dd = node.getOffset(offset);
                    var arrow = node.arrow(W, angle, double, offset, dd);
                    render(node, arrow);
                },
                bbox: exports.arrowBBox[name],
                remove: remove
            }];
    };
};
exports.CommonArrow = CommonArrow;
//# sourceMappingURL=Notation.js.map