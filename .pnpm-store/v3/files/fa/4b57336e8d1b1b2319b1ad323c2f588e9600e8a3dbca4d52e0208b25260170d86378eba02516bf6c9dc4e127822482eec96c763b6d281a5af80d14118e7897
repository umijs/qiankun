'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const getConsoleMethod = node => {
	const methods = [
		'log',
		'debug',
		'info',
		'warn',
		'error'
	];

	const {callee} = node;

	if (
		callee.type === 'MemberExpression' &&
		callee.object.type === 'Identifier' &&
		callee.object.name === 'console' &&
		callee.property.type === 'Identifier' &&
		methods.includes(callee.property.name)
	) {
		return callee.property.name;
	}
};

const getArgumentValue = (context, nodeArgument) => {
	let value = null;

	if (nodeArgument.type === 'Literal' && typeof nodeArgument.value === 'string') {
		value = nodeArgument.value;
	}

	if (nodeArgument.type === 'TemplateLiteral') {
		const sourceCode = context.getSourceCode();
		value = sourceCode.getText(nodeArgument);
		// Strip off backticks
		value = value.substring(1, value.length - 1);
	}

	return value;
};

const fixValue = (value, {
	fixLeading = true,
	fixTrailing = true
}) => {
	if (!value) {
		return value;
	}

	// Allow exactly one space
	if (value.length <= 1) {
		return value;
	}

	let fixed = value;

	// Find exactly one leading space
	if (fixLeading && fixed.startsWith(' ') && !fixed.startsWith('  ')) {
		fixed = fixed.slice(1);
	}

	// Find exactly one trailing space
	if (fixTrailing && fixed.endsWith(' ') && !fixed.endsWith('  ')) {
		fixed = fixed.slice(0, -1);
	}

	return fixed;
};

const getFixableArguments = (context, node) => {
	const {
		arguments: args
	} = node;

	const fixables = args.map((nodeArgument, i) => {
		const fixLeading = i !== 0;
		const fixTrailing = i !== (args.length - 1);

		const value = getArgumentValue(context, nodeArgument);
		const fixed = fixValue(value, {fixLeading, fixTrailing});

		return {
			nodeArgument,
			value,
			fixed,
			fixable: value !== fixed
		};
	});

	return fixables.filter(fixable => fixable.fixable);
};

const fixArg = (context, fixable, fixer) => {
	const {
		nodeArgument,
		fixed
	} = fixable;

	// Ignore quotes and backticks
	const range = [
		nodeArgument.range[0] + 1,
		nodeArgument.range[1] - 1
	];

	return fixer.replaceTextRange(range, fixed);
};

const buildErrorMessage = method => {
	return `Do not use leading/trailing space between \`console.${method}\` parameters.`;
};

const create = context => {
	return {
		CallExpression(node) {
			const method = getConsoleMethod(node);
			if (!method) {
				return;
			}

			const fixables = getFixableArguments(context, node);
			for (const fixable of fixables) {
				context.report({
					node: fixable.nodeArgument,
					message: buildErrorMessage(method),
					fix: fixer => fixArg(context, fixable, fixer)
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
