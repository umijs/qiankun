'use strict';
const upperfirst = require('lodash.upperfirst');
const getDocsUrl = require('./utils/get-docs-url');

const nameRegexp = /^(?:[A-Z][a-z\d]*)*Error$/;

const getClassName = name => upperfirst(name).replace(/(error|)$/i, 'Error');

const getConstructorMethod = className => `
	constructor() {
		super();
		this.name = '${className}';
	}
`;

const hasValidSuperClass = node => {
	if (!node.superClass) {
		return false;
	}

	let {name} = node.superClass;

	if (node.superClass.type === 'MemberExpression') {
		({name} = node.superClass.property);
	}

	return nameRegexp.test(name);
};

const isSuperExpression = node => node.type === 'ExpressionStatement' && node.expression.type === 'CallExpression' && node.expression.callee.type === 'Super';

const isAssignmentExpression = (node, name) => {
	if (node.type !== 'ExpressionStatement' || node.expression.type !== 'AssignmentExpression') {
		return false;
	}

	const lhs = node.expression.left;

	if (!lhs.object || lhs.object.type !== 'ThisExpression') {
		return false;
	}

	return lhs.property.name === name;
};

const customErrorDefinition = (context, node) => {
	if (!hasValidSuperClass(node)) {
		return;
	}

	if (node.id === null) {
		return;
	}

	const {name} = node.id;
	const className = getClassName(name);

	if (name !== className) {
		context.report({
			node: node.id,
			message: `Invalid class name, use \`${className}\`.`
		});
	}

	const {body} = node.body;
	const constructor = body.find(x => x.kind === 'constructor');

	if (!constructor) {
		context.report({
			node,
			message: 'Add a constructor to your error.',
			fix: fixer => fixer.insertTextAfterRange([
				node.body.start,
				node.body.start + 1
			], getConstructorMethod(name))
		});
		return;
	}

	const constructorBodyNode = constructor.value.body;
	const constructorBody = constructorBodyNode.body;

	const superExpression = constructorBody.find(isSuperExpression);
	const messageExpressionIndex = constructorBody.findIndex(x => isAssignmentExpression(x, 'message'));

	if (!superExpression) {
		context.report({
			node: constructorBodyNode,
			message: 'Missing call to `super()` in constructor.'
		});
	} else if (messageExpressionIndex !== -1 && superExpression.expression.arguments.length === 0) {
		const rhs = constructorBody[messageExpressionIndex].expression.right;

		context.report({
			node: superExpression,
			message: 'Pass the error message to `super()`.',
			fix: fixer => fixer.insertTextAfterRange([
				superExpression.start,
				superExpression.start + 6
			], rhs.raw || rhs.name)
		});
	}

	if (messageExpressionIndex !== -1) {
		const expression = constructorBody[messageExpressionIndex];

		context.report({
			node: expression,
			message: 'Pass the error message to `super()` instead of setting `this.message`.',
			fix: fixer => fixer.removeRange([
				messageExpressionIndex === 0 ? constructorBodyNode.start : constructorBody[messageExpressionIndex - 1].end,
				expression.end
			])
		});
	}

	const nameExpression = constructorBody.find(x => isAssignmentExpression(x, 'name'));

	if (!nameExpression || nameExpression.expression.right.value !== name) {
		context.report({
			node: nameExpression ? nameExpression.expression.right : constructorBodyNode,
			message: `The \`name\` property should be set to \`${name}\`.`
		});
	}
};

const create = context => {
	return {
		ClassDeclaration: node => customErrorDefinition(context, node),
		'AssignmentExpression[right.type="ClassExpression"]': node => customErrorDefinition(context, node.right)
	};
};

module.exports = {
	create,
	meta: {
		type: 'problem',
		docs: {
			url: getDocsUrl(__filename)
		},
		fixable: 'code'
	}
};
