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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractExplorer = void 0;
var sre_js_1 = __importDefault(require("../sre.js"));
var AbstractExplorer = (function () {
    function AbstractExplorer(document, region, node) {
        var _rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            _rest[_i - 3] = arguments[_i];
        }
        this.document = document;
        this.region = region;
        this.node = node;
        this.stoppable = true;
        this.events = [];
        this.highlighter = this.getHighlighter();
        this._active = false;
    }
    AbstractExplorer.stopEvent = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        }
        else {
            event.returnValue = false;
        }
        if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
        }
        else if (event.stopPropagation) {
            event.stopPropagation();
        }
        event.cancelBubble = true;
    };
    AbstractExplorer.create = function (document, region, node) {
        var rest = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            rest[_i - 3] = arguments[_i];
        }
        var explorer = new (this.bind.apply(this, __spreadArray([void 0, document, region, node], __read(rest), false)))();
        return explorer;
    };
    AbstractExplorer.prototype.Events = function () {
        return this.events;
    };
    Object.defineProperty(AbstractExplorer.prototype, "active", {
        get: function () {
            return this._active;
        },
        set: function (flag) {
            this._active = flag;
        },
        enumerable: false,
        configurable: true
    });
    AbstractExplorer.prototype.Attach = function () {
        this.AddEvents();
    };
    AbstractExplorer.prototype.Detach = function () {
        this.RemoveEvents();
    };
    AbstractExplorer.prototype.Start = function () {
        this.highlighter = this.getHighlighter();
        this.active = true;
    };
    AbstractExplorer.prototype.Stop = function () {
        if (this.active) {
            this.region.Clear();
            this.region.Hide();
            this.active = false;
        }
    };
    AbstractExplorer.prototype.AddEvents = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.events), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), eventkind = _d[0], eventfunc = _d[1];
                this.node.addEventListener(eventkind, eventfunc);
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
    AbstractExplorer.prototype.RemoveEvents = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.events), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), eventkind = _d[0], eventfunc = _d[1];
                this.node.removeEventListener(eventkind, eventfunc);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    AbstractExplorer.prototype.Update = function (force) {
        if (force === void 0) { force = false; }
    };
    AbstractExplorer.prototype.getHighlighter = function () {
        var opts = this.document.options.a11y;
        var foreground = { color: opts.foregroundColor.toLowerCase(),
            alpha: opts.foregroundOpacity / 100 };
        var background = { color: opts.backgroundColor.toLowerCase(),
            alpha: opts.backgroundOpacity / 100 };
        return sre_js_1.default.getHighlighter(background, foreground, { renderer: this.document.outputJax.name, browser: 'v3' });
    };
    AbstractExplorer.prototype.stopEvent = function (event) {
        if (this.stoppable) {
            AbstractExplorer.stopEvent(event);
        }
    };
    return AbstractExplorer;
}());
exports.AbstractExplorer = AbstractExplorer;
//# sourceMappingURL=Explorer.js.map