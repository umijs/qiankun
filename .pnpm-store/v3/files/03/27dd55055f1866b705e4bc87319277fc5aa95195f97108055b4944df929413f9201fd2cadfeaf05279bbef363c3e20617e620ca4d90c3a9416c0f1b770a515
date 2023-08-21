'use strict';

var GetIntrinsic = require('get-intrinsic');

var AddValueToKeyedGroup = require('./AddValueToKeyedGroup');
var Call = require('es-abstract/2022/Call');
var GetIterator = require('es-abstract/2022/GetIterator');
var IsCallable = require('es-abstract/2022/IsCallable');
var IteratorClose = require('./IteratorClose');
var IteratorStep = require('./IteratorStep');
var IteratorValue = require('es-abstract/2022/IteratorValue');
var maxSafeInteger = require('es-abstract/helpers/maxSafeInteger');
var RequireObjectCoercible = require('es-abstract/2022/RequireObjectCoercible');
var ThrowCompletion = require('es-abstract/2022/ThrowCompletion');
var ToPropertyKey = require('es-abstract/2022/ToPropertyKey');

var $TypeError = GetIntrinsic('%TypeError%');

module.exports = function GroupBy(items, callbackfn, coercion) {
	if (coercion !== 'property' && coercion !== 'zero') {
		throw new $TypeError('Assertion failed: `coercion` must be `"property"` or `"zero"`');
	}

	RequireObjectCoercible(items); // step 1

	if (!IsCallable(callbackfn)) { // step 2
		throw new $TypeError('`callbackfn` must be callable');
	}

	var groups = []; // step 3

	var iterator = GetIterator(items); // step 4
	var iteratorRecord = { // TODO: remove this once GetIterator is on ES2023+
		'[[Iterator]]': iterator,
		'[[NextMethod]]': iterator.next,
		'[[Done]]': false // eslint-disable-line sort-keys
	};

	var k = 0; // step 5

	// eslint-disable-next-line no-constant-condition
	while (true) { // step 6
		if (k >= maxSafeInteger) { // step 6.a
			var error = ThrowCompletion(new $TypeError('Iteration count exceeds the max safe integer value')); // step 6.a.i
			return IteratorClose(iteratorRecord, error); // step 6.a.ii
		}

		var next = IteratorStep(iteratorRecord); // step 6.b
		if (!next) { // step 6.c
			return groups; // step 6.c.i
		}

		var value = IteratorValue(next); // step 6.d

		var key;
		try {
			key = Call(callbackfn, undefined, [value, k]); // step 6.e
		} catch (e) {
			IteratorClose(iteratorRecord, ThrowCompletion(e)); // step 6.f
		}

		if (coercion === 'property') { // step 6.g
			try {
				key = ToPropertyKey(key); // step 6.g.i
			} catch (e) {
				IteratorClose(iteratorRecord, ThrowCompletion(e)); // step 6.g.ii
			}
		} else {
			if (coercion !== 'zero') {
				throw new $TypeError('Assertion failed: `coercion` should be `"zero"` here'); // step 6.h.i
			}
			if (key === 0) { // step 6.h.ii
				key = 0; // handle negative zero
			}
		}

		AddValueToKeyedGroup(groups, key, value); // step 6.i

		k += 1; // step 6.j
	}
};
