'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const fix = value => {
	if (!/^0[a-zA-Z]/.test(value)) {
		return value;
	}

	const indicator = value[1].toLowerCase();
	const val = value.slice(2).toUpperCase();

	return `0${indicator}${val}`;
};

const create = context => {
	return {
		Literal: node => {
			const value = node.raw;
			const fixedValue = fix(value);

			if (value !== fixedValue) {
				context.report({
					node,
					message: 'Invalid number literal casing.',
					fix: fixer => fixer.replaceText(node, fixedValue)
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
