"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../messages");
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    str += NUMBERS.ones[Math.floor(n / 100)]
        ? NUMBERS.ones[Math.floor(n / 100)] + NUMBERS.numSep + 'hundred'
        : '';
    n = n % 100;
    if (n) {
        str += str ? NUMBERS.numSep : '';
        str +=
            NUMBERS.ones[n] ||
                NUMBERS.tens[Math.floor(n / 10)] +
                    (n % 10 ? NUMBERS.numSep + NUMBERS.ones[n % 10] : '');
    }
    return str;
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
        const hundreds = num % 1000;
        if (hundreds) {
            str =
                hundredsToWords_(num % 1000) +
                    (pos ? '-' + NUMBERS.large[pos] + '-' : '') +
                    str;
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str.replace(/-$/, '');
}
function numberToOrdinal(num, plural) {
    if (num === 1) {
        return plural ? 'oneths' : 'oneth';
    }
    if (num === 2) {
        return plural ? 'halves' : 'half';
    }
    const ordinal = wordOrdinal(num);
    return plural ? ordinal + 's' : ordinal;
}
function wordOrdinal(num) {
    let ordinal = numberToWords(num);
    if (ordinal.match(/one$/)) {
        ordinal = ordinal.slice(0, -3) + 'first';
    }
    else if (ordinal.match(/two$/)) {
        ordinal = ordinal.slice(0, -3) + 'second';
    }
    else if (ordinal.match(/three$/)) {
        ordinal = ordinal.slice(0, -5) + 'third';
    }
    else if (ordinal.match(/five$/)) {
        ordinal = ordinal.slice(0, -4) + 'fifth';
    }
    else if (ordinal.match(/eight$/)) {
        ordinal = ordinal.slice(0, -5) + 'eighth';
    }
    else if (ordinal.match(/nine$/)) {
        ordinal = ordinal.slice(0, -4) + 'ninth';
    }
    else if (ordinal.match(/twelve$/)) {
        ordinal = ordinal.slice(0, -6) + 'twelfth';
    }
    else if (ordinal.match(/ty$/)) {
        ordinal = ordinal.slice(0, -2) + 'tieth';
    }
    else {
        ordinal = ordinal + 'th';
    }
    return ordinal;
}
function numericOrdinal(num) {
    const tens = num % 100;
    const numStr = num.toString();
    if (tens > 10 && tens < 20) {
        return numStr + 'th';
    }
    switch (num % 10) {
        case 1:
            return numStr + 'st';
        case 2:
            return numStr + 'nd';
        case 3:
            return numStr + 'rd';
        default:
            return numStr + 'th';
    }
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
