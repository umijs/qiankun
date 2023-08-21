"use strict";
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
exports.AbstractDOMAdaptor = void 0;
var AbstractDOMAdaptor = (function () {
    function AbstractDOMAdaptor(document) {
        if (document === void 0) { document = null; }
        this.document = document;
    }
    AbstractDOMAdaptor.prototype.node = function (kind, def, children, ns) {
        var e_1, _a;
        if (def === void 0) { def = {}; }
        if (children === void 0) { children = []; }
        var node = this.create(kind, ns);
        this.setAttributes(node, def);
        try {
            for (var children_1 = __values(children), children_1_1 = children_1.next(); !children_1_1.done; children_1_1 = children_1.next()) {
                var child = children_1_1.value;
                this.append(node, child);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (children_1_1 && !children_1_1.done && (_a = children_1.return)) _a.call(children_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return node;
    };
    AbstractDOMAdaptor.prototype.setAttributes = function (node, def) {
        var e_2, _a, e_3, _b, e_4, _c;
        if (def.style && typeof (def.style) !== 'string') {
            try {
                for (var _d = __values(Object.keys(def.style)), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var key = _e.value;
                    this.setStyle(node, key.replace(/-([a-z])/g, function (_m, c) { return c.toUpperCase(); }), def.style[key]);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (def.properties) {
            try {
                for (var _f = __values(Object.keys(def.properties)), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var key = _g.value;
                    node[key] = def.properties[key];
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        try {
            for (var _h = __values(Object.keys(def)), _j = _h.next(); !_j.done; _j = _h.next()) {
                var key = _j.value;
                if ((key !== 'style' || typeof (def.style) === 'string') && key !== 'properties') {
                    this.setAttribute(node, key, def[key]);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    AbstractDOMAdaptor.prototype.replace = function (nnode, onode) {
        this.insert(nnode, onode);
        this.remove(onode);
        return onode;
    };
    AbstractDOMAdaptor.prototype.childNode = function (node, i) {
        return this.childNodes(node)[i];
    };
    AbstractDOMAdaptor.prototype.allClasses = function (node) {
        var classes = this.getAttribute(node, 'class');
        return (!classes ? [] :
            classes.replace(/  +/g, ' ').replace(/^ /, '').replace(/ $/, '').split(/ /));
    };
    return AbstractDOMAdaptor;
}());
exports.AbstractDOMAdaptor = AbstractDOMAdaptor;
//# sourceMappingURL=DOMAdaptor.js.map