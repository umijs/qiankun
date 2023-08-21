"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _child_process() {
  const data = require("child_process");
  _child_process = function _child_process() {
    return data;
  };
  return data;
}
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getPkgAliasForPath(absPath) {
  const result = ['', absPath];
  const pkgPath = _path().default.join(absPath, 'package.json');
  // use package.name if exists
  if (_fs().default.existsSync(pkgPath)) {
    result[0] = require(pkgPath).name;
  }
  return result;
}
var _default = paths => {
  const isLerna = _fs().default.existsSync(_path().default.join(paths.cwd, 'lerna.json'));
  const isPnpmWorkspace = _fs().default.existsSync(_path().default.join(paths.cwd, 'pnpm-workspace.yaml'));
  const pkgs = [];
  if (isLerna) {
    // for lerna repo
    const _require = require('lerna/package.json'),
      lernaVersion = _require.version;
    const lernaMainVersion = Number(lernaVersion.split('.')[0]);
    if (lernaMainVersion >= 3) {
      JSON.parse((0, _child_process().execSync)(`${_path().default.join(paths.cwd, 'node_modules/.bin/lerna')} ls --json --all`, {
        stdio: 'pipe'
        // fix: 修复windows环境下有多余输出导致JSON.parse报错的问题
      }).toString().replace(/([\r\n]\])[^]*$/, '$1')).forEach(pkg => {
        pkgs.push([pkg.name, pkg.location]);
      });
    } else if (require.resolve('lerna/lib/PackageUtilities', {
      paths: [paths.cwd]
    })) {
      // reference: https://github.com/azz/lerna-get-packages/blob/master/index.js
      const PackageUtilities = require(require.resolve('lerna/lib/PackageUtilities', {
        paths: [paths.cwd]
      }));
      const Repository = require(require.resolve('lerna/lib/Repository', {
        paths: [paths.cwd]
      }));
      PackageUtilities.getPackages(new Repository(paths.cwd)).forEach(pkg => {
        pkgs.push([pkg._package.name, pkg._location]);
      });
    }
  } else if (isPnpmWorkspace) {
    JSON.parse((0, _child_process().execSync)('pnpm list -r --json', {
      stdio: 'pipe'
    }).toString().replace(/([\r\n]\])[^]*$/, '$1')).filter(pkg => pkg.path !== paths.cwd) // filter root pkg
    .forEach(pkg => {
      pkgs.push([pkg.name, pkg.path]);
    });
  } else {
    // for standard repo
    pkgs.push(getPkgAliasForPath(paths.cwd));
  }
  return pkgs;
};
exports.default = _default;