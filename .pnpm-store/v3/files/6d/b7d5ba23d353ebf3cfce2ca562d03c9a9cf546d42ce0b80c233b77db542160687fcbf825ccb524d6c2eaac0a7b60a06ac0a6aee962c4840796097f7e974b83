'use strict';

var Type = require('es-abstract/2022/Type');
var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var implementation = require('./implementation');

var hasProto = [].__proto__ === Array.prototype; // eslint-disable-line no-proto

var getProto = function getPrototypeOf(value) {
	if (Type(value) !== 'Object') {
		throw new $TypeError('Reflect.getPrototypeOf called on non-object');
	}
	return value.__proto__; // eslint-disable-line no-proto
};

module.exports = function getPolyfill() {
	if (typeof Reflect === 'object' && Reflect && Reflect.getPrototypeOf) {
		return Reflect.getPrototypeOf;
	}
	if (hasProto) {
		return getProto;
	}
	return implementation;
};
