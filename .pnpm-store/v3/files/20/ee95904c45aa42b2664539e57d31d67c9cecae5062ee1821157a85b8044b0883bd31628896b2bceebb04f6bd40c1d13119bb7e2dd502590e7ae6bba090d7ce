"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DestructuringTransformer = void 0;
exports.buildObjectExcludingKeys = buildObjectExcludingKeys;
exports.convertAssignmentExpression = convertAssignmentExpression;
exports.convertVariableDeclaration = convertVariableDeclaration;
exports.unshiftForXStatementBody = unshiftForXStatementBody;
var _core = require("@babel/core");
function isPureVoid(node) {
  return _core.types.isUnaryExpression(node) && node.operator === "void" && _core.types.isPureish(node.argument);
}
function unshiftForXStatementBody(statementPath, newStatements) {
  statementPath.ensureBlock();
  const {
    scope,
    node
  } = statementPath;
  const bodyScopeBindings = statementPath.get("body").scope.bindings;
  const hasShadowedBlockScopedBindings = Object.keys(bodyScopeBindings).some(name => scope.hasBinding(name));
  if (hasShadowedBlockScopedBindings) {
    node.body = _core.types.blockStatement([...newStatements, node.body]);
  } else {
    node.body.body.unshift(...newStatements);
  }
}
function hasArrayRest(pattern) {
  return pattern.elements.some(elem => _core.types.isRestElement(elem));
}
function hasObjectRest(pattern) {
  return pattern.properties.some(prop => _core.types.isRestElement(prop));
}
const STOP_TRAVERSAL = {};
const arrayUnpackVisitor = (node, ancestors, state) => {
  if (!ancestors.length) {
    return;
  }
  if (_core.types.isIdentifier(node) && _core.types.isReferenced(node, ancestors[ancestors.length - 1].node) && state.bindings[node.name]) {
    state.deopt = true;
    throw STOP_TRAVERSAL;
  }
};
class DestructuringTransformer {
  constructor(opts) {
    this.blockHoist = void 0;
    this.operator = void 0;
    this.arrayRefSet = void 0;
    this.nodes = void 0;
    this.scope = void 0;
    this.kind = void 0;
    this.iterableIsArray = void 0;
    this.arrayLikeIsIterable = void 0;
    this.objectRestNoSymbols = void 0;
    this.useBuiltIns = void 0;
    this.addHelper = void 0;
    this.blockHoist = opts.blockHoist;
    this.operator = opts.operator;
    this.arrayRefSet = new Set();
    this.nodes = opts.nodes || [];
    this.scope = opts.scope;
    this.kind = opts.kind;
    this.iterableIsArray = opts.iterableIsArray;
    this.arrayLikeIsIterable = opts.arrayLikeIsIterable;
    this.objectRestNoSymbols = opts.objectRestNoSymbols;
    this.useBuiltIns = opts.useBuiltIns;
    this.addHelper = opts.addHelper;
  }
  getExtendsHelper() {
    return this.useBuiltIns ? _core.types.memberExpression(_core.types.identifier("Object"), _core.types.identifier("assign")) : this.addHelper("extends");
  }
  buildVariableAssignment(id, init) {
    let op = this.operator;
    if (_core.types.isMemberExpression(id)) op = "=";
    let node;
    if (op) {
      node = _core.types.expressionStatement(_core.types.assignmentExpression(op, id, _core.types.cloneNode(init) || this.scope.buildUndefinedNode()));
    } else {
      let nodeInit;
      if ((this.kind === "const" || this.kind === "using") && init === null) {
        nodeInit = this.scope.buildUndefinedNode();
      } else {
        nodeInit = _core.types.cloneNode(init);
      }
      node = _core.types.variableDeclaration(this.kind, [_core.types.variableDeclarator(id, nodeInit)]);
    }
    node._blockHoist = this.blockHoist;
    return node;
  }
  buildVariableDeclaration(id, init) {
    const declar = _core.types.variableDeclaration("var", [_core.types.variableDeclarator(_core.types.cloneNode(id), _core.types.cloneNode(init))]);
    declar._blockHoist = this.blockHoist;
    return declar;
  }
  push(id, _init) {
    const init = _core.types.cloneNode(_init);
    if (_core.types.isObjectPattern(id)) {
      this.pushObjectPattern(id, init);
    } else if (_core.types.isArrayPattern(id)) {
      this.pushArrayPattern(id, init);
    } else if (_core.types.isAssignmentPattern(id)) {
      this.pushAssignmentPattern(id, init);
    } else {
      this.nodes.push(this.buildVariableAssignment(id, init));
    }
  }
  toArray(node, count) {
    if (this.iterableIsArray || _core.types.isIdentifier(node) && this.arrayRefSet.has(node.name)) {
      return node;
    } else {
      return this.scope.toArray(node, count, this.arrayLikeIsIterable);
    }
  }
  pushAssignmentPattern({
    left,
    right
  }, valueRef) {
    if (isPureVoid(valueRef)) {
      this.push(left, right);
      return;
    }
    const tempId = this.scope.generateUidIdentifierBasedOnNode(valueRef);
    this.nodes.push(this.buildVariableDeclaration(tempId, valueRef));
    const tempConditional = _core.types.conditionalExpression(_core.types.binaryExpression("===", _core.types.cloneNode(tempId), this.scope.buildUndefinedNode()), right, _core.types.cloneNode(tempId));
    if (_core.types.isPattern(left)) {
      let patternId;
      let node;
      if (this.kind === "const" || this.kind === "let" || this.kind === "using") {
        patternId = this.scope.generateUidIdentifier(tempId.name);
        node = this.buildVariableDeclaration(patternId, tempConditional);
      } else {
        patternId = tempId;
        node = _core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.cloneNode(tempId), tempConditional));
      }
      this.nodes.push(node);
      this.push(left, patternId);
    } else {
      this.nodes.push(this.buildVariableAssignment(left, tempConditional));
    }
  }
  pushObjectRest(pattern, objRef, spreadProp, spreadPropIndex) {
    const value = buildObjectExcludingKeys(pattern.properties.slice(0, spreadPropIndex), objRef, this.scope, name => this.addHelper(name), this.objectRestNoSymbols, this.useBuiltIns);
    this.nodes.push(this.buildVariableAssignment(spreadProp.argument, value));
  }
  pushObjectProperty(prop, propRef) {
    if (_core.types.isLiteral(prop.key)) prop.computed = true;
    const pattern = prop.value;
    const objRef = _core.types.memberExpression(_core.types.cloneNode(propRef), prop.key, prop.computed);
    if (_core.types.isPattern(pattern)) {
      this.push(pattern, objRef);
    } else {
      this.nodes.push(this.buildVariableAssignment(pattern, objRef));
    }
  }
  pushObjectPattern(pattern, objRef) {
    if (!pattern.properties.length) {
      this.nodes.push(_core.types.expressionStatement(_core.types.callExpression(this.addHelper("objectDestructuringEmpty"), isPureVoid(objRef) ? [] : [objRef])));
      return;
    }
    if (pattern.properties.length > 1 && !this.scope.isStatic(objRef)) {
      const temp = this.scope.generateUidIdentifierBasedOnNode(objRef);
      this.nodes.push(this.buildVariableDeclaration(temp, objRef));
      objRef = temp;
    }
    if (hasObjectRest(pattern)) {
      let copiedPattern;
      for (let i = 0; i < pattern.properties.length; i++) {
        const prop = pattern.properties[i];
        if (_core.types.isRestElement(prop)) {
          break;
        }
        const key = prop.key;
        if (prop.computed && !this.scope.isPure(key)) {
          const name = this.scope.generateUidIdentifierBasedOnNode(key);
          this.nodes.push(this.buildVariableDeclaration(name, key));
          if (!copiedPattern) {
            copiedPattern = pattern = Object.assign({}, pattern, {
              properties: pattern.properties.slice()
            });
          }
          copiedPattern.properties[i] = Object.assign({}, prop, {
            key: name
          });
        }
      }
    }
    for (let i = 0; i < pattern.properties.length; i++) {
      const prop = pattern.properties[i];
      if (_core.types.isRestElement(prop)) {
        this.pushObjectRest(pattern, objRef, prop, i);
      } else {
        this.pushObjectProperty(prop, objRef);
      }
    }
  }
  canUnpackArrayPattern(pattern, arr) {
    if (!_core.types.isArrayExpression(arr)) return false;
    if (pattern.elements.length > arr.elements.length) return;
    if (pattern.elements.length < arr.elements.length && !hasArrayRest(pattern)) {
      return false;
    }
    for (const elem of pattern.elements) {
      if (!elem) return false;
      if (_core.types.isMemberExpression(elem)) return false;
    }
    for (const elem of arr.elements) {
      if (_core.types.isSpreadElement(elem)) return false;
      if (_core.types.isCallExpression(elem)) return false;
      if (_core.types.isMemberExpression(elem)) return false;
    }
    const bindings = _core.types.getBindingIdentifiers(pattern);
    const state = {
      deopt: false,
      bindings
    };
    try {
      _core.types.traverse(arr, arrayUnpackVisitor, state);
    } catch (e) {
      if (e !== STOP_TRAVERSAL) throw e;
    }
    return !state.deopt;
  }
  pushUnpackedArrayPattern(pattern, arr) {
    const holeToUndefined = el => el != null ? el : this.scope.buildUndefinedNode();
    for (let i = 0; i < pattern.elements.length; i++) {
      const elem = pattern.elements[i];
      if (_core.types.isRestElement(elem)) {
        this.push(elem.argument, _core.types.arrayExpression(arr.elements.slice(i).map(holeToUndefined)));
      } else {
        this.push(elem, holeToUndefined(arr.elements[i]));
      }
    }
  }
  pushArrayPattern(pattern, arrayRef) {
    if (arrayRef === null) {
      this.nodes.push(_core.types.expressionStatement(_core.types.callExpression(this.addHelper("objectDestructuringEmpty"), [])));
      return;
    }
    if (!pattern.elements) return;
    if (this.canUnpackArrayPattern(pattern, arrayRef)) {
      this.pushUnpackedArrayPattern(pattern, arrayRef);
      return;
    }
    const count = !hasArrayRest(pattern) && pattern.elements.length;
    const toArray = this.toArray(arrayRef, count);
    if (_core.types.isIdentifier(toArray)) {
      arrayRef = toArray;
    } else {
      arrayRef = this.scope.generateUidIdentifierBasedOnNode(arrayRef);
      this.arrayRefSet.add(arrayRef.name);
      this.nodes.push(this.buildVariableDeclaration(arrayRef, toArray));
    }
    for (let i = 0; i < pattern.elements.length; i++) {
      const elem = pattern.elements[i];
      if (!elem) continue;
      let elemRef;
      if (_core.types.isRestElement(elem)) {
        elemRef = this.toArray(arrayRef);
        elemRef = _core.types.callExpression(_core.types.memberExpression(elemRef, _core.types.identifier("slice")), [_core.types.numericLiteral(i)]);
        this.push(elem.argument, elemRef);
      } else {
        elemRef = _core.types.memberExpression(arrayRef, _core.types.numericLiteral(i), true);
        this.push(elem, elemRef);
      }
    }
  }
  init(pattern, ref) {
    if (!_core.types.isArrayExpression(ref) && !_core.types.isMemberExpression(ref)) {
      const memo = this.scope.maybeGenerateMemoised(ref, true);
      if (memo) {
        this.nodes.push(this.buildVariableDeclaration(memo, _core.types.cloneNode(ref)));
        ref = memo;
      }
    }
    this.push(pattern, ref);
    return this.nodes;
  }
}
exports.DestructuringTransformer = DestructuringTransformer;
function buildObjectExcludingKeys(excludedKeys, objRef, scope, addHelper, objectRestNoSymbols, useBuiltIns) {
  const keys = [];
  let allLiteral = true;
  let hasTemplateLiteral = false;
  for (let i = 0; i < excludedKeys.length; i++) {
    const prop = excludedKeys[i];
    const key = prop.key;
    if (_core.types.isIdentifier(key) && !prop.computed) {
      keys.push(_core.types.stringLiteral(key.name));
    } else if (_core.types.isTemplateLiteral(key)) {
      keys.push(_core.types.cloneNode(key));
      hasTemplateLiteral = true;
    } else if (_core.types.isLiteral(key)) {
      keys.push(_core.types.stringLiteral(String(key.value)));
    } else if (_core.types.isPrivateName(key)) {} else {
      keys.push(_core.types.cloneNode(key));
      allLiteral = false;
    }
  }
  let value;
  if (keys.length === 0) {
    const extendsHelper = useBuiltIns ? _core.types.memberExpression(_core.types.identifier("Object"), _core.types.identifier("assign")) : addHelper("extends");
    value = _core.types.callExpression(extendsHelper, [_core.types.objectExpression([]), _core.types.sequenceExpression([_core.types.callExpression(addHelper("objectDestructuringEmpty"), [_core.types.cloneNode(objRef)]), _core.types.cloneNode(objRef)])]);
  } else {
    let keyExpression = _core.types.arrayExpression(keys);
    if (!allLiteral) {
      keyExpression = _core.types.callExpression(_core.types.memberExpression(keyExpression, _core.types.identifier("map")), [addHelper("toPropertyKey")]);
    } else if (!hasTemplateLiteral && !_core.types.isProgram(scope.block)) {
      const programScope = scope.getProgramParent();
      const id = programScope.generateUidIdentifier("excluded");
      programScope.push({
        id,
        init: keyExpression,
        kind: "const"
      });
      keyExpression = _core.types.cloneNode(id);
    }
    value = _core.types.callExpression(addHelper(`objectWithoutProperties${objectRestNoSymbols ? "Loose" : ""}`), [_core.types.cloneNode(objRef), keyExpression]);
  }
  return value;
}
function convertVariableDeclaration(path, addHelper, arrayLikeIsIterable, iterableIsArray, objectRestNoSymbols, useBuiltIns) {
  const {
    node,
    scope
  } = path;
  const nodeKind = node.kind;
  const nodeLoc = node.loc;
  const nodes = [];
  for (let i = 0; i < node.declarations.length; i++) {
    const declar = node.declarations[i];
    const patternId = declar.init;
    const pattern = declar.id;
    const destructuring = new DestructuringTransformer({
      blockHoist: node._blockHoist,
      nodes: nodes,
      scope: scope,
      kind: node.kind,
      iterableIsArray,
      arrayLikeIsIterable,
      useBuiltIns,
      objectRestNoSymbols,
      addHelper
    });
    if (_core.types.isPattern(pattern)) {
      destructuring.init(pattern, patternId);
      if (+i !== node.declarations.length - 1) {
        _core.types.inherits(nodes[nodes.length - 1], declar);
      }
    } else {
      nodes.push(_core.types.inherits(destructuring.buildVariableAssignment(pattern, patternId), declar));
    }
  }
  let tail = null;
  let nodesOut = [];
  for (const node of nodes) {
    if (_core.types.isVariableDeclaration(node)) {
      if (tail !== null) {
        tail.declarations.push(...node.declarations);
        continue;
      } else {
        node.kind = nodeKind;
        tail = node;
      }
    } else {
      tail = null;
    }
    if (!node.loc) {
      node.loc = nodeLoc;
    }
    nodesOut.push(node);
  }
  if (nodesOut.length === 2 && _core.types.isVariableDeclaration(nodesOut[0]) && _core.types.isExpressionStatement(nodesOut[1]) && _core.types.isCallExpression(nodesOut[1].expression) && nodesOut[0].declarations.length === 1) {
    const expr = nodesOut[1].expression;
    expr.arguments = [nodesOut[0].declarations[0].init];
    nodesOut = [expr];
  } else {
    if (_core.types.isForStatement(path.parent, {
      init: node
    }) && !nodesOut.some(v => _core.types.isVariableDeclaration(v))) {
      for (let i = 0; i < nodesOut.length; i++) {
        const node = nodesOut[i];
        if (_core.types.isExpressionStatement(node)) {
          nodesOut[i] = node.expression;
        }
      }
    }
  }
  if (nodesOut.length === 1) {
    path.replaceWith(nodesOut[0]);
  } else {
    path.replaceWithMultiple(nodesOut);
  }
  scope.crawl();
}
function convertAssignmentExpression(path, addHelper, arrayLikeIsIterable, iterableIsArray, objectRestNoSymbols, useBuiltIns) {
  const {
    node,
    scope,
    parentPath
  } = path;
  const nodes = [];
  const destructuring = new DestructuringTransformer({
    operator: node.operator,
    scope: scope,
    nodes: nodes,
    arrayLikeIsIterable,
    iterableIsArray,
    objectRestNoSymbols,
    useBuiltIns,
    addHelper
  });
  let ref;
  if (!parentPath.isExpressionStatement() && !parentPath.isSequenceExpression() || path.isCompletionRecord()) {
    ref = scope.generateUidIdentifierBasedOnNode(node.right, "ref");
    nodes.push(_core.types.variableDeclaration("var", [_core.types.variableDeclarator(ref, node.right)]));
    if (_core.types.isArrayExpression(node.right)) {
      destructuring.arrayRefSet.add(ref.name);
    }
  }
  destructuring.init(node.left, ref || node.right);
  if (ref) {
    if (parentPath.isArrowFunctionExpression()) {
      path.replaceWith(_core.types.blockStatement([]));
      nodes.push(_core.types.returnStatement(_core.types.cloneNode(ref)));
    } else {
      nodes.push(_core.types.expressionStatement(_core.types.cloneNode(ref)));
    }
  }
  path.replaceWithMultiple(nodes);
  scope.crawl();
}

//# sourceMappingURL=util.js.map
