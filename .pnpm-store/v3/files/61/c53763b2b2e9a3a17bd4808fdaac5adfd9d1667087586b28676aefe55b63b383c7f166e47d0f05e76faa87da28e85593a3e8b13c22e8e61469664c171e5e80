function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useContext, useState } from 'react';
import { context, Link } from 'dumi/theme';
import Navbar from './components/Navbar';
import SideMenu from './components/SideMenu';
import SlugList from './components/SlugList';
import SearchBar from './components/SearchBar';
import Dark from './components/Dark';
import './style/layout.less';

var Hero = function Hero(hero) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout-hero"
  }, hero.image && /*#__PURE__*/React.createElement("img", {
    src: hero.image
  }), /*#__PURE__*/React.createElement("h1", null, hero.title), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: hero.desc
    }
  }), hero.actions && hero.actions.map(function (action) {
    return /*#__PURE__*/React.createElement(Link, {
      to: action.link,
      key: action.text
    }, /*#__PURE__*/React.createElement("button", {
      type: "button"
    }, action.text));
  })));
};

var Features = function Features(features) {
  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout-features"
  }, features.map(function (feat) {
    return /*#__PURE__*/React.createElement("dl", {
      key: feat.title,
      style: {
        backgroundImage: feat.icon ? "url(".concat(feat.icon, ")") : undefined
      }
    }, feat.link ? /*#__PURE__*/React.createElement(Link, {
      to: feat.link
    }, /*#__PURE__*/React.createElement("dt", null, feat.title)) : /*#__PURE__*/React.createElement("dt", null, feat.title), /*#__PURE__*/React.createElement("dd", {
      dangerouslySetInnerHTML: {
        __html: feat.desc
      }
    }));
  }));
};

var Layout = function Layout(_ref) {
  var _meta$slugs, _match;

  var children = _ref.children,
      location = _ref.location;

  var _useContext = useContext(context),
      _useContext$config = _useContext.config,
      mode = _useContext$config.mode,
      repository = _useContext$config.repository,
      navItems = _useContext.nav,
      meta = _useContext.meta,
      locale = _useContext.locale;

  var repoUrl = repository.url,
      branch = repository.branch,
      platform = repository.platform;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      menuCollapsed = _useState2[0],
      setMenuCollapsed = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      darkSwitch = _useState4[0],
      setDarkSwitch = _useState4[1];

  var isSiteMode = mode === 'site';
  var showHero = isSiteMode && meta.hero;
  var showFeatures = isSiteMode && meta.features;
  var showSideMenu = meta.sidemenu !== false && !showHero && !showFeatures && !meta.gapless;
  var showSlugs = !showHero && !showFeatures && Boolean((_meta$slugs = meta.slugs) === null || _meta$slugs === void 0 ? void 0 : _meta$slugs.length) && (meta.toc === 'content' || meta.toc === undefined) && !meta.gapless;
  var isCN = /^zh|cn$/i.test(locale);
  var updatedTimeIns = new Date(meta.updatedTime);
  var updatedTime = "".concat(updatedTimeIns.toLocaleDateString([], {
    hour12: false
  }), " ").concat(updatedTimeIns.toLocaleTimeString([], {
    hour12: false
  }));
  var repoPlatform = {
    github: 'GitHub',
    gitlab: 'GitLab'
  }[((_match = (repoUrl || '').match(/(github|gitlab)/)) === null || _match === void 0 ? void 0 : _match[1]) || 'nothing'] || platform;
  return /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout",
    "data-route": location.pathname,
    "data-show-sidemenu": String(showSideMenu),
    "data-show-slugs": String(showSlugs),
    "data-site-mode": isSiteMode,
    "data-gapless": String(!!meta.gapless),
    onClick: function onClick() {
      setDarkSwitch(false);
      if (menuCollapsed) return;
      setMenuCollapsed(true);
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    location: location,
    navPrefix: /*#__PURE__*/React.createElement(SearchBar, null),
    darkPrefix: /*#__PURE__*/React.createElement(Dark, {
      darkSwitch: darkSwitch,
      onDarkSwitchClick: function onDarkSwitchClick(ev) {
        setDarkSwitch(function (val) {
          return !val;
        });
        ev.stopPropagation();
      },
      isSideMenu: false
    }),
    onMobileMenuClick: function onMobileMenuClick(ev) {
      setMenuCollapsed(function (val) {
        return !val;
      });
      ev.stopPropagation();
    }
  }), /*#__PURE__*/React.createElement(SideMenu, {
    darkPrefix: /*#__PURE__*/React.createElement(Dark, {
      darkSwitch: darkSwitch,
      isSideMenu: true
    }),
    mobileMenuCollapsed: menuCollapsed,
    location: location
  }), showSlugs && /*#__PURE__*/React.createElement(SlugList, {
    slugs: meta.slugs,
    className: "__dumi-default-layout-toc"
  }), showHero && Hero(meta.hero), showFeatures && Features(meta.features), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout-content"
  }, children, !showHero && !showFeatures && meta.filePath && !meta.gapless && /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout-footer-meta"
  }, repoPlatform && /*#__PURE__*/React.createElement(Link, {
    to: "".concat(repoUrl, "/edit/").concat(branch, "/").concat(meta.filePath)
  }, isCN ? "\u5728 ".concat(repoPlatform, " \u4E0A\u7F16\u8F91\u6B64\u9875") : "Edit this doc on ".concat(repoPlatform)), /*#__PURE__*/React.createElement("span", {
    "data-updated-text": isCN ? '最后更新时间：' : 'Last update: '
  }, updatedTime)), (showHero || showFeatures) && meta.footer && /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-layout-footer",
    dangerouslySetInnerHTML: {
      __html: meta.footer
    }
  })));
};

export default Layout;