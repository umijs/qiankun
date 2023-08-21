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

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("slash2"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Umi process route component from pages path but dumi process with cwd, so the path need to be converted
 */
var relative = function relative(routes) {
  return routes.map(route => {
    if (route.component && !_path().default.isAbsolute(route.component)) {
      route.component = (0, _slash().default)(_path().default.relative(_path().default.join(this.umi.paths.absTmpPath, 'core'), _path().default.join(this.umi.paths.cwd, route.component)));
    }

    return route;
  });
};

exports.default = relative;