'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const getMethodName = memberExpression => memberExpression.property.name;

const create = context => {
	return {
		CallExpression(node) {
			const {callee} = node;

			if (callee.type === 'MemberExpression' && getMethodName(callee) === 'appendChild') {
				context.report({
					node,
					message: 'Prefer `append` over `appendChild`',
					fix: fixer => fixer.replaceText(callee.property, 'append')
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
