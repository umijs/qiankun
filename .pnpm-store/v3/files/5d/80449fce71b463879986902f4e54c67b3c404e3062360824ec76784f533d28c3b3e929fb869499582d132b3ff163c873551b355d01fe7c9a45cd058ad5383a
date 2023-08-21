/* @flow */
"use strict";

/**
 * Check whether an array of nodes has some unresolved nested selector
 */
module.exports = function(rule /*: Object*/) /*: boolean*/ {
  return (rule.nodes || []).some(node => ["rule"].indexOf(node.type) !== -1);
};
