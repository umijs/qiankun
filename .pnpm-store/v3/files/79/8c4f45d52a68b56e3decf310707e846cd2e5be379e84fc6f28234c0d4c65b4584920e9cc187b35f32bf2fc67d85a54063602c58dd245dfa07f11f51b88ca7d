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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

var _Common = _interopRequireDefault(require("./Common"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Logger extends _Common.default {
  constructor(...args) {
    super(...args);
    this.LOG = _utils().chalk.black.bgBlue('LOG');
    this.INFO = _utils().chalk.black.bgBlue('INFO');
    this.WARN = _utils().chalk.black.bgHex('#faad14')('WARN');
    this.ERROR = _utils().chalk.black.bgRed('ERROR');
    this.PROFILE = _utils().chalk.black.bgCyan('PROFILE');
  }

  log(...args) {
    // TODO: node env production
    console.log(this.LOG, ...args);
  }
  /**
   * The {@link logger.info} function is an alias for {@link logger.log()}.
   * @param args
   */


  info(...args) {
    console.log(this.INFO, ...args);
  }

  error(...args) {
    console.error(this.ERROR, ...args);
  }

  warn(...args) {
    console.warn(this.WARN, ...args);
  }

  profile(id, message) {
    const time = Date.now();
    const namespace = `${this.namespace}:${id}`; // for test

    let msg;

    if (this.profilers[id]) {
      const timeEnd = this.profilers[id];
      delete this.profilers[id];
      process.stderr.write(this.PROFILE + ' ');
      msg = `${this.PROFILE} ${_utils().chalk.cyan(`└ ${namespace}`)} Completed in ${this.formatTiming(time - timeEnd)}`;
      console.log(msg);
    } else {
      msg = `${this.PROFILE} ${_utils().chalk.cyan(`┌ ${namespace}`)} ${message || ''}`;
      console.log(msg);
    }

    this.profilers[id] = time;
    return msg;
  }

}

exports.default = Logger;