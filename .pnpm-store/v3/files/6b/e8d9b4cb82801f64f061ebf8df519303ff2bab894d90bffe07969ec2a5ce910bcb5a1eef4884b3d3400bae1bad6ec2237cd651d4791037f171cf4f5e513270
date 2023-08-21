'use strict';

var isCallable = require('is-callable');
var fnToStr = Function.prototype.toString;
var isNonArrowFnRegex = /^\s*function/;
var isArrowFnWithParensRegex = /^\([^\)]*\) *=>/;
var isArrowFnWithoutParensRegex = /^[^=]*=>/;

module.exports = function isArrowFunction(fn) {
	if (!isCallable(fn)) { return false; }
	var fnStr = fnToStr.call(fn);
	return fnStr.length > 0 &&
		!isNonArrowFnRegex.test(fnStr) &&
		(isArrowFnWithParensRegex.test(fnStr) || isArrowFnWithoutParensRegex.test(fnStr));
};
