"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordinalPosition = exports.vulgarFraction = exports.wordCounter = exports.ordinalCounter = void 0;
const span_1 = require("../audio/span");
const DomUtil = require("../common/dom_util");
const locale_1 = require("../l10n/locale");
const transformers_1 = require("../l10n/transformers");
function ordinalCounter(_node, context) {
    let counter = 0;
    return function () {
        return locale_1.LOCALE.NUMBERS.numericOrdinal(++counter) + ' ' + context;
    };
}
exports.ordinalCounter = ordinalCounter;
function wordCounter(_node, context) {
    let counter = 0;
    return function () {
        return locale_1.LOCALE.NUMBERS.numberToOrdinal(++counter, false) + ' ' + context;
    };
}
exports.wordCounter = wordCounter;
function vulgarFraction(node) {
    const conversion = (0, transformers_1.convertVulgarFraction)(node, locale_1.LOCALE.MESSAGES.MS.FRAC_OVER);
    if (conversion.convertible &&
        conversion.enumerator &&
        conversion.denominator) {
        return [
            new span_1.Span(locale_1.LOCALE.NUMBERS.numberToWords(conversion.enumerator), {
                extid: node.childNodes[0].childNodes[0].getAttribute('extid'),
                separator: ''
            }),
            new span_1.Span(locale_1.LOCALE.NUMBERS.vulgarSep, { separator: '' }),
            new span_1.Span(locale_1.LOCALE.NUMBERS.numberToOrdinal(conversion.denominator, conversion.enumerator !== 1), {
                extid: node.childNodes[0].childNodes[1].getAttribute('extid')
            })
        ];
    }
    return [
        new span_1.Span(conversion.content || '', { extid: node.getAttribute('extid') })
    ];
}
exports.vulgarFraction = vulgarFraction;
function ordinalPosition(node) {
    const children = DomUtil.toArray(node.parentNode.childNodes);
    return locale_1.LOCALE.NUMBERS.numericOrdinal(children.indexOf(node) + 1).toString();
}
exports.ordinalPosition = ordinalPosition;
