'use strict';

var callBind = require('call-bind');
var define = require('define-properties');

var implementation = require('./implementation');
var getPolyfill = require('./polyfill');
var polyfill = callBind(getPolyfill(), Object);
var shim = require('./shim');

var bound = function getPrototypeOf(value) {
	return polyfill(value);
};

define(bound, {
	getPolyfill: getPolyfill,
	implementation: implementation,
	shim: shim
});

module.exports = bound;
