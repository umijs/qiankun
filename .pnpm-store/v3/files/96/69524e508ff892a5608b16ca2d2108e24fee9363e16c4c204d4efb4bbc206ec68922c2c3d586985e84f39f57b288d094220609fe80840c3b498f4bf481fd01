"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldStoreRHSInTemporaryVariable;
var _core = require("@babel/core");
const {
  isObjectProperty,
  isArrayPattern,
  isObjectPattern,
  isAssignmentPattern,
  isRestElement,
  isIdentifier
} = _core.types;
function shouldStoreRHSInTemporaryVariable(node) {
  if (isArrayPattern(node)) {
    const nonNullElements = node.elements.filter(element => element !== null);
    if (nonNullElements.length > 1) return true;else return shouldStoreRHSInTemporaryVariable(nonNullElements[0]);
  } else if (isObjectPattern(node)) {
    const {
      properties
    } = node;
    if (properties.length > 1) return true;else if (properties.length === 0) return false;else {
      const firstProperty = properties[0];
      if (isObjectProperty(firstProperty)) {
        return shouldStoreRHSInTemporaryVariable(firstProperty.value);
      } else {
        return shouldStoreRHSInTemporaryVariable(firstProperty);
      }
    }
  } else if (isAssignmentPattern(node)) {
    return shouldStoreRHSInTemporaryVariable(node.left);
  } else if (isRestElement(node)) {
    if (isIdentifier(node.argument)) return true;
    return shouldStoreRHSInTemporaryVariable(node.argument);
  } else {
    return false;
  }
}

//# sourceMappingURL=shouldStoreRHSInTemporaryVariable.js.map
