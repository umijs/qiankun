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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var MmlNode_js_1 = require("../../core/MmlTree/MmlNode.js");
var NodeUtil_js_1 = __importDefault(require("./NodeUtil.js"));
var FilterUtil;
(function (FilterUtil) {
    FilterUtil.cleanStretchy = function (arg) {
        var e_1, _a;
        var options = arg.data;
        try {
            for (var _b = __values(options.getList('fixStretchy')), _c = _b.next(); !_c.done; _c = _b.next()) {
                var mo = _c.value;
                if (NodeUtil_js_1.default.getProperty(mo, 'fixStretchy')) {
                    var symbol = NodeUtil_js_1.default.getForm(mo);
                    if (symbol && symbol[3] && symbol[3]['stretchy']) {
                        NodeUtil_js_1.default.setAttribute(mo, 'stretchy', false);
                    }
                    var parent_1 = mo.parent;
                    if (!NodeUtil_js_1.default.getTexClass(mo) && (!symbol || !symbol[2])) {
                        var texAtom = options.nodeFactory.create('node', 'TeXAtom', [mo]);
                        parent_1.replaceChild(texAtom, mo);
                        texAtom.inheritAttributesFrom(mo);
                    }
                    NodeUtil_js_1.default.removeProperties(mo, 'fixStretchy');
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
    };
    FilterUtil.cleanAttributes = function (arg) {
        var node = arg.data.root;
        node.walkTree(function (mml, _d) {
            var e_2, _a;
            var attribs = mml.attributes;
            if (!attribs) {
                return;
            }
            var keep = new Set((attribs.get('mjx-keep-attrs') || '').split(/ /));
            delete (attribs.getAllAttributes())['mjx-keep-attrs'];
            try {
                for (var _b = __values(attribs.getExplicitNames()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var key = _c.value;
                    if (!keep.has(key) && attribs.attributes[key] === mml.attributes.getInherited(key)) {
                        delete attribs.attributes[key];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }, {});
    };
    FilterUtil.combineRelations = function (arg) {
        var e_3, _a, e_4, _b;
        var remove = [];
        try {
            for (var _c = __values(arg.data.getList('mo')), _e = _c.next(); !_e.done; _e = _c.next()) {
                var mo = _e.value;
                if (mo.getProperty('relationsCombined') || !mo.parent ||
                    (mo.parent && !NodeUtil_js_1.default.isType(mo.parent, 'mrow')) ||
                    NodeUtil_js_1.default.getTexClass(mo) !== MmlNode_js_1.TEXCLASS.REL) {
                    continue;
                }
                var mml = mo.parent;
                var m2 = void 0;
                var children = mml.childNodes;
                var next = children.indexOf(mo) + 1;
                var variantForm = NodeUtil_js_1.default.getProperty(mo, 'variantForm');
                while (next < children.length && (m2 = children[next]) &&
                    NodeUtil_js_1.default.isType(m2, 'mo') &&
                    NodeUtil_js_1.default.getTexClass(m2) === MmlNode_js_1.TEXCLASS.REL) {
                    if (variantForm === NodeUtil_js_1.default.getProperty(m2, 'variantForm') &&
                        _compareExplicit(mo, m2)) {
                        NodeUtil_js_1.default.appendChildren(mo, NodeUtil_js_1.default.getChildren(m2));
                        _copyExplicit(['stretchy', 'rspace'], mo, m2);
                        try {
                            for (var _f = (e_4 = void 0, __values(m2.getPropertyNames())), _g = _f.next(); !_g.done; _g = _f.next()) {
                                var name_1 = _g.value;
                                mo.setProperty(name_1, m2.getProperty(name_1));
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        children.splice(next, 1);
                        remove.push(m2);
                        m2.parent = null;
                        m2.setProperty('relationsCombined', true);
                    }
                    else {
                        if (mo.attributes.getExplicit('rspace') == null) {
                            NodeUtil_js_1.default.setAttribute(mo, 'rspace', '0pt');
                        }
                        if (m2.attributes.getExplicit('lspace') == null) {
                            NodeUtil_js_1.default.setAttribute(m2, 'lspace', '0pt');
                        }
                        break;
                    }
                }
                mo.attributes.setInherited('form', mo.getForms()[0]);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        arg.data.removeFromList('mo', remove);
    };
    var _copyExplicit = function (attrs, node1, node2) {
        var attr1 = node1.attributes;
        var attr2 = node2.attributes;
        attrs.forEach(function (x) {
            var attr = attr2.getExplicit(x);
            if (attr != null) {
                attr1.set(x, attr);
            }
        });
    };
    var _compareExplicit = function (node1, node2) {
        var e_5, _a;
        var filter = function (attr, space) {
            var exp = attr.getExplicitNames();
            return exp.filter(function (x) {
                return x !== space &&
                    (x !== 'stretchy' ||
                        attr.getExplicit('stretchy'));
            });
        };
        var attr1 = node1.attributes;
        var attr2 = node2.attributes;
        var exp1 = filter(attr1, 'lspace');
        var exp2 = filter(attr2, 'rspace');
        if (exp1.length !== exp2.length) {
            return false;
        }
        try {
            for (var exp1_1 = __values(exp1), exp1_1_1 = exp1_1.next(); !exp1_1_1.done; exp1_1_1 = exp1_1.next()) {
                var name_2 = exp1_1_1.value;
                if (attr1.getExplicit(name_2) !== attr2.getExplicit(name_2)) {
                    return false;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (exp1_1_1 && !exp1_1_1.done && (_a = exp1_1.return)) _a.call(exp1_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return true;
    };
    var _cleanSubSup = function (options, low, up) {
        var e_6, _a;
        var remove = [];
        try {
            for (var _b = __values(options.getList('m' + low + up)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var mml = _c.value;
                var children = mml.childNodes;
                if (children[mml[low]] && children[mml[up]]) {
                    continue;
                }
                var parent_2 = mml.parent;
                var newNode = (children[mml[low]] ?
                    options.nodeFactory.create('node', 'm' + low, [children[mml.base], children[mml[low]]]) :
                    options.nodeFactory.create('node', 'm' + up, [children[mml.base], children[mml[up]]]));
                NodeUtil_js_1.default.copyAttributes(mml, newNode);
                if (parent_2) {
                    parent_2.replaceChild(newNode, mml);
                }
                else {
                    options.root = newNode;
                }
                remove.push(mml);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        options.removeFromList('m' + low + up, remove);
    };
    FilterUtil.cleanSubSup = function (arg) {
        var options = arg.data;
        if (options.error) {
            return;
        }
        _cleanSubSup(options, 'sub', 'sup');
        _cleanSubSup(options, 'under', 'over');
    };
    var _moveLimits = function (options, underover, subsup) {
        var e_7, _a;
        var remove = [];
        try {
            for (var _b = __values(options.getList(underover)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var mml = _c.value;
                if (mml.attributes.get('displaystyle')) {
                    continue;
                }
                var base = mml.childNodes[mml.base];
                var mo = base.coreMO();
                if (base.getProperty('movablelimits') && !mo.attributes.getExplicit('movablelimits')) {
                    var node = options.nodeFactory.create('node', subsup, mml.childNodes);
                    NodeUtil_js_1.default.copyAttributes(mml, node);
                    if (mml.parent) {
                        mml.parent.replaceChild(node, mml);
                    }
                    else {
                        options.root = node;
                    }
                    remove.push(mml);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
        options.removeFromList(underover, remove);
    };
    FilterUtil.moveLimits = function (arg) {
        var options = arg.data;
        _moveLimits(options, 'munderover', 'msubsup');
        _moveLimits(options, 'munder', 'msub');
        _moveLimits(options, 'mover', 'msup');
    };
    FilterUtil.setInherited = function (arg) {
        arg.data.root.setInheritedAttributes({}, arg.math['display'], 0, false);
    };
})(FilterUtil || (FilterUtil = {}));
exports.default = FilterUtil;
//# sourceMappingURL=FilterUtil.js.map