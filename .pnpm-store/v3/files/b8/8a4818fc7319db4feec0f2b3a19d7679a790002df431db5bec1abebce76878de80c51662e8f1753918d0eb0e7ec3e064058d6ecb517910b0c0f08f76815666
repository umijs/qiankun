import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _typeof from "@babel/runtime/helpers/esm/typeof";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
var _excluded = ["label", "children", "key", "type"];
import * as React from 'react';
import toArray from "rc-util/es/Children/toArray";
import { Divider, MenuItem, MenuItemGroup, SubMenu } from '..';
export function parseChildren(children, keyPath) {
  return toArray(children).map(function (child, index) {
    if ( /*#__PURE__*/React.isValidElement(child)) {
      var _child$props$eventKey, _child$props;

      var key = child.key;
      var eventKey = (_child$props$eventKey = (_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.eventKey) !== null && _child$props$eventKey !== void 0 ? _child$props$eventKey : key;
      var emptyKey = eventKey === null || eventKey === undefined;

      if (emptyKey) {
        eventKey = "tmp_key-".concat([].concat(_toConsumableArray(keyPath), [index]).join('-'));
      }

      var cloneProps = {
        key: eventKey,
        eventKey: eventKey
      };

      if (process.env.NODE_ENV !== 'production' && emptyKey) {
        cloneProps.warnKey = true;
      }

      return /*#__PURE__*/React.cloneElement(child, cloneProps);
    }

    return child;
  });
}

function convertItemsToNodes(list) {
  return (list || []).map(function (opt, index) {
    if (opt && _typeof(opt) === 'object') {
      var label = opt.label,
          children = opt.children,
          key = opt.key,
          type = opt.type,
          restProps = _objectWithoutProperties(opt, _excluded);

      var mergedKey = key !== null && key !== void 0 ? key : "tmp-".concat(index); // MenuItemGroup & SubMenuItem

      if (children || type === 'group') {
        if (type === 'group') {
          // Group
          return /*#__PURE__*/React.createElement(MenuItemGroup, _extends({
            key: mergedKey
          }, restProps, {
            title: label
          }), convertItemsToNodes(children));
        } // Sub Menu


        return /*#__PURE__*/React.createElement(SubMenu, _extends({
          key: mergedKey
        }, restProps, {
          title: label
        }), convertItemsToNodes(children));
      } // MenuItem & Divider


      if (type === 'divider') {
        return /*#__PURE__*/React.createElement(Divider, _extends({
          key: mergedKey
        }, restProps));
      }

      return /*#__PURE__*/React.createElement(MenuItem, _extends({
        key: mergedKey
      }, restProps), label);
    }

    return null;
  }).filter(function (opt) {
    return opt;
  });
}

export function parseItems(children, items, keyPath) {
  var childNodes = children;

  if (items) {
    childNodes = convertItemsToNodes(items);
  }

  return parseChildren(childNodes, keyPath);
}