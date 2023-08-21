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
exports.CommonMtableMixin = void 0;
var BBox_js_1 = require("../../../util/BBox.js");
var string_js_1 = require("../../../util/string.js");
var numeric_js_1 = require("../../../util/numeric.js");
function CommonMtableMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spreadArray([], __read(args), false)) || this;
            _this.numCols = 0;
            _this.numRows = 0;
            _this.data = null;
            _this.pwidthCells = [];
            _this.pWidth = 0;
            _this.numCols = (0, numeric_js_1.max)(_this.tableRows.map(function (row) { return row.numCells; }));
            _this.numRows = _this.childNodes.length;
            _this.hasLabels = _this.childNodes.reduce(function (value, row) { return value || row.node.isKind('mlabeledtr'); }, false);
            _this.findContainer();
            _this.isTop = !_this.container || (_this.container.node.isKind('math') && !_this.container.parent);
            if (_this.isTop) {
                _this.jax.table = _this;
            }
            _this.getPercentageWidth();
            var attributes = _this.node.attributes;
            _this.frame = attributes.get('frame') !== 'none';
            _this.fLine = (_this.frame && attributes.get('frame') ? .07 : 0);
            _this.fSpace = (_this.frame ? _this.convertLengths(_this.getAttributeArray('framespacing')) : [0, 0]);
            _this.cSpace = _this.convertLengths(_this.getColumnAttributes('columnspacing'));
            _this.rSpace = _this.convertLengths(_this.getRowAttributes('rowspacing'));
            _this.cLines = _this.getColumnAttributes('columnlines').map(function (x) { return (x === 'none' ? 0 : .07); });
            _this.rLines = _this.getRowAttributes('rowlines').map(function (x) { return (x === 'none' ? 0 : .07); });
            _this.cWidths = _this.getColumnWidths();
            _this.stretchRows();
            _this.stretchColumns();
            return _this;
        }
        Object.defineProperty(class_1.prototype, "tableRows", {
            get: function () {
                return this.childNodes;
            },
            enumerable: false,
            configurable: true
        });
        class_1.prototype.findContainer = function () {
            var node = this;
            var parent = node.parent;
            while (parent && (parent.node.notParent || parent.node.isKind('mrow'))) {
                node = parent;
                parent = parent.parent;
            }
            this.container = parent;
            this.containerI = node.node.childPosition();
        };
        class_1.prototype.getPercentageWidth = function () {
            if (this.hasLabels) {
                this.bbox.pwidth = BBox_js_1.BBox.fullWidth;
            }
            else {
                var width = this.node.attributes.get('width');
                if ((0, string_js_1.isPercent)(width)) {
                    this.bbox.pwidth = width;
                }
            }
        };
        class_1.prototype.stretchRows = function () {
            var equal = this.node.attributes.get('equalrows');
            var HD = (equal ? this.getEqualRowHeight() : 0);
            var _a = (equal ? this.getTableData() : { H: [0], D: [0] }), H = _a.H, D = _a.D;
            var rows = this.tableRows;
            for (var i = 0; i < this.numRows; i++) {
                var hd = (equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2] : null);
                rows[i].stretchChildren(hd);
            }
        };
        class_1.prototype.stretchColumns = function () {
            for (var i = 0; i < this.numCols; i++) {
                var width = (typeof this.cWidths[i] === 'number' ? this.cWidths[i] : null);
                this.stretchColumn(i, width);
            }
        };
        class_1.prototype.stretchColumn = function (i, W) {
            var e_1, _a, e_2, _b, e_3, _c;
            var stretchy = [];
            try {
                for (var _d = __values(this.tableRows), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var row = _e.value;
                    var cell = row.getChild(i);
                    if (cell) {
                        var child = cell.childNodes[0];
                        if (child.stretch.dir === 0 &&
                            child.canStretch(2)) {
                            stretchy.push(child);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var count = stretchy.length;
            var nodeCount = this.childNodes.length;
            if (count && nodeCount > 1) {
                if (W === null) {
                    W = 0;
                    var all = (count > 1 && count === nodeCount);
                    try {
                        for (var _f = __values(this.tableRows), _g = _f.next(); !_g.done; _g = _f.next()) {
                            var row = _g.value;
                            var cell = row.getChild(i);
                            if (cell) {
                                var child = cell.childNodes[0];
                                var noStretch = (child.stretch.dir === 0);
                                if (all || noStretch) {
                                    var w = child.getBBox(noStretch).w;
                                    if (w > W) {
                                        W = w;
                                    }
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                try {
                    for (var stretchy_1 = __values(stretchy), stretchy_1_1 = stretchy_1.next(); !stretchy_1_1.done; stretchy_1_1 = stretchy_1.next()) {
                        var child = stretchy_1_1.value;
                        child.coreMO().getStretchedVariant([W]);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (stretchy_1_1 && !stretchy_1_1.done && (_c = stretchy_1.return)) _c.call(stretchy_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        };
        class_1.prototype.getTableData = function () {
            if (this.data) {
                return this.data;
            }
            var H = new Array(this.numRows).fill(0);
            var D = new Array(this.numRows).fill(0);
            var W = new Array(this.numCols).fill(0);
            var NH = new Array(this.numRows);
            var ND = new Array(this.numRows);
            var LW = [0];
            var rows = this.tableRows;
            for (var j = 0; j < rows.length; j++) {
                var M = 0;
                var row = rows[j];
                var align = row.node.attributes.get('rowalign');
                for (var i = 0; i < row.numCells; i++) {
                    var cell = row.getChild(i);
                    M = this.updateHDW(cell, i, j, align, H, D, W, M);
                    this.recordPWidthCell(cell, i);
                }
                NH[j] = H[j];
                ND[j] = D[j];
                if (row.labeled) {
                    M = this.updateHDW(row.childNodes[0], 0, j, align, H, D, LW, M);
                }
                this.extendHD(j, H, D, M);
                this.extendHD(j, NH, ND, M);
            }
            var L = LW[0];
            this.data = { H: H, D: D, W: W, NH: NH, ND: ND, L: L };
            return this.data;
        };
        class_1.prototype.updateHDW = function (cell, i, j, align, H, D, W, M) {
            var _a = cell.getBBox(), h = _a.h, d = _a.d, w = _a.w;
            var scale = cell.parent.bbox.rscale;
            if (cell.parent.bbox.rscale !== 1) {
                h *= scale;
                d *= scale;
                w *= scale;
            }
            if (this.node.getProperty('useHeight')) {
                if (h < .75)
                    h = .75;
                if (d < .25)
                    d = .25;
            }
            var m = 0;
            align = cell.node.attributes.get('rowalign') || align;
            if (align !== 'baseline' && align !== 'axis') {
                m = h + d;
                h = d = 0;
            }
            if (h > H[j])
                H[j] = h;
            if (d > D[j])
                D[j] = d;
            if (m > M)
                M = m;
            if (W && w > W[i])
                W[i] = w;
            return M;
        };
        class_1.prototype.extendHD = function (i, H, D, M) {
            var d = (M - (H[i] + D[i])) / 2;
            if (d < .00001)
                return;
            H[i] += d;
            D[i] += d;
        };
        class_1.prototype.recordPWidthCell = function (cell, i) {
            if (cell.childNodes[0] && cell.childNodes[0].getBBox().pwidth) {
                this.pwidthCells.push([cell, i]);
            }
        };
        class_1.prototype.computeBBox = function (bbox, _recompute) {
            if (_recompute === void 0) { _recompute = false; }
            var _a = this.getTableData(), H = _a.H, D = _a.D;
            var height, width;
            if (this.node.attributes.get('equalrows')) {
                var HD = this.getEqualRowHeight();
                height = (0, numeric_js_1.sum)([].concat(this.rLines, this.rSpace)) + HD * this.numRows;
            }
            else {
                height = (0, numeric_js_1.sum)(H.concat(D, this.rLines, this.rSpace));
            }
            height += 2 * (this.fLine + this.fSpace[1]);
            var CW = this.getComputedWidths();
            width = (0, numeric_js_1.sum)(CW.concat(this.cLines, this.cSpace)) + 2 * (this.fLine + this.fSpace[0]);
            var w = this.node.attributes.get('width');
            if (w !== 'auto') {
                width = Math.max(this.length2em(w, 0) + 2 * this.fLine, width);
            }
            var _b = __read(this.getBBoxHD(height), 2), h = _b[0], d = _b[1];
            bbox.h = h;
            bbox.d = d;
            bbox.w = width;
            var _c = __read(this.getBBoxLR(), 2), L = _c[0], R = _c[1];
            bbox.L = L;
            bbox.R = R;
            if (!(0, string_js_1.isPercent)(w)) {
                this.setColumnPWidths();
            }
        };
        class_1.prototype.setChildPWidths = function (_recompute, cwidth, _clear) {
            var width = this.node.attributes.get('width');
            if (!(0, string_js_1.isPercent)(width))
                return false;
            if (!this.hasLabels) {
                this.bbox.pwidth = '';
                this.container.bbox.pwidth = '';
            }
            var _a = this.bbox, w = _a.w, L = _a.L, R = _a.R;
            var labelInWidth = this.node.attributes.get('data-width-includes-label');
            var W = Math.max(w, this.length2em(width, Math.max(cwidth, L + w + R))) - (labelInWidth ? L + R : 0);
            var cols = (this.node.attributes.get('equalcolumns') ?
                Array(this.numCols).fill(this.percent(1 / Math.max(1, this.numCols))) :
                this.getColumnAttributes('columnwidth', 0));
            this.cWidths = this.getColumnWidthsFixed(cols, W);
            var CW = this.getComputedWidths();
            this.pWidth = (0, numeric_js_1.sum)(CW.concat(this.cLines, this.cSpace)) + 2 * (this.fLine + this.fSpace[0]);
            if (this.isTop) {
                this.bbox.w = this.pWidth;
            }
            this.setColumnPWidths();
            if (this.pWidth !== w) {
                this.parent.invalidateBBox();
            }
            return this.pWidth !== w;
        };
        class_1.prototype.setColumnPWidths = function () {
            var e_4, _a;
            var W = this.cWidths;
            try {
                for (var _b = __values(this.pwidthCells), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), cell = _d[0], i = _d[1];
                    if (cell.setChildPWidths(false, W[i])) {
                        cell.invalidateBBox();
                        cell.getBBox();
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
        };
        class_1.prototype.getBBoxHD = function (height) {
            var _a = __read(this.getAlignmentRow(), 2), align = _a[0], row = _a[1];
            if (row === null) {
                var a = this.font.params.axis_height;
                var h2 = height / 2;
                var HD = {
                    top: [0, height],
                    center: [h2, h2],
                    bottom: [height, 0],
                    baseline: [h2, h2],
                    axis: [h2 + a, h2 - a]
                };
                return HD[align] || [h2, h2];
            }
            else {
                var y = this.getVerticalPosition(row, align);
                return [y, height - y];
            }
        };
        class_1.prototype.getBBoxLR = function () {
            if (this.hasLabels) {
                var attributes = this.node.attributes;
                var side = attributes.get('side');
                var _a = __read(this.getPadAlignShift(side), 2), pad = _a[0], align = _a[1];
                var labels = this.hasLabels && !!attributes.get('data-width-includes-label');
                if (labels && this.frame && this.fSpace[0]) {
                    pad -= this.fSpace[0];
                }
                return (align === 'center' && !labels ? [pad, pad] :
                    side === 'left' ? [pad, 0] : [0, pad]);
            }
            return [0, 0];
        };
        class_1.prototype.getPadAlignShift = function (side) {
            var L = this.getTableData().L;
            var sep = this.length2em(this.node.attributes.get('minlabelspacing'));
            var pad = L + sep;
            var _a = __read((this.styles == null ? ['', ''] :
                [this.styles.get('padding-left'), this.styles.get('padding-right')]), 2), lpad = _a[0], rpad = _a[1];
            if (lpad || rpad) {
                pad = Math.max(pad, this.length2em(lpad || '0'), this.length2em(rpad || '0'));
            }
            var _b = __read(this.getAlignShift(), 2), align = _b[0], shift = _b[1];
            if (align === side) {
                shift = (side === 'left' ? Math.max(pad, shift) - pad : Math.min(-pad, shift) + pad);
            }
            return [pad, align, shift];
        };
        class_1.prototype.getAlignShift = function () {
            return (this.isTop ? _super.prototype.getAlignShift.call(this) :
                [this.container.getChildAlign(this.containerI), 0]);
        };
        class_1.prototype.getWidth = function () {
            return this.pWidth || this.getBBox().w;
        };
        class_1.prototype.getEqualRowHeight = function () {
            var _a = this.getTableData(), H = _a.H, D = _a.D;
            var HD = Array.from(H.keys()).map(function (i) { return H[i] + D[i]; });
            return Math.max.apply(Math, HD);
        };
        class_1.prototype.getComputedWidths = function () {
            var _this = this;
            var W = this.getTableData().W;
            var CW = Array.from(W.keys()).map(function (i) {
                return (typeof _this.cWidths[i] === 'number' ? _this.cWidths[i] : W[i]);
            });
            if (this.node.attributes.get('equalcolumns')) {
                CW = Array(CW.length).fill((0, numeric_js_1.max)(CW));
            }
            return CW;
        };
        class_1.prototype.getColumnWidths = function () {
            var width = this.node.attributes.get('width');
            if (this.node.attributes.get('equalcolumns')) {
                return this.getEqualColumns(width);
            }
            var swidths = this.getColumnAttributes('columnwidth', 0);
            if (width === 'auto') {
                return this.getColumnWidthsAuto(swidths);
            }
            if ((0, string_js_1.isPercent)(width)) {
                return this.getColumnWidthsPercent(swidths);
            }
            return this.getColumnWidthsFixed(swidths, this.length2em(width));
        };
        class_1.prototype.getEqualColumns = function (width) {
            var n = Math.max(1, this.numCols);
            var cwidth;
            if (width === 'auto') {
                var W = this.getTableData().W;
                cwidth = (0, numeric_js_1.max)(W);
            }
            else if ((0, string_js_1.isPercent)(width)) {
                cwidth = this.percent(1 / n);
            }
            else {
                var w = (0, numeric_js_1.sum)([].concat(this.cLines, this.cSpace)) + 2 * this.fSpace[0];
                cwidth = Math.max(0, this.length2em(width) - w) / n;
            }
            return Array(this.numCols).fill(cwidth);
        };
        class_1.prototype.getColumnWidthsAuto = function (swidths) {
            var _this = this;
            return swidths.map(function (x) {
                if (x === 'auto' || x === 'fit')
                    return null;
                if ((0, string_js_1.isPercent)(x))
                    return x;
                return _this.length2em(x);
            });
        };
        class_1.prototype.getColumnWidthsPercent = function (swidths) {
            var _this = this;
            var hasFit = swidths.indexOf('fit') >= 0;
            var W = (hasFit ? this.getTableData() : { W: null }).W;
            return Array.from(swidths.keys()).map(function (i) {
                var x = swidths[i];
                if (x === 'fit')
                    return null;
                if (x === 'auto')
                    return (hasFit ? W[i] : null);
                if ((0, string_js_1.isPercent)(x))
                    return x;
                return _this.length2em(x);
            });
        };
        class_1.prototype.getColumnWidthsFixed = function (swidths, width) {
            var _this = this;
            var indices = Array.from(swidths.keys());
            var fit = indices.filter(function (i) { return swidths[i] === 'fit'; });
            var auto = indices.filter(function (i) { return swidths[i] === 'auto'; });
            var n = fit.length || auto.length;
            var W = (n ? this.getTableData() : { W: null }).W;
            var cwidth = width - (0, numeric_js_1.sum)([].concat(this.cLines, this.cSpace)) - 2 * this.fSpace[0];
            var dw = cwidth;
            indices.forEach(function (i) {
                var x = swidths[i];
                dw -= (x === 'fit' || x === 'auto' ? W[i] : _this.length2em(x, cwidth));
            });
            var fw = (n && dw > 0 ? dw / n : 0);
            return indices.map(function (i) {
                var x = swidths[i];
                if (x === 'fit')
                    return W[i] + fw;
                if (x === 'auto')
                    return W[i] + (fit.length === 0 ? fw : 0);
                return _this.length2em(x, cwidth);
            });
        };
        class_1.prototype.getVerticalPosition = function (i, align) {
            var equal = this.node.attributes.get('equalrows');
            var _a = this.getTableData(), H = _a.H, D = _a.D;
            var HD = (equal ? this.getEqualRowHeight() : 0);
            var space = this.getRowHalfSpacing();
            var y = this.fLine;
            for (var j = 0; j < i; j++) {
                y += space[j] + (equal ? HD : H[j] + D[j]) + space[j + 1] + this.rLines[j];
            }
            var _b = __read((equal ? [(HD + H[i] - D[i]) / 2, (HD - H[i] + D[i]) / 2] : [H[i], D[i]]), 2), h = _b[0], d = _b[1];
            var offset = {
                top: 0,
                center: space[i] + (h + d) / 2,
                bottom: space[i] + h + d + space[i + 1],
                baseline: space[i] + h,
                axis: space[i] + h - .25
            };
            y += offset[align] || 0;
            return y;
        };
        class_1.prototype.getEmHalfSpacing = function (fspace, space, scale) {
            if (scale === void 0) { scale = 1; }
            var fspaceEm = this.em(fspace * scale);
            var spaceEm = this.addEm(space, 2 / scale);
            spaceEm.unshift(fspaceEm);
            spaceEm.push(fspaceEm);
            return spaceEm;
        };
        class_1.prototype.getRowHalfSpacing = function () {
            var space = this.rSpace.map(function (x) { return x / 2; });
            space.unshift(this.fSpace[1]);
            space.push(this.fSpace[1]);
            return space;
        };
        class_1.prototype.getColumnHalfSpacing = function () {
            var space = this.cSpace.map(function (x) { return x / 2; });
            space.unshift(this.fSpace[0]);
            space.push(this.fSpace[0]);
            return space;
        };
        class_1.prototype.getAlignmentRow = function () {
            var _a = __read((0, string_js_1.split)(this.node.attributes.get('align')), 2), align = _a[0], row = _a[1];
            if (row == null)
                return [align, null];
            var i = parseInt(row);
            if (i < 0)
                i += this.numRows + 1;
            return [align, i < 1 || i > this.numRows ? null : i - 1];
        };
        class_1.prototype.getColumnAttributes = function (name, i) {
            if (i === void 0) { i = 1; }
            var n = this.numCols - i;
            var columns = this.getAttributeArray(name);
            if (columns.length === 0)
                return null;
            while (columns.length < n) {
                columns.push(columns[columns.length - 1]);
            }
            if (columns.length > n) {
                columns.splice(n);
            }
            return columns;
        };
        class_1.prototype.getRowAttributes = function (name, i) {
            if (i === void 0) { i = 1; }
            var n = this.numRows - i;
            var rows = this.getAttributeArray(name);
            if (rows.length === 0)
                return null;
            while (rows.length < n) {
                rows.push(rows[rows.length - 1]);
            }
            if (rows.length > n) {
                rows.splice(n);
            }
            return rows;
        };
        class_1.prototype.getAttributeArray = function (name) {
            var value = this.node.attributes.get(name);
            if (!value)
                return [this.node.attributes.getDefault(name)];
            return (0, string_js_1.split)(value);
        };
        class_1.prototype.addEm = function (list, n) {
            var _this = this;
            if (n === void 0) { n = 1; }
            if (!list)
                return null;
            return list.map(function (x) { return _this.em(x / n); });
        };
        class_1.prototype.convertLengths = function (list) {
            var _this = this;
            if (!list)
                return null;
            return list.map(function (x) { return _this.length2em(x); });
        };
        return class_1;
    }(Base));
}
exports.CommonMtableMixin = CommonMtableMixin;
//# sourceMappingURL=mtable.js.map