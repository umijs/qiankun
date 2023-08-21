'use strict';

const get = require('lodash.get');
const isStaticRequire = require('./is-static-require');

function getRequireSource(node) {
	return isStaticRequire(node) ? get(node, 'arguments.0.value') : undefined;
}

module.exports = getRequireSource;
