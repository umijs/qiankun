"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = _interopRequireWildcard(require("react"));

var _index = require("./index");

var MockPortal = function MockPortal(_ref) {
  var didUpdate = _ref.didUpdate,
      children = _ref.children,
      getContainer = _ref.getContainer;
  React.useEffect(function () {
    didUpdate();
    getContainer();
  });
  return children;
};

var _default = (0, _index.generateTrigger)(MockPortal);

exports.default = _default;