"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ico_1 = require("./ico");
const TYPE_CURSOR = 2;
exports.CUR = {
    validate(buffer) {
        if (buffer.readUInt16LE(0) !== 0) {
            return false;
        }
        return buffer.readUInt16LE(2) === TYPE_CURSOR;
    },
    calculate(buffer) {
        return ico_1.ICO.calculate(buffer);
    }
};
