"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _hostedGitInfo() {
  const data = _interopRequireDefault(require("hosted-git-info"));

  _hostedGitInfo = function _hostedGitInfo() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = url => {
  var _hostedGit$fromUrl;

  let repoUrl = (_hostedGit$fromUrl = _hostedGitInfo().default.fromUrl(url)) === null || _hostedGit$fromUrl === void 0 ? void 0 : _hostedGit$fromUrl.browse();

  if (!repoUrl && url) {
    repoUrl = url.replace(/^.*?((?:[\w-]+\.?)+)+[:/]([\w-]+)\/([\w-]+).*$/, 'https://$1/$2/$3');
  }

  return repoUrl;
};

exports.default = _default;