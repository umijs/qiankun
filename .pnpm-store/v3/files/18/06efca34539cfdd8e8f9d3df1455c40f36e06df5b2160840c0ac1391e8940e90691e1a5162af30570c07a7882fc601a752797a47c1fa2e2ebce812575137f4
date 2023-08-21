"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
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

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default(api) {
  const _api$utils = api.utils,
        Mustache = _api$utils.Mustache,
        lodash = _api$utils.lodash;
  api.describe({
    key: 'history',
    config: {
      default: {
        type: 'browser'
      },

      schema(joi) {
        const type = joi.string().valid('browser', 'hash', 'memory').required();
        return joi.object({
          type,
          options: joi.object()
        });
      },

      onChange: api.ConfigChangeType.regenerateTmpFiles
    }
  });
  api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
    const historyTpl = (0, _fs().readFileSync)((0, _path().join)(__dirname, // @ts-ignore
    api.config.runtimeHistory ? 'history.runtime.tpl' : api.config.history === false ? 'history.sham.tpl' : 'history.tpl'), 'utf-8');
    const history = api.config.history; // history 不可能为 false，这里是为了 ts 编译

    if (!history) return;
    const type = history.type,
          _history$options = history.options,
          options = _history$options === void 0 ? {} : _history$options;
    api.writeTmpFile({
      path: 'core/history.ts',
      content: Mustache.render(historyTpl, {
        creator: `create${lodash.upperFirst(type)}History`,
        options: JSON.stringify(_objectSpread(_objectSpread({}, options), type === 'browser' || type === 'hash' ? {
          basename: api.config.base
        } : {}), null, 2),
        runtimePath: _constants.runtimePath
      })
    });
  }));
  api.addUmiExports(() => {
    // @ts-ignore
    if (api.config.history === false) return [];

    if (api.config.runtimeHistory) {
      return {
        specifiers: ['history', 'setCreateHistoryOptions', 'getCreateHistoryOptions'],
        source: `./history`
      };
    }

    return {
      specifiers: ['history'],
      source: `./history`
    };
  });
}