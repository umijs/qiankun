"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPluginOrPreset = isPluginOrPreset;
exports.pathToObj = pathToObj;
exports.resolvePresets = resolvePresets;
exports.resolvePlugins = resolvePlugins;
exports.isValidPlugin = isValidPlugin;

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

function _assert() {
  const data = _interopRequireDefault(require("assert"));

  _assert = function _assert() {
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

var _enums = require("../enums");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _utils().createDebug)('umi:core:Service:util:plugin');
const RE = {
  [_enums.PluginType.plugin]: /^(@umijs\/|umi-)plugin-/,
  [_enums.PluginType.preset]: /^(@umijs\/|umi-)preset-/
};

function isPluginOrPreset(type, name) {
  const hasScope = name.charAt(0) === '@';
  const re = RE[type];

  if (hasScope) {
    return re.test(name.split('/')[1]) || re.test(name);
  } else {
    return re.test(name);
  }
}

function getPluginsOrPresets(type, opts) {
  const upperCaseType = type.toUpperCase();
  return [// opts
  ...(opts[type === _enums.PluginType.preset ? 'presets' : 'plugins'] || []), // env
  ...(process.env[`UMI_${upperCaseType}S`] || '').split(',').filter(Boolean), // dependencies
  ...Object.keys(opts.pkg.devDependencies || {}).concat(Object.keys(opts.pkg.dependencies || {})).filter(isPluginOrPreset.bind(null, type)), // user config
  ...(opts[type === _enums.PluginType.preset ? 'userConfigPresets' : 'userConfigPlugins'] || [])].map(path => {
    if (typeof path !== 'string') {
      throw new Error(`Plugin resolved failed, Please check your plugins config, it must be array of string.\nError Plugin Config: ${JSON.stringify(path)}`);
    }

    return _utils().resolve.sync(path, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts']
    });
  });
} // e.g.
// initial-state -> initialState
// webpack.css-loader -> webpack.cssLoader


function nameToKey(name) {
  return name.split('.').map(part => _utils().lodash.camelCase(part)).join('.');
}

function pkgNameToKey(pkgName, type) {
  // strip none @umijs scope
  if (pkgName.charAt(0) === '@' && !pkgName.startsWith('@umijs/')) {
    pkgName = pkgName.split('/')[1];
  }

  return nameToKey(pkgName.replace(RE[type], ''));
}

function pathToObj({
  type,
  path,
  cwd
}) {
  let pkg = null;
  let isPkgPlugin = false;
  (0, _assert().default)((0, _fs().existsSync)(path), `${type} ${path} not exists, pathToObj failed`);

  const pkgJSONPath = _utils().pkgUp.sync({
    cwd: path
  });

  if (pkgJSONPath) {
    pkg = require(pkgJSONPath);
    isPkgPlugin = (0, _utils().winPath)((0, _path().join)((0, _path().dirname)(pkgJSONPath), pkg.main || 'index.js')) === (0, _utils().winPath)(path);
  }

  let id;

  if (isPkgPlugin) {
    id = pkg.name;
  } else if ((0, _utils().winPath)(path).startsWith((0, _utils().winPath)(cwd))) {
    id = `./${(0, _utils().winPath)((0, _path().relative)(cwd, path))}`;
  } else if (pkgJSONPath) {
    id = (0, _utils().winPath)((0, _path().join)(pkg.name, (0, _path().relative)((0, _path().dirname)(pkgJSONPath), path)));
  } else {
    id = (0, _utils().winPath)(path);
  }

  id = id.replace('@umijs/preset-built-in/lib/plugins', '@@');
  id = id.replace(/\.js$/, '');
  const key = isPkgPlugin ? pkgNameToKey(pkg.name, type) : nameToKey((0, _path().basename)(path, (0, _path().extname)(path)));
  return {
    id,
    key,
    path: (0, _utils().winPath)(path),

    apply() {
      // use function to delay require
      try {
        const ret = require(path); // use the default member for es modules


        return (0, _utils().compatESModuleRequire)(ret);
      } catch (e) {
        throw new Error(`Register ${type} ${path} failed, since ${e.message}`);
      }
    },

    defaultConfig: null
  };
}

function resolvePresets(opts) {
  const type = _enums.PluginType.preset;
  const presets = [...getPluginsOrPresets(type, opts)];
  debug(`preset paths:`);
  debug(presets);
  return presets.map(path => {
    return pathToObj({
      type,
      path,
      cwd: opts.cwd
    });
  });
}

function resolvePlugins(opts) {
  const type = _enums.PluginType.plugin;
  const plugins = getPluginsOrPresets(type, opts);
  debug(`plugin paths:`);
  debug(plugins);
  return plugins.map(path => {
    return pathToObj({
      type,
      path,
      cwd: opts.cwd
    });
  });
}

function isValidPlugin(plugin) {
  return plugin.id && plugin.key && plugin.apply;
}