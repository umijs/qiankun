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

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
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

var _htmlUtils = require("../../htmlUtils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _default({
  api
}) {
  return class PageGenerator extends _utils().Generator {
    constructor(opts) {
      super(opts);
    }

    writing() {
      var _this = this;

      return _asyncToGenerator(function* () {
        const jsExt = _this.args.typescript ? '.tsx' : '.js';
        const cssExt = _this.args.less ? '.less' : '.css';
        const html = (0, _htmlUtils.getHtmlGenerator)({
          api
        });
        const content = yield html.getContent({
          route: {
            path: _this.args.path || '/'
          },
          noChunk: true
        });
        const targetPath = (0, _path().join)(api.paths.absOutputPath, 'index.html');

        _utils().mkdirp.sync((0, _path().dirname)(targetPath));

        console.log(`${_utils().chalk.green('Write:')} dist/index.html`);
        (0, _fs().writeFileSync)(targetPath, content, 'utf-8');
      })();
    }

  };
}