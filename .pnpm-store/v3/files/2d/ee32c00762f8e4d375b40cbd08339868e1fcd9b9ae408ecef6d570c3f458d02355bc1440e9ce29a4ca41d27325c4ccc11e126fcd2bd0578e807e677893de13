"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = require("../../rule_engine/grammar");
const messages_1 = require("../messages");
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    str += NUMBERS.ones[Math.floor(n / 100)]
        ? NUMBERS.ones[Math.floor(n / 100)] + NUMBERS.numSep + 'cento'
        : '';
    n = n % 100;
    if (n) {
        str += str ? NUMBERS.numSep : '';
        const ones = NUMBERS.ones[n];
        if (ones) {
            str += ones;
        }
        else {
            let tens = NUMBERS.tens[Math.floor(n / 10)];
            const rest = n % 10;
            if (rest === 1 || rest === 8) {
                tens = tens.slice(0, -1);
            }
            str += tens;
            str += rest ? NUMBERS.numSep + NUMBERS.ones[n % 10] : '';
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
    if (num === 1 && grammar_1.Grammar.getInstance().getParameter('fraction')) {
        return 'un';
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
    if (num === 2) {
        return plural ? 'mezzi' : 'mezzo';
    }
    const ordinal = wordOrdinal(num);
    if (!plural) {
        return ordinal;
    }
    const gender = ordinal.match(/o$/) ? 'i' : 'e';
    return ordinal.slice(0, -1) + gender;
}
function wordOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    const postfix = gender === 'm' ? 'o' : 'a';
    let ordinal = NUMBERS.special.onesOrdinals[num];
    if (ordinal) {
        return ordinal.slice(0, -1) + postfix;
    }
    ordinal = numberToWords(num);
    return ordinal.slice(0, -1) + 'esim' + postfix;
}
function numericOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    return num.toString() + (gender === 'm' ? 'o' : 'a');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
