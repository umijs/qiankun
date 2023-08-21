function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

import React, { useState, useContext, useRef, useEffect } from 'react';
import Tabs, { TabPane } from 'rc-tabs'; // @ts-ignore

import { history } from 'dumi';
import { context, useCodeSandbox, useRiddle, useMotions, useCopy, useLocaleProps, useDemoUrl, useTSPlaygroundUrl, Link, AnchorLink, usePrefersColor } from 'dumi/theme';
import SourceCode from './SourceCode';
import './Previewer.less';

/**
 * get source code type for file
 * @param file    file path
 * @param source  file source object
 */
function getSourceType(file, source) {
  var _file$match;

  // use file extension as source type first
  var type = (_file$match = file.match(/\.(\w+)$/)) === null || _file$match === void 0 ? void 0 : _file$match[1];

  if (!type) {
    type = source.tsx ? 'tsx' : 'jsx';
  }

  return type;
}

var Previewer = function Previewer(oProps) {
  var _props$hideActions, _props$hideActions2, _props$hideActions3;

  var demoRef = useRef();

  var _useContext = useContext(context),
      locale = _useContext.locale;

  var props = useLocaleProps(locale, oProps);
  var builtinDemoUrl = useDemoUrl(props.identifier);
  var demoUrl = props.demoUrl || builtinDemoUrl;
  var isActive = (history === null || history === void 0 ? void 0 : history.location.hash) === "#".concat(props.identifier);
  var isSingleFile = Object.keys(props.sources).length === 1;
  var openCSB = useCodeSandbox(((_props$hideActions = props.hideActions) === null || _props$hideActions === void 0 ? void 0 : _props$hideActions.includes('CSB')) ? null : props);
  var openRiddle = useRiddle(((_props$hideActions2 = props.hideActions) === null || _props$hideActions2 === void 0 ? void 0 : _props$hideActions2.includes('RIDDLE')) ? null : props);

  var _useMotions = useMotions(props.motions || [], demoRef.current),
      _useMotions2 = _slicedToArray(_useMotions, 2),
      execMotions = _useMotions2[0],
      isMotionRunning = _useMotions2[1];

  var _useCopy = useCopy(),
      _useCopy2 = _slicedToArray(_useCopy, 2),
      copyCode = _useCopy2[0],
      copyStatus = _useCopy2[1];

  var _useState = useState('_'),
      _useState2 = _slicedToArray(_useState, 2),
      currentFile = _useState2[0],
      setCurrentFile = _useState2[1];

  var _useState3 = useState(getSourceType(currentFile, props.sources[currentFile])),
      _useState4 = _slicedToArray(_useState3, 2),
      sourceType = _useState4[0],
      setSourceType = _useState4[1];

  var _useState5 = useState(Boolean(props.defaultShowCode)),
      _useState6 = _slicedToArray(_useState5, 2),
      showSource = _useState6[0],
      setShowSource = _useState6[1];

  var _useState7 = useState(Math.random()),
      _useState8 = _slicedToArray(_useState7, 2),
      iframeKey = _useState8[0],
      setIframeKey = _useState8[1];

  var currentFileCode = props.sources[currentFile][sourceType] || props.sources[currentFile].content;
  var playgroundUrl = useTSPlaygroundUrl(locale, currentFileCode);
  var iframeRef = useRef();

  var _usePrefersColor = usePrefersColor(),
      _usePrefersColor2 = _slicedToArray(_usePrefersColor, 1),
      color = _usePrefersColor2[0]; // re-render iframe if prefers color changed


  useEffect(function () {
    setIframeKey(Math.random());
  }, [color]);

  function handleFileChange(filename) {
    setCurrentFile(filename);
    setSourceType(getSourceType(filename, props.sources[filename]));
  }

  return /*#__PURE__*/React.createElement("div", {
    style: props.style,
    className: [props.className, '__dumi-default-previewer', isActive ? '__dumi-default-previewer-target' : ''].filter(Boolean).join(' '),
    id: props.identifier,
    "data-debug": props.debug || undefined,
    "data-iframe": props.iframe || undefined
  }, props.iframe && /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-previewer-browser-nav"
  }), /*#__PURE__*/React.createElement("div", {
    ref: demoRef,
    className: "__dumi-default-previewer-demo",
    style: {
      transform: props.transform ? 'translate(0, 0)' : undefined,
      padding: props.compact || props.iframe && props.compact !== false ? '0' : undefined,
      background: props.background
    }
  }, props.iframe ? /*#__PURE__*/React.createElement("iframe", {
    title: "dumi-previewer",
    style: {
      // both compatible with unit or non-unit, such as 100, 100px, 100vh
      height: String(props.iframe).replace(/(\d)$/, '$1px')
    },
    key: iframeKey,
    src: demoUrl,
    ref: iframeRef
  }) : props.children), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-previewer-desc",
    "data-title": props.title
  }, props.title && /*#__PURE__*/React.createElement(AnchorLink, {
    to: "#".concat(props.identifier)
  }, props.title), props.description && /*#__PURE__*/React.createElement("div", {
    // eslint-disable-next-line
    dangerouslySetInnerHTML: {
      __html: props.description
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-previewer-actions"
  }, openCSB && /*#__PURE__*/React.createElement("button", {
    title: "Open demo on CodeSandbox.io",
    className: "__dumi-default-icon",
    role: "codesandbox",
    onClick: openCSB
  }), openRiddle && /*#__PURE__*/React.createElement("button", {
    title: "Open demo on Riddle",
    className: "__dumi-default-icon",
    role: "riddle",
    onClick: openRiddle
  }), props.motions && /*#__PURE__*/React.createElement("button", {
    title: "Execute motions",
    className: "__dumi-default-icon",
    role: "motions",
    disabled: isMotionRunning,
    onClick: function onClick() {
      return execMotions();
    }
  }), props.iframe && /*#__PURE__*/React.createElement("button", {
    title: "Reload demo iframe page",
    className: "__dumi-default-icon",
    role: "refresh",
    onClick: function onClick() {
      return setIframeKey(Math.random());
    }
  }), !((_props$hideActions3 = props.hideActions) === null || _props$hideActions3 === void 0 ? void 0 : _props$hideActions3.includes('EXTERNAL')) && /*#__PURE__*/React.createElement(Link, {
    target: "_blank",
    to: demoUrl
  }, /*#__PURE__*/React.createElement("button", {
    title: "Open demo in new tab",
    className: "__dumi-default-icon",
    role: "open-demo",
    type: "button"
  })), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("button", {
    title: "Copy source code",
    className: "__dumi-default-icon",
    role: "copy",
    "data-status": copyStatus,
    onClick: function onClick() {
      return copyCode(currentFileCode);
    }
  }), sourceType === 'tsx' && showSource && /*#__PURE__*/React.createElement(Link, {
    target: "_blank",
    to: playgroundUrl
  }, /*#__PURE__*/React.createElement("button", {
    title: "Get JSX via TypeScript Playground",
    className: "__dumi-default-icon",
    role: "change-tsx",
    type: "button"
  })), /*#__PURE__*/React.createElement("button", {
    title: "Toggle source code panel",
    className: "__dumi-default-icon".concat(showSource ? ' __dumi-default-btn-expand' : ''),
    role: "source",
    type: "button",
    onClick: function onClick() {
      return setShowSource(!showSource);
    }
  })), showSource && /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-previewer-source-wrapper"
  }, !isSingleFile && /*#__PURE__*/React.createElement(Tabs, {
    className: "__dumi-default-previewer-source-tab",
    prefixCls: "__dumi-default-tabs",
    moreIcon: "\xB7\xB7\xB7",
    defaultActiveKey: currentFile,
    onChange: handleFileChange
  }, Object.keys(props.sources).map(function (filename) {
    return /*#__PURE__*/React.createElement(TabPane, {
      tab: filename === '_' ? "index.".concat(getSourceType(filename, props.sources[filename])) : filename,
      key: filename
    });
  })), /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-previewer-source"
  }, /*#__PURE__*/React.createElement(SourceCode, {
    code: currentFileCode,
    lang: sourceType,
    showCopy: false
  }))));
};

export default Previewer;