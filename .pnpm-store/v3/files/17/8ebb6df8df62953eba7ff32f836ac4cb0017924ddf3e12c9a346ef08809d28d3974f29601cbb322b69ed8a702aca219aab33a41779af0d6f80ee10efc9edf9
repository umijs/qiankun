function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useEffect, useState, createRef } from 'react';
import Tree from 'rc-tree';
import './Tree.less';
var FileOutlined = /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "__dumi-site-tree-icon icon-file",
  fill: "currentcolor",
  viewBox: "0 0 1024 1024"
}, /*#__PURE__*/React.createElement("path", {
  d: "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494z"
}));
var FolderOpenOutlined = /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "__dumi-site-tree-icon icon-folder-open",
  fill: "currentcolor",
  viewBox: "0 0 1024 1024"
}, /*#__PURE__*/React.createElement("path", {
  d: "M928 444H820V330.4c0-17.7-14.3-32-32-32H473L355.7 186.2a8.15 8.15 0 0 0-5.5-2.2H96c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h698c13 0 24.8-7.9 29.7-20l134-332c1.5-3.8 2.3-7.9 2.3-12 0-17.7-14.3-32-32-32zM136 256h188.5l119.6 114.4H748V444H238c-13 0-24.8 7.9-29.7 20L136 643.2V256zm635.3 512H159l103.3-256h612.4L771.3 768z"
}));
var FolderOutlined = /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "__dumi-site-tree-icon icon-folder",
  fill: "currentcolor",
  viewBox: "0 0 1024 1024"
}, /*#__PURE__*/React.createElement("path", {
  d: "M880 298.4H521L403.7 186.2a8.15 8.15 0 0 0-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"
}));
var MinusSquareOutlined = /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "__dumi-site-tree-icon icon-minus-square",
  fill: "currentcolor",
  viewBox: "0 0 1024 1024"
}, /*#__PURE__*/React.createElement("path", {
  d: "M328 544h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
}));
var PlusSquareOutlined = /*#__PURE__*/React.createElement("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  className: "__dumi-site-tree-icon icon-plus-square",
  fill: "currentcolor",
  viewBox: "0 0 1024 1024"
}, /*#__PURE__*/React.createElement("path", {
  d: "M328 544h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"
}));

function getTreeFromList(nodes) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var data = [];
  [].concat(nodes).forEach(function (node, i) {
    var _data;

    var key = "".concat(prefix ? "".concat(prefix, "-") : '').concat(i);

    switch (node.type) {
      case 'ul':
        var parent = ((_data = data[data.length - 1]) === null || _data === void 0 ? void 0 : _data.children) || data;
        var ulLeafs = getTreeFromList(node.props.children || [], key);
        parent.push.apply(parent, _toConsumableArray(ulLeafs));
        break;

      case 'li':
        var liLeafs = getTreeFromList(node.props.children, key);
        data.push({
          title: [].concat(node.props.children).filter(function (child) {
            return child.type !== 'ul';
          }),
          key: key,
          children: liLeafs,
          isLeaf: !liLeafs.length
        });
        break;

      default:
    }
  });
  return data;
}

var useListToTree = function useListToTree(nodes) {
  var _useState = useState(getTreeFromList(nodes)),
      _useState2 = _slicedToArray(_useState, 2),
      tree = _useState2[0],
      setTree = _useState2[1];

  useEffect(function () {
    setTree(getTreeFromList(nodes));
  }, [nodes]);
  return tree;
};

var getIcon = function getIcon(props) {
  var isLeaf = props.isLeaf,
      expanded = props.expanded;

  if (isLeaf) {
    return FileOutlined;
  }

  return expanded ? FolderOpenOutlined : FolderOutlined;
};

var renderSwitcherIcon = function renderSwitcherIcon(props) {
  var isLeaf = props.isLeaf,
      expanded = props.expanded;

  if (isLeaf) {
    return /*#__PURE__*/React.createElement("span", {
      className: "tree-switcher-leaf-line"
    });
  }

  return expanded ? /*#__PURE__*/React.createElement("span", {
    className: "tree-switcher-line-icon"
  }, MinusSquareOutlined) : /*#__PURE__*/React.createElement("span", {
    className: "tree-switcher-line-icon"
  }, PlusSquareOutlined);
}; // ================== Collapse Motion ==================


var getCollapsedHeight = function getCollapsedHeight() {
  return {
    height: 0,
    opacity: 0
  };
};

var getRealHeight = function getRealHeight(node) {
  return {
    height: node.scrollHeight,
    opacity: 1
  };
};

var getCurrentHeight = function getCurrentHeight(node) {
  return {
    height: node.offsetHeight
  };
};

var skipOpacityTransition = function skipOpacityTransition(_, event) {
  return event.propertyName === 'height';
};

var collapseMotion = {
  motionName: 'ant-motion-collapse',
  onAppearStart: getCollapsedHeight,
  onEnterStart: getCollapsedHeight,
  onAppearActive: getRealHeight,
  onEnterActive: getRealHeight,
  onLeaveStart: getCurrentHeight,
  onLeaveActive: getCollapsedHeight,
  onAppearEnd: skipOpacityTransition,
  onEnterEnd: skipOpacityTransition,
  onLeaveEnd: skipOpacityTransition,
  motionDeadline: 500
};
export default (function (props) {
  var data = useListToTree(props.children);
  var treeRef = /*#__PURE__*/createRef();

  var onClick = function onClick(event, node) {
    var isLeaf = node.isLeaf;

    if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
      return;
    }

    treeRef.current.onNodeExpand(event, node);
  };

  return /*#__PURE__*/React.createElement(Tree, {
    className: "__dumi-site-tree",
    icon: getIcon,
    ref: treeRef,
    itemHeight: 20,
    showLine: true,
    selectable: false,
    motion: _objectSpread(_objectSpread({}, collapseMotion), {}, {
      motionAppear: false
    }),
    onClick: onClick,
    treeData: [{
      key: '0',
      title: props.title || '<root>',
      children: data
    }],
    defaultExpandAll: true,
    switcherIcon: renderSwitcherIcon
  });
});