function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import React from 'react';
import { AnchorLink } from 'dumi/theme';
import './SlugList.less';

var SlugsList = function SlugsList(_ref) {
  var slugs = _ref.slugs,
      props = _objectWithoutProperties(_ref, ["slugs"]);

  return /*#__PURE__*/React.createElement("ul", _extends({
    role: "slug-list"
  }, props), slugs.filter(function (_ref2) {
    var depth = _ref2.depth;
    return depth > 1 && depth < 4;
  }).map(function (slug) {
    return /*#__PURE__*/React.createElement("li", {
      key: slug.heading,
      title: slug.value,
      "data-depth": slug.depth
    }, /*#__PURE__*/React.createElement(AnchorLink, {
      to: "#".concat(slug.heading)
    }, /*#__PURE__*/React.createElement("span", null, slug.value)));
  }));
};

export default SlugsList;