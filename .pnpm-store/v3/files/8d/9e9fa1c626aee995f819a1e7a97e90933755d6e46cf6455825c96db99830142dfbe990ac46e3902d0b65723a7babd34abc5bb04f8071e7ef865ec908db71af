"use strict";

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

var _initWebpack = _interopRequireDefault(require("./initWebpack"));

var _ServiceWithBuiltIn = require("./ServiceWithBuiltIn");

var _getCwd = _interopRequireDefault(require("./utils/getCwd"));

var _getPkg = _interopRequireDefault(require("./utils/getPkg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const args = (0, _utils().yParser)(process.argv.slice(2));

_asyncToGenerator(function* () {
  try {
    process.env.NODE_ENV = 'development'; // Init webpack version determination and require hook

    (0, _initWebpack.default)();
    const service = new _ServiceWithBuiltIn.Service({
      cwd: (0, _getCwd.default)(),
      pkg: (0, _getPkg.default)(process.cwd())
    });
    yield service.run({
      name: 'dev',
      args
    });
    let closed = false; // kill(2) Ctrl-C

    process.once('SIGINT', () => onSignal('SIGINT')); // kill(3) Ctrl-\

    process.once('SIGQUIT', () => onSignal('SIGQUIT')); // kill(15) default

    process.once('SIGTERM', () => onSignal('SIGTERM'));

    function onSignal(signal) {
      if (closed) return;
      closed = true; // 退出时触发插件中的onExit事件

      service.applyPlugins({
        key: 'onExit',
        type: service.ApplyPluginsType.event,
        args: {
          signal
        }
      });
      process.exit(0);
    }
  } catch (e) {
    console.error(_utils().chalk.red(e.message));
    console.error(e.stack);

    _utils().printHelp.feedback();

    process.exit(1);
  }
})();