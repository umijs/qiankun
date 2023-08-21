'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const operatorTypes = {
	gt: ['>'],
	gte: ['>='],
	ne: ['!==', '!=']
};

function reportError(context, node, message, fixDetails) {
	context.report({
		node,
		message,
		fix: fixDetails && (fixer => {
			return fixer.replaceText(
				node,
				`${context.getSourceCode().getText(fixDetails.node)} ${fixDetails.operator} ${fixDetails.value}`
			);
		})
	});
}

function checkZeroType(context, node) {
	if (node.operator === '<' && node.right.value === 1) {
		reportError(
			context,
			node,
			'Zero `.length` should be compared with `=== 0`.',
			{
				node: node.left,
				operator: '===',
				value: 0
			}
		);
	}
}

function checkNonZeroType(context, node, type) {
	const {value} = node.right;
	const {operator} = node;

	switch (type) {
		case 'greater-than':
			if (
				(operatorTypes.gte.includes(operator) && value === 1) ||
				(operatorTypes.ne.includes(operator) && value === 0)
			) {
				reportError(
					context,
					node,
					'Non-zero `.length` should be compared with `> 0`.',
					{
						node: node.left,
						operator: '>',
						value: 0
					}
				);
			}

			break;
		case 'greater-than-or-equal':
			if (
				(operatorTypes.gt.includes(operator) && value === 0) ||
				(operatorTypes.ne.includes(operator) && value === 0)
			) {
				reportError(
					context,
					node,
					'Non-zero `.length` should be compared with `>= 1`.',
					{
						node: node.left,
						operator: '>=',
						value: 1
					}
				);
			}

			break;
		case 'not-equal':
			if (
				(operatorTypes.gt.includes(operator) && value === 0) ||
				(operatorTypes.gte.includes(operator) && value === 1)
			) {
				reportError(
					context,
					node,
					'Non-zero `.length` should be compared with `!== 0`.',
					{
						node: node.left,
						operator: '!==',
						value: 0
					}
				);
			}

			break;
		default:
			break;
	}
}

function checkBinaryExpression(context, node, options) {
	if (node.right.type === 'Literal' &&
		node.left.type === 'MemberExpression' &&
		node.left.property.type === 'Identifier' &&
		node.left.property.name === 'length'
	) {
		checkZeroType(context, node);
		checkNonZeroType(context, node, options['non-zero']);
	}
}

function checkExpression(context, node) {
	if (node.type === 'LogicalExpression') {
		checkExpression(context, node.left);
		checkExpression(context, node.right);
		return;
	}

	if (node.type === 'UnaryExpression' && node.operator === '!') {
		checkExpression(context, node.argument);
		return;
	}

	if (node.type === 'BinaryExpression') {
		checkBinaryExpression(context, node, context.options[0] || {});
		return;
	}

	if (node.type === 'MemberExpression' &&
		node.property.type === 'Identifier' &&
		node.property.name === 'length'
	) {
		reportError(context, node, '`length` property should be compared to a value.');
	}
}

const create = context => {
	return {
		IfStatement: node => {
			checkExpression(context, node.test);
		},
		ConditionalExpression: node => {
			checkExpression(context, node.test);
		}
	};
};

const schema = [{
	type: 'object',
	properties: {
		'non-zero': {
			enum: [
				'not-equal',
				'greater-than',
				'greater-than-or-equal'
			]
		}
	}
}];

module.exports = {
	create,
	meta: {
		type: 'problem',
		docs: {
			url: getDocsUrl(__filename)
		},
		fixable: 'code',
		schema
	}
};
