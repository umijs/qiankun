"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalizeOptions;
var _helperValidatorOption = require("@babel/helper-validator-option");
const v = new _helperValidatorOption.OptionValidator("@babel/preset-typescript");
function normalizeOptions(options = {}) {
  let {
    allowNamespaces = true,
    jsxPragma,
    onlyRemoveTypeImports
  } = options;
  const TopLevelOptions = {
    ignoreExtensions: "ignoreExtensions",
    allowNamespaces: "allowNamespaces",
    disallowAmbiguousJSXLike: "disallowAmbiguousJSXLike",
    jsxPragma: "jsxPragma",
    jsxPragmaFrag: "jsxPragmaFrag",
    onlyRemoveTypeImports: "onlyRemoveTypeImports",
    optimizeConstEnums: "optimizeConstEnums",
    allExtensions: "allExtensions",
    isTSX: "isTSX"
  };
  ;
  const jsxPragmaFrag = v.validateStringOption(TopLevelOptions.jsxPragmaFrag, options.jsxPragmaFrag, "React.Fragment");
  {
    var allExtensions = v.validateBooleanOption(TopLevelOptions.allExtensions, options.allExtensions, false);
    var isTSX = v.validateBooleanOption(TopLevelOptions.isTSX, options.isTSX, false);
    if (isTSX) {
      v.invariant(allExtensions, "isTSX:true requires allExtensions:true");
    }
  }
  const ignoreExtensions = v.validateBooleanOption(TopLevelOptions.ignoreExtensions, options.ignoreExtensions, false);
  const disallowAmbiguousJSXLike = v.validateBooleanOption(TopLevelOptions.disallowAmbiguousJSXLike, options.disallowAmbiguousJSXLike, false);
  if (disallowAmbiguousJSXLike) {
    {
      v.invariant(allExtensions, "disallowAmbiguousJSXLike:true requires allExtensions:true");
    }
  }
  const optimizeConstEnums = v.validateBooleanOption(TopLevelOptions.optimizeConstEnums, options.optimizeConstEnums, false);
  const normalized = {
    ignoreExtensions,
    allowNamespaces,
    disallowAmbiguousJSXLike,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    optimizeConstEnums
  };
  {
    normalized.allExtensions = allExtensions;
    normalized.isTSX = isTSX;
  }
  return normalized;
}

//# sourceMappingURL=normalize-options.js.map
