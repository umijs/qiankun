'use strict'

var convert = require('unist-util-is/convert')

module.exports = filter

var own = {}.hasOwnProperty

function filter(tree, options, test) {
  var is = convert(test || options)
  var cascade = options.cascade == null ? true : options.cascade

  return preorder(tree, null, null)

  function preorder(node, index, parent) {
    var children
    var childIndex
    var result
    var next
    var key

    if (!is(node, index, parent)) return null

    if (node.children) {
      children = []
      childIndex = -1

      while (++childIndex < node.children.length) {
        result = preorder(node.children[childIndex], childIndex, node)

        if (result) {
          children.push(result)
        }
      }

      if (cascade && node.children.length && !children.length) return null
    }

    // Create a shallow clone, using the new children.
    next = {}

    for (key in node) {
      /* istanbul ignore else - Prototype injection. */
      if (own.call(node, key)) {
        next[key] = key === 'children' ? children : node[key]
      }
    }

    return next
  }
}
