"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDepReExportContent = getDepReExportContent;
exports.cjsModeEsmParser = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _esbuild() {
  const data = require("@umijs/deps/reexported/esbuild");

  _esbuild = function _esbuild() {
    return data;
  };

  return data;
}

function _esModuleLexer() {
  const data = require("es-module-lexer");

  _esModuleLexer = function _esModuleLexer() {
    return data;
  };

  return data;
}

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function getDepReExportContent(_x) {
  return _getDepReExportContent.apply(this, arguments);
}

function _getDepReExportContent() {
  _getDepReExportContent = _asyncToGenerator(function* (opts) {
    // Support CSS
    if (opts.filePath && /\.(css|less|scss|sass|stylus|styl)$/.test(opts.filePath)) {
      return `import '${opts.importFrom}';`;
    } // Support Assets Files


    if (opts.filePath && /\.(json|svg|png|jpe?g|gif|webp|ico|eot|woff|woff2|ttf|txt|text|md)$/.test(opts.filePath)) {
      return `
import _ from '${opts.importFrom}';
export default _;`.trim();
    }

    try {
      if (opts.filePath && !/\.(js|jsx|mjs|ts|tsx)$/.test(opts.filePath)) {
        const matchResult = opts.filePath.match(/\.([a-zA-Z]+)$/);
        throw new Error(`${matchResult ? matchResult[0] : 'file type'} not support!`);
      }

      const _yield$parseWithCJSSu = yield parseWithCJSSupport(opts.content, opts.filePath),
            exports = _yield$parseWithCJSSu.exports,
            isCJS = _yield$parseWithCJSSu.isCJS; // cjs


      if (isCJS) {
        return [`import _ from '${opts.importFrom}';`, `export default _;`, `export * from '${opts.importFrom}';`].join('\n');
      } // esm
      else {
          const ret = [];
          let hasExports = false;

          if (exports.includes('default')) {
            ret.push(`import _ from '${opts.importFrom}';`);
            ret.push(`export default _;`);
            hasExports = true;
          }

          if (hasNonDefaultExports(exports) || // export * from 不会有 exports，只会有 imports
          /export\s+\*\s+from/.test(opts.content)) {
            ret.push(`export * from '${opts.importFrom}';`);
            hasExports = true;
          }

          if (!hasExports) {
            // 只有 __esModule 的全量导出
            if (exports.includes('__esModule')) {
              ret.push(`import _ from '${opts.importFrom}';`);
              ret.push(`export default _;`);
              ret.push(`export * from '${opts.importFrom}';`);
            } else {
              ret.push(`import '${opts.importFrom}';`);
            }
          }

          return ret.join('\n');
        }
    } catch (e) {
      throw new Error(`Parse file ${opts.filePath || ''} failed, ${e.message}`);
    }
  });
  return _getDepReExportContent.apply(this, arguments);
}

const cjsModeEsmParser = code => {
  return (0, _utils.matchAll)(/Object\.defineProperty\(\s*exports\s*\,\s*[\"|\'](\w+)[\"|\']/g, code).concat( // Support export['default']
  // ref: https://unpkg.alibaba-inc.com/browse/echarts-for-react@2.0.16/lib/core.js
  (0, _utils.matchAll)(/exports(?:\.|\[(?:\'|\"))(\w+)(?:\s*|(?:\'|\")\])\s*\=/g, code)).concat( // Support __webpack_exports__["default"]
  // ref: https://github.com/margox/braft-editor/blob/master/dist/index.js#L8429
  (0, _utils.matchAll)(/__webpack_exports__\[(?:\"|\')(\w+)(?:\"|\')\]\s*\=/g, code)).concat( // Support __webpack_require__.d(__webpack_exports, "EditorState")
  // ref: https://github.com/margox/braft-editor/blob/master/dist/index.js#L8347
  (0, _utils.matchAll)(/__webpack_require__\.d\(\s*__webpack_exports__\s*,\s*(?:\"|\')(\w+)(?:\"|\')\s*,/g, code)).concat( // Support __webpack_require__.d(__webpack_exports__, {"default": function() { return /* binding */ clipboard; }});
  // ref: https://unpkg.alibaba-inc.com/browse/clipboard@2.0.8/dist/clipboard.js L26
  ...(0, _utils.matchAll)(/__webpack_require__\.d\(\s*__webpack_exports__\s*,\s*(\{)/g, code).map(matchResult => {
    const index = matchResult.index;
    let idx = index;
    let deep = 0;
    let isMeetSymbol = false;
    let symbolBeginIndex = index;

    while (idx < code.length) {
      if (!deep && isMeetSymbol) {
        break;
      }

      if (code[idx] === '{') {
        if (!isMeetSymbol) {
          isMeetSymbol = true;
          symbolBeginIndex = idx;
        }

        deep++;
      }

      if (code[idx] === '}') {
        deep--;
      }

      idx++;
    }

    let result = code.slice(symbolBeginIndex, idx);
    return [...(0, _utils.matchAll)(/(?:\"|\')(\w+)(?:\"|\')\s*\:\s*(?:function|\()/g, result)];
  })).map(result => result[1]);
};

exports.cjsModeEsmParser = cjsModeEsmParser;

function parseWithCJSSupport(_x2, _x3) {
  return _parseWithCJSSupport.apply(this, arguments);
}

function _parseWithCJSSupport() {
  _parseWithCJSSupport = _asyncToGenerator(function* (content, filePath) {
    // Support tsx and jsx
    if (filePath && /\.(tsx|jsx)$/.test(filePath)) {
      content = (yield (0, _esbuild().transform)(content, {
        sourcemap: false,
        sourcefile: filePath,
        format: 'esm',
        target: 'es6',
        loader: (0, _path().extname)(filePath).slice(1)
      })).code;
    }

    yield _esModuleLexer().init;

    const _parse = (0, _esModuleLexer().parse)(content),
          _parse2 = _slicedToArray(_parse, 2),
          imports = _parse2[0],
          exports = _parse2[1];

    let isCJS = !imports.length && !exports.length;
    let cjsEsmExports = null;

    if (isCJS) {
      cjsEsmExports = cjsModeEsmParser(content);

      if (cjsEsmExports.includes('__esModule')) {
        isCJS = false;
      }
    }

    return {
      exports: cjsEsmExports || exports,
      isCJS
    };
  });
  return _parseWithCJSSupport.apply(this, arguments);
}

function hasNonDefaultExports(exports) {
  return exports.filter(exp => !['__esModule', 'default'].includes(exp)).length > 0;
}