"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "patchLooseSandbox", {
  enumerable: true,
  get: function get() {
    return _forLooseSandbox.patchLooseSandbox;
  }
});
Object.defineProperty(exports, "patchStrictSandbox", {
  enumerable: true,
  get: function get() {
    return _forStrictSandbox.patchStrictSandbox;
  }
});
var _forLooseSandbox = require("./forLooseSandbox");
var _forStrictSandbox = require("./forStrictSandbox");