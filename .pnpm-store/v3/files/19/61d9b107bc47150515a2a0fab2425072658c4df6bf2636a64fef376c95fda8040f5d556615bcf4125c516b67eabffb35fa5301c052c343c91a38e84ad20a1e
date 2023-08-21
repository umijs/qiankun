"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _createSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/createSuper"));

var React = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _rcOverflow = _interopRequireDefault(require("rc-overflow"));

var _warning = _interopRequireDefault(require("rc-util/lib/warning"));

var _KeyCode = _interopRequireDefault(require("rc-util/lib/KeyCode"));

var _omit = _interopRequireDefault(require("rc-util/lib/omit"));

var _MenuContext = require("./context/MenuContext");

var _useActive2 = _interopRequireDefault(require("./hooks/useActive"));

var _warnUtil = require("./utils/warnUtil");

var _Icon = _interopRequireDefault(require("./Icon"));

var _useDirectionStyle = _interopRequireDefault(require("./hooks/useDirectionStyle"));

var _PathContext = require("./context/PathContext");

var _IdContext = require("./context/IdContext");

var _PrivateContext = _interopRequireDefault(require("./context/PrivateContext"));

var _excluded = ["title", "attribute", "elementRef"],
    _excluded2 = ["style", "className", "eventKey", "warnKey", "disabled", "itemIcon", "children", "role", "onMouseEnter", "onMouseLeave", "onClick", "onKeyDown", "onFocus"],
    _excluded3 = ["active"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Since Menu event provide the `info.item` which point to the MenuItem node instance.
// We have to use class component here.
// This should be removed from doc & api in future.
var LegacyMenuItem = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(LegacyMenuItem, _React$Component);

  var _super = (0, _createSuper2.default)(LegacyMenuItem);

  function LegacyMenuItem() {
    (0, _classCallCheck2.default)(this, LegacyMenuItem);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(LegacyMenuItem, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          title = _this$props.title,
          attribute = _this$props.attribute,
          elementRef = _this$props.elementRef,
          restProps = (0, _objectWithoutProperties2.default)(_this$props, _excluded);
      var passedProps = (0, _omit.default)(restProps, ['eventKey']);
      (0, _warning.default)(!attribute, '`attribute` of Menu.Item is deprecated. Please pass attribute directly.');
      return /*#__PURE__*/React.createElement(_rcOverflow.default.Item, (0, _extends2.default)({}, attribute, {
        title: typeof title === 'string' ? title : undefined
      }, passedProps, {
        ref: elementRef
      }));
    }
  }]);
  return LegacyMenuItem;
}(React.Component);
/**
 * Real Menu Item component
 */


