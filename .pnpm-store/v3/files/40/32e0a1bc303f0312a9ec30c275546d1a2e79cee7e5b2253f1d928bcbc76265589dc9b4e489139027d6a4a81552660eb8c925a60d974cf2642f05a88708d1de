"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

var _ = require("../");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 暂时无法使用 jest 进行单元测试，原因可参见
// https://github.com/facebook/jest/issues/5741
function _default(cacheKey) {
  // windows 下 require.cache 中路径 key 为类似 ‘c:\demo\.umirc.ts’
  const cachePath = _.isWindows ? cacheKey.replace(/\//g, '\\') : cacheKey;

  if (require.cache[cachePath]) {
    const cacheParent = require.cache[cachePath].parent;
    let i = (cacheParent === null || cacheParent === void 0 ? void 0 : cacheParent.children.length) || 0; // 清理 require cache 中 parents 的引用

    while (i--) {
      if (cacheParent.children[i].id === cachePath) {
        cacheParent.children.splice(i, 1);
      }
    }

    delete require.cache[cachePath];
  }
}