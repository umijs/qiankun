"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nb = void 0;
const locale_1 = require("../locale");
const locale_util_1 = require("../locale_util");
const numbers_nn_1 = require("../numbers/numbers_nn");
const tr = require("../transformers");
let locale = null;
function nb() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.nb = nb;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_nn_1.default;
    loc.ALPHABETS.combiner = tr.Combiners.prefixCombiner;
    loc.ALPHABETS.digitTrans.default = numbers_nn_1.default.numberToWords;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    return loc;
}
