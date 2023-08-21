"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../messages");
function onePrefix_(num, mill = false) {
    return num === NUMBERS.ones[1] ? (mill ? 'eine' : 'ein') : num;
}
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    let ones = NUMBERS.ones[Math.floor(n / 100)];
    str += ones ? onePrefix_(ones) + 'hundert' : '';
    n = n % 100;
    if (n) {
        str += str ? NUMBERS.numSep : '';
        ones = NUMBERS.ones[n];
        if (ones) {
            str += ones;
        }
        else {
            const tens = NUMBERS.tens[Math.floor(n / 10)];
            ones = NUMBERS.ones[n % 10];
            str += ones ? onePrefix_(ones) + 'und' + tens : tens;
        }
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
            const hund = hundredsToWords_(num % 1000);
            if (pos) {
                const large = NUMBERS.large[pos];
                const plural = pos > 1 && hundreds > 1 ? (large.match(/e$/) ? 'n' : 'en') : '';
                str = onePrefix_(hund, pos > 1) + large + plural + str;
            }
            else {
                str = onePrefix_(hund, pos > 1) + str;
            }
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str.replace(/ein$/, 'eins');
}
function numberToOrdinal(num, plural) {
    if (num === 1) {
        return 'eintel';
    }
    if (num === 2) {
        return plural ? 'halbe' : 'halb';
    }
    return wordOrdinal(num) + 'l';
}
function wordOrdinal(num) {
    if (num === 1) {
        return 'erste';
    }
    if (num === 3) {
        return 'dritte';
    }
    if (num === 7) {
        return 'siebte';
    }
    if (num === 8) {
        return 'achte';
    }
    const ordinal = numberToWords(num);
    return ordinal + (num < 19 ? 'te' : 'ste');
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
