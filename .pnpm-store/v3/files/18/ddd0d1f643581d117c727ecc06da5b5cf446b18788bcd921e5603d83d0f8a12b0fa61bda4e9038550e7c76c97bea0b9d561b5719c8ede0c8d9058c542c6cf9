const inlinePlugin = require('./inline')
const blockPlugin = require('./block')

module.exports = math

function math(options) {
  var settings = options || {}
  blockPlugin.call(this, settings)
  inlinePlugin.call(this, settings)
}
