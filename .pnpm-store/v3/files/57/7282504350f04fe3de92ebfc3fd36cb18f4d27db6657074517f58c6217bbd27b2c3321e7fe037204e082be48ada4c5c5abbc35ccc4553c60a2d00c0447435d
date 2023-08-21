"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.de = void 0;
const grammar_1 = require("../../rule_engine/grammar");
const locale_util_1 = require("../locale_util");
const locale_1 = require("../locale");
const numbers_de_1 = require("../numbers/numbers_de");
const germanPrefixCombiner = function (letter, font, cap) {
    if (cap === 's') {
        font = font
            .split(' ')
            .map(function (x) {
            return x.replace(/s$/, '');
        })
            .join(' ');
        cap = '';
    }
    letter = cap ? cap + ' ' + letter : letter;
    return font ? font + ' ' + letter : letter;
};
const germanPostfixCombiner = function (letter, font, cap) {
    letter = !cap || cap === 's' ? letter : cap + ' ' + letter;
    return font ? letter + ' ' + font : letter;
};
let locale = null;
function de() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.de = de;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_de_1.default;
    loc.COMBINERS['germanPostfix'] = germanPostfixCombiner;
    loc.ALPHABETS.combiner = germanPrefixCombiner;
    loc.FUNCTIONS.radicalNestDepth = (x) => {
        return x > 1 ? loc.NUMBERS.numberToWords(x) + 'fach' : '';
    };
    loc.FUNCTIONS.combineRootIndex = (postfix, index) => {
        const root = index ? index + 'wurzel' : '';
        return postfix.replace('Wurzel', root);
    };
    loc.FUNCTIONS.combineNestedRadical = (a, b, c) => {
        a = c.match(/exponent$/) ? a + 'r' : a;
        const count = (b ? b + ' ' : '') + a;
        return c.match(/ /) ? c.replace(/ /, ' ' + count + ' ') : count + ' ' + c;
    };
    loc.FUNCTIONS.fontRegexp = function (font) {
        font = font
            .split(' ')
            .map(function (x) {
            return x.replace(/s$/, '(|s)');
        })
            .join(' ');
        return new RegExp('((^' + font + ' )|( ' + font + '$))');
    };
    loc.CORRECTIONS.correctOne = (num) => num.replace(/^eins$/, 'ein');
    loc.CORRECTIONS.localFontNumber = (font) => {
        const realFont = (0, locale_util_1.localFont)(font);
        return realFont
            .split(' ')
            .map(function (x) {
            return x.replace(/s$/, '');
        })
            .join(' ');
    };
    loc.CORRECTIONS.lowercase = (name) => name.toLowerCase();
    loc.CORRECTIONS.article = (name) => {
        const decl = grammar_1.Grammar.getInstance().getParameter('case');
        const plural = grammar_1.Grammar.getInstance().getParameter('plural');
        if (decl === 'dative') {
            return { der: 'dem', die: plural ? 'den' : 'der', das: 'dem' }[name];
        }
        return name;
    };
    loc.CORRECTIONS.masculine = (name) => {
        const decl = grammar_1.Grammar.getInstance().getParameter('case');
        if (decl === 'dative') {
            return name + 'n';
        }
        return name;
    };
    return loc;
}
