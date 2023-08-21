'use strict';
const safeRegex = require('safe-regex');
const getDocsUrl = require('./utils/get-docs-url');

const message = 'Unsafe regular expression.';

const create = context => {
	return {
		'Literal[regex]': node => {
			// Handle regex literal inside RegExp constructor in the other handler
			if (node.parent.type === 'NewExpression' && node.parent.callee.name === 'RegExp') {
				return;
			}

			if (!safeRegex(node.value)) {
				context.report({
					node,
					message
				});
			}
		},
		'NewExpression[callee.name="RegExp"]': node => {
			const args = node.arguments;

			if (args.length === 0 || args[0].type !== 'Literal') {
				return;
			}

			const hasRegExp = args[0].regex;

			let pattern = null;
			let flags = null;

			if (hasRegExp) {
				({pattern} = args[0].regex);
				flags = args[1] && args[1].type === 'Literal' ? args[1].value : args[0].regex.flags;
			} else {
				pattern = args[0].value;
				flags = args[1] && args[1].type === 'Literal' ? args[1].value : '';
			}

			if (!safeRegex(`/${pattern}/${flags}`)) {
				context.report({
					node,
					message
				});
			}
		}
	};
};

module.exports = {
	create,
	meta: {
		type: 'problem',
		docs: {
			url: getDocsUrl(__filename)
		}
	}
};
