"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammar_1 = require("../../rule_engine/grammar");
const messages_1 = require("../messages");
function tensToWords_(num) {
    const n = num % 100;
    if (n < 30) {
        return NUMBERS.ones[n];
    }
    const tens = NUMBERS.tens[Math.floor(n / 10)];
    const ones = NUMBERS.ones[n % 10];
    return tens && ones ? tens + ' y ' + ones : tens || ones;
}
function hundredsToWords_(num) {
    const n = num % 1000;
    const hundred = Math.floor(n / 100);
    const hundreds = NUMBERS.special.hundreds[hundred];
    const tens = tensToWords_(n % 100);
    if (hundred === 1) {
        if (!tens) {
            return hundreds;
        }
        return hundreds + 'to' + ' ' + tens;
    }
    return hundreds && tens ? hundreds + ' ' + tens : hundreds || tens;
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
            let large = NUMBERS.large[pos];
            const huns = hundredsToWords_(hundreds);
            if (!pos) {
                str = huns;
            }
            else if (hundreds === 1) {
                large = large.match('/^mil( |$)/') ? large : 'un ' + large;
                str = large + (str ? ' ' + str : '');
            }
            else {
                large = large.replace(/\u00f3n$/, 'ones');
                str = hundredsToWords_(hundreds) + ' ' + large + (str ? ' ' + str : '');
            }
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str;
}
function numberToOrdinal(num, _plural) {
    if (num > 1999) {
        return num.toString() + 'a';
    }
    if (num <= 12) {
        return NUMBERS.special.onesOrdinals[num - 1];
    }
    const result = [];
    if (num >= 1000) {
        num = num - 1000;
        result.push('milésima');
    }
    if (!num) {
        return result.join(' ');
    }
    let pos = 0;
    pos = Math.floor(num / 100);
    if (pos > 0) {
        result.push(NUMBERS.special.hundredsOrdinals[pos - 1]);
        num = num % 100;
    }
    if (num <= 12) {
        result.push(NUMBERS.special.onesOrdinals[num - 1]);
    }
    else {
        pos = Math.floor(num / 10);
        if (pos > 0) {
            result.push(NUMBERS.special.tensOrdinals[pos - 1]);
            num = num % 10;
        }
        if (num > 0) {
            result.push(NUMBERS.special.onesOrdinals[num - 1]);
        }
    }
    return result.join(' ');
}
function numericOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    return num.toString() + (gender === 'f' ? 'a' : 'o');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
