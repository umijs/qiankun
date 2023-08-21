"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.da = void 0;
const locale_1 = require("../locale");
const locale_util_1 = require("../locale_util");
const numbers_da_1 = require("../numbers/numbers_da");
const tr = require("../transformers");
let locale = null;
function da() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.da = da;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_da_1.default;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    loc.FUNCTIONS.fontRegexp = (font) => {
        return font === loc.ALPHABETS.capPrefix['default']
            ? RegExp('^' + font + ' ')
            : RegExp(' ' + font + '$');
    };
    loc.ALPHABETS.combiner = tr.Combiners.postfixCombiner;
    loc.ALPHABETS.digitTrans.default = numbers_da_1.default.numberToWords;
    return loc;
}
