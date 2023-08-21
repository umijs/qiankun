"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchPkg = watchPkg;
exports.watchPkgs = watchPkgs;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _core() {
  const data = require("@umijs/core");

  _core = function _core() {
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getUmiPlugins(opts) {
  return Object.keys(_objectSpread(_objectSpread({}, opts.pkg.dependencies), opts.pkg.devDependencies)).filter(name => {
    return (0, _core().isPluginOrPreset)(_core().PluginType.plugin, name) || (0, _core().isPluginOrPreset)(_core().PluginType.preset, name);
  });
}

function getUmiPluginsFromPkgPath(opts) {
  let pkg = {};

  if ((0, _fs().existsSync)(opts.pkgPath)) {
    try {
      pkg = JSON.parse((0, _fs().readFileSync)(opts.pkgPath, 'utf-8'));
    } catch (e) {}
  }

  return getUmiPlugins({
    pkg
  });
}

function watchPkg(opts) {
  const pkgPath = (0, _path().join)(opts.cwd, 'package.json');
  const plugins = getUmiPluginsFromPkgPath({
    pkgPath
  });

  const watcher = _utils().chokidar.watch(pkgPath, {
    ignoreInitial: true
  });

  watcher.on('all', () => {
    const newPlugins = getUmiPluginsFromPkgPath({
      pkgPath
    });

    if (!_utils().lodash.isEqual(plugins, newPlugins)) {
      // 已经重启了，只处理一次就够了
      opts.onChange();
    }
  });
  return () => {
    watcher.close();
  };
}

function watchPkgs(opts) {
  const unwatchs = [watchPkg({
    cwd: opts.cwd,
    onChange: opts.onChange
  })];

  if ((0, _utils().winPath)(opts.cwd) !== (0, _utils().winPath)(process.cwd())) {
    unwatchs.push(watchPkg({
      cwd: process.cwd(),
      onChange: opts.onChange
    }));
  }

  return () => {
    unwatchs.forEach(unwatch => {
      unwatch();
    });
  };
}