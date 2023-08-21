"use strict";

const traverse = require("traverse");
const { get, has, find } = require("lodash");

/**
 * Return an Array of every possible non-cyclic path in the object as a dot separated string sorted
 * by length.
 *
 * Example:
 * getSortedObjectPaths({ process: { env: { NODE_ENV: "development" } } });
 * // => [ "process.env.NODE_ENV", "process.env" "process" ]
 *
 * @param  {Object}  obj  A plain JavaScript Object
 * @return {Array}  Sorted list of non-cyclic paths into obj
 */
const getSortedObjectPaths = (obj) => {
  if (!obj) { return []; }

  return traverse(obj)
    .paths()
    .filter((arr) => arr.length)
    .map((arr) => arr.join("."))
    .sort((a, b) => b.length - a.length);
};

/**
 * Replace a node with a given value. If the replacement results in a BinaryExpression, it will be
 * evaluated. For example, if the result of the replacement is `var x = "production" === "production"`
 * The evaluation will make a second replacement resulting in `var x = true`
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {*}          replacement  The value the node will be replaced with
 * @return {undefined}
 */
const replaceAndEvaluateNode = (replaceFn, nodePath, replacement) => {
  nodePath.replaceWith(replaceFn(replacement));

  if (nodePath.parentPath.isBinaryExpression()) {
    const result = nodePath.parentPath.evaluate();

    if (result.confident) {
      nodePath.parentPath.replaceWith(replaceFn(result.value));
    }
  }
};

/**
 * Finds the first replacement in sorted object paths for replacements that causes comparator
 * to return true.  If one is found, replaces the node with it.
 * @param  {Object}     replacements The object to search for replacements
 * @param  {babelNode}  nodePath     The node to evaluate
 * @param  {function}   replaceFn    The function used to replace the node
 * @param  {function}   comparator   The function used to evaluate whether a node matches a value in `replacements`
 * @return {undefined}
 */
// eslint-disable-next-line max-params
const processNode = (replacements, nodePath, replaceFn, comparator) => {
  const replacementKey = find(getSortedObjectPaths(replacements),
    (value) => comparator(nodePath, value));
  if (has(replacements, replacementKey)) {
    replaceAndEvaluateNode(replaceFn, nodePath, get(replacements, replacementKey));
  }
};

/**
 * Checks if the given identifier is an ES module import
 * @param  {babelNode} identifierNodePath The node to check
 * @return {boolean} Indicates if the provided node is an import specifier or references one
 */
const isImportIdentifier = (identifierNodePath) => {
  const name = get(identifierNodePath, ["node", "name"]);
  const containerType = get(identifierNodePath, ["container", "type"]);

  if (containerType === "ImportDefaultSpecifier" || containerType === "ImportSpecifier") {
    return true;
  }

  // Check if the identifier references a module import of the same name
  const binding = identifierNodePath.scope.getBinding(name);
  if (binding && binding.kind === "module") {
    return true;
  }

  return false;
};

const memberExpressionComparator = (nodePath, value) => nodePath.matchesPattern(value);
const identifierComparator = (nodePath, value) => nodePath.node.name === value;
const unaryExpressionComparator = (nodePath, value) => nodePath.node.argument.name === value;
const TYPEOF_PREFIX = "typeof ";

const plugin = function ({ types: t }) {
  return {
    visitor: {

      // process.env.NODE_ENV;
      MemberExpression(nodePath, state) {
        processNode(state.opts, nodePath, t.valueToNode, memberExpressionComparator);
      },

      // const x = { version: VERSION };
      Identifier(nodePath, state) {
        // Don't transform import idenifiers. This is meant to mimic webpack's
        // DefinePlugin behavior.
        if (isImportIdentifier(nodePath)) {
          return;
        }

        processNode(state.opts, nodePath, t.valueToNode, identifierComparator);
      },

      // typeof window
      UnaryExpression(nodePath, state) {
        if (nodePath.node.operator !== "typeof") { return; }

        const { opts } = state;
        const keys = Object.keys(opts);
        const typeofValues = {};

        keys.forEach((key) => {
          if (key.substring(0, TYPEOF_PREFIX.length) === TYPEOF_PREFIX) {
            typeofValues[key.substring(TYPEOF_PREFIX.length)] = opts[key];
          }
        });

        processNode(typeofValues, nodePath, t.valueToNode, unaryExpressionComparator);
      }

    }
  };
};

// Exports.
module.exports = plugin;
module.exports.default = plugin;
module.exports.getSortedObjectPaths = getSortedObjectPaths;
