'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const disableRegex = /^eslint-disable(-next-line|-line)?($|(\s+(@[\w-]+\/(?:[\w-]+\/)?)?[\w-]+)?)/;

const create = context => ({
	Program: node => {
		for (const comment of node.comments) {
			const value = comment.value.trim();
			const res = disableRegex.exec(value);

			if (
				res && // It's a eslint-disable comment
				!res[2] // But it did not specify any rules
			) {
				context.report({
					// Can't set it at the given location as the warning
					// will be ignored due to the disable comment
					loc: {
						line: 0,
						column: 0
					},
					// So specify the location in the message
					message: 'Specify the rules you want to disable at line {{line}}:{{column}}',
					data: comment.loc.start
				});
			}
		}
	}
});

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocsUrl(__filename)
		}
	}
};
