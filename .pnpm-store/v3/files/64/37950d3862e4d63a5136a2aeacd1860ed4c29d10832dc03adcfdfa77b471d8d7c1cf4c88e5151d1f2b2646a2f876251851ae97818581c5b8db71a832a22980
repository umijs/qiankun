"use strict";

module.exports = function (url, options) {
  options = options || {};
  options.attributes = typeof options.attributes === "object" ? options.attributes : {};

  if (typeof options.attributes.nonce === "undefined") {
    var nonce = typeof __webpack_nonce__ !== "undefined" ? __webpack_nonce__ : null;

    if (nonce) {
      options.attributes.nonce = nonce;
    }
  }

  var linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href = url;
  Object.keys(options.attributes).forEach(function (key) {
    linkElement.setAttribute(key, options.attributes[key]);
  });
  options.insert(linkElement);
  return function (newUrl) {
    if (typeof newUrl === "string") {
      linkElement.href = newUrl;
    } else {
      linkElement.parentNode.removeChild(linkElement);
    }
  };
};