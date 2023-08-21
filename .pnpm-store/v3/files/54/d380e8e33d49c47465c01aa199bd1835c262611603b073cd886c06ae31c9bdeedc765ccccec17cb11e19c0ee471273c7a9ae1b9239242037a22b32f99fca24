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
exports.CenternotConfiguration = exports.filterCenterOver = void 0;
var Configuration_js_1 = require("../Configuration.js");
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var NodeUtil_js_1 = __importDefault(require("../NodeUtil.js"));
var SymbolMap_js_1 = require("../SymbolMap.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
new SymbolMap_js_1.CommandMap('centernot', {
    centerOver: 'CenterOver',
    centernot: ['Macro', '\\centerOver{#1}{{\u29F8}}', 1]
}, {
    CenterOver: function (parser, name) {
        var arg = '{' + parser.GetArgument(name) + '}';
        var over = parser.ParseArg(name);
        var base = new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml();
        var mml = parser.create('node', 'TeXAtom', [
            new TexParser_js_1.default(arg, parser.stack.env, parser.configuration).mml(),
            parser.create('node', 'mpadded', [
                parser.create('node', 'mpadded', [over], { width: 0, lspace: '-.5width' }),
                parser.create('node', 'mphantom', [base])
            ], { width: 0, lspace: '-.5width' })
        ]);
        parser.configuration.addNode('centerOver', base);
        parser.Push(mml);
    },
    Macro: BaseMethods_js_1.default.Macro
});
function filterCenterOver(_a) {
    var e_1, _b;
    var data = _a.data;
    try {
        for (var _c = __values(data.getList('centerOver')), _d = _c.next(); !_d.done; _d = _c.next()) {
            var base = _d.value;
            var texClass = NodeUtil_js_1.default.getTexClass(base.childNodes[0].childNodes[0]);
            if (texClass !== null) {
                NodeUtil_js_1.default.setProperties(base.parent.parent.parent.parent.parent.parent, { texClass: texClass });
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
}
exports.filterCenterOver = filterCenterOver;
exports.CenternotConfiguration = Configuration_js_1.Configuration.create('centernot', {
    handler: { macro: ['centernot'] },
    postprocessors: [filterCenterOver]
});
//# sourceMappingURL=CenternotConfiguration.js.map