var InternalMenuItem = function InternalMenuItem(props) {
  var _classNames;

  var style = props.style,
      className = props.className,
      eventKey = props.eventKey,
      warnKey = props.warnKey,
      disabled = props.disabled,
      itemIcon = props.itemIcon,
      children = props.children,
      role = props.role,
      onMouseEnter = props.onMouseEnter,
      onMouseLeave = props.onMouseLeave,
      onClick = props.onClick,
      onKeyDown = props.onKeyDown,
      onFocus = props.onFocus,
      restProps = (0, _objectWithoutProperties2.default)(props, _excluded2);
  var domDataId = (0, _IdContext.useMenuId)(eventKey);

  var _React$useContext = React.useContext(_MenuContext.MenuContext),
      prefixCls = _React$useContext.prefixCls,
      onItemClick = _React$useContext.onItemClick,
      contextDisabled = _React$useContext.disabled,
      overflowDisabled = _React$useContext.overflowDisabled,
      contextItemIcon = _React$useContext.itemIcon,
      selectedKeys = _React$useContext.selectedKeys,
      onActive = _React$useContext.onActive;

  var _React$useContext2 = React.useContext(_PrivateContext.default),
      _internalRenderMenuItem = _React$useContext2._internalRenderMenuItem;

  var itemCls = "".concat(prefixCls, "-item");
  var legacyMenuItemRef = React.useRef();
  var elementRef = React.useRef();
  var mergedDisabled = contextDisabled || disabled;
  var connectedKeys = (0, _PathContext.useFullPath)(eventKey); // ================================ Warn ================================

  if (process.env.NODE_ENV !== 'production' && warnKey) {
    (0, _warning.default)(false, 'MenuItem should not leave undefined `key`.');
  } // ============================= Info =============================


  var getEventInfo = function getEventInfo(e) {
    return {
      key: eventKey,
      // Note: For legacy code is reversed which not like other antd component
      keyPath: (0, _toConsumableArray2.default)(connectedKeys).reverse(),
      item: legacyMenuItemRef.current,
      domEvent: e
    };
  }; // ============================= Icon =============================


  var mergedItemIcon = itemIcon || contextItemIcon; // ============================ Active ============================

  var _useActive = (0, _useActive2.default)(eventKey, mergedDisabled, onMouseEnter, onMouseLeave),
      active = _useActive.active,
      activeProps = (0, _objectWithoutProperties2.default)(_useActive, _excluded3); // ============================ Select ============================


  var selected = selectedKeys.includes(eventKey); // ======================== DirectionStyle ========================

  var directionStyle = (0, _useDirectionStyle.default)(connectedKeys.length); // ============================ Events ============================

  var onInternalClick = function onInternalClick(e) {
    if (mergedDisabled) {
      return;
    }

    var info = getEventInfo(e);
    onClick === null || onClick === void 0 ? void 0 : onClick((0, _warnUtil.warnItemProp)(info));
    onItemClick(info);
  };

  var onInternalKeyDown = function onInternalKeyDown(e) {
    onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(e);

    if (e.which === _KeyCode.default.ENTER) {
      var info = getEventInfo(e); // Legacy. Key will also trigger click event

      onClick === null || onClick === void 0 ? void 0 : onClick((0, _warnUtil.warnItemProp)(info));
      onItemClick(info);
    }
  };
  /**
   * Used for accessibility. Helper will focus element without key board.
   * We should manually trigger an active
   */


  var onInternalFocus = function onInternalFocus(e) {
    onActive(eventKey);
    onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
  }; // ============================ Render ============================


  var optionRoleProps = {};

  if (props.role === 'option') {
    optionRoleProps['aria-selected'] = selected;
  }

  var renderNode = /*#__PURE__*/React.createElement(LegacyMenuItem, (0, _extends2.default)({
    ref: legacyMenuItemRef,
    elementRef: elementRef,
    role: role === null ? 'none' : role || 'menuitem',
    tabIndex: disabled ? null : -1,
    "data-menu-id": overflowDisabled && domDataId ? null : domDataId
  }, restProps, activeProps, optionRoleProps, {
    component: "li",
    "aria-disabled": disabled,
    style: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, directionStyle), style),
    className: (0, _classnames.default)(itemCls, (_classNames = {}, (0, _defineProperty2.default)(_classNames, "".concat(itemCls, "-active"), active), (0, _defineProperty2.default)(_classNames, "".concat(itemCls, "-selected"), selected), (0, _defineProperty2.default)(_classNames, "".concat(itemCls, "-disabled"), mergedDisabled), _classNames), className),
    onClick: onInternalClick,
    onKeyDown: onInternalKeyDown,
    onFocus: onInternalFocus
  }), children, /*#__PURE__*/React.createElement(_Icon.default, {
    props: (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
      isSelected: selected
    }),
    icon: mergedItemIcon
  }));

  if (_internalRenderMenuItem) {
    renderNode = _internalRenderMenuItem(renderNode, props, {
      selected: selected
    });
  }

  return renderNode;
};

function MenuItem(props) {
  var eventKey = props.eventKey; // ==================== Record KeyPath ====================

  var measure = (0, _PathContext.useMeasure)();
  var connectedKeyPath = (0, _PathContext.useFullPath)(eventKey); // eslint-disable-next-line consistent-return

  React.useEffect(function () {
    if (measure) {
      measure.registerPath(eventKey, connectedKeyPath);
      return function () {
        measure.unregisterPath(eventKey, connectedKeyPath);
      };
    }
  }, [connectedKeyPath]);

  if (measure) {
    return null;
  } // ======================== Render ========================


  return /*#__PURE__*/React.createElement(InternalMenuItem, props);
}

var _default = MenuItem;
exports.default = _default;