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

function _path() {
  const data = require("path");

  _path = function _path() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* ({
    api,
    watch
  }) {
    const paths = api.paths;

    function generate(_x2) {
      return _generate.apply(this, arguments);
    }

    function _generate() {
      _generate = _asyncToGenerator(function* (files) {
        api.logger.debug('generate files', files);
        yield api.applyPlugins({
          key: 'onGenerateFiles',
          type: api.ApplyPluginsType.event,
          args: {
            files: files || []
          }
        });
      });
      return _generate.apply(this, arguments);
    }

    const watchers = [];
    yield generate();

    if (watch) {
      var _api$config;

      const watcherPaths = yield api.applyPlugins({
        key: 'addTmpGenerateWatcherPaths',
        type: api.ApplyPluginsType.add,
        initialValue: [paths.absPagesPath, (0, _path().join)(paths.absSrcPath, ((_api$config = api.config) === null || _api$config === void 0 ? void 0 : _api$config.singular) ? 'layout' : 'layouts'), (0, _path().join)(paths.absSrcPath, 'app.tsx'), (0, _path().join)(paths.absSrcPath, 'app.ts'), (0, _path().join)(paths.absSrcPath, 'app.jsx'), (0, _path().join)(paths.absSrcPath, 'app.js')]
      });

      _utils().lodash.uniq(watcherPaths.map(p => (0, _utils().winPath)(p))).forEach(p => {
        createWatcher(p);
      }); // process.on('SIGINT', () => {
      //   console.log('SIGINT');
      //   unwatch();
      // });

    }

    function unwatch() {
      watchers.forEach(watcher => {
        watcher.close();
      });
    }

    function createWatcher(path) {
      const watcher = _utils().chokidar.watch(path, {
        // ignore .dotfiles and _mock.js
        ignored: /(^|[\/\\])(_mock.js$|\..)/,
        ignoreInitial: true
      });

      let timer = null;
      let files = [];
      watcher.on('all', (event, path) => {
        if (timer) {
          clearTimeout(timer);
        }

        files.push({
          event,
          path: (0, _utils().winPath)(path)
        });
        timer = setTimeout( /*#__PURE__*/_asyncToGenerator(function* () {
          timer = null;
          yield generate(files);
          files = [];
        }), 2000);
      });
      watchers.push(watcher);
    }

    return unwatch;
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;