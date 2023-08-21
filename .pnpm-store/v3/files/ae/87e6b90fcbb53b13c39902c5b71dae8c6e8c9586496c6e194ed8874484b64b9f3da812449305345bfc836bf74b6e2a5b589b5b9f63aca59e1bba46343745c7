const createInput = require('./lib/input')
const createOutput = require('./lib/output-svg')
const createRenderer = require('./lib/renderer')
const createPlugin = require('./lib/core')

module.exports = createPlugin('rehypeMathJaxSvg', renderSvg)

function renderSvg(inputOptions, outputOptions) {
  return createRenderer(createInput(inputOptions), createOutput(outputOptions))
}
