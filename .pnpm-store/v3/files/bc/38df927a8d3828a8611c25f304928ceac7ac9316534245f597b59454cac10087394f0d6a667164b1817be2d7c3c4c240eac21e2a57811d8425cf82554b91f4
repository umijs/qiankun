/**
 * @fileoverview
 *   Remove comments (except conditional comments).
 *
 *   When configured with `force: true` (default: `false`), conditional comments
 *   are also removed.
 * @example
 *   <!--Hello-->
 *   <!--[if IE 6]>OK<![endif]-->
 */

'use strict'

var filter = require('unist-util-filter')
var conditional = require('hast-util-is-conditional-comment')

module.exports = comments

function comments(options) {
  var force = (options || {}).removeConditional

  return transform

  function transform(tree) {
    return filter(tree, {cascade: false}, force ? hard : soft)
  }
}

function soft(node) {
  return hard(node) || conditional(node)
}

function hard(node) {
  return node.type !== 'comment'
}
