"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTooBig = exports.isText = exports.MAX_FILE_SIZE = void 0;
var _isText = require("istextorbinary").isText;
var jsRegex = /(t|j)sx?$/i;
var FILE_LOADER_REGEX = /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm)(\?.*)?$/i;
exports.MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
exports.isText = function (filename, buffer) {
    if (jsRegex.test(filename)) {
        return true;
    }
    return new Promise(function (resolve, reject) {
        _isText(filename, buffer, function (err, result) {
            if (err) {
                return reject(err);
            }
            // We don't support null bytes in the database with postgres,
            // so we need to mark it as binary if there are null bytes
            var hasNullByte = buffer.toString().includes("\0");
            resolve(result &&
                !FILE_LOADER_REGEX.test(filename) &&
                !exports.isTooBig(buffer) &&
                !hasNullByte);
        });
    });
};
exports.isTooBig = function (buffer) {
    return buffer.length > exports.MAX_FILE_SIZE;
};
//# sourceMappingURL=is-text.js.map