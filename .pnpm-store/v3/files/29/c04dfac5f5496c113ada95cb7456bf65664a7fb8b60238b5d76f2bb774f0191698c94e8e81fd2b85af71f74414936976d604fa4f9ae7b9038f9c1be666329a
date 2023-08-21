"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;
var _helperValidatorOption = require("@babel/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("@babel/preset-react");
function normalizeOptions(options = {}) {
  {
    let {
      pragma,
      pragmaFrag
    } = options;
    const {
      pure,
      throwIfNamespace = true,
      runtime = "classic",
      importSource,
      useBuiltIns,
      useSpread
    } = options;
    if (runtime === "classic") {
      pragma = pragma || "React.createElement";
      pragmaFrag = pragmaFrag || "React.Fragment";
    }
    const development = !!options.development;
    return {
      development,
      importSource,
      pragma,
      pragmaFrag,
      pure,
      runtime,
      throwIfNamespace,
      useBuiltIns,
      useSpread
    };
  }
}

//# sourceMappingURL=normalize-options.js.map
