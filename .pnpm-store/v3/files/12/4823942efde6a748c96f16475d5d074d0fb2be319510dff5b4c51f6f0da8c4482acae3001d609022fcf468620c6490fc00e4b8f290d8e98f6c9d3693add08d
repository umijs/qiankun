'use strict';

var define = require('define-properties');
var getPolyfill = require('./polyfill');

module.exports = function shimGetPrototypeOf() {
	var polyfill = getPolyfill();
	define(
		Object,
		{ getPrototypeOf: polyfill },
		{ getPrototypeOf: function () { return Object.getPrototypeOf !== polyfill; } }
	);
	return polyfill;
};
