'use strict';

var test = require('tape');
var isEqualWhy = require('../why');
var hasSymbols = require('has-symbols')();
var hasSymbolShams = require('has-symbols/shams')();
var hasBigInts = require('has-bigints')();
var arrowFunctions = require('make-arrow-function').list();
var objectEntries = require('object.entries');
var forEach = require('foreach');
var functionsHaveNames = require('functions-have-names')();
var inspect = require('object-inspect');
var v = require('es-value-fixtures');
var hasGeneratorSupport = v.generatorFunctions.length > 0;
var assign = require('object.assign');

var symbolIterator = (hasSymbols || hasSymbolShams) && Symbol.iterator;
var symbolToStringTag = (hasSymbols || hasSymbolShams) && Symbol.toStringTag;

var copyFunction = function (fn) {
	/* eslint-disable no-new-func */
	try {
		return Function('return ' + String(fn))();
	} catch (e) {
		return Function('return {' + String(fn) + '}["' + fn.name + '"];')();
	}
};

test('nullish', function (t) {
	t.equal('', isEqualWhy(), 'absent undefineds are equal');
	t.equal('', isEqualWhy(undefined, undefined), 'present undefineds are equal');
	t.equal('', isEqualWhy(null, null), 'nulls are equal');

	t.end();
});

test('strings', function (t) {
	forEach(v.strings, function (str) {
		t.equal(isEqualWhy(str, str), '', inspect(str) + ' is equal to itself');

		var obj = Object(str);
		t.equal(
			isEqualWhy(obj, str),
			'',
			inspect(obj) + ' and ' + inspect(str) + ' are equal'
		);
		t.equal(
			isEqualWhy(str, obj),
			'',
			inspect(str) + ' and ' + inspect(obj) + ' are equal'
		);
	});

	t.test('fakes', { skip: !symbolToStringTag }, function (st) {
		forEach(v.strings, function (str) {
			var fake = { toString: function () { return str; } };
			fake[symbolToStringTag] = 'String';

			st.equal(
				isEqualWhy(fake, str),
				'second argument is string; first is not',
				inspect(fake) + ' and ' + inspect(str) + ' are not equal'
			);
			st.equal(
				isEqualWhy(str, fake),
				'first argument is string; second is not',
				inspect(str) + ' and ' + inspect(fake) + ' are not equal'
			);
		});

		st.end();
	});

	t.equal(
		isEqualWhy('42', 42),
		'toStringTag is not the same: [object String] !== [object Number]',
		'"42" and 42 are not equal'
	);
	t.equal(
		isEqualWhy(42, '42'),
		'toStringTag is not the same: [object Number] !== [object String]',
		'42 and "42" are not equal'
	);

	t.end();
});

test('booleans', function (t) {
	forEach(v.booleans, function (bool) {
		t.equal(isEqualWhy(bool, bool), '', inspect(bool) + ' is equal to itself');
		t.equal(
			isEqualWhy(bool, !bool),
			'primitive value of boolean arguments do not match: ' + bool + ' !== ' + !bool,
			inspect(bool) + ' and ' + inspect(!bool) + ' are not equal'
		);

		var str = String(bool);
		t.equal(
			isEqualWhy(str, bool),
			'toStringTag is not the same: [object String] !== [object Boolean]',
			inspect(str) + ' and ' + inspect(bool) + ' are not equal'
		);
		t.equal(
			isEqualWhy(bool, str),
			'toStringTag is not the same: [object Boolean] !== [object String]',
			inspect(bool) + ' and ' + inspect(str) + ' are not equal'
		);

		var obj = Object(bool);
		t.equal(
			isEqualWhy(obj, bool),
			'',
			inspect(obj) + ' and ' + inspect(bool) + ' are equal'
		);
		t.equal(
			isEqualWhy(bool, obj),
			'',
			inspect(bool) + ' and ' + inspect(obj) + ' are equal'
		);
	});

	t.test('fakes', { skip: !symbolToStringTag }, function (st) {
		forEach(v.booleans, function (bool) {
			var fake = { valueOf: function () { return bool; } };
			if (symbolToStringTag) {
				fake[symbolToStringTag] = 'Boolean';
			}
			st.equal(
				isEqualWhy(fake, bool),
				'first argument is not a boolean; second argument is',
				inspect(fake) + ' and ' + inspect(bool) + ' are not equal'
			);
			st.equal(
				isEqualWhy(bool, fake),
				'second argument is not a boolean; first argument is',
				inspect(bool) + ' and ' + inspect(fake) + ' are not equal'
			);
		});

		st.end();
	});

	t.end();
});

