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
exports.SetOptionsConfiguration = exports.SetOptionsUtil = void 0;
var Configuration_js_1 = require("../Configuration.js");
var SymbolMap_js_1 = require("../SymbolMap.js");
var TexError_js_1 = __importDefault(require("../TexError.js"));
var ParseUtil_js_1 = __importDefault(require("../ParseUtil.js"));
var Symbol_js_1 = require("../Symbol.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
var Options_js_1 = require("../../../util/Options.js");
exports.SetOptionsUtil = {
    filterPackage: function (parser, extension) {
        if (extension !== 'tex' && !Configuration_js_1.ConfigurationHandler.get(extension)) {
            throw new TexError_js_1.default('NotAPackage', 'Not a defined package: %1', extension);
        }
        var config = parser.options.setoptions;
        var options = config.allowOptions[extension];
        if ((options === undefined && !config.allowPackageDefault) || options === false) {
            throw new TexError_js_1.default('PackageNotSettable', 'Options can\'t be set for package "%1"', extension);
        }
        return true;
    },
    filterOption: function (parser, extension, option) {
        var _a;
        var config = parser.options.setoptions;
        var options = config.allowOptions[extension] || {};
        var allow = (options.hasOwnProperty(option) && !(0, Options_js_1.isObject)(options[option]) ? options[option] : null);
        if (allow === false || (allow === null && !config.allowOptionsDefault)) {
            throw new TexError_js_1.default('OptionNotSettable', 'Option "%1" is not allowed to be set', option);
        }
        if (!((_a = (extension === 'tex' ? parser.options : parser.options[extension])) === null || _a === void 0 ? void 0 : _a.hasOwnProperty(option))) {
            if (extension === 'tex') {
                throw new TexError_js_1.default('InvalidTexOption', 'Invalid TeX option "%1"', option);
            }
            else {
                throw new TexError_js_1.default('InvalidOptionKey', 'Invalid option "%1" for package "%2"', option, extension);
            }
        }
        return true;
    },
    filterValue: function (_parser, _extension, _option, value) {
        return value;
    }
};
var setOptionsMap = new SymbolMap_js_1.CommandMap('setoptions', {
    setOptions: 'SetOptions'
}, {
    SetOptions: function (parser, name) {
        var e_1, _a;
        var extension = parser.GetBrackets(name) || 'tex';
        var options = ParseUtil_js_1.default.keyvalOptions(parser.GetArgument(name));
        var config = parser.options.setoptions;
        if (!config.filterPackage(parser, extension))
            return;
        try {
            for (var _b = __values(Object.keys(options)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (config.filterOption(parser, extension, key)) {
                    (extension === 'tex' ? parser.options : parser.options[extension])[key] =
                        config.filterValue(parser, extension, key, options[key]);
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
    }
});
function setoptionsConfig(_config, jax) {
    var require = jax.parseOptions.handlers.get('macro').lookup('require');
    if (require) {
        setOptionsMap.add('Require', new Symbol_js_1.Macro('Require', require._func));
        setOptionsMap.add('require', new Symbol_js_1.Macro('require', BaseMethods_js_1.default.Macro, ['\\Require{#2}\\setOptions[#2]{#1}', 2, '']));
    }
}
exports.SetOptionsConfiguration = Configuration_js_1.Configuration.create('setoptions', {
    handler: { macro: ['setoptions'] },
    config: setoptionsConfig,
    priority: 3,
    options: {
        setoptions: {
            filterPackage: exports.SetOptionsUtil.filterPackage,
            filterOption: exports.SetOptionsUtil.filterOption,
            filterValue: exports.SetOptionsUtil.filterValue,
            allowPackageDefault: true,
            allowOptionsDefault: true,
            allowOptions: (0, Options_js_1.expandable)({
                tex: {
                    FindTeX: false,
                    formatError: false,
                    package: false,
                    baseURL: false,
                    tags: false,
                    maxBuffer: false,
                    maxMaxros: false,
                    macros: false,
                    environments: false
                },
                setoptions: false,
                autoload: false,
                require: false,
                configmacros: false,
                tagformat: false
            })
        }
    }
});
//# sourceMappingURL=SetOptionsConfiguration.js.map