"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localeFontCombiner = exports.extractString = exports.localEnclose = exports.localRole = exports.localFont = exports.combinePostfixIndex = exports.nestingToString = void 0;
const locale_1 = require("./locale");
const transformers_1 = require("./transformers");
function nestingToString(count) {
    switch (count) {
        case 1:
            return locale_1.LOCALE.MESSAGES.MS.ONCE || '';
        case 2:
            return locale_1.LOCALE.MESSAGES.MS.TWICE;
        default:
            return count.toString();
    }
}
exports.nestingToString = nestingToString;
function combinePostfixIndex(postfix, index) {
    return postfix === locale_1.LOCALE.MESSAGES.MS.ROOTINDEX ||
        postfix === locale_1.LOCALE.MESSAGES.MS.INDEX
        ? postfix
        : postfix + ' ' + index;
}
exports.combinePostfixIndex = combinePostfixIndex;
function localFont(font) {
    return extractString(locale_1.LOCALE.MESSAGES.font[font], font);
}
exports.localFont = localFont;
function localRole(role) {
    return extractString(locale_1.LOCALE.MESSAGES.role[role], role);
}
exports.localRole = localRole;
function localEnclose(enclose) {
    return extractString(locale_1.LOCALE.MESSAGES.enclose[enclose], enclose);
}
exports.localEnclose = localEnclose;
function extractString(combiner, fallback) {
    if (combiner === undefined) {
        return fallback;
    }
    return typeof combiner === 'string' ? combiner : combiner[0];
}
exports.extractString = extractString;
function localeFontCombiner(font) {
    return typeof font === 'string'
        ? { font: font, combiner: locale_1.LOCALE.ALPHABETS.combiner }
        : {
            font: font[0],
            combiner: locale_1.LOCALE.COMBINERS[font[1]] ||
                transformers_1.Combiners[font[1]] ||
                locale_1.LOCALE.ALPHABETS.combiner
        };
}
exports.localeFontCombiner = localeFontCombiner;
