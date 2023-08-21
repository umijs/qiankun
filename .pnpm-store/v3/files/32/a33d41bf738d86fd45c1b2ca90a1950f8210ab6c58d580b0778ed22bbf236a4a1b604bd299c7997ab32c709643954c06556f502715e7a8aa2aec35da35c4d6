'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// As Errlop uses Editions, we should use a specific Errlop edition
// As otherwise, the circular reference may fail on some machines
// https://github.com/bevry/errlop/issues/2
var errlop_1 = __importDefault(require("errlop"));
/**
 * Allow code and level inputs on Errlop.
 * We do this instead of a class extension, as class extensions do not interop well on node 0.8, which is our target.
 */
function errtion(opts, parent) {
    var message = opts.message, code = opts.code, level = opts.level;
    var error = new errlop_1.default(message, parent);
    if (code)
        error.code = code;
    if (level)
        error.level = level;
    return error;
}
exports.errtion = errtion;
/** Converts anything to a string, by returning strings and serialising objects. */
function stringify(value) {
    return typeof value === 'string' ? value : JSON.stringify(value);
}
exports.stringify = stringify;
/** Converts a version range like `4 || 6` to `>=4` */
function simplifyRange(range) {
    return range.replace(/^([.\-\w]+)(\s.+)?$/, '>=$1');
}
exports.simplifyRange = simplifyRange;
