"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../messages");
function onePrefix_(num, mill = false) {
    return num === NUMBERS.ones[1] ? (mill ? 'et' : 'en') : num;
}
function hundredsToWords_(num, ordinal = false) {
    let n = num % 1000;
    let str = '';
    let ones = NUMBERS.ones[Math.floor(n / 100)];
    str += ones ? onePrefix_(ones, true) + ' hundrede' : '';
    n = n % 100;
    if (n) {
        str += str ? ' og ' : '';
        ones = ordinal ? NUMBERS.special.smallOrdinals[n] : NUMBERS.ones[n];
        if (ones) {
            str += ones;
        }
        else {
            const tens = ordinal
                ? NUMBERS.special.tensOrdinals[Math.floor(n / 10)]
                : NUMBERS.tens[Math.floor(n / 10)];
            ones = NUMBERS.ones[n % 10];
            str += ones ? onePrefix_(ones) + 'og' + tens : tens;
        }
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
            const hund = hundredsToWords_(hundreds, ordinal && !pos);
            if (pos) {
                const large = NUMBERS.large[pos];
                const plural = hundreds > 1 ? 'er' : '';
                str =
                    onePrefix_(hund, pos <= 1) +
                        ' ' +
                        large +
                        plural +
                        (str ? ' og ' : '') +
                        str;
            }
            else {
                str = onePrefix_(hund) + str;
            }
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str;
}
function numberToOrdinal(num, plural) {
    if (num === 1) {
        return plural ? 'hel' : 'hele';
    }
    if (num === 2) {
        return plural ? 'halv' : 'halve';
    }
    return wordOrdinal(num) + (plural ? 'dele' : 'del');
}
function wordOrdinal(num) {
    if (num % 100) {
        return numberToWords(num, true);
    }
    const ordinal = numberToWords(num);
    return ordinal.match(/e$/) ? ordinal : ordinal + 'e';
}
function numericOrdinal(num) {
    return num.toString() + '.';
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
