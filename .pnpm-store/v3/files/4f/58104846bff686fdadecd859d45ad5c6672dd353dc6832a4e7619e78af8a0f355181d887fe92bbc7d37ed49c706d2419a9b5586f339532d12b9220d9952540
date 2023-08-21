"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextMacrosConfiguration = exports.TextBaseConfiguration = void 0;
var Configuration_js_1 = require("../Configuration.js");
var ParseOptions_js_1 = __importDefault(require("../ParseOptions.js"));
var Tags_js_1 = require("../Tags.js");
var BaseItems_js_1 = require("../base/BaseItems.js");
var TextParser_js_1 = require("./TextParser.js");
var TextMacrosMethods_js_1 = require("./TextMacrosMethods.js");
require("./TextMacrosMappings.js");
exports.TextBaseConfiguration = Configuration_js_1.Configuration.create('text-base', {
    parser: 'text',
    handler: {
        character: ['command', 'text-special'],
        macro: ['text-macros']
    },
    fallback: {
        character: function (parser, c) {
            parser.text += c;
        },
        macro: function (parser, name) {
            var texParser = parser.texParser;
            var macro = texParser.lookup('macro', name);
            if (macro && macro._func !== TextMacrosMethods_js_1.TextMacrosMethods.Macro) {
                parser.Error('MathMacro', '%1 is only supported in math mode', '\\' + name);
            }
            texParser.parse('macro', [parser, name]);
        }
    },
    items: (_a = {},
        _a[BaseItems_js_1.StartItem.prototype.kind] = BaseItems_js_1.StartItem,
        _a[BaseItems_js_1.StopItem.prototype.kind] = BaseItems_js_1.StopItem,
        _a[BaseItems_js_1.MmlItem.prototype.kind] = BaseItems_js_1.MmlItem,
        _a[BaseItems_js_1.StyleItem.prototype.kind] = BaseItems_js_1.StyleItem,
        _a)
});
function internalMath(parser, text, level, mathvariant) {
    var config = parser.configuration.packageData.get('textmacros');
    if (!(parser instanceof TextParser_js_1.TextParser)) {
        config.texParser = parser;
    }
    return [(new TextParser_js_1.TextParser(text, mathvariant ? { mathvariant: mathvariant } : {}, config.parseOptions, level)).mml()];
}
exports.TextMacrosConfiguration = Configuration_js_1.Configuration.create('textmacros', {
    config: function (_config, jax) {
        var textConf = new Configuration_js_1.ParserConfiguration(jax.parseOptions.options.textmacros.packages, ['tex', 'text']);
        textConf.init();
        var parseOptions = new ParseOptions_js_1.default(textConf, []);
        parseOptions.options = jax.parseOptions.options;
        textConf.config(jax);
        Tags_js_1.TagsFactory.addTags(textConf.tags);
        parseOptions.tags = Tags_js_1.TagsFactory.getDefault();
        parseOptions.tags.configuration = parseOptions;
        parseOptions.packageData = jax.parseOptions.packageData;
        parseOptions.packageData.set('textmacros', { parseOptions: parseOptions, jax: jax, texParser: null });
        parseOptions.options.internalMath = internalMath;
    },
    preprocessors: [function (data) {
            var config = data.data.packageData.get('textmacros');
            config.parseOptions.nodeFactory.setMmlFactory(config.jax.mmlFactory);
        }],
    options: {
        textmacros: {
            packages: ['text-base']
        }
    }
});
//# sourceMappingURL=TextMacrosConfiguration.js.map