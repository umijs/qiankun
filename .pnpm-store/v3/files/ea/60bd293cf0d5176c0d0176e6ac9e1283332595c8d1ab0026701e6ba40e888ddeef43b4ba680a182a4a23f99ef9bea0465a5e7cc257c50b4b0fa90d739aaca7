"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getDepsForDemo", {
  enumerable: true,
  get: function get() {
    return _dependencies.default;
  }
});
Object.defineProperty(exports, "getCSSForDep", {
  enumerable: true,
  get: function get() {
    return _dependencies.getCSSForDep;
  }
});
exports.default = exports.DEMO_COMPONENT_NAME = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function babel() {
  const data = _interopRequireWildcard(require("@babel/core"));

  babel = function babel() {
    return data;
  };

  return data;
}

function types() {
  const data = _interopRequireWildcard(require("@babel/types"));

  types = function types() {
    return data;
  };

  return data;
}

function _traverse() {
  const data = _interopRequireDefault(require("@babel/traverse"));

  _traverse = function _traverse() {
    return data;
  };

  return data;
}

function _generator() {
  const data = _interopRequireDefault(require("@babel/generator"));

  _generator = function _generator() {
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

var _options = require("./options");

var _dependencies = _interopRequireWildcard(require("./dependencies"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEMO_COMPONENT_NAME = 'DumiDemo';
/**
 * transform code block statments to preview
 */

exports.DEMO_COMPONENT_NAME = DEMO_COMPONENT_NAME;

var _default = (raw, opts) => {
  const code = babel().transformSync(raw, (0, _options.getBabelOptions)(opts));
  const body = code.ast.program.body;
  let reactVar;
  let returnStatement; // traverse all expression

  (0, _traverse().default)(code.ast, {
    VariableDeclaration(callPath) {
      const callPathNode = callPath.node; // save react import variables

      if (callPathNode.declarations[0] && types().isIdentifier(callPathNode.declarations[0].id) && types().isCallExpression(callPathNode.declarations[0].init) && types().isCallExpression(callPathNode.declarations[0].init.arguments[0]) && types().isIdentifier(callPathNode.declarations[0].init.arguments[0].callee) && callPathNode.declarations[0].init.arguments[0].callee.name === 'require' && types().isStringLiteral(callPathNode.declarations[0].init.arguments[0].arguments[0]) && callPathNode.declarations[0].init.arguments[0].arguments[0].value === 'react') {
        reactVar = callPathNode.declarations[0].id.name;
      }
    },

    AssignmentExpression(callPath) {
      const callPathNode = callPath.node;

      if (callPathNode.operator === '=' && types().isMemberExpression(callPathNode.left) && (types().isStringLiteral(callPathNode.left.property) && // exports["default"]
      callPathNode.left.property.value === 'default' || types().isIdentifier(callPathNode.left.property) && // exports.default
      callPathNode.left.property.name === 'default') && types().isIdentifier(callPathNode.left.object) && callPathNode.left.object.name === 'exports') {
        // remove original export expression
        if (types().isIdentifier(callPathNode.right)) {
          // save export function as return statement arg
          const reactIdentifier = reactVar ? types().memberExpression(types().identifier(reactVar), types().stringLiteral('default'), true) : types().identifier('React');
          returnStatement = types().returnStatement(types().callExpression(types().memberExpression(reactIdentifier, types().identifier('createElement')), [callPathNode.right]));
          callPath.remove();
        } // remove uesless exports.default = void 0;


        if (types().isUnaryExpression(callPathNode.right)) {
          callPath.remove();
        }
      }
    },

    CallExpression(callPath) {
      const callPathNode = callPath.node; // transform all relative import to absolute import

      if (types().isIdentifier(callPathNode.callee) && callPathNode.callee.name === 'require' && types().isStringLiteral(callPathNode.arguments[0]) && callPathNode.arguments[0].value.startsWith('.')) {
        callPathNode.arguments[0].value = (0, _utils().winPath)(_path().default.join(_path().default.dirname(opts.fileAbsPath), callPathNode.arguments[0].value));
      }
    }

  }); // push return statement to program body

  if (returnStatement) {
    body.push(returnStatement);
  } // if user forgot to import react, redeclare it in local scope for throw error


  if (!reactVar) {
    body.unshift(types().variableDeclaration('var', [types().variableDeclarator(types().identifier('React'))]));
  } // create demo function


  const demoFunction = types().functionDeclaration(types().identifier(DEMO_COMPONENT_NAME), [], types().blockStatement(body));
  return {
    ast: code.ast,
    content: (0, _generator().default)(types().program([demoFunction]), {}, raw).code
  };
};

exports.default = _default;