test('numbers', function (t) {
	t.equal(isEqualWhy(NaN, NaN), '', 'NaNs are equal');

	t.test('fake', { skip: !symbolToStringTag }, function (st) {
		var notNaN = { valueOf: function () { return NaN; } };
		notNaN[symbolToStringTag] = 'Number';

		st.equal(isEqualWhy(NaN, notNaN), 'second argument is not a number; first argument is', 'NaN and ' + inspect(notNaN) + ' are not equal');
		st.equal(isEqualWhy(notNaN, NaN), 'first argument is not a number; second argument is', inspect(notNaN) + ' and NaN are not equal');

		st.equal(isEqualWhy(NaN, Infinity), 'first argument is NaN; second is not', 'NaN and Infinity are not equal');
		st.equal(isEqualWhy(Infinity, NaN), 'second argument is NaN; first is not', 'Infinity and NaN are not equal');

		st.end();
	});

	forEach(v.numbers, function (num) {
		t.equal(isEqualWhy(num, num), '', inspect(num) + ' is equal to itself');
	});

	t.equal(isEqualWhy(+0, -0), '', '+0 and -0 are equal');
	t.equal(isEqualWhy(-0, +0), '', '-0 and +0 are equal');

	t.end();
});

test('boxed primitives', function (t) {
	t.equal('', isEqualWhy(Object(''), ''), 'Empty String and empty string are equal');
	t.equal('', isEqualWhy(Object('foo'), 'foo'), 'String and string are equal');
	t.equal('', isEqualWhy(Object(true), true), 'Boolean true and boolean true are equal');
	t.equal('', isEqualWhy(Object(false), false), 'Boolean false and boolean false are equal');
	t.equal('', isEqualWhy(true, Object(true)), 'boolean true and Boolean true are equal');
	t.equal('', isEqualWhy(false, Object(false)), 'boolean false and Boolean false are equal');
	t.equal(
		'primitive value of boolean arguments do not match: true !== false',
		isEqualWhy(Object(true), false),
		'Boolean true and boolean false are not equal'
	);
	t.equal(
		'primitive value of boolean arguments do not match: false !== true',
		isEqualWhy(Object(false), true),
		'Boolean false and boolean true are not equal'
	);
	t.equal(
		'primitive value of boolean arguments do not match: false !== true',
		isEqualWhy(false, Object(true)),
		'boolean false and Boolean true are not equal'
	);
	t.equal(
		'primitive value of boolean arguments do not match: true !== false',
		isEqualWhy(true, Object(false)),
		'boolean true and Boolean false are not equal'
	);
	t.equal('', isEqualWhy(Object(42), 42), 'Number and number literal are equal');
	t.end();
});

test('dates', function (t) {
	t.equal(
		isEqualWhy(new Date(123), new Date(123)),
		'',
		'two dates with the same timestamp are equal'
	);
	t.equal(
		isEqualWhy(new Date(123), new Date(456)),
		'Dates have different time values: 123 !== 456',
		'two dates with different timestamp are not equal'
	);

	t.test('fake', { skip: !symbolToStringTag }, function (st) {
		var date = new Date(123);
		var fake = {
			__proto__: Date.prototype,
			toString: function () { return String(date); },
			valueOf: function () { return +date; }
		};
		fake[symbolToStringTag] = 'Date';

		st.equal(
			isEqualWhy(fake, date),
			'second argument is Date, first is not',
			inspect(fake) + ' and ' + inspect(date) + ' are not equal'
		);
		st.equal(
			isEqualWhy(date, fake),
			'first argument is Date, second is not',
			inspect(date) + ' and ' + inspect(fake) + ' are not equal'
		);

		st.end();
	});

	var zero = new Date(0);
	var zeroPlus = assign(new Date(0), { a: 1 });
	t.equal(
		isEqualWhy(zero, zeroPlus),
		'second argument has key "a"; first does not',
		inspect(zero) + ' and ' + inspect(zeroPlus) + ' are not equal'
	);

	t.end();
});

test('regexes', function (t) {
	t.equal(isEqualWhy(/a/g, /a/g), '', 'two regex literals are equal');
	t.equal(
		isEqualWhy(/a/g, /b/g),
		'regular expressions differ: /a/g !== /b/g',
		'two different regex literals are not equal'
	);
	t.equal(
		isEqualWhy(/a/i, /a/g),
		'regular expressions differ: /a/i !== /a/g',
		'two different regex literals (same source, diff flags) are not equal'
	);
	t.equal(
		isEqualWhy(new RegExp('a', 'g'), new RegExp('a', 'g')),
		'',
		'two regex objects are equal'
	);
	t.equal(
		isEqualWhy(new RegExp('a', 'g'), new RegExp('b', 'g')),
		'regular expressions differ: /a/g !== /b/g',
		'two different regex objects are equal'
	);
	t.equal(
		isEqualWhy(new RegExp('a', 'g'), /a/g),
		'',
		'regex object and literal, same content, are equal'
	);
	t.equal(
		isEqualWhy(new RegExp('a', 'g'), /b/g),
		'regular expressions differ: /a/g !== /b/g',
		'regex object and literal, different content, are not equal'
	);

	t.test('fake', { skip: !symbolToStringTag }, function (st) {
		var re = /a/g;
		var fake = {
			__proto__: RegExp.prototype,
			source: re.source,
			flags: 'g',
			toString: function () { return String(re); }
		};
		fake[symbolToStringTag] = 'RegExp';

		st.equal(
			isEqualWhy(fake, re),
			'second argument is RegExp, first is not',
			inspect(fake) + ' and ' + inspect(re) + ' are not equal'
		);
		st.equal(
			isEqualWhy(re, fake),
			'first argument is RegExp, second is not',
			inspect(re) + ' and ' + inspect(fake) + ' are not equal'
		);

		st.end();
	});

	var re = /a/g;
	var rePlus = assign(/a/g, { a: 1 });
	t.equal(
		isEqualWhy(re, rePlus),
		'second argument has key "a"; first does not',
		inspect(re) + ' and ' + inspect(rePlus) + ' are not equal'
	);

	t.end();
});

