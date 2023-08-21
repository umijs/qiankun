"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripLineComment = exports.minifyRawValues = exports.minifyRaw = exports.minifyCookedValues = exports.minifyCooked = exports.compressSymbols = void 0;

var _difference = _interopRequireDefault(require("lodash/difference"));

var _placeholderUtils = require("../css/placeholderUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const injectUniquePlaceholders = strArr => {
  let i = 0;
  return strArr.reduce((str, val, index, arr) => {
    return str + val + (index < arr.length - 1 ? (0, _placeholderUtils.makePlaceholder)(i++) : '');
  }, '');
};

const makeMultilineCommentRegex = newlinePattern => new RegExp('\\/\\*[^!](.|' + newlinePattern + ')*?\\*\\/', 'g');

const lineCommentStart = /\/\//g;
const symbolRegex = /(\s*[;:{},]\s*)/g; // Counts occurences of substr inside str

const countOccurences = (str, substr) => str.split(substr).length - 1; // Joins substrings until predicate returns true


const reduceSubstr = (substrs, join, predicate) => {
  const length = substrs.length;
  let res = substrs[0];

  if (length === 1) {
    return res;
  }

  for (let i = 1; i < length; i++) {
    if (predicate(res)) {
      break;
    }

    res += join + substrs[i];
  }

  return res;
}; // Joins at comment starts when it's inside a string or parantheses
// effectively removing line comments


const stripLineComment = line => reduceSubstr(line.split(lineCommentStart), '//', str => !str.endsWith(':') && // NOTE: This is another guard against urls, if they're not inside strings or parantheses.
countOccurences(str, "'") % 2 === 0 && countOccurences(str, '"') % 2 === 0 && countOccurences(str, '(') === countOccurences(str, ')'));

exports.stripLineComment = stripLineComment;

const compressSymbols = code => code.split(symbolRegex).reduce((str, fragment, index) => {
  // Even-indices are non-symbol fragments
  if (index % 2 === 0) {
    return str + fragment;
  } // Only manipulate symbols outside of strings


  if (countOccurences(str, "'") % 2 !== 0 || countOccurences(str, '"') % 2 !== 0) {
    return str + fragment;
  } // Preserve whitespace preceding colon, to avoid joining selectors.


  if (/^\s+:/.test(fragment)) {
    return str + ' ' + fragment.trim();
  }

  return str + fragment.trim();
}, ''); // Detects lines that are exclusively line comments


exports.compressSymbols = compressSymbols;

const isLineComment = line => line.trim().startsWith('//'); // Creates a minifier with a certain linebreak pattern


const minify = linebreakPattern => {
  const linebreakRegex = new RegExp(linebreakPattern + '\\s*', 'g');
  const multilineCommentRegex = makeMultilineCommentRegex(linebreakPattern);
  return code => {
    const newCode = code.replace(multilineCommentRegex, '\n') // Remove multiline comments
    .split(linebreakRegex) // Split at newlines
    .filter(line => line.length > 0 && !isLineComment(line)) // Removes lines containing only line comments
    .map(stripLineComment) // Remove line comments inside text
    .join(' '); // Rejoin all lines

    const eliminatedExpressionIndices = (0, _difference.default)(code.match(_placeholderUtils.placeholderRegex), newCode.match(_placeholderUtils.placeholderRegex)).map(x => parseInt(x.match(/\d+/)[0], 10));
    return [compressSymbols(newCode), eliminatedExpressionIndices];
  };
};

const minifyRaw = minify('(?:\\\\r|\\\\n|\\r|\\n)');
exports.minifyRaw = minifyRaw;
const minifyCooked = minify('[\\r\\n]');
exports.minifyCooked = minifyCooked;

const minifyRawValues = rawValues => (0, _placeholderUtils.splitByPlaceholders)(minifyRaw(injectUniquePlaceholders(rawValues)), false);

exports.minifyRawValues = minifyRawValues;

const minifyCookedValues = cookedValues => (0, _placeholderUtils.splitByPlaceholders)(minifyCooked(injectUniquePlaceholders(cookedValues)), false);

exports.minifyCookedValues = minifyCookedValues;