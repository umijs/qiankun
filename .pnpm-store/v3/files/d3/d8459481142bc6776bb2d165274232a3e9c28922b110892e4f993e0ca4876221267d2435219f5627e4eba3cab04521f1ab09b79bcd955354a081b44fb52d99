'use strict';

var test = require('tape');
var isArrowFunction = require('../index');
var arrowFuncs = require('make-arrow-function').list();

var forEach = function (arr, func) {
	var i;
	for (i = 0; i < arr.length; ++i) {
		func(arr[i], i, arr);
	}
};

test('returns false for non-functions', function (t) {
	var nonFuncs = [
		true,
		false,
		null,
		undefined,
		{},
		[],
		/a/g,
		'string',
		42,
		new Date()
	];
	t.plan(nonFuncs.length);
	forEach(nonFuncs, function (nonFunc) {
		t.notOk(isArrowFunction(nonFunc), nonFunc + ' is not a function');
	});
	t.end();
});

test('returns false for non-arrow functions', function (t) {
	var func = function () {};
	t.notOk(isArrowFunction(func), 'anonymous function is not an arrow function');

	var namedFunc = function foo() {};
	t.notOk(isArrowFunction(namedFunc), 'named function is not an arrow function');

	/* globals window */
	if (typeof window !== 'undefined') {
		t.notOk(isArrowFunction(window.alert), 'window.alert is not an arrow function');
	} else {
		t.skip('window.alert is not an arrow function');
	}
	t.end();
});

test('returns false for non-arrow function with faked toString', function (t) {
	var func = function () {};
	func.toString = function () { return 'ARROW'; };

	t.notEqual(String(func), Function.prototype.toString.call(func), 'test function has faked toString that is different from default toString');
	t.notOk(isArrowFunction(func), 'anonymous function with faked toString is not an arrow function');
	t.end();
});

test('returns true for arrow functions', function (t) {
	if (arrowFuncs.length > 0) {
		arrowFuncs.forEach(function (arrowFunc) {
			t.ok(isArrowFunction(arrowFunc), 'arrow function ' + arrowFunc + ' is arrow function');
		});
	} else {
		t.skip('arrow function is arrow function - this environment does not support ES6 arrow functions. Please run `node --harmony`, or use a supporting browser.');
	}
	t.end();
});
