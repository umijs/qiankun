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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonMencloseMixin = void 0;
var Notation = __importStar(require("../Notation.js"));
var string_js_1 = require("../../../util/string.js");
function CommonMencloseMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
            _this.notations = {};
            _this.renderChild = null;
            _this.msqrt = null;
            _this.padding = Notation.PADDING;
            _this.thickness = Notation.THICKNESS;
            _this.arrowhead = { x: Notation.ARROWX, y: Notation.ARROWY, dx: Notation.ARROWDX };
            _this.TRBL = [0, 0, 0, 0];
            _this.getParameters();
            _this.getNotations();
            _this.removeRedundantNotations();
            _this.initializeNotations();
            _this.TRBL = _this.getBBoxExtenders();
            return _this;
        }
        class_1.prototype.getParameters = function () {
            var attributes = this.node.attributes;
            var padding = attributes.get('data-padding');
            if (padding !== undefined) {
                this.padding = this.length2em(padding, Notation.PADDING);
            }
            var thickness = attributes.get('data-thickness');
            if (thickness !== undefined) {
                this.thickness = this.length2em(thickness, Notation.THICKNESS);
            }
            var arrowhead = attributes.get('data-arrowhead');
            if (arrowhead !== undefined) {
                var _b = __read((0, string_js_1.split)(arrowhead), 3), x = _b[0], y = _b[1], dx = _b[2];
                this.arrowhead = {
                    x: (x ? parseFloat(x) : Notation.ARROWX),
                    y: (y ? parseFloat(y) : Notation.ARROWY),
                    dx: (dx ? parseFloat(dx) : Notation.ARROWDX)
                };
            }
        };
        class_1.prototype.getNotations = function () {
            var e_1, _b;
            var Notations = this.constructor.notations;
            try {
                for (var _c = __values((0, string_js_1.split)(this.node.attributes.get('notation'))), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_1 = _d.value;
                    var notation = Notations.get(name_1);
                    if (notation) {
                        this.notations[name_1] = notation;
                        if (notation.renderChild) {
                            this.renderChild = notation.renderer;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        class_1.prototype.removeRedundantNotations = function () {
            var e_2, _b, e_3, _c;
            try {
                for (var _d = __values(Object.keys(this.notations)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var name_2 = _e.value;
                    if (this.notations[name_2]) {
                        var remove = this.notations[name_2].remove || '';
                        try {
                            for (var _f = (e_3 = void 0, __values(remove.split(/ /))), _g = _f.next(); !_g.done; _g = _f.next()) {
                                var notation = _g.value;
                                delete this.notations[notation];
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        class_1.prototype.initializeNotations = function () {
            var e_4, _b;
            try {
                for (var _c = __values(Object.keys(this.notations)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_3 = _d.value;
                    var init = this.notations[name_3].init;
                    init && init(this);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        class_1.prototype.computeBBox = function (bbox, recompute) {
            if (recompute === void 0) { recompute = false; }
            var _b = __read(this.TRBL, 4), T = _b[0], R = _b[1], B = _b[2], L = _b[3];
            var child = this.childNodes[0].getBBox();
            bbox.combine(child, L, 0);
            bbox.h += T;
            bbox.d += B;
            bbox.w += R;
            this.setChildPWidths(recompute);
        };
        class_1.prototype.getBBoxExtenders = function () {
            var e_5, _b;
            var TRBL = [0, 0, 0, 0];
            try {
                for (var _c = __values(Object.keys(this.notations)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_4 = _d.value;
                    this.maximizeEntries(TRBL, this.notations[name_4].bbox(this));
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_5) throw e_5.error; }
            }
            return TRBL;
        };
        class_1.prototype.getPadding = function () {
            var e_6, _b;
            var _this = this;
            var BTRBL = [0, 0, 0, 0];
            try {
                for (var _c = __values(Object.keys(this.notations)), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var name_5 = _d.value;
                    var border = this.notations[name_5].border;
                    if (border) {
                        this.maximizeEntries(BTRBL, border(this));
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return [0, 1, 2, 3].map(function (i) { return _this.TRBL[i] - BTRBL[i]; });
        };
        class_1.prototype.maximizeEntries = function (X, Y) {
            for (var i = 0; i < X.length; i++) {
                if (X[i] < Y[i]) {
                    X[i] = Y[i];
                }
            }
        };
        class_1.prototype.getOffset = function (direction) {
            var _b = __read(this.TRBL, 4), T = _b[0], R = _b[1], B = _b[2], L = _b[3];
            var d = (direction === 'X' ? R - L : B - T) / 2;
            return (Math.abs(d) > .001 ? d : 0);
        };
        class_1.prototype.getArgMod = function (w, h) {
            return [Math.atan2(h, w), Math.sqrt(w * w + h * h)];
        };
        class_1.prototype.arrow = function (_w, _a, _double, _offset, _dist) {
            if (_offset === void 0) { _offset = ''; }
            if (_dist === void 0) { _dist = 0; }
            return null;
        };
        class_1.prototype.arrowData = function () {
            var _b = __read([this.padding, this.thickness], 2), p = _b[0], t = _b[1];
            var r = t * (this.arrowhead.x + Math.max(1, this.arrowhead.dx));
            var _c = this.childNodes[0].getBBox(), h = _c.h, d = _c.d, w = _c.w;
            var H = h + d;
            var R = Math.sqrt(H * H + w * w);
            var x = Math.max(p, r * w / R);
            var y = Math.max(p, r * H / R);
            var _d = __read(this.getArgMod(w + 2 * x, H + 2 * y), 2), a = _d[0], W = _d[1];
            return { a: a, W: W, x: x, y: y };
        };
        class_1.prototype.arrowAW = function () {
            var _b = this.childNodes[0].getBBox(), h = _b.h, d = _b.d, w = _b.w;
            var _c = __read(this.TRBL, 4), T = _c[0], R = _c[1], B = _c[2], L = _c[3];
            return this.getArgMod(L + w + R, T + h + d + B);
        };
        class_1.prototype.createMsqrt = function (child) {
            var mmlFactory = this.node.factory;
            var mml = mmlFactory.create('msqrt');
            mml.inheritAttributesFrom(this.node);
            mml.childNodes[0] = child.node;
            var node = this.wrap(mml);
            node.parent = this;
            return node;
        };
        class_1.prototype.sqrtTRBL = function () {
            var bbox = this.msqrt.getBBox();
            var cbox = this.msqrt.childNodes[0].getBBox();
            return [bbox.h - cbox.h, 0, bbox.d - cbox.d, bbox.w - cbox.w];
        };
        return class_1;
    }(Base));
}
exports.CommonMencloseMixin = CommonMencloseMixin;
//# sourceMappingURL=menclose.js.map