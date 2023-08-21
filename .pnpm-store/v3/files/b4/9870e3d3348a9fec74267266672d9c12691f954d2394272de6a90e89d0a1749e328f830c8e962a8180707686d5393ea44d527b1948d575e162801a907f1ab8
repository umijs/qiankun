"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.Safe = void 0;
var Options_js_1 = require("../../util/Options.js");
var SafeMethods_js_1 = require("./SafeMethods.js");
var Safe = (function () {
    function Safe(document, options) {
        this.filterAttributes = new Map([
            ['href', 'filterURL'],
            ['src', 'filterURL'],
            ['altimg', 'filterURL'],
            ['class', 'filterClassList'],
            ['style', 'filterStyles'],
            ['id', 'filterID'],
            ['fontsize', 'filterFontSize'],
            ['mathsize', 'filterFontSize'],
            ['scriptminsize', 'filterFontSize'],
            ['scriptsizemultiplier', 'filterSizeMultiplier'],
            ['scriptlevel', 'filterScriptLevel'],
            ['data-', 'filterData']
        ]);
        this.filterMethods = __assign({}, SafeMethods_js_1.SafeMethods);
        this.adaptor = document.adaptor;
        this.options = options;
        this.allow = this.options.allow;
    }
    Safe.prototype.sanitize = function (math, document) {
        try {
            math.root.walkTree(this.sanitizeNode.bind(this));
        }
        catch (err) {
            document.options.compileError(document, math, err);
        }
    };
    Safe.prototype.sanitizeNode = function (node) {
        var e_1, _a;
        var attributes = node.attributes.getAllAttributes();
        try {
            for (var _b = __values(Object.keys(attributes)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var id = _c.value;
                var method = this.filterAttributes.get(id);
                if (method) {
                    var value = this.filterMethods[method](this, attributes[id]);
                    if (value) {
                        if (value !== (typeof value === 'number' ? parseFloat(attributes[id]) : attributes[id])) {
                            attributes[id] = value;
                        }
                    }
                    else {
                        delete attributes[id];
                    }
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
    Safe.prototype.mmlAttribute = function (id, value) {
        if (id === 'class')
            return null;
        var method = this.filterAttributes.get(id);
        var filter = (method || (id.substr(0, 5) === 'data-' ? this.filterAttributes.get('data-') : null));
        if (!filter) {
            return value;
        }
        var result = this.filterMethods[filter](this, value, id);
        return (typeof result === 'number' || typeof result === 'boolean' ? String(result) : result);
    };
    Safe.prototype.mmlClassList = function (list) {
        var _this = this;
        return list.map(function (name) { return _this.filterMethods.filterClass(_this, name); })
            .filter(function (value) { return value !== null; });
    };
    Safe.OPTIONS = {
        allow: {
            URLs: 'safe',
            classes: 'safe',
            cssIDs: 'safe',
            styles: 'safe'
        },
        lengthMax: 3,
        scriptsizemultiplierRange: [.6, 1],
        scriptlevelRange: [-2, 2],
        classPattern: /^mjx-[-a-zA-Z0-9_.]+$/,
        idPattern: /^mjx-[-a-zA-Z0-9_.]+$/,
        dataPattern: /^data-mjx-/,
        safeProtocols: (0, Options_js_1.expandable)({
            http: true,
            https: true,
            file: true,
            javascript: false,
            data: false
        }),
        safeStyles: (0, Options_js_1.expandable)({
            color: true,
            backgroundColor: true,
            border: true,
            cursor: true,
            margin: true,
            padding: true,
            textShadow: true,
            fontFamily: true,
            fontSize: true,
            fontStyle: true,
            fontWeight: true,
            opacity: true,
            outline: true
        }),
        styleParts: (0, Options_js_1.expandable)({
            border: true,
            padding: true,
            margin: true,
            outline: true
        }),
        styleLengths: (0, Options_js_1.expandable)({
            borderTop: 'borderTopWidth',
            borderRight: 'borderRightWidth',
            borderBottom: 'borderBottomWidth',
            borderLeft: 'borderLeftWidth',
            paddingTop: true,
            paddingRight: true,
            paddingBottom: true,
            paddingLeft: true,
            marginTop: true,
            marginRight: true,
            marginBottom: true,
            marginLeft: true,
            outlineTop: true,
            outlineRight: true,
            outlineBottom: true,
            outlineLeft: true,
            fontSize: [.707, 1.44]
        })
    };
    return Safe;
}());
exports.Safe = Safe;
//# sourceMappingURL=safe.js.map