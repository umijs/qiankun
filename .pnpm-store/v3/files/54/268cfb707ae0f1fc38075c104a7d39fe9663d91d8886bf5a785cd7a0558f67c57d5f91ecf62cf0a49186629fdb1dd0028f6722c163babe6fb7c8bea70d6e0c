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

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _ = require("../");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _.createDebug)('umi:utils:BabelRegister');

class BabelRegister {
  constructor() {
    this.only = {};
  }

  setOnlyMap({
    key,
    value
  }) {
    debug(`set ${key} of only map:`);
    debug(value);
    this.only[key] = value;
    this.register();
  }

  register() {
    const only = _.lodash.uniq(Object.keys(this.only).reduce((memo, key) => {
      return memo.concat(this.only[key]);
    }, []).map(_.winPath).map(path => (0, _fs().existsSync)(path) ? (0, _fs().realpathSync)(path) : path));

    require('@umijs/deps/compiled/babel/register')({
      presets: [require.resolve('@umijs/babel-preset-umi/node')],
      ignore: [/node_modules/],
      only,
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      babelrc: false,
      cache: false
    });
  }

}

exports.default = BabelRegister;