test('arrays', function (t) {
	var arr = [1, 2, 3];
	var two = arr.slice(0, 2);
	var rev = arr.slice().reverse();

	t.equal(isEqualWhy([], []), '', 'empty arrays are equal');
	t.equal(isEqualWhy(arr, arr.slice()), '', 'same arrays are equal');
	t.equal(
		isEqualWhy(arr, rev),
		'numbers are different: 3 !== 1',
		'arrays in different order with same values are not equal'
	);
	t.equal(
		isEqualWhy(two, arr),
		'arrays have different length: 2 !== 3',
		'arrays with different lengths are not equal'
	);
	t.equal(
		isEqualWhy(arr, two),
		'arrays have different length: 3 !== 2',
		'arrays with different lengths are not equal'
	);

	t.test('sparse arrays', function (st) {
		var dense = [1, undefined, 3];
		var sparse = [1, , 3]; // eslint-disable-line no-sparse-arrays
		st.equal(
			isEqualWhy(dense, sparse),
			'first argument has index 1; second does not',
			inspect(dense) + ' is not equal to ' + inspect(sparse)
		);
		st.equal(
			isEqualWhy(sparse, dense),
			'second argument has index 1; first does not',
			inspect(sparse) + ' is not equal to ' + inspect(dense)
		);

		st.end();
	});

	t.test('nested values', function (st) {
		st.equal(isEqualWhy([[1, 2], [2, 3], [3, 4]], [[1, 2], [2, 3], [3, 4]]), '', 'arrays with same array values are equal');
		st.end();
	});

	t.test('nested objects', function (st) {
		var arr1 = [
			{ a: 0, b: '1', c: false },
			{ a: 1, b: '2', c: false }
		];
		var arr2 = [
			{ a: 0, b: '1', c: true },
			{ a: 1, b: '2', c: false }
		];
		st.equal(
			isEqualWhy(arr1[0], arr2[0]),
			'value at key "c" differs: primitive value of boolean arguments do not match: false !== true',
			'array items 0 are not equal'
		);
		st.equal(
			isEqualWhy(arr1[1], arr2[1]),
			'',
			'array items 1 are equal'
		);
		st.equal(
			isEqualWhy(arr1, arr2),
			'value at key "c" differs: primitive value of boolean arguments do not match: false !== true',
			'two arrays with nested inequal objects are not equal'
		);

		st.end();
	});

	t.test('fakes', { skip: !symbolToStringTag }, function (st) {
		var fake = function (x) {}; // eslint-disable-line no-unused-vars
		var fnArr = [String(fake)];
		fake[symbolToStringTag] = 'Array';

		st.equal(fake.length, fnArr.length, 'precondition: fake and fnArr have the same length');

		st.equal(
			isEqualWhy(fnArr, fake),
			'first argument is an Array, second is not',
			inspect(fnArr) + ' is not equal to ' + inspect(fake)
		);
		st.equal(
			isEqualWhy(fake, fnArr),
			'second argument is an Array, first is not',
			inspect(fake) + ' is not equal to ' + inspect(fnArr)
		);

		st.end();
	});

	t.end();
});

