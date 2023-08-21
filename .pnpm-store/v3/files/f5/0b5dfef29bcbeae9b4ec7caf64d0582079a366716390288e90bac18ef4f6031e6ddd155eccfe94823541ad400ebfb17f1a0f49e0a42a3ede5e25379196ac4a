"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _options = require("../utils/options");

var _detectors = require("../utils/detectors");

var _minify = require("../minify");

var _default = t => (path, state) => {
  if ((0, _options.useMinify)(state) && ((0, _detectors.isStyled)(t)(path.node.tag, state) || (0, _detectors.isHelper)(t)(path.node.tag, state))) {
    const templateLiteral = path.node.quasi;
    const quasisLength = templateLiteral.quasis.length;
    const [rawValuesMinified] = (0, _minify.minifyRawValues)(templateLiteral.quasis.map(x => x.value.raw));
    const [cookedValuesMinfified, eliminatedExpressionIndices] = (0, _minify.minifyCookedValues)(templateLiteral.quasis.map(x => x.value.cooked));
    eliminatedExpressionIndices.forEach((expressionIndex, iteration) => {
      templateLiteral.expressions.splice(expressionIndex - iteration, 1);
    });

    for (let i = 0; i < quasisLength; i++) {
      const element = templateLiteral.quasis[i];
      element.value.raw = rawValuesMinified[i];
      element.value.cooked = cookedValuesMinfified[i];
    }
  }
};

exports.default = _default;