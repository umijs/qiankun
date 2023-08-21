"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const engine_1 = require("../../common/engine");
const grammar_1 = require("../../rule_engine/grammar");
const messages_1 = require("../messages");
function hundredsToWords_(num) {
    let n = num % 1000;
    let str = '';
    str += NUMBERS.ones[Math.floor(n / 100)]
        ? NUMBERS.ones[Math.floor(n / 100)] + '-cent'
        : '';
    n = n % 100;
    if (n) {
        str += str ? '-' : '';
        let ones = NUMBERS.ones[n];
        if (ones) {
            str += ones;
        }
        else {
            const tens = NUMBERS.tens[Math.floor(n / 10)];
            if (tens.match(/-dix$/)) {
                ones = NUMBERS.ones[(n % 10) + 10];
                str += tens.replace(/-dix$/, '') + '-' + ones;
            }
            else {
                str += tens + (n % 10 ? '-' + NUMBERS.ones[n % 10] : '');
            }
        }
    }
    const match = str.match(/s-\w+$/);
    return match
        ? str.replace(/s-\w+$/, match[0].slice(1))
        : str.replace(/-un$/, '-et-un');
}
function numberToWords(num) {
    if (num === 0) {
        return NUMBERS.zero;
    }
    if (num >= Math.pow(10, 36)) {
        return num.toString();
    }
    if (NUMBERS.special['tens-' + engine_1.default.getInstance().subiso]) {
        NUMBERS.tens = NUMBERS.special['tens-' + engine_1.default.getInstance().subiso];
    }
    let pos = 0;
    let str = '';
    while (num > 0) {
        const hundreds = num % 1000;
        if (hundreds) {
            let large = NUMBERS.large[pos];
            const huns = hundredsToWords_(hundreds);
            if (large && large.match(/^mille /)) {
                const rest = large.replace(/^mille /, '');
                if (str.match(RegExp(rest))) {
                    str = huns + (pos ? '-mille-' : '') + str;
                }
                else if (str.match(RegExp(rest.replace(/s$/, '')))) {
                    str =
                        huns +
                            (pos ? '-mille-' : '') +
                            str.replace(rest.replace(/s$/, ''), rest);
                }
                else {
                    str = huns + (pos ? '-' + large + '-' : '') + str;
                }
            }
            else {
                large = hundreds === 1 && large ? large.replace(/s$/, '') : large;
                str = huns + (pos ? '-' + large + '-' : '') + str;
            }
        }
        num = Math.floor(num / 1000);
        pos++;
    }
    return str.replace(/-$/, '');
}
const SMALL_ORDINAL = {
    1: 'unième',
    2: 'demi',
    3: 'tiers',
    4: 'quart'
};
function numberToOrdinal(num, plural) {
    const ordinal = SMALL_ORDINAL[num] || wordOrdinal(num);
    return num === 3 ? ordinal : plural ? ordinal + 's' : ordinal;
}
function wordOrdinal(num) {
    if (num === 1) {
        return 'première';
    }
    let ordinal = numberToWords(num);
    if (ordinal.match(/^neuf$/)) {
        ordinal = ordinal.slice(0, -1) + 'v';
    }
    else if (ordinal.match(/cinq$/)) {
        ordinal = ordinal + 'u';
    }
    else if (ordinal.match(/trois$/)) {
        ordinal = ordinal + '';
    }
    else if (ordinal.match(/e$/) || ordinal.match(/s$/)) {
        ordinal = ordinal.slice(0, -1);
    }
    ordinal = ordinal + 'ième';
    return ordinal;
}
function numericOrdinal(num) {
    const gender = grammar_1.Grammar.getInstance().getParameter('gender');
    return num === 1
        ? num.toString() + (gender === 'm' ? 'er' : 're')
        : num.toString() + 'e';
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.wordOrdinal = wordOrdinal;
NUMBERS.numericOrdinal = numericOrdinal;
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToOrdinal;
exports.default = NUMBERS;
