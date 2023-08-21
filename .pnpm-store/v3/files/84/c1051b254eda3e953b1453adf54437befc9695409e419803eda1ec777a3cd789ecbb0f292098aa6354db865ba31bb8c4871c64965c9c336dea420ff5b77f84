'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const create = context => {
	const startsWithHashBang = context.getSourceCode().lines[0].indexOf('#!') === 0;

	if (startsWithHashBang) {
		return {};
	}

	let processEventHandler = null;

	return {
		CallExpression: node => {
			const {callee} = node;

			if (callee.type === 'MemberExpression' && callee.object.name === 'process') {
				if (callee.property.name === 'on' || callee.property.name === 'once') {
					processEventHandler = node;
					return;
				}

				if (callee.property.name === 'exit' && !processEventHandler) {
					context.report({
						node,
						message: 'Only use `process.exit()` in CLI apps. Throw an error instead.'
					});
				}
			}
		},
		'CallExpression:exit': node => {
			if (node === processEventHandler) {
				processEventHandler = null;
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
