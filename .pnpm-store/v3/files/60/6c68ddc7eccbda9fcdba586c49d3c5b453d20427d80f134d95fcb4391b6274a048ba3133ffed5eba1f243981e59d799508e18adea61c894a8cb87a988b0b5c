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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isWin = process.platform === 'win32';
/**
 * resolve src from dest
 * @refer https://github.com/zkochan/symlink-dir/blob/master/src/index.ts#L18
 */

function resolveSrc(src, dest) {
  return isWin ? `${src}\\` : _path().default.relative(_path().default.dirname(dest), src);
}

var _default = (src, dest) => {
  const destDir = _path().default.dirname(dest);

  const resolvedSrc = resolveSrc(src, dest); // see also: https://github.com/zkochan/symlink-dir/blob/master/src/index.ts#L14

  const symlinkType = isWin ? 'junction' : 'dir'; // create directory first if node_modules/@group not exists

  if (!_fs().default.existsSync(destDir)) {
    _fs().default.mkdirSync(destDir, {
      recursive: true
    });
  } // create src symlink relative dest


  _fs().default.symlinkSync(resolvedSrc, dest, symlinkType);
};

exports.default = _default;