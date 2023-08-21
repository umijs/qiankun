"use strict";

module.exports = function(params) {
  const { div, index, nodes, expectation, position, symb } = params;

  if (expectation.indexOf("always") === 0) {
    div[position] = symb;

    return true;
  } else if (expectation.indexOf("never") === 0) {
    div[position] = "";

    for (let i = index + 1; i < nodes.length; i++) {
      const node = nodes[i];

      if (node.type === "comment") {
        continue;
      }

      if (node.type === "space") {
        node.value = "";
        continue;
      }

      break;
    }

    return true;
  }
};
