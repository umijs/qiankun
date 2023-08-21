/**
 * Contains helpers for working with vendor prefixes.
 *
 * @namespace vendor
 */
const vendor = {
  /**
   * Returns the vendor prefix extracted from an input string.
   *
   * @param {string} prop String with or without vendor prefix.
   *
   * @return {string} vendor prefix or empty string
   *
   * @example
   * vendorPrefixes.prefix('-moz-tab-size') //=> '-moz-'
   * vendorPrefixes.prefix('tab-size')      //=> ''
   */
  prefix(prop) {
    const match = prop.match(/^(-\w+-)/);
    if (match) {
      return match[0];
    }

    return "";
  },

  /**
   * Returns the input string stripped of its vendor prefix.
   *
   * @param {string} prop String with or without vendor prefix.
   *
   * @return {string} String name without vendor prefixes.
   *
   * @example
   * vendorPrefixes.unprefixed('-moz-tab-size') //=> 'tab-size'
   */
  unprefixed(prop) {
    return prop.replace(/^-\w+-/, "");
  }
};

module.exports = vendor;
