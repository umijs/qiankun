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
exports.CommonMlabeledtrMixin = exports.CommonMtrMixin = void 0;
function CommonMtrMixin(Base) {
    return (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(class_1.prototype, "fixesPWidth", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "numCells", {
            get: function () {
                return this.childNodes.length;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "labeled", {
            get: function () {
                return false;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(class_1.prototype, "tableCells", {
            get: function () {
                return this.childNodes;
            },
            enumerable: false,
            configurable: true
        });
        class_1.prototype.getChild = function (i) {
            return this.childNodes[i];
        };
        class_1.prototype.getChildBBoxes = function () {
            return this.childNodes.map(function (cell) { return cell.getBBox(); });
        };
        class_1.prototype.stretchChildren = function (HD) {
            var e_1, _a, e_2, _b, e_3, _c;
            if (HD === void 0) { HD = null; }
            var stretchy = [];
            var children = (this.labeled ? this.childNodes.slice(1) : this.childNodes);
            try {
                for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                    var mtd = children_1_1.value;
                    var child = mtd.childNodes[0];
                    if (child.canStretch(1)) {
                        stretchy.push(child);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            var count = stretchy.length;
            var nodeCount = this.childNodes.length;
            if (count && nodeCount > 1) {
                if (HD === null) {
                    var H = 0, D = 0;
                    var all = (count > 1 && count === nodeCount);
                    try {
                        for (var children_2 = __values(children), children_2_1 = children_2.next(); !children_2_1.done; children_2_1 = children_2.next()) {
                            var mtd = children_2_1.value;
                            var child = mtd.childNodes[0];
                            var noStretch = (child.stretch.dir === 0);
                            if (all || noStretch) {
                                var _d = child.getBBox(noStretch), h = _d.h, d = _d.d;
                                if (h > H) {
                                    H = h;
                                }
                                if (d > D) {
                                    D = d;
                                }
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (children_2_1 && !children_2_1.done && (_b = children_2.return)) _b.call(children_2);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                    HD = [H, D];
                }
                try {
                    for (var stretchy_1 = __values(stretchy), stretchy_1_1 = stretchy_1.next(); !stretchy_1_1.done; stretchy_1_1 = stretchy_1.next()) {
                        var child = stretchy_1_1.value;
                        child.coreMO().getStretchedVariant(HD);
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
        return class_1;
    }(Base));
}
exports.CommonMtrMixin = CommonMtrMixin;
function CommonMlabeledtrMixin(Base) {
    return (function (_super) {
        __extends(class_2, _super);
        function class_2() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(class_2.prototype, "numCells", {
            get: function () {
                return Math.max(0, this.childNodes.length - 1);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(class_2.prototype, "labeled", {
            get: function () {
                return true;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(class_2.prototype, "tableCells", {
            get: function () {
                return this.childNodes.slice(1);
            },
            enumerable: false,
            configurable: true
        });
        class_2.prototype.getChild = function (i) {
            return this.childNodes[i + 1];
        };
        class_2.prototype.getChildBBoxes = function () {
            return this.childNodes.slice(1).map(function (cell) { return cell.getBBox(); });
        };
        return class_2;
    }(Base));
}
exports.CommonMlabeledtrMixin = CommonMlabeledtrMixin;
//# sourceMappingURL=mtr.js.map