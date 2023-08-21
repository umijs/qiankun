"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findOutermostTransparentParent = findOutermostTransparentParent;
exports.willPathCastToBoolean = willPathCastToBoolean;
var _helperSkipTransparentExpressionWrappers = require("@babel/helper-skip-transparent-expression-wrappers");
function willPathCastToBoolean(path) {
  const maybeWrapped = findOutermostTransparentParent(path);
  const {
    node,
    parentPath
  } = maybeWrapped;
  if (parentPath.isLogicalExpression()) {
    const {
      operator,
      right
    } = parentPath.node;
    if (operator === "&&" || operator === "||" || operator === "??" && node === right) {
      return willPathCastToBoolean(parentPath);
    }
  }
  if (parentPath.isSequenceExpression()) {
    const {
      expressions
    } = parentPath.node;
    if (expressions[expressions.length - 1] === node) {
      return willPathCastToBoolean(parentPath);
    } else {
      return true;
    }
  }
  return parentPath.isConditional({
    test: node
  }) || parentPath.isUnaryExpression({
    operator: "!"
  }) || parentPath.isLoop({
    test: node
  });
}
function findOutermostTransparentParent(path) {
  let maybeWrapped = path;
  path.findParent(p => {
    if (!(0, _helperSkipTransparentExpressionWrappers.isTransparentExprWrapper)(p.node)) return true;
    maybeWrapped = p;
  });
  return maybeWrapped;
}

//# sourceMappingURL=util.js.map
