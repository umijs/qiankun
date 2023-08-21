'use strict';

var test = require('tape');
var isEqual = require('../');
var hasSymbols = require('has-symbols')();
var hasSymbolShams = require('has-symbols/shams')();
var hasBigInts = require('has-bigints')();
var arrowFunctions = require('make-arrow-function').list();
var hasArrowFunctionSupport = arrowFunctions.length > 0;
var objectEntries = require('object.entries');
var forEach = require('foreach');
var functionsHaveNames = require('functions-have-names')();
var inspect = require('object-inspect');
var v = require('es-value-fixtures');
var hasGeneratorSupport = v.generatorFunctions.length > 0;

var symbolIterator = (hasSymbols || hasSymbolShams) && Symbol.iterator;

var copyFunction = function (fn) {
	/* eslint-disable no-new-func */
	try {
		return Function('return ' + String(fn))();
	} catch (e) {
		return Function('return {' + String(fn) + '}["' + fn.name + '"];')();
	}
};

test('primitives', function (t) {
	t.ok(isEqual(), 'undefineds are equal');
	t.ok(isEqual(null, null), 'nulls are equal');
	t.ok(isEqual(true, true), 'trues are equal');
	t.ok(isEqual(false, false), 'falses are equal');
	t.notOk(isEqual(true, false), 'true:false is not equal');
	t.notOk(isEqual(false, true), 'false:true is not equal');
	t.ok(isEqual('foo', 'foo'), 'strings are equal');
	t.ok(isEqual(42, 42), 'numbers are equal');
	t.ok(isEqual(0 / Infinity, -0 / Infinity), 'opposite sign zeroes are equal');
	t.ok(isEqual(Infinity, Infinity), 'infinities are equal');
	t.end();
});

test('NaN', function (t) {
	t.ok(isEqual(NaN, NaN), 'NaNs are equal');
	t.end();
});

test('boxed primitives', function (t) {
	t.ok(isEqual(Object(''), ''), 'Empty String and empty string are equal');
	t.ok(isEqual(Object('foo'), 'foo'), 'String and string are equal');
	t.ok(isEqual(Object(true), true), 'Boolean true and boolean true are equal');
	t.ok(isEqual(Object(false), false), 'Boolean false and boolean false are equal');
	t.ok(isEqual(true, Object(true)), 'boolean true and Boolean true are equal');
	t.ok(isEqual(false, Object(false)), 'boolean false and Boolean false are equal');
	t.notOk(isEqual(Object(true), false), 'Boolean true and boolean false are not equal');
	t.notOk(isEqual(Object(false), true), 'Boolean false and boolean true are not equal');
	t.notOk(isEqual(false, Object(true)), 'boolean false and Boolean true are not equal');
	t.notOk(isEqual(true, Object(false)), 'boolean true and Boolean false are not equal');
	t.ok(isEqual(Object(42), 42), 'Number and number literal are equal');
	t.end();
});

test('dates', function (t) {
	t.ok(isEqual(new Date(123), new Date(123)), 'two dates with the same timestamp are equal');
	t.notOk(isEqual(new Date(123), new Date(456)), 'two dates with different timestamp are not equal');
	t.end();
});

test('regexes', function (t) {
	t.ok(isEqual(/a/g, /a/g), 'two regex literals are equal');
	t.notOk(isEqual(/a/g, /b/g), 'two different regex literals (same flags, diff source) are not equal');
	t.notOk(isEqual(/a/i, /a/g), 'two different regex literals (same source, diff flags) are not equal');
	t.ok(isEqual(new RegExp('a', 'g'), new RegExp('a', 'g')), 'two regex objects are equal');
	t.notOk(isEqual(new RegExp('a', 'g'), new RegExp('b', 'g')), 'two different regex objects are equal');
	t.ok(isEqual(new RegExp('a', 'g'), /a/g), 'regex object and literal, same content, are equal');
	t.notOk(isEqual(new RegExp('a', 'g'), /b/g), 'regex object and literal, different content, are not equal');
	t.end();
});

