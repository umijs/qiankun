"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = require("../../rule_engine/grammar");
const messages_1 = require("../messages");
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    str += NUMBERS.ones[Math.floor(n / 100)]
        ? NUMBERS.ones[Math.floor(n / 100)] +
            NUMBERS.numSep +
            NUMBERS.special.hundred
        : '';
    n = n % 100;
    if (n) {
        str += str ? NUMBERS.numSep : '';
        str += NUMBERS.ones[n];
    }
    return str;
}
function numberToWords(num) {
    if (num === 0) {
        return NUMBERS.zero;
    }
    if (num >= Math.pow(10, 32)) {
        return num.toString();
    }
    let pos = 0;
    let str = '';
    const hundreds = num % 1000;
    const hundredsWords = hundredsToWords_(hundreds);
    num = Math.floor(num / 1000);
    if (!num) {
        return hundredsWords;
    }
    while (num > 0) {
        const thousands = num % 100;
        if (thousands) {
            str =
                NUMBERS.ones[thousands] +
                    NUMBERS.numSep +
                    NUMBERS.large[pos] +
                    (str ? NUMBERS.numSep + str : '');
        }
        num = Math.floor(num / 100);
        pos++;
    }
    return hundredsWords ? str + NUMBERS.numSep + hundredsWords : str;
}
function numberToOrdinal(num, _plural) {
    if (num <= 10) {
        return NUMBERS.special.smallDenominators[num];
    }
    return wordOrdinal(num) + ' अंश';
}
function wordOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    if (num <= 0) {
        return num.toString();
    }
    if (num < 10) {
        return gender === 'f'
            ? NUMBERS.special.ordinalsFeminine[num]
            : NUMBERS.special.ordinalsMasculine[num];
    }
    const ordinal = numberToWords(num);
    return ordinal + (gender === 'f' ? 'वीं' : 'वाँ');
}
function numericOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    if (num > 0 && num < 10) {
        return gender === 'f'
            ? NUMBERS.special.simpleSmallOrdinalsFeminine[num]
            : NUMBERS.special.simpleSmallOrdinalsMasculine[num];
    }
    const ordinal = num
        .toString()
        .split('')
        .map(function (x) {
        const num = parseInt(x, 10);
        return isNaN(num) ? '' : NUMBERS.special.simpleNumbers[num];
    })
        .join('');
    return ordinal + (gender === 'f' ? 'वीं' : 'वाँ');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
