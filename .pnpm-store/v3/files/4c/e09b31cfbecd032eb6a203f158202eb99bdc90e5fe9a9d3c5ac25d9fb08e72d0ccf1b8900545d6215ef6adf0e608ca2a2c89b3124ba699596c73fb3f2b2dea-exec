var _map =
/*#__PURE__*/
require("./internal/_map.js");

var identity =
/*#__PURE__*/
require("./identity.js");

var pickAll =
/*#__PURE__*/
require("./pickAll.js");

var useWith =
/*#__PURE__*/
require("./useWith.js");
/**
 * Reasonable analog to SQL `select` statement.
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Object
 * @category Relation
 * @sig [k] -> [{k: v}] -> [{k: v}]
 * @param {Array} props The property names to project
 * @param {Array} objs The objects to query
 * @return {Array} An array of objects with just the `props` properties.
 * @see R.pluck, R.props, R.prop
 * @example
 *
 *      const abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
 *      const fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
 *      const kids = [abby, fred];
 *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
 */


var project =
/*#__PURE__*/
useWith(_map, [pickAll, identity]); // passing `identity` gives correct arity

module.exports = project;