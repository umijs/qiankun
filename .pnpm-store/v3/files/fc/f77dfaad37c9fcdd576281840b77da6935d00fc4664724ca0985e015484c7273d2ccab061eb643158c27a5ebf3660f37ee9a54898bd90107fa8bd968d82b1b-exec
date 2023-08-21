var _curry2 =
/*#__PURE__*/
require("./internal/_curry2.js");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray.js");

var _map =
/*#__PURE__*/
require("./internal/_map.js");

var _assoc =
/*#__PURE__*/
require("./internal/_assoc.js");
/**
 *
 * Deconstructs an array field from the input documents to output a document for each element.
 * Each output document is the input document with the value of the array field replaced by the element.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig String -> {k: [v]} -> [{k: v}]
 * @param {String} key The key to determine which property of the object should be unwind
 * @param {Object} object The object containing list under property named as key which is to unwind
 * @return {List} A new list of object containing the value of input key having list replaced by each element in the object.
 * @example
 *
 * R.unwind('hobbies', {
 *   name: 'alice',
 *   hobbies: ['Golf', 'Hacking'],
 *   colors: ['red', 'green'],
 * });
 * // [
 * //   { name: 'alice', hobbies: 'Golf', colors: ['red', 'green'] },
 * //   { name: 'alice', hobbies: 'Hacking', colors: ['red', 'green'] }
 * // ]
 */


var unwind =
/*#__PURE__*/
_curry2(function (key, object) {
  // If key is not in object or key is not as a list in object
  if (!(key in object && _isArray(object[key]))) {
    return [object];
  } // Map over object[key] which is a list and assoc each element with key


  return _map(function (item) {
    return _assoc(key, item, object);
  }, object[key]);
});

module.exports = unwind;