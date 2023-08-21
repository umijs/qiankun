"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = transform;
exports.transformOptionalChain = transformOptionalChain;
var _core = require("@babel/core");
var _helperSkipTransparentExpressionWrappers = require("@babel/helper-skip-transparent-expression-wrappers");
var _util = require("./util");
function isSimpleMemberExpression(expression) {
  expression = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrapperNodes)(expression);
  return _core.types.isIdentifier(expression) || _core.types.isSuper(expression) || _core.types.isMemberExpression(expression) && !expression.computed && isSimpleMemberExpression(expression.object);
}
function needsMemoize(path) {
  let optionalPath = path;
  const {
    scope
  } = path;
  while (optionalPath.isOptionalMemberExpression() || optionalPath.isOptionalCallExpression()) {
    const {
      node
    } = optionalPath;
    const childPath = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(optionalPath.isOptionalMemberExpression() ? optionalPath.get("object") : optionalPath.get("callee"));
    if (node.optional) {
      return !scope.isStatic(childPath.node);
    }
    optionalPath = childPath;
  }
}
const NULLISH_CHECK = _core.template.expression(`%%check%% === null || %%ref%% === void 0`);
const NULLISH_CHECK_NO_DDA = _core.template.expression(`%%check%% == null`);
const NULLISH_CHECK_NEG = _core.template.expression(`%%check%% !== null && %%ref%% !== void 0`);
const NULLISH_CHECK_NO_DDA_NEG = _core.template.expression(`%%check%% != null`);
function transformOptionalChain(path, {
  pureGetters,
  noDocumentAll
}, replacementPath, ifNullish, wrapLast) {
  const {
    scope
  } = path;
  if (scope.path.isPattern() && needsMemoize(path)) {
    replacementPath.replaceWith(_core.template.expression.ast`(() => ${replacementPath.node})()`);
    return;
  }
  const optionals = [];
  let optionalPath = path;
  while (optionalPath.isOptionalMemberExpression() || optionalPath.isOptionalCallExpression()) {
    const {
      node
    } = optionalPath;
    if (node.optional) {
      optionals.push(node);
    }
    if (optionalPath.isOptionalMemberExpression()) {
      optionalPath.node.type = "MemberExpression";
      optionalPath = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(optionalPath.get("object"));
    } else if (optionalPath.isOptionalCallExpression()) {
      optionalPath.node.type = "CallExpression";
      optionalPath = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrappers)(optionalPath.get("callee"));
    }
  }
  if (optionals.length === 0) {
    return;
  }
  const checks = [];
  let tmpVar;
  for (let i = optionals.length - 1; i >= 0; i--) {
    const node = optionals[i];
    const isCall = _core.types.isCallExpression(node);
    const chainWithTypes = isCall ? node.callee : node.object;
    const chain = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrapperNodes)(chainWithTypes);
    let ref;
    let check;
    if (isCall && _core.types.isIdentifier(chain, {
      name: "eval"
    })) {
      check = ref = chain;
      node.callee = _core.types.sequenceExpression([_core.types.numericLiteral(0), ref]);
    } else if (pureGetters && isCall && isSimpleMemberExpression(chain)) {
      check = ref = node.callee;
    } else if (scope.isStatic(chain)) {
      check = ref = chainWithTypes;
    } else {
      if (!tmpVar || isCall) {
        tmpVar = scope.generateUidIdentifierBasedOnNode(chain);
        scope.push({
          id: _core.types.cloneNode(tmpVar)
        });
      }
      ref = tmpVar;
      check = _core.types.assignmentExpression("=", _core.types.cloneNode(tmpVar), chainWithTypes);
      isCall ? node.callee = ref : node.object = ref;
    }
    if (isCall && _core.types.isMemberExpression(chain)) {
      if (pureGetters && isSimpleMemberExpression(chain)) {
        node.callee = chainWithTypes;
      } else {
        const {
          object
        } = chain;
        let context;
        if (_core.types.isSuper(object)) {
          context = _core.types.thisExpression();
        } else {
          const memoized = scope.maybeGenerateMemoised(object);
          if (memoized) {
            context = memoized;
            chain.object = _core.types.assignmentExpression("=", memoized, object);
          } else {
            context = object;
          }
        }
        node.arguments.unshift(_core.types.cloneNode(context));
        node.callee = _core.types.memberExpression(node.callee, _core.types.identifier("call"));
      }
    }
    const data = {
      check: _core.types.cloneNode(check),
      ref: _core.types.cloneNode(ref)
    };
    Object.defineProperty(data, "ref", {
      enumerable: false
    });
    checks.push(data);
  }
  let result = replacementPath.node;
  if (wrapLast) result = wrapLast(result);
  const ifNullishBoolean = _core.types.isBooleanLiteral(ifNullish);
  const ifNullishFalse = ifNullishBoolean && ifNullish.value === false;
  const tpl = ifNullishFalse ? noDocumentAll ? NULLISH_CHECK_NO_DDA_NEG : NULLISH_CHECK_NEG : noDocumentAll ? NULLISH_CHECK_NO_DDA : NULLISH_CHECK;
  const logicalOp = ifNullishFalse ? "&&" : "||";
  const check = checks.map(tpl).reduce((expr, check) => _core.types.logicalExpression(logicalOp, expr, check));
  replacementPath.replaceWith(ifNullishBoolean ? _core.types.logicalExpression(logicalOp, check, result) : _core.types.conditionalExpression(check, ifNullish, result));
}
function transform(path, assumptions) {
  const {
    scope
  } = path;
  const maybeWrapped = (0, _util.findOutermostTransparentParent)(path);
  const {
    parentPath
  } = maybeWrapped;
  if (parentPath.isUnaryExpression({
    operator: "delete"
  })) {
    transformOptionalChain(path, assumptions, parentPath, _core.types.booleanLiteral(true));
  } else {
    let wrapLast;
    if (parentPath.isCallExpression({
      callee: maybeWrapped.node
    }) && path.isOptionalMemberExpression()) {
      wrapLast = replacement => {
        var _baseRef;
        const object = (0, _helperSkipTransparentExpressionWrappers.skipTransparentExprWrapperNodes)(replacement.object);
        let baseRef;
        if (!assumptions.pureGetters || !isSimpleMemberExpression(object)) {
          baseRef = scope.maybeGenerateMemoised(object);
          if (baseRef) {
            replacement.object = _core.types.assignmentExpression("=", baseRef, object);
          }
        }
        return _core.types.callExpression(_core.types.memberExpression(replacement, _core.types.identifier("bind")), [_core.types.cloneNode((_baseRef = baseRef) != null ? _baseRef : object)]);
      };
    }
    transformOptionalChain(path, assumptions, path, (0, _util.willPathCastToBoolean)(maybeWrapped) ? _core.types.booleanLiteral(false) : scope.buildUndefinedNode(), wrapLast);
  }
}

//# sourceMappingURL=transform.js.map
