import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import * as React from 'react';
var EmptyList = [];
export var PathRegisterContext = /*#__PURE__*/React.createContext(null);
export function useMeasure() {
  return React.useContext(PathRegisterContext);
} // ========================= Path Tracker ==========================

export var PathTrackerContext = /*#__PURE__*/React.createContext(EmptyList);
export function useFullPath(eventKey) {
  var parentKeyPath = React.useContext(PathTrackerContext);
  return React.useMemo(function () {
    return eventKey !== undefined ? [].concat(_toConsumableArray(parentKeyPath), [eventKey]) : parentKeyPath;
  }, [parentKeyPath, eventKey]);
}
export var PathUserContext = /*#__PURE__*/React.createContext(null);