test('arrays', function (t) {
	t.ok(isEqual([], []), 'empty arrays are equal');
	t.ok(isEqual([1, 2, 3], [1, 2, 3]), 'same arrays are equal');
	t.notOk(isEqual([1, 2, 3], [3, 2, 1]), 'arrays in different order with same values are not equal');
	t.notOk(isEqual([1, 2], [1, 2, 3]), 'arrays with different lengths are not equal');
	t.notOk(isEqual([1, 2, 3], [1, 2]), 'arrays with different lengths are not equal');

	t.test('nested values', function (st) {
		st.ok(isEqual([[1, 2], [2, 3], [3, 4]], [[1, 2], [2, 3], [3, 4]]), 'arrays with same array values are equal');
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
		st.notOk(isEqual(arr1[0], arr2[0]), 'array items 0 are not equal');
		st.ok(isEqual(arr1[1], arr2[1]), 'array items 1 are equal');
		st.notOk(isEqual(arr1, arr2), 'two arrays with nested inequal objects are not equal');

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

		st.ok(isEqual(f1, f2), 'two instances of the same thing are equal');

		st.ok(isEqual(g1, h1), 'two instances of different things with the same prototype are equal');
		st.notOk(isEqual(f1, i1), 'two instances of different things with a different prototype are not equal');

		var isParentEqualToChild = isEqual(f1, g1);
		st.notOk(isParentEqualToChild, 'two instances of a parent and child are not equal');
		var isChildEqualToParent = isEqual(g1, f1);
		st.notOk(isChildEqualToParent, 'two instances of a child and parent are not equal');

		g1.foo = 'bar';
		var g2 = new G();
		st.notOk(isEqual(g1, g2), 'two instances of the same thing with different properties are not equal');
		st.notOk(isEqual(g2, g1), 'two instances of the same thing with different properties are not equal');
		st.end();
	});

	t.test('literals', function (st) {
		var a = { foo: 42 };
		var b = { foo: 42 };
		st.ok(isEqual(a, a), 'same hash is equal to itself');
		st.ok(isEqual(a, b), 'two similar hashes are equal');
		st.ok(isEqual({ nested: a }, { nested: a }), 'similar hashes with same nested hash are equal');
		st.ok(isEqual({ nested: a }, { nested: b }), 'similar hashes with similar nested hash are equal');

		st.notOk(isEqual({ a: 42, b: 0 }, { a: 42 }), 'second hash missing a key is not equal');
		st.notOk(isEqual({ a: 42 }, { a: 42, b: 0 }), 'first hash missing a key is not equal');

		st.notOk(isEqual({ a: 1 }, { a: 2 }), 'two objects with equal keys but inequal values are not equal');
		st.notOk(isEqual({ c: 1 }, { a: 1 }), 'two objects with inequal keys but same values are not equal');

		var obj1 = { a: 0, b: '1', c: false };
		var obj2 = { a: 0, b: '1', c: true };
		st.notOk(isEqual(obj1, obj2), 'two objects with inequal boolean keys are not equal');
		st.end();
	});

	t.test('key ordering', function (st) {
		var a = { a: 1, b: 2 };
		var b = { b: 2 };
		b.a = 1;
		st.ok(isEqual(a, b), 'objects with different key orderings but same contents are equal');
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
	/* jscs: disable */
	/* eslint-disable space-before-function-paren */
	/* eslint-disable space-before-blocks */
	var fnNoSpace = Object(function(){});
	/* eslint-enable space-before-blocks */
	/* eslint-enable space-before-function-paren */
	/* jscs: enable */
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

	t.ok(isEqual(f1, f1), 'same function is equal to itself');
	t.ok(isEqual(anon1, anon1), 'same anon function is equal to itself');
	t.notOk(isEqual(anon1, anon1withArg), 'similar anon function with different lengths are not equal');

	if (functionsHaveNames) {
		t.notOk(isEqual(f1, g), 'functions with different names but same implementations are not equal');
	} else {
		t.comment('* function names not supported *');
		t.ok(isEqual(f1, g), 'functions with different names but same implementations should not be equal, but are');
	}
	t.ok(isEqual(f1, f2), 'functions with same names but same implementations are equal');
	t.notOk(isEqual(f1, f3), 'functions with same names but different implementations are not equal');
	t.ok(isEqual(anon1, anon2), 'anon functions with same implementations are equal');

	t.ok(isEqual(fnNoSpace, fnWithSpaceBeforeBody), 'functions with same arity/name/body are equal despite whitespace between signature and body');
	if (functionsHaveNames) {
		t.notOk(isEqual(emptyFnWithName, fnNoSpace), 'functions with same arity/body, diff name, are not equal');
	} else {
		t.comment('* function names not supported *');
		t.notOk(isEqual(emptyFnWithName, fnNoSpace), 'functions with same arity/body, diff name, should not be equal, but are');
	}
	t.notOk(isEqual(emptyFnOneArg, fnNoSpace), 'functions with same name/body, diff arity, are not equal');

	t.test('generators', { skip: !hasGeneratorSupport }, function (st) {
		/* eslint-disable no-new-func */
		var genFnStar = Function('return function* () {};')();
		var genFnSpaceStar = Function('return function *() {};')();
		var genNoSpaces = Function('return function*(){};')();
		st.notOk(isEqual(fnNoSpace, genNoSpaces), 'generator and fn that are otherwise identical are not equal');

		forEach(v.generatorFunctions.concat(genFnStar, genFnSpaceStar, genNoSpaces), function (generator) {
			st.ok(isEqual(generator, generator), generator + ' is equal to itself');

			var copied = copyFunction(generator);
			st.ok(isEqual(generator, copied), inspect(generator) + ' is equal to copyFunction(' + inspect(generator) + ')');
			st.ok(isEqual(copied, generator), 'copyFunction(' + inspect(generator) + ') is equal to ' + inspect(generator));
		});

		st.end();
	});

	t.test('arrow functions', { skip: !hasArrowFunctionSupport }, function (st) {
		forEach(arrowFunctions, function (fn) {
			st.notOk(isEqual(fnNoSpace, fn), fn + ' not equal to ' + fnNoSpace);
			st.ok(isEqual(fn, fn), fn + ' equal to itself');
			st.ok(isEqual(fn, copyFunction(fn)), fn + ' equal to copyFunction(fn)');
		});
		st.end();
	});

	t.end();
});

test('symbols', { skip: !hasSymbols }, function (t) {
	var foo = 'foo';
	var fooSym = Symbol(foo);
	var objectFooSym = Object(fooSym);
	t.ok(isEqual(fooSym, fooSym), 'Symbol("foo") is equal to itself');
	t.ok(isEqual(fooSym, objectFooSym), 'Symbol("foo") is equal to the object form of itself');
	t.notOk(isEqual(Symbol(foo), Symbol(foo)), 'Symbol("foo") is not equal to Symbol("foo"), even when the string is the same instance');
	t.notOk(isEqual(Symbol(foo), Object(Symbol(foo))), 'Symbol("foo") is not equal to Object(Symbol("foo")), even when the string is the same instance');

	t.test('arrays containing symbols', function (st) {
		st.ok(
			isEqual([fooSym], [fooSym]),
			'Arrays each containing the same instance of Symbol("foo") are equal'
		);

		st.notOk(
			isEqual([Symbol(foo)], [Object(Symbol(foo))]),
			'An array containing Symbol("foo") is not equal to Object(Symbol("foo")), even when the string is the same instance'
		);

		st.end();
	});

	t.end();
});

test('bigints', { skip: !hasBigInts }, function (t) {
	var bigInt = BigInt(42);
	var objectBigInt = Object(bigInt);
	t.ok(isEqual(bigInt, bigInt), '42n is equal to itself');
	t.ok(isEqual(bigInt, objectBigInt), '42n is equal to the object form of itself');
	t.notOk(isEqual(bigInt, BigInt(40)), '42n !== 40n');

	t.test('arrays containing bigints', function (st) {
		st.ok(
			isEqual([bigInt], [bigInt]),
			'Arrays each containing 42n are equal'
		);

		st.ok(
			isEqual([objectBigInt], [Object(bigInt)]),
			'Arrays each containing different instances of Object(42n) are equal'
		);

		st.ok(
			isEqual([bigInt], [objectBigInt]),
			'An array containing 42n is equal to an array containing Object(42n)'
		);

		st.end();
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

		mt.equal(isEqual(a, b), true, 'equal Maps (a, b) are equal');
		mt.equal(isEqual(b, a), true, 'equal Maps (b, a) are equal');
		mt.equal(isEqual(a, c), false, 'unequal Maps (a, c) are not equal');
		mt.equal(isEqual(b, c), false, 'unequal Maps (b, c) are not equal');
		mt.equal(isEqual(c, a), false, 'unequal Maps (c, a) are not equal');
		mt.equal(isEqual(c, b), false, 'unequal Maps (c, b) are not equal');

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

		st.ok(isEqual(a, b), 'equal Set (a, b) are equal');
		st.ok(isEqual(b, a), 'equal Set (b, a) are equal');
		st.notOk(isEqual(a, c), 'unequal Set (a, c) are not equal');
		st.notOk(isEqual(b, c), 'unequal Set (b, c) are not equal');
		st.notOk(isEqual(c, a), 'unequal Set (c, a) are not equal');
		st.notOk(isEqual(c, b), 'unequal Set (c, b) are not equal');

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
			if (ab.size !== 2) {
				// work around IE 11 (and others) bug accepting iterables
				ab.add('a');
				ab.add('c');
			}
			sst.notOk(isEqual(ab, ac), 'Sets initially populated with different strings are not equal');
			sst.end();
		});

		st.end();
	});

	var obj = { a: { aa: true }, b: [2] };
	t.test('generic iterables', { skip: !symbolIterator }, function (it) {
		var a = { foo: 'bar' };
		var b = { bar: 'baz' };

		it.equal(isEqual(a, b), false, 'normal a and normal b are not equal');

		a[symbolIterator] = genericIterator(obj);
		it.equal(isEqual(a, b), false, 'iterable a / normal b are not equal');
		it.equal(isEqual(b, a), false, 'iterable b / normal a are not equal');
		it.equal(isEqual(a, obj), false, 'iterable a / normal obj are not equal');
		it.equal(isEqual(obj, a), false, 'normal obj / iterable a are not equal');

		b[symbolIterator] = genericIterator(obj);
		it.equal(isEqual(a, b), true, 'iterable a / iterable b are equal');
		it.equal(isEqual(b, a), true, 'iterable b / iterable a are equal');
		it.equal(isEqual(b, obj), false, 'iterable b and normal obj are not equal');
		it.equal(isEqual(obj, b), false, 'normal obj / iterable b are not equal');

		it.end();
	});

	t.test('unequal iterables', { skip: !symbolIterator }, function (it) {
		var c = {};
		c[symbolIterator] = genericIterator({});
		var d = {};
		d[symbolIterator] = genericIterator(obj);

		it.equal(isEqual(c, d), false, 'iterable c / iterable d are not equal');
		it.equal(isEqual(d, c), false, 'iterable d / iterable c are not equal');

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
	t.equal(isEqual(a, b), true, 'two circular referencing instances are equal');

	var c = {};
	var d = {};
	c.c = c;
	d.d = d;
	t.equal(isEqual(c, d), false, 'two objects with different circular references are not equal');

	t.end();
});
