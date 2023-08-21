import React, { useContext } from 'react';
import { context, Link, NavLink } from 'dumi/theme';
import LocaleSelect from './LocaleSelect';
import SlugList from './SlugList';
import './SideMenu.less';

var SideMenu = function SideMenu(_ref) {
  var mobileMenuCollapsed = _ref.mobileMenuCollapsed,
      location = _ref.location,
      darkPrefix = _ref.darkPrefix;

  var _useContext = useContext(context),
      _useContext$config = _useContext.config,
      logo = _useContext$config.logo,
      title = _useContext$config.title,
      description = _useContext$config.description,
      mode = _useContext$config.mode,
      repoUrl = _useContext$config.repository.url,
      menu = _useContext.menu,
      navItems = _useContext.nav,
      base = _useContext.base,
      meta = _useContext.meta;

  var isHiddenMenus = Boolean((meta.hero || meta.features || meta.gapless) && mode === 'site') || meta.sidemenu === false || undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-menu",
    "data-mode": mode,
    "data-hidden": isHiddenMenus,
    "data-mobile-show": !mobileMenuCollapsed || undefined
  }, /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-menu-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-menu-header"
  }, /*#__PURE__*/React.createElement(Link, {
    to: base,
    className: "__dumi-default-menu-logo",
    style: {
      backgroundImage: logo && "url('".concat(logo, "')")
    }
  }), /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", null, description), /github\.com/.test(repoUrl) && mode === 'doc' && /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("object", {
    type: "image/svg+xml",
    data: "https://img.shields.io/github/stars".concat(repoUrl.match(/((\/[^\/]+){2})$/)[1], "?style=social")
  }))), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-menu-mobile-area"
  }, !!navItems.length && /*#__PURE__*/React.createElement("ul", {
    className: "__dumi-default-menu-nav-list"
  }, navItems.map(function (nav) {
    var _nav$children;

    var child = Boolean((_nav$children = nav.children) === null || _nav$children === void 0 ? void 0 : _nav$children.length) && /*#__PURE__*/React.createElement("ul", null, nav.children.map(function (item) {
      return /*#__PURE__*/React.createElement("li", {
        key: item.path || item.title
      }, /*#__PURE__*/React.createElement(NavLink, {
        to: item.path
      }, item.title));
    }));
    return /*#__PURE__*/React.createElement("li", {
      key: nav.path || nav.title
    }, nav.path ? /*#__PURE__*/React.createElement(NavLink, {
      to: nav.path
    }, nav.title) : nav.title, child);
  })), /*#__PURE__*/React.createElement(LocaleSelect, {
    location: location
  }), darkPrefix), /*#__PURE__*/React.createElement("ul", {
    className: "__dumi-default-menu-list"
  }, !isHiddenMenus && menu.map(function (item) {
    var _meta$slugs;

    // always use meta from routes to reduce menu data size
    var hasSlugs = Boolean((_meta$slugs = meta.slugs) === null || _meta$slugs === void 0 ? void 0 : _meta$slugs.length);
    var hasChildren = item.children && Boolean(item.children.length);
    var show1LevelSlugs = meta.toc === 'menu' && !hasChildren && hasSlugs && item.path === location.pathname.replace(/([^^])\/$/, '$1');
    var menuPaths = hasChildren ? item.children.map(function (i) {
      return i.path;
    }) : [item.path, // handle menu group which has no index route and no valid children
    location.pathname.startsWith("".concat(item.path, "/")) && meta.title === item.title ? location.pathname : null];
    return /*#__PURE__*/React.createElement("li", {
      key: item.path || item.title
    }, /*#__PURE__*/React.createElement(NavLink, {
      to: item.path,
      isActive: function isActive() {
        return menuPaths.includes(location.pathname);
      }
    }, item.title), Boolean(item.children && item.children.length) && /*#__PURE__*/React.createElement("ul", null, item.children.map(function (child) {
      return /*#__PURE__*/React.createElement("li", {
        key: child.path
      }, /*#__PURE__*/React.createElement(NavLink, {
        to: child.path,
        exact: true
      }, /*#__PURE__*/React.createElement("span", null, child.title)), Boolean(meta.toc === 'menu' && typeof window !== 'undefined' && child.path === location.pathname && hasSlugs) && /*#__PURE__*/React.createElement(SlugList, {
        slugs: meta.slugs
      }));
    })), show1LevelSlugs && /*#__PURE__*/React.createElement(SlugList, {
      slugs: meta.slugs
    }));
  }))));
};

export default SideMenu;