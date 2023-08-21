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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * generate a 404.html to make sure dynamic routes can be resolved on deploy platform
 */
var _default = api => {
  api.modifyExportRouteMap(defaultRouteMap => {
    // use dynamic route to avoid Umi SSR render content
    defaultRouteMap.unshift({
      route: {
        path: '/:404'
      },
      file: '404.html'
    });
    return defaultRouteMap;
  });
};

exports.default = _default;