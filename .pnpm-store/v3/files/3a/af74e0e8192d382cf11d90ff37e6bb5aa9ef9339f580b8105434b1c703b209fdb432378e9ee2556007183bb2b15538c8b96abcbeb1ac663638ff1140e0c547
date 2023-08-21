'use strict'

var own = {}.hasOwnProperty

module.exports = hasProperty

// Check if `node` has a set `name` property.
function hasProperty(node, name) {
  var props
  var value

  if (!node || !name || typeof node !== 'object' || node.type !== 'element') {
    return false
  }

  props = node.properties
  value = props && own.call(props, name) && props[name]

  return value !== null && value !== undefined && value !== false
}