test('objects', function (t) {
	t.test('prototypes', function (st) {
		var F = function F() {
			this.foo = 42;
		};
		var G = function G() {};
		G.prototype = new F();
		G.prototype.constructor = G;
		var H = function H() {};
		H.prototype = G.prototype;
		var I = function I() {};

		var f1 = new F();
		var f2 = new F();
		var g1 = new G();
		var h1 = new H();
		var i1 = new I();

		st.equal(isEqualWhy(f1, f2), '', 'two instances of the same thing are equal');

		st.equal(isEqualWhy(g1, h1), '', 'two instances of different things with the same prototype are equal');
		st.equal(
			isEqualWhy(f1, i1),
			'arguments have a different [[Prototype]]',
			'two instances of different things with a different prototype are not equal'
		);

		var isParentEqualToChild = isEqualWhy(f1, g1);
		st.equal(
			isParentEqualToChild,
			'arguments have a different [[Prototype]]',
			'two instances of a parent and child are not equal'
		);
		var isChildEqualToParent = isEqualWhy(g1, f1);
		st.equal(
			isChildEqualToParent,
			'arguments have a different [[Prototype]]',
			'two instances of a child and parent are not equal'
		);

		g1.foo = 'bar';
		var g2 = new G();
		st.equal(
			isEqualWhy(g1, g2),
			'first argument has key "foo"; second does not',
			'two instances of the same thing with different properties are not equal'
		);
		st.equal(
			isEqualWhy(g2, g1),
			'second argument has key "foo"; first does not',
			'two instances of the same thing with different properties are not equal'
		);

		st.equal(
			isEqualWhy(f1, F.prototype),
			'second argument is the [[Prototype]] of the first',
			inspect(f1) + ' is not equal to ' + inspect(F.prototype)
		);
		st.equal(
			isEqualWhy(F.prototype, f1),
			'first argument is the [[Prototype]] of the second',
			inspect(F.prototype) + ' is not equal to ' + inspect(f1)
		);

		st.end();
	});

	t.test('literals', function (st) {
		var a = { foo: 42 };
		var b = { foo: 42 };
		st.equal('', isEqualWhy(a, a), 'same hash is equal to itself');
		st.equal('', isEqualWhy(a, b), 'two similar hashes are equal');
		st.equal('', isEqualWhy({ nested: a }, { nested: a }), 'similar hashes with same nested hash are equal');
		st.equal('', isEqualWhy({ nested: a }, { nested: b }), 'similar hashes with similar nested hash are equal');

		st.equal(
			isEqualWhy({ a: 42, b: 0 }, { a: 42 }),
			'first argument has key "b"; second does not',
			'second hash missing a key is not equal'
		);
		st.equal(
			isEqualWhy({ a: 42 }, { a: 42, b: 0 }),
			'second argument has key "b"; first does not',
			'first hash missing a key is not equal'
		);

		st.equal(
			isEqualWhy({ a: 1 }, { a: 2 }),
			'value at key "a" differs: numbers are different: 1 !== 2',
			'two objects with equal keys but inequal values are not equal'
		);
		st.equal(
			isEqualWhy({ c: 1 }, { a: 1 }),
			'first argument has key "c"; second does not',
			'two objects with inequal keys but same values are not equal'
		);

		var obj1 = { a: 0, b: '1', c: false };
		var obj2 = { a: 0, b: '1', c: true };
		st.equal(
			isEqualWhy(obj1, obj2),
			'value at key "c" differs: primitive value of boolean arguments do not match: false !== true',
			'two objects with inequal boolean keys are not equal'
		);
		st.end();
	});

	t.test('key ordering', function (st) {
		var a = { a: 1, b: 2 };
		var b = { b: 2 };
		b.a = 1;
		st.equal('', isEqualWhy(a, b), 'objects with different key orderings but same contents are equal');
		st.end();
	});

	t.end();
});

