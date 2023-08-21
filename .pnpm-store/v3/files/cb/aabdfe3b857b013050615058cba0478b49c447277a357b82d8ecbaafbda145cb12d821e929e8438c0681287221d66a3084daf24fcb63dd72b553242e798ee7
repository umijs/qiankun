'use strict';

module.exports = function (getPrototypeOf, t) {
	t.test('nullish value', function (st) {
		st['throws'](function () { return getPrototypeOf(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { return getPrototypeOf(null); }, TypeError, 'null is not an object');
		st.end();
	});

	t.equal(getPrototypeOf(true), Boolean.prototype);
	t.equal(getPrototypeOf(false), Boolean.prototype);
	t.equal(getPrototypeOf(42), Number.prototype);
	t.equal(getPrototypeOf(NaN), Number.prototype);
	t.equal(getPrototypeOf(0), Number.prototype);
	t.equal(getPrototypeOf(-0), Number.prototype);
	t.equal(getPrototypeOf(Infinity), Number.prototype);
	t.equal(getPrototypeOf(-Infinity), Number.prototype);
	t.equal(getPrototypeOf(''), String.prototype);
	t.equal(getPrototypeOf('foo'), String.prototype);
	t.equal(getPrototypeOf(/a/g), RegExp.prototype);
	t.equal(getPrototypeOf(new Date()), Date.prototype);
	t.equal(getPrototypeOf(function () {}), Function.prototype);
	t.equal(getPrototypeOf([]), Array.prototype);
	t.equal(getPrototypeOf({}), Object.prototype);
};
