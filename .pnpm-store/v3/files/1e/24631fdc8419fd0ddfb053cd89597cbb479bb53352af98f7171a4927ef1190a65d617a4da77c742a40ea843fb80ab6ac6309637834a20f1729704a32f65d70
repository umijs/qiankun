"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../messages");
function numberToWords(num) {
    const digits = num.toString().split('');
    return digits
        .map(function (digit) {
        return NUMBERS.ones[parseInt(digit, 10)];
    })
        .join('');
}
const NUMBERS = (0, messages_1.NUMBERS)();
NUMBERS.numberToWords = numberToWords;
NUMBERS.numberToOrdinal = numberToWords;
exports.default = NUMBERS;
