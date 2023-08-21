import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import * as React from 'react';
function getUseId() {
  // We need fully clone React function here to avoid webpack warning React 17 do not export `useId`
  var fullClone = _objectSpread({}, React);
  return fullClone.useId;
}
var uuid = 0;

/** @private Note only worked in develop env. Not work in production. */
export function resetUuid() {
  if (process.env.NODE_ENV !== 'production') {
    uuid = 0;
  }
}
export default function useId(id) {
  // Inner id for accessibility usage. Only work in client side
  var _React$useState = React.useState('ssr-id'),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    innerId = _React$useState2[0],
    setInnerId = _React$useState2[1];
  var useOriginId = getUseId();
  var reactNativeId = useOriginId === null || useOriginId === void 0 ? void 0 : useOriginId();
  React.useEffect(function () {
    if (!useOriginId) {
      var nextId = uuid;
      uuid += 1;
      setInnerId("rc_unique_".concat(nextId));
    }
  }, []);

  // Developer passed id is single source of truth
  if (id) {
    return id;
  }

  // Test env always return mock id
  if (process.env.NODE_ENV === 'test') {
    return 'test-id';
  }

  // Return react native id or inner id
  return reactNativeId || innerId;
}