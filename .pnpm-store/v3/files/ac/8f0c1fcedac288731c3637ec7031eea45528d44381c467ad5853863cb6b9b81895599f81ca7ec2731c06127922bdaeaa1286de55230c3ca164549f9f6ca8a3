"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextMacrosMethods = void 0;
var TexParser_js_1 = __importDefault(require("../TexParser.js"));
var Retries_js_1 = require("../../../util/Retries.js");
var BaseMethods_js_1 = __importDefault(require("../base/BaseMethods.js"));
exports.TextMacrosMethods = {
    Comment: function (parser, _c) {
        while (parser.i < parser.string.length && parser.string.charAt(parser.i) !== '\n') {
            parser.i++;
        }
        parser.i++;
    },
    Math: function (parser, open) {
        parser.saveText();
        var i = parser.i;
        var j, c;
        var braces = 0;
        while ((c = parser.GetNext())) {
            j = parser.i++;
            switch (c) {
                case '\\':
                    var cs = parser.GetCS();
                    if (cs === ')')
                        c = '\\(';
                case '$':
                    if (braces === 0 && open === c) {
                        var config = parser.texParser.configuration;
                        var mml = (new TexParser_js_1.default(parser.string.substr(i, j - i), parser.stack.env, config)).mml();
                        parser.PushMath(mml);
                        return;
                    }
                    break;
                case '{':
                    braces++;
                    break;
                case '}':
                    if (braces === 0) {
                        parser.Error('ExtraCloseMissingOpen', 'Extra close brace or missing open brace');
                    }
                    braces--;
                    break;
            }
        }
        parser.Error('MathNotTerminated', 'Math-mode is not properly terminated');
    },
    MathModeOnly: function (parser, c) {
        parser.Error('MathModeOnly', '\'%1\' allowed only in math mode', c);
    },
    Misplaced: function (parser, c) {
        parser.Error('Misplaced', '\'%1\' can not be used here', c);
    },
    OpenBrace: function (parser, _c) {
        var env = parser.stack.env;
        parser.envStack.push(env);
        parser.stack.env = Object.assign({}, env);
    },
    CloseBrace: function (parser, _c) {
        if (parser.envStack.length) {
            parser.saveText();
            parser.stack.env = parser.envStack.pop();
        }
        else {
            parser.Error('ExtraCloseMissingOpen', 'Extra close brace or missing open brace');
        }
    },
    OpenQuote: function (parser, c) {
        if (parser.string.charAt(parser.i) === c) {
            parser.text += '\u201C';
            parser.i++;
        }
        else {
            parser.text += '\u2018';
        }
    },
    CloseQuote: function (parser, c) {
        if (parser.string.charAt(parser.i) === c) {
            parser.text += '\u201D';
            parser.i++;
        }
        else {
            parser.text += '\u2019';
        }
    },
    Tilde: function (parser, _c) {
        parser.text += '\u00A0';
    },
    Space: function (parser, _c) {
        parser.text += ' ';
        while (parser.GetNext().match(/\s/))
            parser.i++;
    },
    SelfQuote: function (parser, name) {
        parser.text += name.substr(1);
    },
    Insert: function (parser, _name, c) {
        parser.text += c;
    },
    Accent: function (parser, name, c) {
        var base = parser.ParseArg(name);
        var accent = parser.create('token', 'mo', {}, c);
        parser.addAttributes(accent);
        parser.Push(parser.create('node', 'mover', [base, accent]));
    },
    Emph: function (parser, name) {
        var variant = (parser.stack.env.mathvariant === '-tex-mathit' ? 'normal' : '-tex-mathit');
        parser.Push(parser.ParseTextArg(name, { mathvariant: variant }));
    },
    SetFont: function (parser, _name, variant) {
        parser.saveText();
        parser.stack.env.mathvariant = variant;
    },
    SetSize: function (parser, _name, size) {
        parser.saveText();
        parser.stack.env.mathsize = size;
    },
    CheckAutoload: function (parser, name) {
        var autoload = parser.configuration.packageData.get('autoload');
        var texParser = parser.texParser;
        name = name.slice(1);
        var macro = texParser.lookup('macro', name);
        if (!macro || (autoload && macro._func === autoload.Autoload)) {
            texParser.parse('macro', [texParser, name]);
            if (!macro)
                return;
            (0, Retries_js_1.retryAfter)(Promise.resolve());
        }
        texParser.parse('macro', [parser, name]);
    },
    Macro: BaseMethods_js_1.default.Macro,
    Spacer: BaseMethods_js_1.default.Spacer,
    Hskip: BaseMethods_js_1.default.Hskip,
    rule: BaseMethods_js_1.default.rule,
    Rule: BaseMethods_js_1.default.Rule,
    HandleRef: BaseMethods_js_1.default.HandleRef
};
//# sourceMappingURL=TextMacrosMethods.js.map