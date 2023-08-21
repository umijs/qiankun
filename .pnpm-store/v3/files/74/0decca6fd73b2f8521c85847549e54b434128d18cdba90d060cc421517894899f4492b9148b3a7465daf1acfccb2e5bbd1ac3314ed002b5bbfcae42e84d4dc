'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const getMethodName = callee => {
	const {property} = callee;

	if (property.type === 'Identifier') {
		return property.name;
	}

	return null;
};

const getCallerName = callee => {
	const {object} = callee;

	if (object.type === 'Identifier') {
		return object.name;
	}

	if (object.type === 'MemberExpression') {
		const {property} = object;

		if (property.type === 'Identifier') {
			return property.name;
		}
	}

	return null;
};

const getArgumentName = args => {
	const [identifier] = args;

	if (identifier.type === 'ThisExpression') {
		return 'this';
	}

	if (identifier.type === 'Identifier') {
		return identifier.name;
	}

	return null;
};

const create = context => {
	return {
		CallExpression(node) {
			const {callee} = node;

			if (node.arguments.length === 0 ||
				callee.type !== 'MemberExpression' ||
				callee.computed
			) {
				return;
			}

			const methodName = getMethodName(callee);
			const callerName = getCallerName(callee);

			if (methodName === 'removeChild' && (
				callerName === 'parentNode' ||
				callerName === 'parentElement'
			)) {
				const argumentName = getArgumentName(node.arguments);

				if (argumentName) {
					context.report({
						node,
						message: `Prefer \`remove\` over \`${callerName}.removeChild\``,
						fix: fixer => fixer.replaceText(node, `${argumentName}.remove()`)
					});
				}
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
