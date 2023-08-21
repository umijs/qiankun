"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = require("../../rule_engine/grammar");
const messages_1 = require("../messages");
function tensToWords_(num) {
    const n = num % 100;
    if (n < 20) {
        return NUMBERS.ones[n];
    }
    const ten = Math.floor(n / 10);
    const tens = NUMBERS.tens[ten];
    const ones = NUMBERS.ones[n % 10];
    return tens && ones ? tens + (ten === 2 ? '-i-' : '-') + ones : tens || ones;
}
function hundredsToWords_(num) {
    const n = num % 1000;
    const hundred = Math.floor(n / 100);
    const hundreds = hundred
        ? hundred === 1
            ? 'cent'
            : NUMBERS.ones[hundred] + '-cents'
        : '';
    const tens = tensToWords_(n % 100);
    return hundreds && tens ? hundreds + NUMBERS.numSep + tens : hundreds || tens;
}
function numberToWords(num) {
    if (num === 0) {
        return NUMBERS.zero;
    }
    if (num >= Math.pow(10, 36)) {
        return num.toString();
    }
    let pos = 0;
    let str = '';
    while (num > 0) {
        const hundreds = num % (pos > 1 ? 1000000 : 1000);
        if (hundreds) {
            let large = NUMBERS.large[pos];
            if (!pos) {
                str = hundredsToWords_(hundreds);
            }
            else if (pos === 1) {
                str =
                    (hundreds === 1 ? '' : hundredsToWords_(hundreds) + NUMBERS.numSep) +
                        large +
                        (str ? NUMBERS.numSep + str : '');
            }
            else {
                const thousands = numberToWords(hundreds);
                large = hundreds === 1 ? large : large.replace(/\u00f3$/, 'ons');
                str =
                    thousands +
                        NUMBERS.numSep +
                        large +
                        (str ? NUMBERS.numSep + str : '');
            }
        }
        num = Math.floor(num / (pos > 1 ? 1000000 : 1000));
        pos++;
    }
    return str;
}
function numberToOrdinal(num, _plural) {
    if (num > 1999) {
        return numericOrdinal(num);
    }
    if (num <= 10) {
        return NUMBERS.special.onesOrdinals[num - 1];
    }
    const result = numberToWords(num);
    if (result.match(/mil$/)) {
        return result.replace(/mil$/, 'mil·lèsima');
    }
    if (result.match(/u$/)) {
        return result.replace(/u$/, 'vena');
    }
    if (result.match(/a$/)) {
        return result.replace(/a$/, 'ena');
    }
    return result + (result.match(/e$/) ? 'na' : 'ena');
}
function numericOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    return num.toString() + (gender === 'f' ? 'a' : 'n');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