test('functions', function (t) {
	var f1 = Object(function f() { /* SOME STUFF */ return 1; });
	var f2 = Object(function f() { /* SOME STUFF */ return 1; });
	var f3 = Object(function f() { /* SOME DIFFERENT STUFF */ return 2; });
	var g = Object(function g() { /* SOME STUFF */ return 1; });
	var anon1 = Object(function () { /* ANONYMOUS! */ return 'anon'; });
	var anon2 = Object(function () { /* ANONYMOUS! */ return 'anon'; });
	/* eslint-disable space-before-function-paren */
	/* eslint-disable space-before-blocks */
	var fnNoSpace = Object(function(){});
	/* eslint-enable space-before-blocks */
	/* eslint-enable space-before-function-paren */
	var fnWithSpaceBeforeBody = Object(function () {});
	var emptyFnWithName = Object(function a() {});
	/* eslint-disable no-unused-vars */
	var emptyFnOneArg = Object(function (a) {});
	var anon1withArg = Object(function (a) { /* ANONYMOUS! */ return 'anon'; });
	/* eslint-enable no-unused-vars */

	/* for code coverage */
	f1();
	f2();
	f3();
	g();
	anon1();
	anon2();
	/* end for code coverage */

	t.equal('', isEqualWhy(f1, f1), 'same function is equal to itself');
	t.equal('', isEqualWhy(anon1, anon1), 'same anon function is equal to itself');
	t.equal(
		isEqualWhy(anon1, anon1withArg),
		'Function lengths differ: 0 !== 1',
		'similar anon function with different lengths are not equal'
	);

	if (functionsHaveNames) {
		t.equal(
			'Function names differ: "f" !== "g"',
			isEqualWhy(f1, g),
			'functions with different names but same implementations are not equal'
		);
	} else {
		t.comment('** function names not supported **');
		t.equal(
			'Function string representations differ',
			isEqualWhy(f1, g),
			'functions with different names but same implementations are not equal'
		);
	}
	t.equal(isEqualWhy(f1, f2), '', 'functions with same names but same implementations are equal');
	t.equal(
		isEqualWhy(f1, f3),
		'Function string representations differ',
		'functions with same names but different implementations are not equal'
	);
	t.equal('', isEqualWhy(anon1, anon2), 'anon functions with same implementations are equal');

	t.equal('', isEqualWhy(fnNoSpace, fnWithSpaceBeforeBody), 'functions with same arity/name/body are equal despite whitespace between signature and body');
	if (functionsHaveNames) {
		t.equal(
			isEqualWhy(emptyFnWithName, fnNoSpace),
			'Function names differ: "a" !== ""',
			'functions with same arity/body, diff name, are not equal'
		);
	} else {
		t.comment('** function names not supported **');
		t.equal(
			isEqualWhy(emptyFnWithName, fnNoSpace),
			'Function string representations differ',
			'functions with same arity/body, diff name, are not equal'
		);
	}
	t.equal(
		isEqualWhy(emptyFnOneArg, fnNoSpace),
		'Function lengths differ: ' + emptyFnOneArg.length + ' !== ' + fnNoSpace.length,
		'functions with same name/body, diff arity, are not equal'
	);

	t.test('generators', { skip: !hasGeneratorSupport }, function (st) {
		/* eslint-disable no-new-func */
		var genFnStar = Function('return function* () {};')();
		var genFnSpaceStar = Function('return function *() {};')();
		var genNoSpaces = Function('return function*(){};')();

		st.equal(
			isEqualWhy(fnNoSpace, genNoSpaces),
			genNoSpaces[symbolToStringTag]
				? 'toStringTag is not the same: [object Function] !== [object GeneratorFunction]'
				: 'second argument is a Generator function; first is not',
			'generator ' + inspect(genNoSpaces) + ' and ' + inspect(fnNoSpace) + ' that are otherwise identical are not equal'
		);
		st.equal(
			isEqualWhy(genNoSpaces, fnNoSpace),
			genNoSpaces[symbolToStringTag]
				? 'toStringTag is not the same: [object GeneratorFunction] !== [object Function]'
				: 'first argument is a Generator function; second is not',
			inspect(fnNoSpace) + ' and generator ' + inspect(genNoSpaces) + ' that are otherwise identical are not equal'
		);

		t.test('fakes', { skip: !symbolToStringTag }, function (s2t) {
			var fake = copyFunction(fnNoSpace);
			fake[symbolToStringTag] = 'GeneratorFunction';
			s2t.equal(
				isEqualWhy(fake, genNoSpaces),
				genNoSpaces[symbolToStringTag]
					? 'second argument is a Generator function; first is not'
					: 'toStringTag is not the same: [object GeneratorFunction] !== [object Function]',
				'generator ' + inspect(genNoSpaces) + ' and ' + inspect(fake) + ' that are otherwise identical are not equal'
			);
			s2t.equal(
				isEqualWhy(genNoSpaces, fake),
				genNoSpaces[symbolToStringTag]
					? 'first argument is a Generator function; second is not'
					: 'toStringTag is not the same: [object Function] !== [object GeneratorFunction]',
				inspect(fake) + ' and generator ' + inspect(genNoSpaces) + ' that are otherwise identical are not equal'
			);

			s2t.end();
		});

		forEach(v.generatorFunctions.concat(genFnStar, genFnSpaceStar, genNoSpaces), function (generator) {
			st.equal(isEqualWhy(generator, generator), '', inspect(generator) + ' is equal to itself');

			var copied = copyFunction(generator);
			st.equal(isEqualWhy(generator, copied), '', inspect(generator) + ' is equal to copyFunction(' + inspect(generator) + ')');
			st.equal(isEqualWhy(copied, generator), '', 'copyFunction(' + inspect(generator) + ') is equal to ' + inspect(generator));
		});

		st.end();
	});

	t.test('arrow functions', { skip: arrowFunctions.length === 0 }, function (st) {
		forEach(arrowFunctions, function (fn) {
			st.equal(
				isEqualWhy(fn, fnNoSpace),
				'first argument is an arrow function; second is not',
				inspect(fn) + ' not equal to ' + inspect(fnNoSpace)
			);
			st.equal(
				isEqualWhy(fnNoSpace, fn),
				'second argument is an arrow function; first is not',
				inspect(fnNoSpace) + ' not equal to ' + inspect(fn)
			);
			st.equal(isEqualWhy(fn, fn), '', inspect(fn) + ' is equal to itself');
			st.equal(isEqualWhy(fn, copyFunction(fn)), '', inspect(fn) + ' is equal to copyFunction(fn)');
		});

		var arrow1 = Function('return (a) => {}');
		var arrow2 = Function('return (b) => {}');
		st.equal(
			isEqualWhy(arrow1(), arrow2()),
			'Function string representations differ',
			'same name/length arrow functions with different source are not equal'
		);
		st.equal(
			isEqualWhy(arrow1(), arrow1()),
			'',
			'same name/length arrow functions with same source are equal'
		);

		st.end();
	});

	t.test('async functions', { skip: v.asyncFunctions.length === 0 }, function (st) {
		var asyncNoSpaces = Function('return async function(){};')();

		forEach(v.asyncFunctions, function (fn) {
			st.equal(
				isEqualWhy(fn, fnNoSpace),
				'toStringTag is not the same: [object AsyncFunction] !== [object Function]',
				inspect(fn) + ' not equal to ' + inspect(fnNoSpace)
			);
			st.equal(
				isEqualWhy(fnNoSpace, fn),
				'toStringTag is not the same: [object Function] !== [object AsyncFunction]',
				inspect(fnNoSpace) + ' not equal to ' + inspect(fn)
			);
			st.equal(isEqualWhy(fn, fn), '', inspect(fn) + ' is equal to itself');
			st.equal(isEqualWhy(fn, copyFunction(fn)), '', inspect(fn) + ' is equal to copyFunction(fn)');
		});

		var fake = copyFunction(fnNoSpace);
		fake[symbolToStringTag] = 'AsyncFunction';
		st.equal(
			isEqualWhy(fake, asyncNoSpaces),
			'Function string representations differ',
			// 'second argument is an async function; first is not',
			'generator ' + inspect(asyncNoSpaces) + ' and ' + inspect(fake) + ' that are otherwise identical are not equal'
		);
		st.equal(
			isEqualWhy(asyncNoSpaces, fake),
			'Function string representations differ',
			// 'first argument is an async function; second is not',
			inspect(fake) + ' and generator ' + inspect(asyncNoSpaces) + ' that are otherwise identical are not equal'
		);

		st.equal(
			isEqualWhy(fnNoSpace, asyncNoSpaces),
			'toStringTag is not the same: [object Function] !== [object AsyncFunction]',
			'generator ' + inspect(asyncNoSpaces) + ' and ' + inspect(fnNoSpace) + ' that are otherwise identical are not equal'
		);
		st.equal(
			isEqualWhy(asyncNoSpaces, fnNoSpace),
			'toStringTag is not the same: [object AsyncFunction] !== [object Function]',
			inspect(fnNoSpace) + ' and generator ' + inspect(asyncNoSpaces) + ' that are otherwise identical are not equal'
		);

		st.end();
	});

	/* eslint-disable no-unused-vars */
	var fn = function f(x) { 'y'; };
	var fnPlus = assign(function f(x) { 'y'; }, { a: 1 });
	/* eslint-enable no-unused-vars */
	t.equal(
		isEqualWhy(fn, fnPlus),
		'second argument has key "a"; first does not',
		inspect(fn) + ' and ' + inspect(fnPlus) + ' are not equal'
	);

	t.end();
});

