"use strict";

var memo;
/* istanbul ignore next  */

function isOldIE() {
  if (typeof memo === "undefined") {
    // Test for IE <= 9 as proposed by Browserhacks
    // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
    // Tests for existence of standard globals is to allow style-loader
    // to operate correctly into non-standard environments
    // @see https://github.com/webpack-contrib/style-loader/issues/177
    memo = Boolean(window && document && document.all && !window.atob);
  }

  return memo;
}

module.exports = isOldIE;