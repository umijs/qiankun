"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.willPathCastToBoolean = willPathCastToBoolean;
function willPathCastToBoolean(path) {
  const maybeWrapped = path;
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

//# sourceMappingURL=util.js.map
