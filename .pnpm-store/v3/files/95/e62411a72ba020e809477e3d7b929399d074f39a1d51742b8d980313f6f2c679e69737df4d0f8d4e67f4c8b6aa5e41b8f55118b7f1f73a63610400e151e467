'use strict';
const astUtils = require('eslint-ast-utils');
const getDocsUrl = require('./utils/get-docs-url');

// Matches `someObj.then([FunctionExpression | ArrowFunctionExpression])`
function isLintablePromiseCatch(node) {
	const {callee} = node;

	if (callee.type !== 'MemberExpression') {
		return false;
	}

	const {property} = callee;

	if (property.type !== 'Identifier' || property.name !== 'catch') {
		return false;
	}

	if (node.arguments.length === 0) {
		return false;
	}

	const [arg0] = node.arguments;

	return arg0.type === 'FunctionExpression' || arg0.type === 'ArrowFunctionExpression';
}

// TODO: Use `./utils/avoid-capture.js` instead
function indexifyName(name, scope) {
	const variables = scope.variableScope.set;

	let index = 1;
	while (variables.has(index === 1 ? name : name + index)) {
		index++;
	}

	return name + (index === 1 ? '' : index);
}

const create = context => {
	const options = Object.assign({}, {
		name: 'error',
		caughtErrorsIgnorePattern: '^_$'
	}, context.options[0]);

	const {scopeManager} = context.getSourceCode();

	const {name} = options;
	const caughtErrorsIgnorePattern = new RegExp(options.caughtErrorsIgnorePattern);
	const stack = [];

	function push(value) {
		if (stack.length === 1) {
			stack[0] = true;
		}

		stack.push(stack.length > 0 || value);
	}

	function popAndReport(node, scopeNode) {
		const value = stack.pop();

		if (value !== true && !caughtErrorsIgnorePattern.test(node.name)) {
			const expectedName = value || name;
			const problem = {
				node,
				message: `The catch parameter should be named \`${expectedName}\`.`
			};

			if (node.type === 'Identifier') {
				problem.fix = fixer => {
					const fixings = [fixer.replaceText(node, expectedName)];

					const scope = scopeManager.acquire(scopeNode);
					const variable = scope.set.get(node.name);
					for (const reference of variable.references) {
						fixings.push(fixer.replaceText(reference.identifier, expectedName));
					}

					return fixings;
				};
			}

			context.report(problem);
		}
	}

	return {
		CallExpression: node => {
			if (isLintablePromiseCatch(node)) {
				const {params} = node.arguments[0];

				if (params.length > 0 && params[0].name === '_') {
					push(!astUtils.containsIdentifier('_', node.arguments[0].body));
					return;
				}

				const errName = indexifyName(name, context.getScope());
				push(params.length === 0 || params[0].name === errName || errName);
			}
		},
		'CallExpression:exit': node => {
			if (isLintablePromiseCatch(node)) {
				const callbackNode = node.arguments[0];
				popAndReport(callbackNode.params[0], callbackNode);
			}
		},
		CatchClause: node => {
			// Optional catch binding
			if (!node || !node.param) {
				push(true);
				return;
			}

			if (node.param.name === '_') {
				push(!astUtils.someContainIdentifier('_', node.body.body));
				return;
			}

			const errName = indexifyName(name, context.getScope());
			push(node.param.name === errName || errName);
		},
		'CatchClause:exit': node => {
			popAndReport(node.param, node);
		}
	};
};

const schema = [{
	type: 'object',
	properties: {
		name: {
			type: 'string'
		},
		caughtErrorsIgnorePattern: {
			type: 'string'
		}
	}
}];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: getDocsUrl(__filename)
		},
		fixable: 'code',
		schema
	}
};
