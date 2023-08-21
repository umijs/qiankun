MathJax = Object.assign(global.MathJax || {}, require("../legacy/MathJax.js").MathJax);

//
//  Load component-based configuration, if any
//
if (MathJax.config && MathJax.config.asciimath) {
  MathJax.Hub.Config({AsciiMath: MathJax.config.asciimath});
}

MathJax.Ajax.Preloading(
  "[MathJax]/jax/input/AsciiMath/config.js",
  "[MathJax]/jax/input/AsciiMath/jax.js",
  "[MathJax]/jax/element/mml/jax.js"
);

require("../legacy/jax/element/mml/jax.js");
require("../legacy/jax/input/AsciiMath/config.js");
require("../legacy/jax/input/AsciiMath/jax.js");

require("../legacy/jax/element/MmlNode.js");

var MmlFactory = require("../../../../core/MmlTree/MmlFactory.js").MmlFactory;
var factory = new MmlFactory();

exports.LegacyAsciiMath = {
  Compile: function (am,display) {
    var script = {
      type: "math/asciimath",
      innerText: am,
      MathJax: {}
    };
    var node = MathJax.InputJax.AsciiMath.Translate(script).root.toMmlNode(factory);
    node.setInheritedAttributes({}, display, 0, false);
    return node;
  },
  Translate: function (am,display) {
    return this.Compile(am,display);
  }
};
