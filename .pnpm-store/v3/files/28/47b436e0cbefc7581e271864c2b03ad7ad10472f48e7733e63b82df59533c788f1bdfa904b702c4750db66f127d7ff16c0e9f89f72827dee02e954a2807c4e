"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mdComponent = require("../../transformer/remark/mdComponent");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _default = api => {
  api.onPluginReady( /*#__PURE__*/_asyncToGenerator(function* () {
    const mdComponents = yield api.applyPlugins({
      type: api.ApplyPluginsType.add,
      key: 'dumi.registerMdComponent',
      initialValue: []
    });
    mdComponents.forEach(comp => {
      (0, _mdComponent.registerMdComponent)(comp);
    });
  }));
};
exports.default = _default;