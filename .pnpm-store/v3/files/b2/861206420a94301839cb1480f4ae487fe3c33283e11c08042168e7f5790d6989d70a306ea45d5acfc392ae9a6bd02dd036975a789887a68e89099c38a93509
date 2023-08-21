const mathjax = require('mathjax-full/js/mathjax').mathjax
const register = require('mathjax-full/js/handlers/html').RegisterHTMLHandler
const fromDom = require('hast-util-from-dom')
const toText = require('hast-util-to-text')
const createAdaptor = require('./adaptor')

module.exports = renderer

const adaptor = createAdaptor()

// To do next major: Keep resultant HTML handler from `register(adaptor)` to
// allow registering the `AssistiveMmlHandler` as in this demo:
// <https://github.com/mathjax/MathJax-demos-node/tree/master/direct>
//
// To do next major: If registering `AssistiveMmlHandler` is supported through
// configuration, move HTML handler registration to beginning of transformer and
// unregister at the end of transformer with
// `mathjax.handlers.unregister(handler)`.
// That is to prevent memory leak in `mathjax.handlers` whenever a new instance
// of the plugin is used.
register(adaptor)

function renderer(input, output) {
  const doc = mathjax.document('', {InputJax: input, OutputJax: output})

  return {render: render, styleSheet: styleSheet}

  function render(node, options) {
    node.children = [fromDom(doc.convert(toText(node), options))]
  }

  function styleSheet() {
    const value = adaptor.textContent(output.styleSheet(doc))

    return {
      type: 'element',
      tagName: 'style',
      properties: {},
      children: [{type: 'text', value: value}]
    }
  }
}
