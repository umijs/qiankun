'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const tcIdentifiers = new Set([
	'isArguments',
	'isArray',
	'isArrayBuffer',
	'isArrayLike',
	'isArrayLikeObject',
	'isBoolean',
	'isBuffer',
	'isDate',
	'isElement',
	'isError',
	'isFinite',
	'isFunction',
	'isInteger',
	'isLength',
	'isMap',
	'isNaN',
	'isNative',
	'isNil',
	'isNull',
	'isNumber',
	'isObject',
	'isObjectLike',
	'isPlainObject',
	'isPrototypeOf',
	'isRegExp',
	'isSafeInteger',
	'isSet',
	'isString',
	'isSymbol',
	'isTypedArray',
	'isUndefined',
	'isView',
	'isWeakMap',
	'isWeakSet',
	'isWindow',
	'isXMLDoc'
]);

const tcGlobalIdentifiers = new Set([
	'isNaN',
	'isFinite'
]);

const isTypecheckingIdentifier = (node, callExpression, isMemberExpression) =>
	callExpression !== undefined &&
	callExpression.arguments.length > 0 &&
	node.type === 'Identifier' &&
	((isMemberExpression === true &&
	tcIdentifiers.has(node.name)) ||
	(isMemberExpression === false &&
	tcGlobalIdentifiers.has(node.name)));

const throwsErrorObject = node =>
	node.argument.type === 'NewExpression' &&
	node.argument.callee.type === 'Identifier' &&
	node.argument.callee.name === 'Error';

const isLone = node => node.parent && node.parent.body && node.parent.body.length === 1;

const isTypecheckingMemberExpression = (node, callExpression) => {
	if (isTypecheckingIdentifier(node.property, callExpression, true)) {
		return true;
	}

	if (node.object.type === 'MemberExpression') {
		return isTypecheckingMemberExpression(node.object, callExpression);
	}

	return false;
};

const isTypecheckingExpression = (node, callExpression) => {
	switch (node.type) {
		case 'Identifier':
			return isTypecheckingIdentifier(node, callExpression, false);
		case 'MemberExpression':
			return isTypecheckingMemberExpression(node, callExpression);
		case 'CallExpression':
			return isTypecheckingExpression(node.callee, node);
		case 'UnaryExpression':
			return node.operator === 'typeof' ||
				(node.operator === '!' &&
				isTypecheckingExpression(node.argument));
		case 'BinaryExpression':
			return node.operator === 'instanceof' ||
				isTypecheckingExpression(node.left, callExpression) ||
				isTypecheckingExpression(node.right, callExpression);
		case 'LogicalExpression':
			return isTypecheckingExpression(node.left, callExpression) &&
				isTypecheckingExpression(node.right, callExpression);
		default:
			return false;
	}
};

const isTypechecking = node => node.type === 'IfStatement' && isTypecheckingExpression(node.test);

const create = context => {
	return {
		ThrowStatement: node => {
			if (throwsErrorObject(node) &&
				isLone(node) &&
				node.parent.parent &&
				isTypechecking(node.parent.parent)) {
				context.report({
					node,
					message: '`new Error()` is too unspecific for a type check. Use `new TypeError()` instead.',
					fix: fixer => fixer.replaceText(node.argument.callee, 'TypeError')
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
