var _curry3 =
/*#__PURE__*/
require("./internal/_curry3.js");

var path =
/*#__PURE__*/
require("./path.js");
/**
 * Returns `true` if the specified object property at given path satisfies the
 * given predicate; `false` otherwise.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category Logic
 * @typedefn Idx = String | Int | Symbol
 * @sig (a -> Boolean) -> [Idx] -> {a} -> Boolean
 * @param {Function} pred
 * @param {Array} propPath
 * @param {*} obj
 * @return {Boolean}
 * @see R.propSatisfies, R.path
 * @example
 *
 *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
 *      R.pathSatisfies(R.is(Object), [], {x: {y: 2}}); //=> true
 */


var pathSatisfies =
/*#__PURE__*/
_curry3(function pathSatisfies(pred, propPath, obj) {
  return pred(path(propPath, obj));
});

module.exports = pathSatisfies;