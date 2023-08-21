'use strict';

// TODO: delete in next semver-major

var isSymbol = require('is-symbol');

module.exports = function getSymbolIterator() {
	var symbolIterator = typeof Symbol === 'function' && isSymbol(Symbol.iterator) ? Symbol.iterator : null;

	if (typeof Object.getOwnPropertyNames === 'function' && typeof Map === 'function' && typeof Map.prototype.entries === 'function') {
		Object.getOwnPropertyNames(Map.prototype)
			.concat(Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(Map.prototype) : [])
			.forEach(function (name) {
				if (name !== 'entries' && name !== 'size' && Map.prototype[name] === Map.prototype.entries) {
					symbolIterator = name;
				}
			});
	}

	return symbolIterator;
};
