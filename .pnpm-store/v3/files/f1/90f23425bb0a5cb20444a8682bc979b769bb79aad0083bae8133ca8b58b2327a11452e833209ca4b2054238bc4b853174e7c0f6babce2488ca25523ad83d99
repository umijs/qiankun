'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const isCommaFollowedWithComma = (element, index, array) => {
	return element === null && array[index + 1] === null;
};

const create = context => {
	return {
		ArrayPattern(node) {
			const {elements} = node;
			if (!elements || elements.length === 0) {
				return;
			}

			if (elements.some(isCommaFollowedWithComma)) {
				context.report({
					node,
					message: 'Array destructuring may not contain consecutive ignored values.'
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
		}
	}
};
