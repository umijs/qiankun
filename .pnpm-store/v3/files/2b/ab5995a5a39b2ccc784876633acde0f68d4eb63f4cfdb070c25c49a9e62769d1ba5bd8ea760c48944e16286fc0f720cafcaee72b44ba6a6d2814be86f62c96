'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const isMathPow = node => {
	const {callee} = node;
	return (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'Math' &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'pow'
	);
};

const parseArgument = (context, arg) => {
	if (arg.type === 'Identifier') {
		return arg.name;
	}

	return context.getSourceCode().getText(arg);
};

const fix = (context, node, fixer) => {
	const base = parseArgument(context, node.arguments[0]);
	const exponent = parseArgument(context, node.arguments[1]);

	const replacement = `${base} ** ${exponent}`;

	return fixer.replaceText(node, replacement);
};

const create = context => {
	return {
		CallExpression(node) {
			if (isMathPow(node)) {
				context.report({
					node,
					message: 'Prefer the exponentiation operator over `Math.pow()`.',
					fix: fixer => fix(context, node, fixer)
				});
			}
		}
	};
};

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocsUrl(__filename)
		},
		fixable: 'code'
	}
};
