var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/dep/getCJSExports.ts
var getCJSExports_exports = {};
__export(getCJSExports_exports, {
  getCJSExports: () => getCJSExports
});
module.exports = __toCommonJS(getCJSExports_exports);
function getCJSExports({ content }) {
  return matchAll(
    /Object\.defineProperty\(\s*exports\s*\,\s*[\"|\'](\w+)[\"|\']/g,
    content
  ).concat(
    // Support export['default']
    // ref: https://unpkg.alibaba-inc.com/browse/echarts-for-react@2.0.16/lib/core.js
    matchAll(
      /exports(?:\.|\[(?:\'|\"))(\w+)(?:\s*|(?:\'|\")\])\s*\=/g,
      content
    )
  ).concat(
    // Support __webpack_exports__["default"]
    // ref: https://github.com/margox/braft-editor/blob/master/dist/index.js#L8429
    matchAll(/__webpack_exports__\[(?:\"|\')(\w+)(?:\"|\')\]\s*\=/g, content)
  ).concat(
    // Support __webpack_require__.d(__webpack_exports, "EditorState")
    // ref: https://github.com/margox/braft-editor/blob/master/dist/index.js#L8347
    matchAll(
      /__webpack_require__\.d\(\s*__webpack_exports__\s*,\s*(?:\"|\')(\w+)(?:\"|\')\s*,/g,
      content
    )
  ).concat(
    ...matchAll(
      /__webpack_require__\.d\(\s*__webpack_exports__\s*,\s*(\{)/g,
      content
    ).map((matchResult) => {
      const { index } = matchResult;
      let idx = index;
      let deep = 0;
      let isMeetSymbol = false;
      let symbolBeginIndex = index;
      while (idx < content.length) {
        if (!deep && isMeetSymbol) {
          break;
        }
        if (content[idx] === "{") {
          if (!isMeetSymbol) {
            isMeetSymbol = true;
            symbolBeginIndex = idx;
          }
          deep++;
        }
        if (content[idx] === "}") {
          deep--;
        }
        idx++;
      }
      let result = content.slice(symbolBeginIndex, idx);
      return [
        ...matchAll(
          /(?:\"|\')(\w+)(?:\"|\')\s*\:\s*(?:function|\()/g,
          result
        )
      ];
    })
  ).map((result) => result[1]);
}
function matchAll(regexp, str) {
  const result = [];
  let match;
  while ((match = regexp.exec(str)) !== null) {
    result.push(match);
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCJSExports
});
