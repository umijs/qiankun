"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldTransform = shouldTransform;
function shouldTransform(path) {
  const {
    node
  } = path;
  const functionId = node.id;
  if (!functionId) return false;
  const name = functionId.name;
  const paramNameBinding = path.scope.getOwnBinding(name);
  if (paramNameBinding === undefined) {
    return false;
  }
  if (paramNameBinding.kind !== "param") {
    return false;
  }
  if (paramNameBinding.identifier === paramNameBinding.path.node) {
    return false;
  }
  return name;
}

//# sourceMappingURL=util.js.map
