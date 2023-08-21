"use strict";

Object.defineProperty(exports, "__esModule", {
  value: !0
});

var assembleReleasePlan = require("@changesets/assemble-release-plan"), readChangesets = require("@changesets/read"), config = require("@changesets/config"), getPackages = require("@manypkg/get-packages"), pre = require("@changesets/pre");

function _interopDefault(e) {
  return e && e.__esModule ? e : {
    default: e
  };
}

var assembleReleasePlan__default = _interopDefault(assembleReleasePlan), readChangesets__default = _interopDefault(readChangesets);

function _defineProperty(obj, key, value) {
  return key in obj ? Object.defineProperty(obj, key, {
    value: value,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : obj[key] = value, obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter((function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    }))), keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach((function(key) {
      _defineProperty(target, key, source[key]);
    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach((function(key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    }));
  }
  return target;
}

async function getReleasePlan(cwd, sinceRef, passedConfig) {
  const packages = await getPackages.getPackages(cwd), preState = await pre.readPreState(cwd), readConfig = await config.read(cwd, packages), config$1 = passedConfig ? _objectSpread2(_objectSpread2({}, readConfig), passedConfig) : readConfig, changesets = await readChangesets__default.default(cwd, sinceRef);
  return assembleReleasePlan__default.default(changesets, packages, config$1, preState);
}

exports.default = getReleasePlan;
