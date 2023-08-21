/**
 * @fileoverview
 *   Check if a node is a conditional comment.
 * @longdescription
 *   ## Use
 *
 *   ```js
 *   var u = require('unist-builder')
 *   var ok = require('hast-util-is-conditional-comment')
 *
 *   ok(u('comment', '[if IE]>...<![endif]')) //=> true
 *   ok(u('comment', '<![endif]')) //=> true
 *   ok(u('comment', 'foo')) //=> false
 *   ```
 *
 *   ## API
 *
 *   ### `isConditionalComment(node)`
 *
 *   Return `true` if `node` is a comment node matching one of the know IE
 *   conditional comments.
 */

'use strict'

module.exports = conditional

var re = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/

function conditional(node) {
  return node && node.type === 'comment' && re.test(node.value)
}
