var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/dep/getExposeFromContent.ts
var getExposeFromContent_exports = {};
__export(getExposeFromContent_exports, {
  getExposeFromContent: () => getExposeFromContent
});
module.exports = __toCommonJS(getExposeFromContent_exports);
var import_utils = require("@umijs/utils");
var import_assert = __toESM(require("assert"));
var import_path = require("path");
var import_getModuleExports = require("./getModuleExports");
async function getExposeFromContent(opts) {
  var _a;
  const importPath = (0, import_utils.winPath)(opts.filePath);
  if (opts.filePath && /\.(css|less|scss|sass|stylus|styl)$/.test(opts.filePath)) {
    return `import '${importPath}';`;
  }
  if ((_a = opts.filePath) == null ? void 0 : _a.endsWith(".wasm")) {
    return `
import _ from '${importPath}';
export default _; 
export * from '${importPath}';`.trim();
  }
  if (opts.filePath && /\.(json|svg|png|jpe?g|avif|gif|webp|ico|eot|woff|woff2|ttf|txt|text|mdx?)$/.test(
    opts.filePath
  )) {
    return `
import _ from '${importPath}';
export default _;`.trim();
  }
  (0, import_assert.default)(
    (0, import_utils.isJavaScriptFile)(opts.filePath),
    `file type not supported for ${(0, import_path.basename)(opts.filePath)}.`
  );
  const { exports, isCJS } = await (0, import_getModuleExports.getModuleExports)({
    content: opts.content,
    filePath: opts.filePath
  });
  if (isCJS) {
    return [
      `import _ from '${importPath}';`,
      `export default _;`,
      `export * from '${importPath}';`
    ].join("\n");
  } else {
    const ret = [];
    let hasExports = false;
    if (exports.includes("default")) {
      ret.push(`import _ from '${importPath}';`);
      ret.push(`export default _;`);
      hasExports = true;
    }
    if (hasNonDefaultExports(exports) || // export * from 不会有 exports，只会有 imports
    // case: export*from'.'
    //       export * from '.'
    /export\s*\*\s*from/.test(opts.content)) {
      ret.push(`export * from '${importPath}';`);
      hasExports = true;
    }
    if (!hasExports) {
      if (exports.includes("__esModule")) {
        ret.push(`import _ from '${importPath}';`);
        ret.push(`export default _;`);
        ret.push(`export * from '${importPath}';`);
      } else {
        ret.push(`import '${importPath}';`);
      }
    }
    return ret.join("\n");
  }
}
function hasNonDefaultExports(exports) {
  return exports.filter((exp) => !["__esModule", "default"].includes(exp)).length > 0;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getExposeFromContent
});
