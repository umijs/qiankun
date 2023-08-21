'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const isArrayFrom = node => {
	const {callee} = node;
	return (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'Array' &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'from'
	);
};

const isArrayLike = arg => arg && arg.type !== 'ObjectExpression';

const parseArgument = (context, arg) => {
	if (arg.type === 'Identifier') {
		return arg.name;
	}

	return context.getSourceCode().getText(arg);
};

const create = context => {
	return {
		CallExpression(node) {
			if (isArrayFrom(node) && isArrayLike(node.arguments[0])) {
				context.report({
					node,
					message: 'Prefer the spread operator over `Array.from()`.',
					fix: fixer => {
						const arrayLikeArg = parseArgument(context, node.arguments[0]);
						const replacement = `[...${arrayLikeArg}]`;

						if (node.arguments.length > 1) {
							const mapFn = parseArgument(context, node.arguments[1]);
							const thisArg = node.arguments.length === 3 ? parseArgument(context, node.arguments[2]) : null;
							const thisArgReplacement = thisArg ? `, ${thisArg}` : '';

							return fixer.replaceText(node, `${replacement}.map(${mapFn}${thisArgReplacement})`);
						}

						return fixer.replaceText(node, replacement);
					}
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
