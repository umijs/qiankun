import React, { useContext } from 'react';
import { context, Link, NavLink } from 'dumi/theme';
import LocaleSelect from './LocaleSelect';
import './Navbar.less';

var Navbar = function Navbar(_ref) {
  var onMobileMenuClick = _ref.onMobileMenuClick,
      navPrefix = _ref.navPrefix,
      location = _ref.location,
      darkPrefix = _ref.darkPrefix;

  var _useContext = useContext(context),
      base = _useContext.base,
      _useContext$config = _useContext.config,
      mode = _useContext$config.mode,
      title = _useContext$config.title,
      logo = _useContext$config.logo,
      navItems = _useContext.nav;

  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-navbar",
    "data-mode": mode
  }, /*#__PURE__*/React.createElement("button", {
    className: "__dumi-default-navbar-toggle",
    onClick: onMobileMenuClick
  }), /*#__PURE__*/React.createElement(Link, {
    className: "__dumi-default-navbar-logo",
    style: {
      backgroundImage: logo && "url('".concat(logo, "')")
    },
    to: base,
    "data-plaintext": logo === false || undefined
  }, title), /*#__PURE__*/React.createElement("nav", null, navPrefix, navItems.map(function (nav) {
    var _nav$children;

    var child = Boolean((_nav$children = nav.children) === null || _nav$children === void 0 ? void 0 : _nav$children.length) && /*#__PURE__*/React.createElement("ul", null, nav.children.map(function (item) {
      return /*#__PURE__*/React.createElement("li", {
        key: item.path
      }, /*#__PURE__*/React.createElement(NavLink, {
        to: item.path
      }, item.title));
    }));
    return /*#__PURE__*/React.createElement("span", {
      key: nav.title || nav.path
    }, nav.path ? /*#__PURE__*/React.createElement(NavLink, {
      to: nav.path,
      key: nav.path
    }, nav.title) : nav.title, child);
  }), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-navbar-tool"
  }, /*#__PURE__*/React.createElement(LocaleSelect, {
    location: location
  }), darkPrefix)));
};

export default Navbar;