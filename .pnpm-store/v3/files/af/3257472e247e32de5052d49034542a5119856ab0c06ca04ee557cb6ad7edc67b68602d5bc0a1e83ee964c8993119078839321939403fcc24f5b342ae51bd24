'use strict';

var ObjectPrototype = Object.prototype;
var toStr = ObjectPrototype.toString;
var booleanValue = Boolean.prototype.valueOf;
var has = require('has');
var isArray = require('isarray');
var isArrowFunction = require('is-arrow-function');
var isBoolean = require('is-boolean-object');
var isDate = require('is-date-object');
var isGenerator = require('is-generator-function');
var isNumber = require('is-number-object');
var isRegex = require('is-regex');
var isString = require('is-string');
var isSymbol = require('is-symbol');
var isCallable = require('is-callable');
var isBigInt = require('is-bigint');
var getIterator = require('es-get-iterator');
var whichCollection = require('which-collection');
var whichBoxedPrimitive = require('which-boxed-primitive');
var getPrototypeOf = require('object.getprototypeof/polyfill')();
var hasSymbols = require('has-symbols/shams')();
var hasBigInts = require('has-bigints')();

var objectType = function (v) { return whichCollection(v) || whichBoxedPrimitive(v) || typeof v; };

var isProto = Object.prototype.isPrototypeOf;

var functionsHaveNames = require('functions-have-names')();

var symbolValue = hasSymbols ? Symbol.prototype.valueOf : null;

var bigIntValue = hasBigInts ? BigInt.prototype.valueOf : null;

