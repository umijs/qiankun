"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.en = void 0;
const grammar_1 = require("../../rule_engine/grammar");
const locale_1 = require("../locale");
const locale_util_1 = require("../locale_util");
const numbers_en_1 = require("../numbers/numbers_en");
const tr = require("../transformers");
let locale = null;
function en() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.en = en;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_en_1.default;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    loc.FUNCTIONS.plural = (unit) => {
        return /.*s$/.test(unit) ? unit : unit + 's';
    };
    loc.ALPHABETS.combiner = tr.Combiners.prefixCombiner;
    loc.ALPHABETS.digitTrans.default = numbers_en_1.default.numberToWords;
    loc.CORRECTIONS.article = (name) => {
        return grammar_1.Grammar.getInstance().getParameter('noArticle') ? '' : name;
    };
    return loc;
}
