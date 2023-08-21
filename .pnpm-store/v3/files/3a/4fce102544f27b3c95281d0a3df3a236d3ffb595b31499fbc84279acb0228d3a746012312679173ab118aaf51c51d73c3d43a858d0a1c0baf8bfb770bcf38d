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
exports.HandlerList = void 0;
var PrioritizedList_js_1 = require("../util/PrioritizedList.js");
var HandlerList = (function (_super) {
    __extends(HandlerList, _super);
    function HandlerList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HandlerList.prototype.register = function (handler) {
        return this.add(handler, handler.priority);
    };
    HandlerList.prototype.unregister = function (handler) {
        this.remove(handler);
    };
    HandlerList.prototype.handlesDocument = function (document) {
        var e_1, _a;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var item = _c.value;
                var handler = item.item;
                if (handler.handlesDocument(document)) {
                    return handler;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        throw new Error("Can't find handler for document");
    };
    HandlerList.prototype.document = function (document, options) {
        if (options === void 0) { options = null; }
        return this.handlesDocument(document).create(document, options);
    };
    return HandlerList;
}(PrioritizedList_js_1.PrioritizedList));
exports.HandlerList = HandlerList;
//# sourceMappingURL=HandlerList.js.map