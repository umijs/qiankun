const Tex = require('mathjax-full/js/input/tex').TeX
const packages = require('mathjax-full/js/input/tex/AllPackages').AllPackages

module.exports = createInput

function createInput(options) {
  return new Tex(Object.assign({packages: packages}, options))
}
