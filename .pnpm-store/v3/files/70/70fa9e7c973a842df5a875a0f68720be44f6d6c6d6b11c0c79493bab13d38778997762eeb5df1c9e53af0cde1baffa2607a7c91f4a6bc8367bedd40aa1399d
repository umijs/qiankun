'use strict';
const getDocsUrl = require('./utils/get-docs-url');
const domEventsJson = require('./utils/dom-events.json');

const nestedEvents = Object.keys(domEventsJson).map(key => domEventsJson[key]);
const eventTypes = new Set(nestedEvents.reduce((accEvents, events) => accEvents.concat(events), []));
const getEventMethodName = memberExpression => memberExpression.property.name;
const getEventTypeName = eventMethodName => eventMethodName.slice('on'.length);

const beforeUnloadMessage = 'Use `event.preventDefault(); event.returnValue = \'foo\'` to trigger the prompt.';

const formatMessage = (methodReplacement, eventMethodName, extra) => {
	let message = `Prefer \`${methodReplacement}\` over \`${eventMethodName}\`.`;

	if (extra) {
		message += ' ' + extra;
	}

	return message;
};

const fix = (fixer, sourceCode, assignmentNode, memberExpression) => {
	const eventTypeName = getEventTypeName(getEventMethodName(memberExpression));
	const eventObjectCode = sourceCode.getText(memberExpression.object);
	const fncCode = sourceCode.getText(assignmentNode.right);
	const fixedCodeStatement = `${eventObjectCode}.addEventListener('${eventTypeName}', ${fncCode})`;
	return fixer.replaceText(assignmentNode, fixedCodeStatement);
};

const shouldFixBeforeUnload = (assignedExpression, nodeReturnsSomething) => {
	if (
		assignedExpression.type !== 'ArrowFunctionExpression' &&
		assignedExpression.type !== 'FunctionExpression'
	) {
		return false;
	}

	if (assignedExpression.body.type !== 'BlockStatement') {
		return false;
	}

	return !nodeReturnsSomething.get(assignedExpression);
};

const isClearing = node => {
	if (node.type === 'Literal') {
		return node.raw === 'null';
	}

	if (node.type === 'Identifier') {
		return node.name === 'undefined';
	}

	return false;
};

const create = context => {
	const options = context.options[0] || {};
	const excludedPackages = new Set(options.excludedPackages || ['koa', 'sax']);
	let isDisabled;

	const nodeReturnsSomething = new WeakMap();
	let codePathInfo = null;

	return {
		onCodePathStart(codePath, node) {
			codePathInfo = {
				node,
				upper: codePathInfo,
				returnsSomething: false
			};
		},

		onCodePathEnd() {
			nodeReturnsSomething.set(codePathInfo.node, codePathInfo.returnsSomething);
			codePathInfo = codePathInfo.upper;
		},

		'CallExpression[callee.name="require"] > Literal'(node) {
			if (!isDisabled && excludedPackages.has(node.value)) {
				isDisabled = true;
			}
		},

		'ImportDeclaration > Literal'(node) {
			if (!isDisabled && excludedPackages.has(node.value)) {
				isDisabled = true;
			}
		},

		ReturnStatement(node) {
			codePathInfo.returnsSomething = codePathInfo.returnsSomething || Boolean(node.argument);
		},

		'AssignmentExpression:exit'(node) {
			if (isDisabled) {
				return;
			}

			const {left: memberExpression, right: assignedExpression} = node;

			if (memberExpression.type !== 'MemberExpression') {
				return;
			}

			const eventMethodName = getEventMethodName(memberExpression);

			if (!eventMethodName || !eventMethodName.startsWith('on')) {
				return;
			}

			const eventTypeName = getEventTypeName(eventMethodName);

			if (!eventTypes.has(eventTypeName)) {
				return;
			}

			if (isClearing(assignedExpression)) {
				context.report({
					node,
					message: formatMessage('removeEventListener', eventMethodName)
				});
			} else if (eventTypeName === 'beforeunload' &&
				!shouldFixBeforeUnload(assignedExpression, nodeReturnsSomething)
			) {
				context.report({
					node,
					message: formatMessage('addEventListener', eventMethodName, beforeUnloadMessage)
				});
			} else {
				context.report({
					node,
					message: formatMessage('addEventListener', eventMethodName),
					fix: fixer => fix(fixer, context.getSourceCode(), node, memberExpression)
				});
			}
		}
	};
};

const schema = [
	{
		type: 'object',
		properties: {
			excludedPackages: {
				type: 'array',
				items: {
					type: 'string'
				},
				uniqueItems: true
			}
		},
		additionalProperties: false
	}
];

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
