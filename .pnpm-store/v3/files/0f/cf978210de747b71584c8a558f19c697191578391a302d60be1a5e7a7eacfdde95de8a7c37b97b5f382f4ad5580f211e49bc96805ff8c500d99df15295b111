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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * set title for route
 */
var title = function title(routes) {
  return routes.map(route => {
    // generate title if user did not configured
    if (!route.meta.title && typeof route.component === 'string') {
      let clearFilename = _path().default.parse(route.component).name; // discard locale for component filename


      if (route.meta.locale) {
        clearFilename = clearFilename.replace(`.${route.meta.locale}`, '');
      } // index => Index


      route.meta.title = clearFilename.replace(/^[a-z]/, s => s.toUpperCase());
    } // apply meta title for umi routes


    route.title = route.meta.title;
    return route;
  });
};

exports.default = title;