"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hi = void 0;
const locale_1 = require("../locale");
const numbers_hi_1 = require("../numbers/numbers_hi");
const transformers_1 = require("../transformers");
const locale_util_1 = require("../locale_util");
let locale = null;
function hi() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.hi = hi;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_hi_1.default;
    loc.ALPHABETS.combiner = transformers_1.Combiners.prefixCombiner;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    return loc;
}
