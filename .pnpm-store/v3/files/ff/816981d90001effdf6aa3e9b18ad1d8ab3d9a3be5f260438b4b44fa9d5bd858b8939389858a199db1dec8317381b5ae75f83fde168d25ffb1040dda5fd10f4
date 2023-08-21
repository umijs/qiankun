'use strict';

const computeStaticExpression = require('./compute-static-expression');

function getPropertyName(node) {
	if (!node || node.type !== 'MemberExpression') {
		return undefined;
	}

	if (node.property.type === 'Identifier' && node.computed === false) {
		return node.property.name;
	}

	const expression = computeStaticExpression(node.property);
	return expression && expression.value;
}

module.exports = getPropertyName;
