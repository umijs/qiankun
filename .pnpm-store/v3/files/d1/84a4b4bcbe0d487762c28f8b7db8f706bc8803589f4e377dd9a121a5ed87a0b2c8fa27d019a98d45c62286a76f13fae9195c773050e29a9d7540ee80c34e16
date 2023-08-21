'use strict';
const cleanRegexp = require('clean-regexp');
const getDocsUrl = require('./utils/get-docs-url');

const message = 'Use regex shorthands to improve readability.';

const create = context => {
	return {
		'Literal[regex]': node => {
			const oldPattern = node.regex.pattern;
			const {flags} = node.regex;

			const newPattern = cleanRegexp(oldPattern, flags);

			// Handle regex literal inside RegExp constructor in the other handler
			if (node.parent.type === 'NewExpression' && node.parent.callee.name === 'RegExp') {
				return;
			}

			if (oldPattern !== newPattern) {
				context.report({
					node,
					message,
					fix: fixer => fixer.replaceTextRange(node.range, `/${newPattern}/${flags}`)
				});
			}
		},
		'NewExpression[callee.name="RegExp"]': node => {
			const args = node.arguments;

			if (args.length === 0 || args[0].type !== 'Literal') {
				return;
			}

			const hasRegExp = args[0].regex;

			let oldPattern = null;
			let flags = null;

			if (hasRegExp) {
				oldPattern = args[0].regex.pattern;
				flags = args[1] && args[1].type === 'Literal' ? args[1].value : args[0].regex.flags;
			} else {
				oldPattern = args[0].value;
				flags = args[1] && args[1].type === 'Literal' ? args[1].value : '';
			}

			const newPattern = cleanRegexp(oldPattern, flags);

			if (oldPattern !== newPattern) {
				let fixed;
				if (hasRegExp) {
					fixed = `/${newPattern}/`;
				} else {
					// Escape backslash and apostrophe because we wrap the result in single quotes.
					fixed = (newPattern || '').replace(/\\/, '\\\\');
					fixed = fixed.replace(/'/, '\'');
					fixed = `'${fixed}'`;
				}

				context.report({
					node,
					message,
					fix: fixer => fixer.replaceTextRange(args[0].range, fixed)
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
