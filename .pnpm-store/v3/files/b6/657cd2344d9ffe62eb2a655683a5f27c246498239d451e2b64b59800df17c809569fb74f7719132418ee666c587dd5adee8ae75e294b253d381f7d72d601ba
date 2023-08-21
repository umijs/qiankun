"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNoDeprecation = exports.setNodeTitle = exports.checkLocal = exports.checkVersion = void 0;
const utils_1 = require("../utils");
const path_1 = require("path");
const fs_1 = require("fs");
const constants_1 = require("../constants");
function checkVersion() {
    const v = parseInt(process.version.slice(1));
    if (v < constants_1.MIN_NODE_VERSION || v === 15 || v === 17) {
        utils_1.logger.error(`Your node version ${v} is not supported, please upgrade to ${constants_1.MIN_NODE_VERSION} or above except 15 or 17.`);
        process.exit(1);
    }
}
exports.checkVersion = checkVersion;
function checkLocal() {
    if ((0, fs_1.existsSync)((0, path_1.join)(__dirname, '../../jest.config.ts'))) {
        utils_1.logger.info('@local');
    }
}
exports.checkLocal = checkLocal;
function setNodeTitle(name) {
    if (process.title === 'node') {
        process.title = name || constants_1.FRAMEWORK_NAME;
    }
}
exports.setNodeTitle = setNodeTitle;
function setNoDeprecation() {
    // Use magic to suppress node deprecation warnings
    // See: https://github.com/nodejs/node/blob/master/lib/internal/process/warning.js#L77
    // @ts-ignore
    process.noDeprecation = '1';
}
exports.setNoDeprecation = setNoDeprecation;
