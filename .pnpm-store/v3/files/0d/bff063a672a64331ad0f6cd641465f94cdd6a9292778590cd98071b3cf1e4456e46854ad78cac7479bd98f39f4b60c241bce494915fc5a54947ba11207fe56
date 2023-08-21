"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _objectDestructuringEmpty2 = _interopRequireDefault(require("@babel/runtime/helpers/objectDestructuringEmpty"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));
var _classnames = _interopRequireDefault(require("classnames"));
var _rcMotion = _interopRequireDefault(require("rc-motion"));
var _useLayoutEffect = _interopRequireDefault(require("rc-util/lib/hooks/useLayoutEffect"));
var React = _interopRequireWildcard(require("react"));
var _contextTypes = require("./contextTypes");
var _TreeNode = _interopRequireDefault(require("./TreeNode"));
var _useUnmount = _interopRequireDefault(require("./useUnmount"));
var _treeUtil = require("./utils/treeUtil");
var _excluded = ["className", "style", "motion", "motionNodes", "motionType", "onMotionStart", "onMotionEnd", "active", "treeNodeRequiredProps"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var MotionTreeNode = function MotionTreeNode(_ref, ref) {
  var className = _ref.className,
    style = _ref.style,
    motion = _ref.motion,
    motionNodes = _ref.motionNodes,
    motionType = _ref.motionType,
    onOriginMotionStart = _ref.onMotionStart,
    onOriginMotionEnd = _ref.onMotionEnd,
    active = _ref.active,
    treeNodeRequiredProps = _ref.treeNodeRequiredProps,
    props = (0, _objectWithoutProperties2.default)(_ref, _excluded);
  var _React$useState = React.useState(true),
    _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
    visible = _React$useState2[0],
    setVisible = _React$useState2[1];
  var _React$useContext = React.useContext(_contextTypes.TreeContext),
    prefixCls = _React$useContext.prefixCls;
  // Calculate target visible here.
  // And apply in effect to make `leave` motion work.
  var targetVisible = motionNodes && motionType !== 'hide';
  (0, _useLayoutEffect.default)(function () {
    if (motionNodes) {
      if (targetVisible !== visible) {
        setVisible(targetVisible);
      }
    }
  }, [motionNodes]);
  var triggerMotionStart = function triggerMotionStart() {
    if (motionNodes) {
      onOriginMotionStart();
    }
  };
  // Should only trigger once
  var triggerMotionEndRef = React.useRef(false);
  var triggerMotionEnd = function triggerMotionEnd() {
    if (motionNodes && !triggerMotionEndRef.current) {
      triggerMotionEndRef.current = true;
      onOriginMotionEnd();
    }
  };
  // Effect if unmount
  (0, _useUnmount.default)(triggerMotionStart, triggerMotionEnd);
  // Motion end event
  var onVisibleChanged = function onVisibleChanged(nextVisible) {
    if (targetVisible === nextVisible) {
      triggerMotionEnd();
    }
  };
  if (motionNodes) {
    return /*#__PURE__*/React.createElement(_rcMotion.default, (0, _extends2.default)({
      ref: ref,
      visible: visible
    }, motion, {
      motionAppear: motionType === 'show',
      onVisibleChanged: onVisibleChanged
    }), function (_ref2, motionRef) {
      var motionClassName = _ref2.className,
        motionStyle = _ref2.style;
      return /*#__PURE__*/React.createElement("div", {
        ref: motionRef,
        className: (0, _classnames.default)("".concat(prefixCls, "-treenode-motion"), motionClassName),
        style: motionStyle
      }, motionNodes.map(function (treeNode) {
        var restProps = (0, _extends2.default)({}, ((0, _objectDestructuringEmpty2.default)(treeNode.data), treeNode.data)),
          title = treeNode.title,
          key = treeNode.key,
          isStart = treeNode.isStart,
          isEnd = treeNode.isEnd;
        delete restProps.children;
        var treeNodeProps = (0, _treeUtil.getTreeNodeProps)(key, treeNodeRequiredProps);
        return /*#__PURE__*/React.createElement(_TreeNode.default, (0, _extends2.default)({}, restProps, treeNodeProps, {
          title: title,
          active: active,
          data: treeNode.data,
          key: key,
          isStart: isStart,
          isEnd: isEnd
        }));
      }));
    });
  }
  return /*#__PURE__*/React.createElement(_TreeNode.default, (0, _extends2.default)({
    domRef: ref,
    className: className,
    style: style
  }, props, {
    active: active
  }));
};
MotionTreeNode.displayName = 'MotionTreeNode';
var RefMotionTreeNode = /*#__PURE__*/React.forwardRef(MotionTreeNode);
var _default = RefMotionTreeNode;
exports.default = _default;