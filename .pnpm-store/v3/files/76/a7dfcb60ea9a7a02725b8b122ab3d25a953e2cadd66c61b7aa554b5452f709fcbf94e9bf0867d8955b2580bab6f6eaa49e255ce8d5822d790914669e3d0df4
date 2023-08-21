'use strict'

var convert = require('unist-util-is/convert')
var whiteSpace = require('hast-util-whitespace')

module.exports = whiteSpaceLeft

var isText = convert('text')

// Check if `node` starts with white-space.
function whiteSpaceLeft(node) {
  return isText(node) && whiteSpace(node.value.charAt(0))
}