test('symbols', { skip: !hasSymbols }, function (t) {
	var desc = 'foo';
	var sym = Symbol(desc);
	var obj = Object(sym);
	t.equal(isEqualWhy(sym, sym), '', inspect(sym) + ' is equal to itself');

	t.equal(isEqualWhy(sym, obj), '', inspect(sym) + ' is equal to ' + inspect(obj));
	t.equal(isEqualWhy(obj, sym), '', inspect(obj) + ' is equal to ' + inspect(sym));

	t.equal(
		isEqualWhy(Symbol(desc), Symbol(desc)),
		'first Symbol value !== second Symbol value',
		inspect(sym) + ' is not equal to ' + inspect(sym) + ', even when the description is the same string instance'
	);
	t.equal(
		isEqualWhy(Symbol(desc), Object(Symbol(desc))),
		'first Symbol value !== second Symbol value',
		inspect(sym) + ' is not equal to ' + inspect(obj) + ', even when the description is the same string instance'
	);

	t.test('fakes', { skip: !symbolToStringTag }, function (st) {
		var fake = { valueOf: function () { return sym; } };
		if (symbolToStringTag) {
			fake[symbolToStringTag] = 'Symbol';
		}
		st.equal(
			isEqualWhy(fake, sym),
			'second argument is Symbol; first is not',
			inspect(fake) + ' and ' + inspect(sym) + ' are not equal'
		);
		st.equal(
			isEqualWhy(sym, fake),
			'first argument is Symbol; second is not',
			inspect(sym) + ' and ' + inspect(fake) + ' are not equal'
		);

		st.end();
	});

	t.test('arrays containing symbols', function (st) {
		st.equal(
			isEqualWhy([sym], [sym]),
			'',
			'Arrays each containing the same instance of ' + inspect(sym) + ' are equal'
		);

		st.equal(
			isEqualWhy([Symbol(desc)], [Object(Symbol(desc))]),
			'first Symbol value !== second Symbol value',
			'An array containing ' + inspect(sym) + ' is not equal to ' + inspect(obj) + ', even when the description is the same string instance'
		);

		st.end();
	});

	t.end();
});

