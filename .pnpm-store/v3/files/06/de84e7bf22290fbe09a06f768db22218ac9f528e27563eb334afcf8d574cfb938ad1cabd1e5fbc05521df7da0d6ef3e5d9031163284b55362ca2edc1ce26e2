import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as React from 'react';
import classNames from 'classnames';
var Indent = function Indent(_ref) {
  var prefixCls = _ref.prefixCls,
    level = _ref.level,
    isStart = _ref.isStart,
    isEnd = _ref.isEnd;
  var baseClassName = "".concat(prefixCls, "-indent-unit");
  var list = [];
  for (var i = 0; i < level; i += 1) {
    var _classNames;
    list.push( /*#__PURE__*/React.createElement("span", {
      key: i,
      className: classNames(baseClassName, (_classNames = {}, _defineProperty(_classNames, "".concat(baseClassName, "-start"), isStart[i]), _defineProperty(_classNames, "".concat(baseClassName, "-end"), isEnd[i]), _classNames))
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "".concat(prefixCls, "-indent")
  }, list);
};
export default /*#__PURE__*/React.memo(Indent);