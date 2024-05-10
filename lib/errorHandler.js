"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "addErrorHandler", {
  enumerable: true,
  get: function get() {
    return _singleSpa.addErrorHandler;
  }
});
exports.addGlobalUncaughtErrorHandler = addGlobalUncaughtErrorHandler;
Object.defineProperty(exports, "removeErrorHandler", {
  enumerable: true,
  get: function get() {
    return _singleSpa.removeErrorHandler;
  }
});
exports.removeGlobalUncaughtErrorHandler = removeGlobalUncaughtErrorHandler;
var _singleSpa = require("single-spa");
/**
 * @author Kuitos
 * @since 2020-02-21
 */

function addGlobalUncaughtErrorHandler(errorHandler) {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);
}
function removeGlobalUncaughtErrorHandler(errorHandler) {
  window.removeEventListener('error', errorHandler);
  window.removeEventListener('unhandledrejection', errorHandler);
}