test('bigints', { skip: !hasBigInts }, function (t) {
	forEach(v.bigints, function (bigInt) {
		var objectBigInt = Object(bigInt);
		t.equal(isEqualWhy(bigInt, bigInt), '', inspect(bigInt) + ' is equal to itself');
		t.equal(isEqualWhy(bigInt, objectBigInt), '', inspect(bigInt) + ' is equal to ' + inspect(objectBigInt));
		t.equal(isEqualWhy(objectBigInt, bigInt), '', inspect(objectBigInt) + ' is equal to ' + inspect(bigInt));

		var str = String(bigInt);
		t.equal(
			isEqualWhy(bigInt, str),
			'toStringTag is not the same: [object BigInt] !== [object String]',
			inspect(bigInt) + ' and ' + inspect(str) + ' are not equal'
		);
		t.equal(
			isEqualWhy(str, bigInt),
			'toStringTag is not the same: [object String] !== [object BigInt]',
			inspect(str) + ' and ' + inspect(bigInt) + ' are not equal'
		);

		var fake = { toString: function () { return bigInt; } };
		if (symbolToStringTag) {
			fake[symbolToStringTag] = 'BigInt';
		}
		t.equal(
			isEqualWhy(fake, bigInt),
			'second argument is BigInt; first is not',
			inspect(fake) + ' and ' + inspect(bigInt) + ' are not equal'
		);
		t.equal(
			isEqualWhy(bigInt, fake),
			'first argument is BigInt; second is not',
			inspect(bigInt) + ' and ' + inspect(fake) + ' are not equal'
		);

		var one = BigInt(1);
		t.equal(
			isEqualWhy(bigInt, bigInt + one),
			'first BigInt value !== second BigInt value',
			inspect(bigInt) + ' and ' + inspect(bigInt + one) + ' are not equal'
		);
		t.equal(
			isEqualWhy(bigInt + one, bigInt),
			'first BigInt value !== second BigInt value',
			inspect(bigInt + one) + ' and ' + inspect(bigInt) + ' are not equal'
		);

		t.test('arrays containing bigints', function (st) {
			st.equal(
				isEqualWhy([bigInt], [bigInt]),
				'',
				'Arrays each containing ' + inspect(bigInt) + ' are equal'
			);

			st.equal(
				isEqualWhy([objectBigInt], [Object(bigInt)]),
				'',
				'Arrays each containing different instances of ' + inspect(objectBigInt) + ' are equal'
			);

			st.equal(
				isEqualWhy([bigInt], [objectBigInt]),
				'',
				'An array containing ' + inspect(bigInt) + ' is equal to an array containing ' + inspect(objectBigInt)
			);

			st.end();
		});
	});

	t.end();
});

var genericIterator = function (obj) {
	var entries = objectEntries(obj);
	return function iterator() {
		return {
			next: function () {
				return {
					done: entries.length === 0,
					value: entries.shift()
				};
			}
		};
	};
};

