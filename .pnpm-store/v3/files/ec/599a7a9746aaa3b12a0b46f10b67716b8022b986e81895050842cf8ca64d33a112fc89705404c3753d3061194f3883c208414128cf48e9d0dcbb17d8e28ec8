import * as React from 'react';
import { generateTrigger } from "./index";

var MockPortal = function MockPortal(_ref) {
  var didUpdate = _ref.didUpdate,
      children = _ref.children,
      getContainer = _ref.getContainer;
  React.useEffect(function () {
    didUpdate();
    getContainer();
  });
  return children;
};

export default generateTrigger(MockPortal);