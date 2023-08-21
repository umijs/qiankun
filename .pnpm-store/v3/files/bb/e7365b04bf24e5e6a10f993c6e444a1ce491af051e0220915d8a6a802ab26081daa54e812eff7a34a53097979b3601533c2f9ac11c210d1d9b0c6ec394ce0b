'use strict';

function isStaticRequire(node) {
	return Boolean(node &&
		node.callee &&
		node.callee.type === 'Identifier' &&
		node.callee.name === 'require' &&
		node.arguments.length === 1 &&
		node.arguments[0].type === 'Literal' &&
		typeof node.arguments[0].value === 'string'
	);
}

module.exports = isStaticRequire;