test('iterables', function (t) {
	t.test('Maps', { skip: typeof Map !== 'function' }, function (mt) {
		var a = new Map();
		a.set('a', 'b');
		a.set('c', 'd');
		var b = new Map();
		b.set('a', 'b');
		b.set('c', 'd');
		var c = new Map();
		c.set('a', 'b');

		mt.equal(
			isEqualWhy(a, b),
			'',
			'equal Maps (a, b) are equal'
		);
		mt.equal(
			isEqualWhy(b, a),
			'',
			'equal Maps (b, a) are equal'
		);

		var tag = Object.prototype.toString.call(a) === '[object Map]' ? 'Map' : 'object';
		mt.equal(
			isEqualWhy(a, c),
			'second ' + tag + ' argument finished iterating before first ' + tag,
			'unequal Maps (a, c) are not equal'
		);
		mt.equal(
			isEqualWhy(b, c),
			'second ' + tag + ' argument finished iterating before first ' + tag,
			'unequal Maps (b, c) are not equal'
		);
		mt.equal(
			isEqualWhy(c, a),
			'first ' + tag + ' argument finished iterating before second ' + tag,
			'unequal Maps (c, a) are not equal'
		);
		mt.equal(
			isEqualWhy(c, b),
			'first ' + tag + ' argument finished iterating before second ' + tag,
			'unequal Maps (c, b) are not equal'
		);

		mt.end();
	});

	t.test('Sets', { skip: typeof Set !== 'function' }, function (st) {
		var a = new Set();
		a.add('a');
		a.add('b');
		var b = new Set();
		b.add('a');
		b.add('b');
		var c = new Set();
		c.add('a');

		st.equal(isEqualWhy(a, b), '', 'equal Set (a, b) are equal');
		st.equal(isEqualWhy(b, a), '', 'equal Set (b, a) are equal');

		var tag = Object.prototype.toString.call(a) === '[object Set]' ? 'Set' : 'object';
		st.equal(
			isEqualWhy(a, c),
			'second ' + tag + ' argument finished iterating before first ' + tag,
			'unequal Set (a, c) are not equal'
		);
		st.equal(
			isEqualWhy(b, c),
			'second ' + tag + ' argument finished iterating before first ' + tag,
			'unequal Set (b, c) are not equal'
		);
		st.equal(
			isEqualWhy(c, a),
			'first ' + tag + ' argument finished iterating before second ' + tag,
			'unequal Set (c, a) are not equal'
		);
		st.equal(
			isEqualWhy(c, b),
			'first ' + tag + ' argument finished iterating before second ' + tag,
			'unequal Set (b, c) are not equal'
		);

		st.test('Sets with strings as iterables', function (sst) {
			var ab;
			// eslint-disable-next-line max-statements-per-line
			try { ab = new Set('ab'); } catch (e) { ab = new Set(); } // node 0.12 throws when given a string
			if (ab.size !== 2) {
				// work around IE 11 (and others) bug accepting iterables
				ab.add('a');
				ab.add('b');
			}
			var ac;
			// eslint-disable-next-line max-statements-per-line
			try { ac = new Set('ac'); } catch (e) { ac = new Set(); } // node 0.12 throws when given a string
			if (ac.size !== 2) {
				// work around IE 11 (and others) bug accepting iterables
				ac.add('a');
				ac.add('c');
			}
			sst.equal(
				isEqualWhy(ab, ac),
				'iteration results are not equal: value at key "value" differs: string values are different: "b" !== "c"',
				'Sets initially populated with different strings are not equal'
			);
			sst.end();
		});

		st.end();
	});

	var obj = { a: { aa: true }, b: [2] };
	t.test('generic iterables', { skip: !symbolIterator }, function (it) {
		var a = { foo: 'bar' };
		var b = { bar: 'baz' };

		it.equal(isEqualWhy(a, b), 'first argument has key "foo"; second does not', 'normal a and normal b are not equal');

		a[symbolIterator] = genericIterator(obj);
		it.equal(isEqualWhy(a, b), 'first argument is iterable; second is not', 'iterable a / normal b are not equal');
		it.equal(isEqualWhy(b, a), 'second argument is iterable; first is not', 'iterable b / normal a are not equal');
		it.equal(
			isEqualWhy(a, obj),
			'first argument is iterable; second is not',
			'iterable a / normal obj are not equal'
		);
		it.equal(
			isEqualWhy(obj, a),
			'second argument is iterable; first is not',
			'normal obj / iterable a are not equal'
		);

		b[symbolIterator] = genericIterator(obj);
		it.equal(isEqualWhy(a, b), '', 'iterable a / iterable b are equal');
		it.equal(isEqualWhy(b, a), '', 'iterable b / iterable a are equal');
		it.equal(
			isEqualWhy(b, obj),
			'first argument is iterable; second is not',
			'iterable b and normal obj are not equal'
		);
		it.equal(
			isEqualWhy(obj, b),
			'second argument is iterable; first is not',
			'normal obj / iterable b are not equal'
		);

		it.end();
	});

	t.test('unequal iterables', { skip: !symbolIterator }, function (it) {
		var c = {};
		c[symbolIterator] = genericIterator({});
		var d = {};
		d[symbolIterator] = genericIterator(obj);

		it.equal(
			isEqualWhy(c, d),
			'first object argument finished iterating before second object',
			'iterable c / iterable d are not equal'
		);
		it.equal(
			isEqualWhy(d, c),
			'second object argument finished iterating before first object',
			'iterable d / iterable c are not equal'
		);

		it.end();
	});

	t.end();
});

var Circular = function Circular() {
	this.circularRef = this;
};
test('circular references', function (t) {
	var a = new Circular();
	var b = new Circular();
	t.equal(
		isEqualWhy(a, b),
		'',
		'two circular referencing instances are equal'
	);

	var c = {};
	var d = {};
	c.c = c;
	d.d = d;
	t.equal(
		isEqualWhy(c, d),
		'first argument has key "c"; second does not',
		'two objects with different circular references are not equal'
	);

	var e = {};
	var f = {};
	e.e = e;
	f.e = null;
	t.equal(
		isEqualWhy(e, f),
		'first argument has a circular reference at key "e"; second does not',
		'two objects without corresponding circular references are not equal'
	);

	t.equal(
		isEqualWhy(f, e),
		'second argument has a circular reference at key "e"; first does not',
		'two objects without corresponding circular references are not equal'
	);

	t.test('false positives', function (st) {
		st.equal(
			isEqualWhy({ bar: { baz: 'abc' } }, { bar: { baz: null } }),
			'value at key "bar" differs: value at key "baz" differs: abc !== null',
			'two nested structures with a string vs null key are not equal'
		);

		st.equal(
			isEqualWhy({ bar: { baz: 'abc' } }, { bar: { baz: undefined } }),
			'value at key "bar" differs: value at key "baz" differs: abc !== undefined',
			'two nested structures with a string vs null key are not equal'
		);

		st.equal(
			isEqualWhy({ bar: { baz: 'abc' } }, { bar: { baz: '' } }),
			'value at key "bar" differs: value at key "baz" differs: string values are different: "abc" !== ""',
			'two nested structures with different string keys are not equal'
		);

		st.end();
	});

	t.end();
});
