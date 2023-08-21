"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _previewer = require("../../transformer/remark/previewer");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _default = api => {
  // wait for compiletime be registered
  api.onPluginReady( /*#__PURE__*/_asyncToGenerator(function* () {
    // get registered compiletime
    const compiletimes = yield api.applyPlugins({
      type: api.ApplyPluginsType.add,
      key: 'dumi.registerCompiletime',
      initialValue: []
    });
    // reverse to make sure order is correct, the registerPreviewerTransformer use unshift() method
    compiletimes.reverse().forEach(opts => {
      // register transformer
      (0, _previewer.registerPreviewerTransformer)({
        type: opts.name,
        fn: opts.transformer,
        component: opts.component
      });
    });
  }));
};
exports.default = _default;