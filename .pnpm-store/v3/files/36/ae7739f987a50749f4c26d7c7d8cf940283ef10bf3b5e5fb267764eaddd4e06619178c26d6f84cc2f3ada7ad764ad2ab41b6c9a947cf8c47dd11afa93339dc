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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
    return data;
  };

  return data;
}

function _util() {
  const data = require("util");

  _util = function _util() {
    return data;
  };

  return data;
}

var _buildDevUtils = require("../buildDevUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = api => {
  api.registerCommand({
    name: 'webpack',
    description: 'inspect webpack configurations',

    fn() {
      return _asyncToGenerator(function* () {
        const _yield$getBundleAndCo = yield (0, _buildDevUtils.getBundleAndConfigs)({
          api
        }),
              bundleConfigs = _yield$getBundleAndCo.bundleConfigs;

        let config = bundleConfigs.filter(bundleConfig => {
          var _bundleConfig$entry;

          return (_bundleConfig$entry = bundleConfig.entry) === null || _bundleConfig$entry === void 0 ? void 0 : _bundleConfig$entry.umi;
        })[0];
        (0, _assert().default)(config, `No valid config found with umi entry.`);

        if (api.args.rule) {
          config = config.module.rules.find(r => r.__ruleNames[0] === api.args.rule);
        } else if (api.args.plugin) {
          config = config.plugins.find(p => p.__pluginName === api.args.plugin);
        } else if (api.args.rules) {
          config = config.module.rules.map(r => r.__ruleNames[0]);
        } else if (api.args.plugins) {
          config = config.plugins.map(p => p.__pluginName || p.constructor.name);
        }

        if (api.args.print !== false) {
          // print object with util.inspect
          // ref: https://stackoverflow.com/questions/10729276/how-can-i-get-the-full-object-in-node-jss-console-log-rather-than-object
          console.log((0, _util().inspect)(config, false, null, true));
        }

        return config;
      })();
    }

  });
};

exports.default = _default;