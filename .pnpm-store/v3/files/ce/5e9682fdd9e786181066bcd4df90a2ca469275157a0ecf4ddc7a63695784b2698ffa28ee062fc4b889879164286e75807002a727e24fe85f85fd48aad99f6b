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

function _joi() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/@hapi/joi"));

  _joi = function _joi() {
    return data;
  };

  return data;
}

function _joi2types() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/joi2types"));

  _joi2types = function _joi2types() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  api.onGenerateFiles( /*#__PURE__*/_asyncToGenerator(function* () {
    const service = api.service;
    const properties = Object.keys(service.plugins).map(plugin => {
      const _service$plugins$plug = service.plugins[plugin],
            config = _service$plugins$plug.config,
            key = _service$plugins$plug.key; // recognize as key if have schema config

      if (!(config === null || config === void 0 ? void 0 : config.schema)) return;
      const schema = config.schema(_joi().default);

      if (!_joi().default.isSchema(schema)) {
        return;
      }

      return {
        [key]: schema
      };
    }).reduce((acc, curr) => _objectSpread(_objectSpread({}, acc), curr), {});
    const interfaceName = 'IConfigFromPlugins'; // catch

    const content = yield (0, _joi2types().default)(_joi().default.object(properties).unknown(), {
      interfaceName,
      bannerComment: '// Created by Umi Plugin'
    }).catch(err => {
      api.logger.error('Config types generated error', err);
      return Promise.resolve(`export interface ${interfaceName} {}`);
    });
    api.writeTmpFile({
      path: 'core/pluginConfig.d.ts',
      content
    });
  }));
};

exports.default = _default;