var normalizeFnWhitespace = function normalizeWhitespace(fnStr) {
	// this is needed in IE 9, at least, which has inconsistencies here.
	return fnStr.replace(/^function ?\(/, 'function (').replace('){', ') {');
};

module.exports = function whyNotEqual(value, other) {
	if (value === other) { return ''; }
	if (value == null || other == null) {
		return value === other ? '' : String(value) + ' !== ' + String(other);
	}

	var valToStr = toStr.call(value);
	var otherToStr = toStr.call(other);
	if (valToStr !== otherToStr) {
		return 'toStringTag is not the same: ' + valToStr + ' !== ' + otherToStr;
	}

	var valIsBool = isBoolean(value);
	var otherIsBool = isBoolean(other);
	if (valIsBool || otherIsBool) {
		if (!valIsBool) { return 'first argument is not a boolean; second argument is'; }
		if (!otherIsBool) { return 'second argument is not a boolean; first argument is'; }
		var valBoolVal = booleanValue.call(value);
		var otherBoolVal = booleanValue.call(other);
		if (valBoolVal === otherBoolVal) { return ''; }
		return 'primitive value of boolean arguments do not match: ' + valBoolVal + ' !== ' + otherBoolVal;
	}

	var valIsNumber = isNumber(value);
	var otherIsNumber = isNumber(other);
	if (valIsNumber || otherIsNumber) {
		if (!valIsNumber) { return 'first argument is not a number; second argument is'; }
		if (!otherIsNumber) { return 'second argument is not a number; first argument is'; }
		var valNum = Number(value);
		var otherNum = Number(other);
		if (valNum === otherNum) { return ''; }
		var valIsNaN = isNaN(value);
		var otherIsNaN = isNaN(other);
		if (valIsNaN && !otherIsNaN) {
			return 'first argument is NaN; second is not';
		} else if (!valIsNaN && otherIsNaN) {
			return 'second argument is NaN; first is not';
		} else if (valIsNaN && otherIsNaN) {
			return '';
		}
		return 'numbers are different: ' + value + ' !== ' + other;
	}

	var valIsString = isString(value);
	var otherIsString = isString(other);
	if (valIsString || otherIsString) {
		if (!valIsString) { return 'second argument is string; first is not'; }
		if (!otherIsString) { return 'first argument is string; second is not'; }
		var stringVal = String(value);
		var otherVal = String(other);
		if (stringVal === otherVal) { return ''; }
		return 'string values are different: "' + stringVal + '" !== "' + otherVal + '"';
	}

	var valIsDate = isDate(value);
	var otherIsDate = isDate(other);
	if (valIsDate || otherIsDate) {
		if (!valIsDate) { return 'second argument is Date, first is not'; }
		if (!otherIsDate) { return 'first argument is Date, second is not'; }
		var valTime = +value;
		var otherTime = +other;
		if (valTime !== otherTime) {
			return 'Dates have different time values: ' + valTime + ' !== ' + otherTime;
		}
	}

	var valIsRegex = isRegex(value);
	var otherIsRegex = isRegex(other);
	if (valIsRegex || otherIsRegex) {
		if (!valIsRegex) { return 'second argument is RegExp, first is not'; }
		if (!otherIsRegex) { return 'first argument is RegExp, second is not'; }
		var regexStringVal = String(value);
		var regexStringOther = String(other);
		if (regexStringVal !== regexStringOther) {
			return 'regular expressions differ: ' + regexStringVal + ' !== ' + regexStringOther;
		}
	}

	var valIsArray = isArray(value);
	var otherIsArray = isArray(other);
	if (valIsArray || otherIsArray) {
		if (!valIsArray) { return 'second argument is an Array, first is not'; }
		if (!otherIsArray) { return 'first argument is an Array, second is not'; }
		if (value.length !== other.length) {
			return 'arrays have different length: ' + value.length + ' !== ' + other.length;
		}

		var index = value.length - 1;
		var equal = '';
		var valHasIndex, otherHasIndex;
		while (equal === '' && index >= 0) {
			valHasIndex = has(value, index);
			otherHasIndex = has(other, index);
			if (!valHasIndex && otherHasIndex) { return 'second argument has index ' + index + '; first does not'; }
			if (valHasIndex && !otherHasIndex) { return 'first argument has index ' + index + '; second does not'; }
			equal = whyNotEqual(value[index], other[index]);
			index -= 1;
		}
		return equal;
	}

	var valueIsSym = isSymbol(value);
	var otherIsSym = isSymbol(other);
	if (valueIsSym !== otherIsSym) {
		if (valueIsSym) { return 'first argument is Symbol; second is not'; }
		return 'second argument is Symbol; first is not';
	}
	if (valueIsSym && otherIsSym) {
		return symbolValue.call(value) === symbolValue.call(other) ? '' : 'first Symbol value !== second Symbol value';
	}

	var valueIsBigInt = isBigInt(value);
	var otherIsBigInt = isBigInt(other);
	if (valueIsBigInt !== otherIsBigInt) {
		if (valueIsBigInt) { return 'first argument is BigInt; second is not'; }
		return 'second argument is BigInt; first is not';
	}
	if (valueIsBigInt && otherIsBigInt) {
		return bigIntValue.call(value) === bigIntValue.call(other) ? '' : 'first BigInt value !== second BigInt value';
	}

	var valueIsGen = isGenerator(value);
	var otherIsGen = isGenerator(other);
	if (valueIsGen !== otherIsGen) {
		if (valueIsGen) { return 'first argument is a Generator function; second is not'; }
		return 'second argument is a Generator function; first is not';
	}

	var valueIsArrow = isArrowFunction(value);
	var otherIsArrow = isArrowFunction(other);
	if (valueIsArrow !== otherIsArrow) {
		if (valueIsArrow) { return 'first argument is an arrow function; second is not'; }
		return 'second argument is an arrow function; first is not';
	}

	var valueIsCallable = isCallable(value);
	var otherIsCallable = isCallable(other);
	if (valueIsCallable || otherIsCallable) {
		if (functionsHaveNames && whyNotEqual(value.name, other.name) !== '') {
			return 'Function names differ: "' + value.name + '" !== "' + other.name + '"';
		}
		if (whyNotEqual(value.length, other.length) !== '') {
			return 'Function lengths differ: ' + value.length + ' !== ' + other.length;
		}

		var valueStr = normalizeFnWhitespace(String(value));
		var otherStr = normalizeFnWhitespace(String(other));
		if (
			whyNotEqual(valueStr, otherStr) !== ''
			&& !(
				!valueIsGen
				&& !valueIsArrow
				&& whyNotEqual(valueStr.replace(/\)\s*\{/, '){'), otherStr.replace(/\)\s*\{/, '){')) === ''
			)
		) {
			return 'Function string representations differ';
		}
	}

	var valueIsObj = valIsDate || valIsRegex || valIsArray || valueIsGen || valueIsArrow || valueIsCallable || Object(value) === value;
	var otherIsObj = otherIsDate || otherIsRegex || otherIsArray || otherIsGen || otherIsArrow || otherIsCallable || Object(other) === other;

	if (valueIsObj || otherIsObj) {
		if (typeof value !== typeof other) { return 'arguments have a different typeof: ' + typeof value + ' !== ' + typeof other; }
		if (isProto.call(value, other)) { return 'first argument is the [[Prototype]] of the second'; }
		if (isProto.call(other, value)) { return 'second argument is the [[Prototype]] of the first'; }
		if (getPrototypeOf(value) !== getPrototypeOf(other)) { return 'arguments have a different [[Prototype]]'; }

		var valueIterator = getIterator(value);
		var otherIterator = getIterator(other);
		if (!!valueIterator !== !!otherIterator) {
			if (valueIterator) { return 'first argument is iterable; second is not'; }
			return 'second argument is iterable; first is not';
		}
		if (valueIterator && otherIterator) { // both should be truthy or falsy at this point
			var valueNext, otherNext, nextWhy;
			do {
				valueNext = valueIterator.next();
				otherNext = otherIterator.next();
				if (!valueNext.done && !otherNext.done) {
					nextWhy = whyNotEqual(valueNext, otherNext);
					if (nextWhy !== '') {
						return 'iteration results are not equal: ' + nextWhy;
					}
				}
			} while (!valueNext.done && !otherNext.done);
			if (valueNext.done && !otherNext.done) { return 'first ' + objectType(value) + ' argument finished iterating before second ' + objectType(other); }
			if (!valueNext.done && otherNext.done) { return 'second ' + objectType(other) + ' argument finished iterating before first ' + objectType(value); }
			return '';
		}

		var key, valueKeyIsRecursive, otherKeyIsRecursive, keyWhy;
		for (key in value) {
			if (has(value, key)) {
				if (!has(other, key)) { return 'first argument has key "' + key + '"; second does not'; }
				valueKeyIsRecursive = !!value[key] && value[key][key] === value;
				otherKeyIsRecursive = !!other[key] && other[key][key] === other;
				if (valueKeyIsRecursive !== otherKeyIsRecursive) {
					if (valueKeyIsRecursive) { return 'first argument has a circular reference at key "' + key + '"; second does not'; }
					return 'second argument has a circular reference at key "' + key + '"; first does not';
				}
				if (!valueKeyIsRecursive && !otherKeyIsRecursive) {
					keyWhy = whyNotEqual(value[key], other[key]);
					if (keyWhy !== '') {
						return 'value at key "' + key + '" differs: ' + keyWhy;
					}
				}
			}
		}
		for (key in other) {
			if (has(other, key) && !has(value, key)) {
				return 'second argument has key "' + key + '"; first does not';
			}
		}
		return '';
	}

	return false;
};
