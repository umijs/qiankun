"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../messages");
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    const hundreds = Math.floor(n / 100);
    str += NUMBERS.ones[hundreds]
        ? (hundreds === 1 ? '' : NUMBERS.ones[hundreds] + NUMBERS.numSep) + 'hundra'
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
function numberToWords(num, ordinal = false) {
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
            const large = NUMBERS.large[pos];
            const plural = hundreds > 1 && pos > 1 && !ordinal ? 'er' : '';
            str =
                (pos === 1 && hundreds === 1
                    ? ''
                    : (pos > 1 && hundreds === 1 ? 'en' : hundredsToWords_(num % 1000)) +
                        (pos > 1 ? ' ' : '')) +
                    (pos ? large + plural + (pos > 1 ? ' ' : '') : '') +
                    str;
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str.replace(/ $/, '');
}
function numberToOrdinal(num, plural) {
    if (num === 1) {
        return plural ? 'hel' : 'hel';
    }
    if (num === 2) {
        return plural ? 'halva' : 'halv';
    }
    let ordinal = wordOrdinal(num);
    ordinal = ordinal.match(/de$/) ? ordinal.replace(/de$/, '') : ordinal;
    return ordinal + (plural ? 'delar' : 'del');
}
function wordOrdinal(num) {
    let ordinal = numberToWords(num, true);
    if (ordinal.match(/^noll$/)) {
        ordinal = 'nollte';
    }
    else if (ordinal.match(/ett$/)) {
        ordinal = ordinal.replace(/ett$/, 'första');
    }
    else if (ordinal.match(/två$/)) {
        ordinal = ordinal.replace(/två$/, 'andra');
    }
    else if (ordinal.match(/tre$/)) {
        ordinal = ordinal.replace(/tre$/, 'tredje');
    }
    else if (ordinal.match(/fyra$/)) {
        ordinal = ordinal.replace(/fyra$/, 'fjärde');
    }
    else if (ordinal.match(/fem$/)) {
        ordinal = ordinal.replace(/fem$/, 'femte');
    }
    else if (ordinal.match(/sex$/)) {
        ordinal = ordinal.replace(/sex$/, 'sjätte');
    }
    else if (ordinal.match(/sju$/)) {
        ordinal = ordinal.replace(/sju$/, 'sjunde');
    }
    else if (ordinal.match(/åtta$/)) {
        ordinal = ordinal.replace(/åtta$/, 'åttonde');
    }
    else if (ordinal.match(/nio$/)) {
        ordinal = ordinal.replace(/nio$/, 'nionde');
    }
    else if (ordinal.match(/tio$/)) {
        ordinal = ordinal.replace(/tio$/, 'tionde');
    }
    else if (ordinal.match(/elva$/)) {
        ordinal = ordinal.replace(/elva$/, 'elfte');
    }
    else if (ordinal.match(/tolv$/)) {
        ordinal = ordinal.replace(/tolv$/, 'tolfte');
    }
    else if (ordinal.match(/tusen$/)) {
        ordinal = ordinal.replace(/tusen$/, 'tusonde');
    }
    else if (ordinal.match(/jard$/) || ordinal.match(/jon$/)) {
        ordinal = ordinal + 'te';
    }
    else {
        ordinal = ordinal + 'de';
    }
    return ordinal;
}
function numericOrdinal(num) {
    const str = num.toString();
    if (str.match(/11$|12$/)) {
        return str + ':e';
    }
    return str + (str.match(/1$|2$/) ? ':a' : ':e');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
