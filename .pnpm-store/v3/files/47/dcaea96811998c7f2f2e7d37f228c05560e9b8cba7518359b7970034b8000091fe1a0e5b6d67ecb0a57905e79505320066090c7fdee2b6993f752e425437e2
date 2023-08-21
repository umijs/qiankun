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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpheqConfiguration = exports.EmpheqMethods = exports.EmpheqBeginItem = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var TexError_js_1 = __importDefault(require("../TexError.js"));
var BaseItems_js_1 = require("../base/BaseItems.js");
var EmpheqUtil_js_1 = require("./EmpheqUtil.js");
var EmpheqBeginItem = (function (_super) {
    __extends(EmpheqBeginItem, _super);
    function EmpheqBeginItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(EmpheqBeginItem.prototype, "kind", {
        get: function () {
            return 'empheq-begin';
        },
        enumerable: false,
        configurable: true
    });
    EmpheqBeginItem.prototype.checkItem = function (item) {
        if (item.isKind('end') && item.getName() === this.getName()) {
            this.setProperty('end', false);
        }
        return _super.prototype.checkItem.call(this, item);
    };
    return EmpheqBeginItem;
}(BaseItems_js_1.BeginItem));
exports.EmpheqBeginItem = EmpheqBeginItem;
exports.EmpheqMethods = {
    Empheq: function (parser, begin) {
        if (parser.stack.env.closing === begin.getName()) {
            delete parser.stack.env.closing;
            parser.Push(parser.itemFactory.create('end').setProperty('name', parser.stack.global.empheq));
            parser.stack.global.empheq = '';
            var empheq = parser.stack.Top();
            EmpheqUtil_js_1.EmpheqUtil.adjustTable(empheq, parser);
            parser.Push(parser.itemFactory.create('end').setProperty('name', 'empheq'));
        }
        else {
            ParseUtil_js_1.default.checkEqnEnv(parser);
            delete parser.stack.global.eqnenv;
            var opts = parser.GetBrackets('\\begin{' + begin.getName() + '}') || '';
            var _a = __read((parser.GetArgument('\\begin{' + begin.getName() + '}') || '').split(/=/), 2), env = _a[0], n = _a[1];
            if (!EmpheqUtil_js_1.EmpheqUtil.checkEnv(env)) {
                throw new TexError_js_1.default('UnknownEnv', 'Unknown environment "%1"', env);
            }
            if (opts) {
                begin.setProperties(EmpheqUtil_js_1.EmpheqUtil.splitOptions(opts, { left: 1, right: 1 }));
            }
            parser.stack.global.empheq = env;
            parser.string = '\\begin{' + env + '}' + (n ? '{' + n + '}' : '') + parser.string.slice(parser.i);
            parser.i = 0;
            parser.Push(begin);
        }
    },
    EmpheqMO: function (parser, _name, c) {
        parser.Push(parser.create('token', 'mo', {}, c));
    },
    EmpheqDelim: function (parser, name) {
        var c = parser.GetDelimiter(name);
        parser.Push(parser.create('token', 'mo', { stretchy: true, symmetric: true }, c));
    }
};
new SymbolMap_js_1.EnvironmentMap('empheq-env', EmpheqUtil_js_1.EmpheqUtil.environment, {
    empheq: ['Empheq', 'empheq'],
}, exports.EmpheqMethods);
new SymbolMap_js_1.CommandMap('empheq-macros', {
    empheqlbrace: ['EmpheqMO', '{'],
    empheqrbrace: ['EmpheqMO', '}'],
    empheqlbrack: ['EmpheqMO', '['],
    empheqrbrack: ['EmpheqMO', ']'],
    empheqlangle: ['EmpheqMO', '\u27E8'],
    empheqrangle: ['EmpheqMO', '\u27E9'],
    empheqlparen: ['EmpheqMO', '('],
    empheqrparen: ['EmpheqMO', ')'],
    empheqlvert: ['EmpheqMO', '|'],
    empheqrvert: ['EmpheqMO', '|'],
    empheqlVert: ['EmpheqMO', '\u2016'],
    empheqrVert: ['EmpheqMO', '\u2016'],
    empheqlfloor: ['EmpheqMO', '\u230A'],
    empheqrfloor: ['EmpheqMO', '\u230B'],
    empheqlceil: ['EmpheqMO', '\u2308'],
    empheqrceil: ['EmpheqMO', '\u2309'],
    empheqbiglbrace: ['EmpheqMO', '{'],
    empheqbigrbrace: ['EmpheqMO', '}'],
    empheqbiglbrack: ['EmpheqMO', '['],
    empheqbigrbrack: ['EmpheqMO', ']'],
    empheqbiglangle: ['EmpheqMO', '\u27E8'],
    empheqbigrangle: ['EmpheqMO', '\u27E9'],
    empheqbiglparen: ['EmpheqMO', '('],
    empheqbigrparen: ['EmpheqMO', ')'],
    empheqbiglvert: ['EmpheqMO', '|'],
    empheqbigrvert: ['EmpheqMO', '|'],
    empheqbiglVert: ['EmpheqMO', '\u2016'],
    empheqbigrVert: ['EmpheqMO', '\u2016'],
    empheqbiglfloor: ['EmpheqMO', '\u230A'],
    empheqbigrfloor: ['EmpheqMO', '\u230B'],
    empheqbiglceil: ['EmpheqMO', '\u2308'],
    empheqbigrceil: ['EmpheqMO', '\u2309'],
    empheql: 'EmpheqDelim',
    empheqr: 'EmpheqDelim',
    empheqbigl: 'EmpheqDelim',
    empheqbigr: 'EmpheqDelim'
}, exports.EmpheqMethods);
exports.EmpheqConfiguration = Configuration_js_1.Configuration.create('empheq', {
    handler: {
        macro: ['empheq-macros'],
        environment: ['empheq-env'],
    },
    items: (_a = {},
        _a[EmpheqBeginItem.prototype.kind] = EmpheqBeginItem,
        _a)
});
//# sourceMappingURL=EmpheqConfiguration.js.map