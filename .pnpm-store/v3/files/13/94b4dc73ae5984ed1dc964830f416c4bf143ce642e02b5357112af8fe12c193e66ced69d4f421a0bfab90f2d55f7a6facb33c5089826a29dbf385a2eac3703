"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.it = void 0;
const locale_util_1 = require("../locale_util");
const locale_1 = require("../locale");
const numbers_it_1 = require("../numbers/numbers_it");
const transformers_1 = require("../transformers");
const italianPostfixCombiner = function (letter, font, cap) {
    if (letter.match(/^[a-zA-Z]$/)) {
        font = font.replace('cerchiato', 'cerchiata');
    }
    letter = cap ? letter + ' ' + cap : letter;
    return font ? letter + ' ' + font : letter;
};
let locale = null;
function it() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.it = it;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_it_1.default;
    loc.COMBINERS['italianPostfix'] = italianPostfixCombiner;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    loc.FUNCTIONS.combineRootIndex = locale_util_1.combinePostfixIndex;
    loc.FUNCTIONS.combineNestedFraction = (a, b, c) => c.replace(/ $/g, '') + b + a;
    loc.FUNCTIONS.combineNestedRadical = (a, _b, c) => c + ' ' + a;
    loc.FUNCTIONS.fontRegexp = (font) => RegExp(' (en |)' + font + '$');
    loc.ALPHABETS.combiner = transformers_1.Combiners.romanceCombiner;
    return loc;
}
