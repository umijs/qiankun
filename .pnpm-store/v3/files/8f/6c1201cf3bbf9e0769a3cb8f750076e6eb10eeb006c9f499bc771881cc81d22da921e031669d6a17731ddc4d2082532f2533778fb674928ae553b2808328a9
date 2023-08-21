'use strict';

var callBound = require('call-bind/callBound');
var GetIntrinsic = require('get-intrinsic');
var SameValue = require('es-abstract/2022/SameValue');

var $TypeError = GetIntrinsic('%TypeError%');

var $filter = callBound('Array.prototype.filter');
var $push = callBound('Array.prototype.push');

module.exports = function AddValueToKeyedGroup(groups, key, value) {
	var found = $filter(groups, function (group) {
		return SameValue(group['[[Key]]'], key); // eslint-disable-line new-cap
	});
	if (found.length > 0) {
		var g = found[0];
		if (found.length !== 1) {
			throw new $TypeError('Assertion failed: more than 1 Record inside `groups` has a `[[Key]]` that is SameValue to `key`');
		}
		$push(g['[[Elements]]'], value); // step 1.a.ii
	} else {
		var group = { '[[Key]]': key, '[[Elements]]': [value] }; // eslint-disable-line sort-keys
		$push(groups, group); // step 3
	}
};
