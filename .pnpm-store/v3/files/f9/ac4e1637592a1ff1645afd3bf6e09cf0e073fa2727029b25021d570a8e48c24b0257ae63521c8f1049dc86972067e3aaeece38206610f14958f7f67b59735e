'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var assembleReleasePlan = require('@changesets/assemble-release-plan');
var readChangesets = require('@changesets/read');
var config = require('@changesets/config');
var getPackages = require('@manypkg/get-packages');
var pre = require('@changesets/pre');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var assembleReleasePlan__default = /*#__PURE__*/_interopDefault(assembleReleasePlan);
var readChangesets__default = /*#__PURE__*/_interopDefault(readChangesets);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

async function getReleasePlan(cwd, sinceRef, passedConfig) {
  const packages = await getPackages.getPackages(cwd);
  const preState = await pre.readPreState(cwd);
  const readConfig = await config.read(cwd, packages);
  const config$1 = passedConfig ? _objectSpread2(_objectSpread2({}, readConfig), passedConfig) : readConfig;
  const changesets = await readChangesets__default['default'](cwd, sinceRef);
  return assembleReleasePlan__default['default'](changesets, packages, config$1, preState);
}

exports.default = getReleasePlan;
