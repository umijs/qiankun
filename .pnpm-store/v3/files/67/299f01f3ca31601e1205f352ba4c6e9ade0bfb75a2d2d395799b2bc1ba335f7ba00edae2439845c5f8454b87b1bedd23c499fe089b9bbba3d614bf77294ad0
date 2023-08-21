"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Get the name of variable that contains node
 *
 * @param  {Path} path to the node
 *
 * @return {String}   The target
 */
var _default = t => path => {
  let namedNode;
  path.find(path => {
    // X = styled
    if (path.isAssignmentExpression()) {
      namedNode = path.node.left; // const X = { Y: styled }
    } else if (path.isObjectProperty()) {
      namedNode = path.node.key; // class Y { (static) X = styled }
    } else if (path.isClassProperty()) {
      namedNode = path.node.key; // const X = styled
    } else if (path.isVariableDeclarator()) {
      namedNode = path.node.id;
    } else if (path.isStatement()) {
      // we've hit a statement, we should stop crawling up
      return true;
    } // we've got an displayName (if we need it) no need to continue
    // However if this is an assignment expression like X = styled then we
    // want to keep going up incase there is Y = X = styled; in this case we
    // want to pick the outer name because react-refresh will add HMR variables
    // like this: X = _a = styled. We could also consider only doing this if the
    // name starts with an underscore.


    if (namedNode && !path.isAssignmentExpression()) return true;
  }); // foo.bar -> bar

  if (t.isMemberExpression(namedNode)) {
    namedNode = namedNode.property;
  } // identifiers are the only thing we can reliably get a name from


  return t.isIdentifier(namedNode) ? namedNode.name : undefined;
};

exports.default = _default;