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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

var _index = require("../index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

class Generator {
  constructor({
    cwd,
    args
  }) {
    this.cwd = void 0;
    this.args = void 0;
    this.prompts = void 0;
    this.cwd = cwd;
    this.args = args;
    this.prompts = {};
  }

  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const questions = _this.prompting();

      _this.prompts = yield (0, _index.prompts)(questions);
      yield _this.writing();
    })();
  }

  prompting() {
    return [];
  }

  writing() {
    return _asyncToGenerator(function* () {})();
  }

  copyTpl(opts) {
    const tpl = (0, _fs().readFileSync)(opts.templatePath, 'utf-8');

    const content = _index.Mustache.render(tpl, opts.context);

    _index.mkdirp.sync((0, _path().dirname)(opts.target));

    console.log(`${_index.chalk.green('Write:')} ${(0, _path().relative)(this.cwd, opts.target)}`);
    (0, _fs().writeFileSync)(opts.target, content, 'utf-8');
  }

  copyDirectory(opts) {
    const files = _index.glob.sync('**/*', {
      cwd: opts.path,
      dot: true,
      ignore: ['**/node_modules/**']
    });

    files.forEach(file => {
      const absFile = (0, _path().join)(opts.path, file);
      if ((0, _fs().statSync)(absFile).isDirectory()) return;

      if (file.endsWith('.tpl')) {
        this.copyTpl({
          templatePath: absFile,
          target: (0, _path().join)(opts.target, file.replace(/\.tpl$/, '')),
          context: opts.context
        });
      } else {
        console.log(`${_index.chalk.green('Copy: ')} ${file}`);
        const absTarget = (0, _path().join)(opts.target, file);

        _index.mkdirp.sync((0, _path().dirname)(absTarget));

        (0, _fs().copyFileSync)(absFile, absTarget);
      }
    });
  }

}

var _default = Generator;
exports.default = _default;