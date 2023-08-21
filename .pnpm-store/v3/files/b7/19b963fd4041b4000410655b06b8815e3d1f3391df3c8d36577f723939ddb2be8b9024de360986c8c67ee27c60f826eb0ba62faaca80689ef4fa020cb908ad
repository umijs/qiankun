'use strict';

require('../auto');

var test = require('tape');
var defineProperties = require('define-properties');

var isEnumerable = Object.prototype.propertyIsEnumerable;
var functionsHaveNames = require('functions-have-names')();

var runTests = require('./tests');

test('shimmed', function (t) {
	t.equal(Object.getPrototypeOf.length, 1, 'Object.getPrototypeOf has length of 1');
	t.test('Function name', { skip: !functionsHaveNames }, function (st) {
		st.equal(Object.getPrototypeOf.name, 'getPrototypeOf', 'Object.getPrototypeOf has name "getPrototypeOf"');
		st.end();
	});

	t.test('enumerability', { skip: !defineProperties.supportsDescriptors }, function (et) {
		et.equal(false, isEnumerable.call(Object, 'getPrototypeOf'), 'Object.getPrototypeOf is not enumerable');
		et.end();
	});

	runTests(Object.getPrototypeOf, t);

	t.end();
});
