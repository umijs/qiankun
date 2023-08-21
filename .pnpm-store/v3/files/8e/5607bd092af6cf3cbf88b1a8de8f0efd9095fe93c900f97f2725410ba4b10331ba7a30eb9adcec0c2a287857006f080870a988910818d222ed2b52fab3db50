'use strict';

const functionExpressions = [
	'FunctionExpression',
	'ArrowFunctionExpression'
];

function isFunctionExpression(node) {
	return Boolean(node) &&
		functionExpressions.indexOf(node.type) !== -1;
}

module.exports = isFunctionExpression;
