var _curry3 =
/*#__PURE__*/
require("./internal/_curry3.js");

var _isArray =
/*#__PURE__*/
require("./internal/_isArray.js");

var _isObject =
/*#__PURE__*/
require("./internal/_isObject.js");

var _has =
/*#__PURE__*/
require("./internal/_has.js");

var _assoc =
/*#__PURE__*/
require("./internal/_assoc.js");

var _modify =
/*#__PURE__*/
require("./internal/_modify.js");
/**
 * Creates a shallow clone of the passed object by applying an `fn` function
 * to the value at the given path.
 *
 * The function will not be invoked, and the object will not change
 * if its corresponding path does not exist in the object.
 * All non-primitive properties are copied to the new object by reference.
 *
 * @func
 * @memberOf R
 * @since v0.28.0
 * @category Object
 * @sig [Idx] -> (v -> v) -> {k: v} -> {k: v}
 * @param {Array} path The path to be modified.
 * @param {Function} fn The function to apply to the path.
 * @param {Object} object The object to be transformed.
 * @return {Object} The transformed object.
 * @example
 *
 *      const person = {name: 'James', address: { zipCode: '90216' }};
 *      R.modifyPath(['address', 'zipCode'], R.reverse, person); //=> {name: 'James', address: { zipCode: '61209' }}
 *
 *      // Can handle arrays too
 *      const person = {name: 'James', addresses: [{ zipCode: '90216' }]};
 *      R.modifyPath(['addresses', 0, 'zipCode'], R.reverse, person); //=> {name: 'James', addresses: [{ zipCode: '61209' }]}
 */


var modifyPath =
/*#__PURE__*/
_curry3(function modifyPath(path, fn, object) {
  if (!_isObject(object) && !_isArray(object) || path.length === 0) {
    return object;
  }

  var idx = path[0];

  if (!_has(idx, object)) {
    return object;
  }

  if (path.length === 1) {
    return _modify(idx, fn, object);
  }

  var val = modifyPath(Array.prototype.slice.call(path, 1), fn, object[idx]);

  if (val === object[idx]) {
    return object;
  }

  return _assoc(idx, val, object);
});

module.exports = modifyPath;