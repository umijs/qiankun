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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DevCompileDonePlugin {
  constructor(opts) {
    this.opts = void 0;
    this.opts = opts;
  }

  apply(compiler) {
    let isFirstCompile = true;
    compiler.hooks.done.tap('DevFirstCompileDone', stats => {
      if (stats.hasErrors()) {
        // make sound
        if (process.env.SYSTEM_BELL !== 'none') {
          process.stdout.write('\x07');
        }

        return;
      }

      console.log(`App running at: http://localhost:${this.opts.port}`);

      if (isFirstCompile) {
        var _process$send, _process;

        (_process$send = (_process = process).send) === null || _process$send === void 0 ? void 0 : _process$send.call(_process, {
          type: 'DONE'
        });
        isFirstCompile = false;
      }
    });
  }

}

exports.default = DevCompileDonePlugin;