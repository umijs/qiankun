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

var _default = api => {
  const paths = api.paths,
        pkg = api.pkg,
        cwd = api.cwd;
  api.describe({
    key: 'alias',
    config: {
      schema(joi) {
        return joi.object();
      },

      default: {
        'react-router': (0, _path().dirname)(require.resolve('react-router/package.json')),
        'react-router-dom': (0, _path().dirname)(require.resolve('react-router-dom/package.json')),
        // 替换成带 query 的 history
        // 由于用了 query-string，会额外引入 7.6K（压缩后，gzip 前），考虑换轻量的实现
        history: (0, _path().dirname)(require.resolve('history-with-query/package.json'))
      }
    }
  });

  function getUserLibDir({
    library
  }) {
    if (pkg.dependencies && pkg.dependencies[library] || pkg.devDependencies && pkg.devDependencies[library] || // egg project using `clientDependencies` in ali tnpm
    pkg.clientDependencies && pkg.clientDependencies[library]) {
      return (0, _utils().winPath)((0, _path().dirname)( // 通过 resolve 往上找，可支持 lerna 仓库
      // lerna 仓库如果用 yarn workspace 的依赖不一定在 node_modules，可能被提到根目录，并且没有 link
      _utils().resolve.sync(`${library}/package.json`, {
        basedir: cwd
      })));
    }

    return null;
  } // 另一种实现方式:
  // 提供 projectFirstLibraries 的配置方式，但是不通用，先放插件层实现


  api.chainWebpack( /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (memo) {
      const libraries = yield api.applyPlugins({
        key: 'addProjectFirstLibraries',
        type: api.ApplyPluginsType.add,
        initialValue: [{
          name: 'react',
          path: (0, _path().dirname)(require.resolve(`react/package.json`))
        }, {
          name: 'react-dom',
          path: (0, _path().dirname)(require.resolve(`react-dom/package.json`))
        }]
      });
      libraries.forEach(library => {
        memo.resolve.alias.set(library.name, getUserLibDir({
          library: library.name
        }) || library.path);
      }); // 选择在 chainWebpack 中进行以上 alias 的初始化，是为了支持用户使用 modifyPaths API 对 paths 进行改写

      memo.resolve.alias.set('@', paths.absSrcPath);
      memo.resolve.alias.set('@@', paths.absTmpPath);
      return memo;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
};

exports.default = _default;