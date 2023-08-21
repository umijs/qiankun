"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findObjectLiteralProperties = findObjectLiteralProperties;
exports.findObjectMembers = findObjectMembers;
exports.findClassStaticProperty = findClassStaticProperty;
exports.findArrayLiteralElements = findArrayLiteralElements;
exports.findArrayElements = findArrayElements;
exports.NODE_RESOLVERS = exports.LITERAL_NODE_RESOLVERS = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _utils() {
  const data = require("@umijs/utils");

  _utils = function _utils() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StringResolver = {
  is(src) {
    return _utils().t.isStringLiteral(src);
  },

  get(src) {
    return src.value;
  }

};
const NumberResolver = {
  is(src) {
    return _utils().t.isNumericLiteral(src);
  },

  get(src) {
    return src.value;
  }

};
const BooleanResolver = {
  is(src) {
    return _utils().t.isBooleanLiteral(src);
  },

  get(src) {
    return src.value;
  }

};
const NullResolver = {
  is(src) {
    return _utils().t.isNullLiteral(src);
  },

  get(src) {
    return null;
  }

};
const UndefinedResolver = {
  is(src) {
    return _utils().t.isIdentifier(src) && src.name === 'undefined';
  },

  get(src) {
    return undefined;
  }

};
const ObjectLiteralResolver = {
  is(src) {
    return _utils().t.isObjectExpression(src);
  },

  get(src) {
    return findObjectLiteralProperties(src);
  }

};
const ObjectResolver = {
  is(src) {
    return _utils().t.isObjectExpression(src);
  },

  get(src) {
    return findObjectMembers(src);
  }

};
const ClassResolver = {
  is(src) {
    return _utils().t.isClass(src);
  },

  get(src) {
    return findClassStaticProperty(src);
  }

};
const ArrayLiteralResolver = {
  is(src) {
    return _utils().t.isArrayExpression(src);
  },

  get(src) {
    return findArrayLiteralElements(src);
  }

};
const ArrayResolver = {
  is(src) {
    return _utils().t.isArrayExpression(src);
  },

  get(src) {
    return findArrayElements(src);
  }

};
const FunctionResolver = {
  is(src) {
    return _utils().t.isFunctionExpression(src);
  },

  get(src) {
    return function () {};
  }

};
const ArrowFunctionResolver = {
  is(src) {
    return _utils().t.isArrowFunctionExpression(src);
  },

  get(src) {
    return () => {};
  }

};
const LITERAL_NODE_RESOLVERS = [StringResolver, NumberResolver, BooleanResolver, NullResolver, UndefinedResolver, ObjectLiteralResolver, ArrayLiteralResolver];
exports.LITERAL_NODE_RESOLVERS = LITERAL_NODE_RESOLVERS;
const NODE_RESOLVERS = [StringResolver, NumberResolver, BooleanResolver, NullResolver, UndefinedResolver, ObjectResolver, ArrayResolver, ClassResolver, FunctionResolver, ArrowFunctionResolver];
exports.NODE_RESOLVERS = NODE_RESOLVERS;

function findObjectLiteralProperties(node) {
  const target = {};
  node.properties.forEach(p => {
    if (_utils().t.isObjectProperty(p) && _utils().t.isIdentifier(p.key)) {
      const resolver = LITERAL_NODE_RESOLVERS.find(resolver => resolver.is(p.value));

      if (resolver) {
        target[p.key.name] = resolver.get(p.value);
      }
    }
  });
  return target;
}

function findObjectMembers(node) {
  const target = {};
  node.properties.forEach(p => {
    if (_utils().t.isObjectMember(p) && _utils().t.isIdentifier(p.key)) {
      if (_utils().t.isObjectMethod(p)) {
        target[p.key.name] = () => {};
      } else {
        const resolver = NODE_RESOLVERS.find(resolver => resolver.is(p.value));

        if (resolver) {
          target[p.key.name] = resolver.get(p.value);
        }
      }
    }
  });
  return target;
}

function findClassStaticProperty(node) {
  function isStaticNode(p) {
    return 'static' in p && p.static === true;
  }

  let body = node.body;
  if (!_utils().t.isClassBody(body)) return;
  const target = {};
  body.body.forEach(p => {
    if (isStaticNode(p) && _utils().t.isIdentifier(p.key)) {
      if (_utils().t.isMethod(p) || _utils().t.isTSDeclareMethod(p)) {
        target[p.key.name] = () => {};
      } else {
        const resolver = NODE_RESOLVERS.find(resolver => resolver.is(p.value));

        if (resolver) {
          target[p.key.name] = resolver.get(p.value);
        }
      }
    }
  });
  return target;
}

function findArrayLiteralElements(node) {
  const target = [];
  node.elements.forEach(p => {
    const resolver = LITERAL_NODE_RESOLVERS.find(resolver => resolver.is(p));

    if (resolver) {
      target.push(resolver.get(p));
    }
  });
  return target;
}

function findArrayElements(node) {
  const target = [];
  node.elements.forEach(p => {
    const resolver = NODE_RESOLVERS.find(resolver => resolver.is(p));

    if (resolver) {
      target.push(resolver.get(p));
    }
  });
  return target;
}