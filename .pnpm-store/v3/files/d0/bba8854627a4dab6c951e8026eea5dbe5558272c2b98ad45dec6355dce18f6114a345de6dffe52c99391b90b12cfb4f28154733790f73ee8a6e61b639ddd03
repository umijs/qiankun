'use strict';

const zip = require('lodash.zip');

const toValue = value => ({value});

function computeTemplateLiteral(node) {
	const expressions = node.expressions.map(computeStaticExpression);

	if (expressions.some(expression => expression === undefined)) {
		return undefined;
	}

	const quasi = node.quasis.map(quasis => quasis.value.cooked);
	const value = zip(quasi, expressions.map(expr => expr.value))
		.reduce((res, elts) => res.concat(elts))
		.filter(Boolean)
		.join('');

	return toValue(value);
}

function computeBinaryExpression(operator, leftExpr, rightExpr) { // eslint-disable-line complexity
	if (!leftExpr || !rightExpr) {
		return undefined;
	}

	const left = leftExpr.value;
	const right = rightExpr.value;

	switch (operator) { // eslint-disable-line default-case
		case '+': return toValue(left + right);
		case '-': return toValue(left - right);
		case '*': return toValue(left * right);
		case '/': return toValue(left / right);
		case '%': return toValue(left % right);
		case '**': return toValue(Math.pow(left, right));
		case '<<': return toValue(left << right);
		case '>>': return toValue(left >> right);
		case '>>>': return toValue(left >>> right);
		case '&': return toValue(left & right);
		case '|': return toValue(left | right);
		case '^': return toValue(left | right);
		case '&&': return toValue(left && right);
		case '||': return toValue(left || right);
		case '===': return toValue(left === right);
		case '!==': return toValue(left !== right);
		case '==': return toValue(left == right); // eslint-disable-line eqeqeq
		case '!=': return toValue(left != right); // eslint-disable-line eqeqeq
		case '<': return toValue(left < right);
		case '>': return toValue(left > right);
		case '<=': return toValue(left <= right);
		case '>=': return toValue(left >= right);
	}
}

function applyUnaryOperator(operator, expr) {
	if (operator === 'void') {
		return toValue(undefined);
	}

	if (!expr) {
		return undefined;
	}

	const value = expr.value;

	switch (operator) { // eslint-disable-line default-case
		case '+': return toValue(+value); // eslint-disable-line no-implicit-coercion
		case '-': return toValue(-value);
		case '!': return toValue(!value);
		case '~': return toValue(~value);
	}
}

function computeConditionalExpression(test, consequent, alternate) {
	if (!test) {
		return undefined;
	}

	return test.value ? consequent : alternate;
}

function computeStaticExpression(node) {
	if (!node) {
		return undefined;
	}

	switch (node.type) {
		case 'Identifier':
			return node.name === 'undefined' ? toValue(undefined) : undefined;
		case 'Literal':
			return toValue(node.value);
		case 'TemplateLiteral':
			return computeTemplateLiteral(node);
		case 'UnaryExpression':
			return applyUnaryOperator(node.operator, computeStaticExpression(node.argument));
		case 'BinaryExpression': {
			return computeBinaryExpression(
				node.operator,
				computeStaticExpression(node.left),
				computeStaticExpression(node.right)
			);
		}
		case 'LogicalExpression': {
			return computeBinaryExpression(
				node.operator,
				computeStaticExpression(node.left),
				computeStaticExpression(node.right)
			);
		}
		case 'ConditionalExpression':
			return computeConditionalExpression(
				computeStaticExpression(node.test),
				computeStaticExpression(node.consequent),
				computeStaticExpression(node.alternate)
			);
		default:
			return undefined;
	}
}

module.exports = computeStaticExpression;
