"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _hostedGitInfo() {
  const data = _interopRequireDefault(require("hosted-git-info"));
  _hostedGitInfo = function _hostedGitInfo() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = (url, platform) => {
  var _hostedGit$fromUrl;
  if (!url || typeof url !== 'string') return '';
  let repoUrl = (_hostedGit$fromUrl = _hostedGitInfo().default.fromUrl(url)) === null || _hostedGit$fromUrl === void 0 ? void 0 : _hostedGit$fromUrl.browse();
  if (!repoUrl) {
    const isHttpProtocol = url.includes('http://');
    if (['gitlab', 'bitbucket'].includes(platform)) {
      var _hostedGit$fromUrl2, _hostedGit$fromUrl2$b;
      if (isHttpProtocol) url = url.replace('http', 'https');
      let originalHost;
      repoUrl = (_hostedGit$fromUrl2 = _hostedGitInfo().default.fromUrl(
      // fake to gitlab to make hostedGit worked
      // refer: https://github.com/npm/hosted-git-info/pull/30#issuecomment-400074956
      url.replace(/([\w-]+\.)+[\w-]+/, str => {
        originalHost = str;
        return 'gitlab.com';
      }))) === null || _hostedGit$fromUrl2 === void 0 ? void 0 : (_hostedGit$fromUrl2$b = _hostedGit$fromUrl2.browse()
      // restore the original host
      ) === null || _hostedGit$fromUrl2$b === void 0 ? void 0 : _hostedGit$fromUrl2$b.replace('gitlab.com', originalHost);
    }
    // process other case, protocol://domain/group/repo{discard remaining paths}
    repoUrl = repoUrl || url.replace(/^.*?((?:[\w-]+\.?)+)+[:/]([\w-]+)\/([\w-]+).*$/, 'https://$1/$2/$3');
    if (isHttpProtocol) repoUrl = repoUrl.replace('https', 'http');
  }
  return repoUrl;
};
exports.default = _default;