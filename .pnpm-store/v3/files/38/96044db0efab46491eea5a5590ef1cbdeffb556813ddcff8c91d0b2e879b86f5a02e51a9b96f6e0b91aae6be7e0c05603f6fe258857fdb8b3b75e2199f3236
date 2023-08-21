"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localePath = exports.makePath = void 0;
const system_external_1 = require("./system_external");
function makePath(path) {
    return path.match('/$') ? path : path + '/';
}
exports.makePath = makePath;
function localePath(locale, ext = 'json') {
    return (makePath(system_external_1.default.jsonPath) +
        locale +
        (ext.match(/^\./) ? ext : '.' + ext));
}
exports.localePath = localePath;
