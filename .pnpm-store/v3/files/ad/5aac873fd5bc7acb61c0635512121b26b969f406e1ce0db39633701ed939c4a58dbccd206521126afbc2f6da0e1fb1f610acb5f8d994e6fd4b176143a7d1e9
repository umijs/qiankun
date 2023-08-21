'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const doesNotContain = (string, chars) => chars.every(char => !string.includes(char));

const isSimpleString = string => doesNotContain(
	string,
	['^', '$', '+', '[', '{', '(', '\\', '.', '?', '*']
);

const create = context => {
	return {
		CallExpression(node) {
			const {callee} = node;
			const prop = callee.property;

			if (!(prop && callee.type === 'MemberExpression')) {
				return;
			}

			const args = node.arguments;

			let regex;
			if (prop.name === 'test' && callee.object.regex) {
				({regex} = callee.object);
			} else if (prop.name === 'match' && args && args[0] && args[0].regex) {
				({regex} = args[0]);
			} else {
				return;
			}

			if (regex.flags && regex.flags.includes('i')) {
				return;
			}

			const {pattern} = regex;
			if (pattern.startsWith('^') && isSimpleString(pattern.slice(1))) {
				context.report({
					node,
					message: 'Prefer `String#startsWith` over a regex with `^`.'
				});
			} else if (pattern.endsWith('$') && isSimpleString(pattern.slice(0, -1))) {
				context.report({
					node,
					message: 'Prefer `String#endsWith` over a regex with `$`.'
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
