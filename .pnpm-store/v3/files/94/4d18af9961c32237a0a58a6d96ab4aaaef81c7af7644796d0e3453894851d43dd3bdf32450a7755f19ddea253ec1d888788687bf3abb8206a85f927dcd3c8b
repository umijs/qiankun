'use strict';

var RequireObjectCoercible = require('es-abstract/2022/RequireObjectCoercible');
var implementation = require('./implementation');

var hasProto = [].__proto__ === Array.prototype; // eslint-disable-line no-proto

var getProto = function getPrototypeOf(value) {
	RequireObjectCoercible(value);
	return value.__proto__; // eslint-disable-line no-proto
};

var $getPrototypeOf = Object.getPrototypeOf;
var getPrototypeOfPrimitivesToo = function getPrototypeOf(value) {
	RequireObjectCoercible(value);
	return $getPrototypeOf(Object(value));
};

module.exports = function getPolyfill() {
	if ($getPrototypeOf) {
		try {
			$getPrototypeOf(true);
		} catch (e) {
			return getPrototypeOfPrimitivesToo;
		}
		return $getPrototypeOf;
	}
	if (hasProto) {
		return getProto;
	}
	return implementation;
};
