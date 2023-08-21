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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathtoolsConfiguration = exports.fixPrescripts = exports.PAIREDDELIMS = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var Options_js_1 = require("../../../util/Options.js");
require("./MathtoolsMappings.js");
var MathtoolsUtil_js_1 = require("./MathtoolsUtil.js");
var MathtoolsTags_js_1 = require("./MathtoolsTags.js");
var MathtoolsItems_js_1 = require("./MathtoolsItems.js");
exports.PAIREDDELIMS = 'mathtools-paired-delims';
function initMathtools(config) {
    new SymbolMap_js_1.CommandMap(exports.PAIREDDELIMS, {}, {});
    config.append(Configuration_js_1.Configuration.local({ handler: { macro: [exports.PAIREDDELIMS] }, priority: -5 }));
}
function configMathtools(config, jax) {
    var e_1, _a;
    var parser = jax.parseOptions;
    var pairedDelims = parser.options.mathtools.pairedDelimiters;
    try {
        for (var _b = __values(Object.keys(pairedDelims)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var cs = _c.value;
            MathtoolsUtil_js_1.MathtoolsUtil.addPairedDelims(parser, cs, pairedDelims[cs]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    (0, MathtoolsTags_js_1.MathtoolsTagFormat)(config, jax);
}
function fixPrescripts(_a) {
    var e_2, _b, e_3, _c, e_4, _d;
    var data = _a.data;
    try {
        for (var _e = __values(data.getList('mmultiscripts')), _f = _e.next(); !_f.done; _f = _e.next()) {
            var node = _f.value;
            if (!node.getProperty('fixPrescript'))
                continue;
            var childNodes = NodeUtil_js_1.default.getChildren(node);
            var n = 0;
            try {
                for (var _g = (e_3 = void 0, __values([1, 2])), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var i = _h.value;
                    if (!childNodes[i]) {
                        NodeUtil_js_1.default.setChild(node, i, data.nodeFactory.create('node', 'none'));
                        n++;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _j = (e_4 = void 0, __values([4, 5])), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var i = _k.value;
                    if (NodeUtil_js_1.default.isType(childNodes[i], 'mrow') && NodeUtil_js_1.default.getChildren(childNodes[i]).length === 0) {
                        NodeUtil_js_1.default.setChild(node, i, data.nodeFactory.create('node', 'none'));
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_d = _j.return)) _d.call(_j);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (n === 2) {
                childNodes.splice(1, 2);
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
exports.fixPrescripts = fixPrescripts;
exports.MathtoolsConfiguration = Configuration_js_1.Configuration.create('mathtools', {
    handler: {
        macro: ['mathtools-macros', 'mathtools-delimiters'],
        environment: ['mathtools-environments'],
        delimiter: ['mathtools-delimiters'],
        character: ['mathtools-characters']
    },
    items: (_a = {},
        _a[MathtoolsItems_js_1.MultlinedItem.prototype.kind] = MathtoolsItems_js_1.MultlinedItem,
        _a),
    init: initMathtools,
    config: configMathtools,
    postprocessors: [[fixPrescripts, -6]],
    options: {
        mathtools: {
            'multlinegap': '1em',
            'multlined-pos': 'c',
            'firstline-afterskip': '',
            'lastline-preskip': '',
            'smallmatrix-align': 'c',
            'shortvdotsadjustabove': '.2em',
            'shortvdotsadjustbelow': '.2em',
            'centercolon': false,
            'centercolon-offset': '.04em',
            'thincolon-dx': '-.04em',
            'thincolon-dw': '-.08em',
            'use-unicode': false,
            'prescript-sub-format': '',
            'prescript-sup-format': '',
            'prescript-arg-format': '',
            'allow-mathtoolsset': true,
            pairedDelimiters: (0, Options_js_1.expandable)({}),
            tagforms: (0, Options_js_1.expandable)({}),
        }
    }
});
//# sourceMappingURL=MathtoolsConfiguration.js.map