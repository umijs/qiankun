"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _detectors = require("../../utils/detectors");

var _default = t => (path, state) => {
  if ((0, _detectors.isStyled)(t)(path.node.tag, state) || (0, _detectors.isHelper)(t)(path.node.tag, state)) {
    const {
      tag: callee,
      quasi: {
        quasis,
        expressions
      }
    } = path.node;
    const values = t.arrayExpression(quasis.filter(quasi => quasi.value.cooked !== undefined).map(quasi => t.stringLiteral(quasi.value.cooked)));
    path.replaceWith(t.callExpression(callee, [values, ...expressions]));
  }
};

exports.default = _default;