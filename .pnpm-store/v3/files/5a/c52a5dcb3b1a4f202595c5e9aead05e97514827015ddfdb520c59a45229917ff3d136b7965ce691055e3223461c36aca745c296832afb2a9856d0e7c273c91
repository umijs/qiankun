"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sv = void 0;
const locale_1 = require("../locale");
const locale_util_1 = require("../locale_util");
const numbers_sv_1 = require("../numbers/numbers_sv");
const tr = require("../transformers");
let locale = null;
function sv() {
    if (!locale) {
        locale = create();
    }
    return locale;
}
exports.sv = sv;
function create() {
    const loc = (0, locale_1.createLocale)();
    loc.NUMBERS = numbers_sv_1.default;
    loc.FUNCTIONS.radicalNestDepth = locale_util_1.nestingToString;
    loc.FUNCTIONS.fontRegexp = function (font) {
        return new RegExp('((^' + font + ' )|( ' + font + '$))');
    };
    loc.ALPHABETS.combiner = tr.Combiners.prefixCombiner;
    loc.ALPHABETS.digitTrans.default = numbers_sv_1.default.numberToWords;
    loc.CORRECTIONS.correctOne = (num) => num.replace(/^ett$/, 'en');
    return loc;
}
