"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Abstract reading multi-byte unsigned integers
function readUInt(buffer, bits, offset, isBigEndian) {
    offset = offset || 0;
    const endian = isBigEndian ? 'BE' : 'LE';
    const methodName = ('readUInt' + bits + endian);
    const method = buffer[methodName];
    return method.call(buffer, offset);
}
exports.readUInt = readUInt;
