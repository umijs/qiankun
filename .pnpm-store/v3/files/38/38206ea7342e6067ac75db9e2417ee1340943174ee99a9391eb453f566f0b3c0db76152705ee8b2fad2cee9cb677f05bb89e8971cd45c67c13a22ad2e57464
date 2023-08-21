"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrow = exports.DiagonalArrow = exports.DiagonalStrike = exports.Border2 = exports.Border = exports.RenderLine = exports.lineOffset = exports.lineData = exports.computeLineData = void 0;
var Notation = __importStar(require("../common/Notation.js"));
__exportStar(require("../common/Notation.js"), exports);
exports.computeLineData = {
    top: function (h, _d, w, t) { return [0, h - t, w, h - t]; },
    right: function (h, d, w, t) { return [w - t, -d, w - t, h]; },
    bottom: function (_h, d, w, t) { return [0, t - d, w, t - d]; },
    left: function (h, d, _w, t) { return [t, -d, t, h]; },
    vertical: function (h, d, w, _t) { return [w / 2, h, w / 2, -d]; },
    horizontal: function (h, d, w, _t) { return [0, (h - d) / 2, w, (h - d) / 2]; },
    up: function (h, d, w, t) { return [t, t - d, w - t, h - t]; },
    down: function (h, d, w, t) { return [t, h - t, w - t, t - d]; }
};
var lineData = function (node, kind, offset) {
    if (offset === void 0) { offset = ''; }
    var _a = node.getBBox(), h = _a.h, d = _a.d, w = _a.w;
    var t = node.thickness / 2;
    return (0, exports.lineOffset)(exports.computeLineData[kind](h, d, w, t), node, offset);
};
exports.lineData = lineData;
var lineOffset = function (data, node, offset) {
    if (offset) {
        var d = node.getOffset(offset);
        if (d) {
            if (offset === 'X') {
                data[0] -= d;
                data[2] -= d;
            }
            else {
                data[1] -= d;
                data[3] -= d;
            }
        }
    }
    return data;
};
exports.lineOffset = lineOffset;
var RenderLine = function (line, offset) {
    if (offset === void 0) { offset = ''; }
    return (function (node, _child) {
        var L = node.line((0, exports.lineData)(node, line, offset));
        node.adaptor.append(node.element, L);
    });
};
exports.RenderLine = RenderLine;
var Border = function (side) {
    return Notation.CommonBorder(function (node, _child) {
        node.adaptor.append(node.element, node.line((0, exports.lineData)(node, side)));
    })(side);
};
exports.Border = Border;
var Border2 = function (name, side1, side2) {
    return Notation.CommonBorder2(function (node, _child) {
        node.adaptor.append(node.element, node.line((0, exports.lineData)(node, side1)));
        node.adaptor.append(node.element, node.line((0, exports.lineData)(node, side2)));
    })(name, side1, side2);
};
exports.Border2 = Border2;
var DiagonalStrike = function (name) {
    return Notation.CommonDiagonalStrike(function (_cname) { return function (node, _child) {
        node.adaptor.append(node.element, node.line((0, exports.lineData)(node, name)));
    }; })(name);
};
exports.DiagonalStrike = DiagonalStrike;
var DiagonalArrow = function (name) {
    return Notation.CommonDiagonalArrow(function (node, arrow) {
        node.adaptor.append(node.element, arrow);
    })(name);
};
exports.DiagonalArrow = DiagonalArrow;
var Arrow = function (name) {
    return Notation.CommonArrow(function (node, arrow) {
        node.adaptor.append(node.element, arrow);
    })(name);
};
exports.Arrow = Arrow;
//# sourceMappingURL=Notation.js.map