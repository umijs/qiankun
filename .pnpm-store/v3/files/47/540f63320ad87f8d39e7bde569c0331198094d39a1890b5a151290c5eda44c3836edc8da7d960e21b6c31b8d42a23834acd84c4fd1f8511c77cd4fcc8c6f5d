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
var StackItemFactory_js_1 = __importDefault(require("./StackItemFactory.js"));
var NodeFactory_js_1 = require("./NodeFactory.js");
var NodeUtil_js_1 = __importDefault(require("./NodeUtil.js"));
var Options_js_1 = require("../../util/Options.js");
var ParseOptions = (function () {
    function ParseOptions(configuration, options) {
        if (options === void 0) { options = []; }
        this.options = {};
        this.packageData = new Map();
        this.parsers = [];
        this.root = null;
        this.nodeLists = {};
        this.error = false;
        this.handlers = configuration.handlers;
        this.nodeFactory = new NodeFactory_js_1.NodeFactory();
        this.nodeFactory.configuration = this;
        this.nodeFactory.setCreators(configuration.nodes);
        this.itemFactory = new StackItemFactory_js_1.default(configuration.items);
        this.itemFactory.configuration = this;
        Options_js_1.defaultOptions.apply(void 0, __spreadArray([this.options], __read(options), false));
        (0, Options_js_1.defaultOptions)(this.options, configuration.options);
    }
    ParseOptions.prototype.pushParser = function (parser) {
        this.parsers.unshift(parser);
    };
    ParseOptions.prototype.popParser = function () {
        this.parsers.shift();
    };
    Object.defineProperty(ParseOptions.prototype, "parser", {
        get: function () {
            return this.parsers[0];
        },
        enumerable: false,
        configurable: true
    });
    ParseOptions.prototype.clear = function () {
        this.parsers = [];
        this.root = null;
        this.nodeLists = {};
        this.error = false;
        this.tags.resetTag();
    };
    ParseOptions.prototype.addNode = function (property, node) {
        var list = this.nodeLists[property];
        if (!list) {
            list = this.nodeLists[property] = [];
        }
        list.push(node);
        if (node.kind !== property) {
            var inlists = (NodeUtil_js_1.default.getProperty(node, 'in-lists') || '');
            var lists = (inlists ? inlists.split(/,/) : []).concat(property).join(',');
            NodeUtil_js_1.default.setProperty(node, 'in-lists', lists);
        }
    };
    ParseOptions.prototype.getList = function (property) {
        var e_1, _a;
        var list = this.nodeLists[property] || [];
        var result = [];
        try {
            for (var list_1 = __values(list), list_1_1 = list_1.next(); !list_1_1.done; list_1_1 = list_1.next()) {
                var node = list_1_1.value;
                if (this.inTree(node)) {
                    result.push(node);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (list_1_1 && !list_1_1.done && (_a = list_1.return)) _a.call(list_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.nodeLists[property] = result;
        return result;
    };
    ParseOptions.prototype.removeFromList = function (property, nodes) {
        var e_2, _a;
        var list = this.nodeLists[property] || [];
        try {
            for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
                var node = nodes_1_1.value;
                var i = list.indexOf(node);
                if (i >= 0) {
                    list.splice(i, 1);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1.return)) _a.call(nodes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    ParseOptions.prototype.inTree = function (node) {
        while (node && node !== this.root) {
            node = node.parent;
        }
        return !!node;
    };
    return ParseOptions;
}());
exports.default = ParseOptions;
//# sourceMappingURL=ParseOptions.js.map