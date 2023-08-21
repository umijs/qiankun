"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _createHTMLGenerator = _interopRequireDefault(require("./HTMLGenerator/createHTMLGenerator"));

var _createPageGenerator = _interopRequireDefault(require("./PageGenerator/createPageGenerator"));

var _createTmpGenerator = _interopRequireDefault(require("./TmpGenerator/createTmpGenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  const paths = api.paths,
        chalk = api.utils.chalk;
  const generators = {};
  api.registerCommand({
    name: 'generate',
    alias: 'g',
    description: 'generate code snippets quickly',

    fn({
      args
    }) {
      return _asyncToGenerator(function* () {
        const _args$_ = _toArray(args._),
              type = _args$_[0],
              _ = _args$_.slice(1);

        const Generator = generators[type];

        if (!Generator) {
          throw new Error(`Generator ${type} not found.`);
        }

        const generator = new Generator({
          cwd: api.cwd,
          args: _objectSpread(_objectSpread({}, args), {}, {
            _
          })
        });
        yield generator.run();
      })();
    }

  });
  api.registerMethod({
    name: 'registerGenerator',
    fn: ({
      key,
      Generator
    }) => {
      generators[key] = Generator;
    }
  });
  api.registerGenerator({
    key: 'page',
    // @ts-ignore
    Generator: (0, _createPageGenerator.default)({
      api
    })
  });
  api.registerGenerator({
    key: 'tmp',
    // @ts-ignore
    Generator: (0, _createTmpGenerator.default)({
      api
    })
  });
  api.registerGenerator({
    key: 'html',
    // @ts-ignore
    Generator: (0, _createHTMLGenerator.default)({
      api
    })
  });
};

exports.default = _default;