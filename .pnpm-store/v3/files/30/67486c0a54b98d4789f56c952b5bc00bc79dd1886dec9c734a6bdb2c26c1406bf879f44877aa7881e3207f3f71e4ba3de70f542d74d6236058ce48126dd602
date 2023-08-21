'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const message = 'Prefer `textContent` over `innerText`.';

const create = context => {
	return {
		MemberExpression: node => {
			const {property} = node;

			if (property.type === 'Identifier' && !node.computed && property.name === 'innerText') {
				context.report({
					node,
					message,
					fix: fixer => fixer.replaceText(property, 'textContent')
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
