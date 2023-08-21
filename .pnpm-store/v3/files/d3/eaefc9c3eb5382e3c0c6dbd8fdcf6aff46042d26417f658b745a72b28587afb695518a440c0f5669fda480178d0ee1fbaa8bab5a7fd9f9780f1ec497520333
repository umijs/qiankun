'use strict';

var callBound = require('call-bind/callBound');

var $register = callBound('FinalizationRegistry.prototype.register', true);

module.exports = $register
	? function isFinalizationRegistry(value) {
		if (!value || typeof value !== 'object') {
			return false;
		}
		try {
			$register(value, {});
			return true;
		} catch (e) {
			return false;
		}
	}
	: function isFinalizationRegistry(value) { // eslint-disable-line no-unused-vars
		return false;
	};
