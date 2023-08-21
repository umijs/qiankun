"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fr = void 0;
const grammar_1 = require("../../rule_engine/grammar");
const locale_1 = require("../locale");
const locale_util_1 = require("../locale_util");
const numbers_fr_1 = require("../numbers/numbers_fr");
const transformers_1 = require("../transformers");
let locale = null;
function fr() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.fr = fr;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_fr_1.default;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    loc.FUNCTIONS.combineRootIndex = locale_util_1.combinePostfixIndex;
    loc.FUNCTIONS.combineNestedFraction = (a, b, c) => c.replace(/ $/g, '') + b + a;
    loc.FUNCTIONS.combineNestedRadical = (a, _b, c) => c + ' ' + a;
    loc.FUNCTIONS.fontRegexp = (font) => RegExp(' (en |)' + font + '$');
    loc.FUNCTIONS.plural = (unit) => {
        return /.*s$/.test(unit) ? unit : unit + 's';
    };
    loc.CORRECTIONS.article = (name) => {
        return grammar_1.Grammar.getInstance().getParameter('noArticle') ? '' : name;
    };
    loc.ALPHABETS.combiner = transformers_1.Combiners.romanceCombiner;
    loc.SUBISO = {
        default: 'fr',
        current: 'fr',
        all: ['fr', 'be', 'ch']
    };
    return loc;
}
