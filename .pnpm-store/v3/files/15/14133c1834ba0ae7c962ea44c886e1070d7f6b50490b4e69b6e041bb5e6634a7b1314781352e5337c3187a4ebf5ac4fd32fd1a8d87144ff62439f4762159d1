"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routeToChunkName = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _lodash() {
  const data = require("@umijs/deps/compiled/lodash");

  _lodash = function _lodash() {
    return data;
  };

  return data;
}

var _winPath = _interopRequireDefault(require("./winPath/winPath"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function lastSlash(str) {
  return str[str.length - 1] === '/' ? str : `${str}/`;
}
/**
 * transform route component into webpack chunkName
 * @param param0
 */


const routeToChunkName = ({
  route,
  cwd
} = {
  route: {}
}) => {
  return typeof route.component === 'string' ? route.component.replace(new RegExp(`^${(0, _lodash().escapeRegExp)(lastSlash((0, _winPath.default)(cwd || '/')))}`), '').replace(/^.(\/|\\)/, '').replace(/(\/|\\)/g, '__').replace(/\.jsx?$/, '').replace(/\.tsx?$/, '').replace(/^src__/, '').replace(/\.\.__/g, '') // 约定式路由的 [ 会导致 webpack 的 code splitting 失败
  // ref: https://github.com/umijs/umi/issues/4155
  .replace(/[\[\]]/g, '') // 插件层的文件也可能是路由组件，比如 plugin-layout 插件
  .replace(/^.umi-production__/, 't__').replace(/^pages__/, 'p__').replace(/^page__/, 'p__') : '';
};

exports.routeToChunkName = routeToChunkName;