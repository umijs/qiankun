'use strict'

module.exports = doctype

var docLower = 'doctype'
var docUpper = docLower.toUpperCase()

// Stringify a doctype `node`.
function doctype(ctx, node) {
  var doc = ctx.upperDoctype ? docUpper : docLower
  var sep = ctx.tightDoctype ? '' : ' '
  var name = node.name
  var pub = node.public
  var sys = node.system
  var val = ['<!' + doc]

  if (name) {
    val.push(sep, name)

    if (pub != null) {
      val.push(' public', sep, smart(pub))
    } else if (sys != null) {
      val.push(' system')
    }

    if (sys != null) {
      val.push(sep, smart(sys))
    }
  }

  return val.join('') + '>'
}

function smart(value) {
  var quote = value.indexOf('"') === -1 ? '"' : "'"
  return quote + value + quote
}
