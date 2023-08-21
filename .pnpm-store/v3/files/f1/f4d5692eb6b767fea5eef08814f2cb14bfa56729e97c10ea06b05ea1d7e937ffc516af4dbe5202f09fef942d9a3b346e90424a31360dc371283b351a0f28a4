"use strict";

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const _require = require('terser'),
      terserMinify = _require.minify;

const buildTerserOptions = ({
  ecma,
  parse = {},
  compress = {},
  mangle,
  module,
  output,
  toplevel,
  nameCache,
  ie8,

  /* eslint-disable camelcase */
  keep_classnames,
  keep_fnames,

  /* eslint-enable camelcase */
  safari10
} = {}) => ({
  parse: _objectSpread({}, parse),
  compress: typeof compress === 'boolean' ? compress : _objectSpread({}, compress),
  // eslint-disable-next-line no-nested-ternary
  mangle: mangle == null ? true : typeof mangle === 'boolean' ? mangle : _objectSpread({}, mangle),
  output: _objectSpread({
    beautify: false
  }, output),
  // Ignoring sourceMap from options
  sourceMap: null,
  ecma,
  keep_classnames,
  keep_fnames,
  ie8,
  module,
  nameCache,
  safari10,
  toplevel
});

function isObject(value) {
  const type = typeof value;
  return value != null && (type === 'object' || type === 'function');
}

const buildComments = (extractComments, terserOptions, extractedComments) => {
  const condition = {};
  const comments = terserOptions.output.comments;
  condition.preserve = typeof comments !== 'undefined' ? comments : false;

  if (typeof extractComments === 'boolean' && extractComments) {
    condition.extract = 'some';
  } else if (typeof extractComments === 'string' || extractComments instanceof RegExp) {
    condition.extract = extractComments;
  } else if (typeof extractComments === 'function') {
    condition.extract = extractComments;
  } else if (isObject(extractComments)) {
    condition.extract = typeof extractComments.condition === 'boolean' && extractComments.condition ? 'some' : typeof extractComments.condition !== 'undefined' ? extractComments.condition : 'some';
  } else {
    // No extract
    // Preserve using "commentsOpts" or "some"
    condition.preserve = typeof comments !== 'undefined' ? comments : 'some';
    condition.extract = false;
  } // Ensure that both conditions are functions


  ['preserve', 'extract'].forEach(key => {
    let regexStr;
    let regex;

    switch (typeof condition[key]) {
      case 'boolean':
        condition[key] = condition[key] ? () => true : () => false;
        break;

      case 'function':
        break;

      case 'string':
        if (condition[key] === 'all') {
          condition[key] = () => true;

          break;
        }

        if (condition[key] === 'some') {
          condition[key] = (astNode, comment) => {
            return (comment.type === 'comment2' || comment.type === 'comment1') && /@preserve|@lic|@cc_on|^\**!/i.test(comment.value);
          };

          break;
        }

        regexStr = condition[key];

        condition[key] = (astNode, comment) => {
          return new RegExp(regexStr).test(comment.value);
        };

        break;

      default:
        regex = condition[key];

        condition[key] = (astNode, comment) => regex.test(comment.value);

    }
  }); // Redefine the comments function to extract and preserve
  // comments according to the two conditions

  return (astNode, comment) => {
    if (condition.extract(astNode, comment)) {
      const commentText = comment.type === 'comment2' ? `/*${comment.value}*/` : `//${comment.value}`; // Don't include duplicate comments

      if (!extractedComments.includes(commentText)) {
        extractedComments.push(commentText);
      }
    }

    return condition.preserve(astNode, comment);
  };
};

function minify(_x) {
  return _minify.apply(this, arguments);
}

function _minify() {
  _minify = _asyncToGenerator(function* (options) {
    const name = options.name,
          input = options.input,
          inputSourceMap = options.inputSourceMap,
          minifyFn = options.minify,
          minimizerOptions = options.minimizerOptions;

    if (minifyFn) {
      return minifyFn({
        [name]: input
      }, inputSourceMap, minimizerOptions);
    } // Copy terser options


    const terserOptions = buildTerserOptions(minimizerOptions); // Let terser generate a SourceMap

    if (inputSourceMap) {
      terserOptions.sourceMap = {
        asObject: true
      };
    }

    const extractedComments = [];
    const extractComments = options.extractComments;
    terserOptions.output.comments = buildComments(extractComments, terserOptions, extractedComments);
    const result = yield terserMinify({
      [name]: input
    }, terserOptions);
    return _objectSpread(_objectSpread({}, result), {}, {
      extractedComments
    });
  });
  return _minify.apply(this, arguments);
}

function transform(options) {
  // 'use strict' => this === undefined (Clean Scope)
  // Safer for possible security issues, albeit not critical at all here
  // eslint-disable-next-line no-new-func, no-param-reassign
  options = new Function('exports', 'require', 'module', '__filename', '__dirname', `'use strict'\nreturn ${options}`)(exports, require, module, __filename, __dirname);
  return minify(options);
}

module.exports.minify = minify;
module.exports.transform = transform;