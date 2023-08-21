'use strict';
const getDocsUrl = require('./utils/get-docs-url');

function checkEscape(context, node, value) {
	const fixedValue = typeof value === 'string' ? value.replace(/((?:^|[^\\])(?:\\\\)*)\\x/g, '$1\\u00') : value;

	if (value !== fixedValue) {
		context.report({
			node,
			message: 'Use unicode escapes instead of hexadecimal escapes.',
			fix: fixer => fixer.replaceTextRange([node.start, node.end], fixedValue)
		});
	}
}

const create = context => {
	return {
		Literal: node => {
			checkEscape(context, node, node.raw);
		},
		TemplateElement: node => {
			checkEscape(context, node, node.value.raw);
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
