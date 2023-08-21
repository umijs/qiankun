"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldTransform = shouldTransform;
var _helperSkipTransparentExpressionWrappers = require("@babel/helper-skip-transparent-expression-wrappers");
var _core = require("@babel/core");
function matchAffectedArguments(argumentNodes) {
  const spreadIndex = argumentNodes.findIndex(node => _core.types.isSpreadElement(node));
  return spreadIndex >= 0 && spreadIndex !== argumentNodes.length - 1;
}
function shouldTransform(path) {
  let optionalPath = path;
  const chains = [];
  for (;;) {
    if (optionalPath.isOptionalMemberExpression()) {
      chains.push(optionalPath.node);
      optionalPath = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(optionalPath.get("object"));
    } else if (optionalPath.isOptionalCallExpression()) {
      chains.push(optionalPath.node);
      optionalPath = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(optionalPath.get("callee"));
    } else {
      break;
    }
  }
  for (let i = 0; i < chains.length; i++) {
    const node = chains[i];
    if (_core.types.isOptionalCallExpression(node) && matchAffectedArguments(node.arguments)) {
      if (node.optional) {
        return true;
      }
      const callee = chains[i + 1];
      if (_core.types.isOptionalMemberExpression(callee, {
        optional: true
      })) {
        return true;
      }
    }
  }
  return false;
}

//# sourceMappingURL=util.js.map
