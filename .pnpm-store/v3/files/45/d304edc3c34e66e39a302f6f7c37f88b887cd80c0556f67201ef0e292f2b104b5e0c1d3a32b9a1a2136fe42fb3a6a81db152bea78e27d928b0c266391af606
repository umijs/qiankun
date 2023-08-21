'use strict';

function introduces(name, node) { // eslint-disable-line complexity
	if (!node) {
		return false;
	}
	switch (node.type) {
		case 'Identifier':
			return node.name === name;
		case 'FunctionDeclaration':
			return introduces(name, node.id) ||
				someIntroduce(name, node.params);
		case 'ArrowFunctionExpression':
			return someIntroduce(name, node.params);
		case 'FunctionExpression':
			return someIntroduce(name, node.params);
		case 'BlockStatement':
			return someIntroduce(name, node.body);
		case 'VariableDeclaration':
			return someIntroduce(name, node.declarations);
		case 'VariableDeclarator':
			return introduces(name, node.id);
		case 'ObjectPattern':
			return someIntroduce(name, node.properties);
		case 'ArrayPattern':
			return someIntroduce(name, node.elements);
		case 'Property':
			return introduces(name, node.value);
		case 'ExperimentalRestProperty':
			return introduces(name, node.argument);
		case 'ForStatement':
			return introduces(name, node.init);
		case 'ClassDeclaration':
			return introduces(name, node.id);
		case 'RestElement':
			return introduces(name, node.argument);
		case 'Program':
			return someIntroduce(name, node.body);
		case 'ImportDeclaration':
			return someIntroduce(name, node.specifiers);
		case 'ImportDefaultSpecifier':
			return introduces(name, node.local);
		case 'ImportSpecifier':
			return introduces(name, node.local);
		case 'ImportNamespaceSpecifier':
			return introduces(name, node.local);
		default:
			return false;
	}
}

function someIntroduce(name, array) {
	return Array.isArray(array) && array.some(item => {
		return introduces(name, item);
	});
}

function containsIdentifier(name, node) { // eslint-disable-line complexity
	if (!node) {
		return false;
	}
	switch (node.type) {
		// Primitives
		case 'Identifier':
			return node.name === name;
		case 'Literal':
			return false;
		case 'ThisExpression':
			return false;

		// Objects / Arrays
		case 'ArrayExpression':
			return someContainIdentifier(name, node.elements);
		case 'ObjectExpression':
			return someContainIdentifier(name, node.properties);
		case 'ExperimentalSpreadProperty':
			return containsIdentifier(name, node.argument);
		case 'Property':
			return (node.computed && containsIdentifier(name, node.key)) ||
				containsIdentifier(name, node.value);

		// Expressions
		case 'TemplateLiteral':
			return someContainIdentifier(name, node.expressions);
		case 'TaggedTemplateExpression':
			return containsIdentifier(name, node.tag) || containsIdentifier(name, node.quasi);
		case 'SequenceExpression':
			return someContainIdentifier(name, node.expressions);
		case 'CallExpression':
			return containsIdentifier(name, node.callee) ||
				someContainIdentifier(name, node.arguments);
		case 'NewExpression':
			return containsIdentifier(name, node.callee) ||
				someContainIdentifier(name, node.arguments);
		case 'MemberExpression':
			if (node.computed === false) {
				return containsIdentifier(name, node.object);
			}
			return containsIdentifier(name, node.property) ||
				containsIdentifier(name, node.object);
		case 'ConditionalExpression':
			return containsIdentifier(name, node.test) ||
				containsIdentifier(name, node.consequent) ||
				containsIdentifier(name, node.alternate);
		case 'BinaryExpression':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right);
		case 'LogicalExpression':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right);
		case 'AssignmentExpression':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right);
		case 'UpdateExpression':
			return containsIdentifier(name, node.argument);
		case 'UnaryExpression':
			return containsIdentifier(name, node.argument);
		case 'YieldExpression':
			return containsIdentifier(name, node.argument);
		case 'AwaitExpression':
			return containsIdentifier(name, node.argument);
		case 'ArrowFunctionExpression':
			if (node.params.some(param => param.type !== 'Identifier' && containsIdentifier(name, param))) {
				return true;
			}
			return !introduces(name, node) && containsIdentifier(name, node.body);
		case 'FunctionExpression':
			if (node.params.some(param => param.type !== 'Identifier' && containsIdentifier(name, param))) {
				return true;
			}
			return !introduces(name, node) && containsIdentifier(name, node.body);
		case 'SpreadElement':
			return containsIdentifier(name, node.argument);

		// Statements / control flow
		case 'ExpressionStatement':
			return containsIdentifier(name, node.expression);
		case 'ReturnStatement':
			return containsIdentifier(name, node.argument);
		case 'ThrowStatement':
			return containsIdentifier(name, node.argument);
		case 'IfStatement':
			return containsIdentifier(name, node.test) ||
				containsIdentifier(name, node.consequent) ||
				containsIdentifier(name, node.alternate);
		case 'BreakStatement':
			return false;
		case 'ContinueStatement':
			return false;
		case 'ForOfStatement':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right) ||
				containsIdentifier(name, node.body);
		case 'ForInStatement':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right) ||
				containsIdentifier(name, node.body);
		case 'ForStatement':
			return !introduces(name, node) && (
				containsIdentifier(name, node.init) ||
				containsIdentifier(name, node.test) ||
				containsIdentifier(name, node.update) ||
				containsIdentifier(name, node.body)
			);
		case 'WhileStatement':
			return containsIdentifier(name, node.test) ||
				containsIdentifier(name, node.body);
		case 'DoWhileStatement':
			return containsIdentifier(name, node.test) ||
				containsIdentifier(name, node.body);
		case 'Program':
			return !introduces(name, node) && someContainIdentifier(name, node.body);
		case 'BlockStatement':
			return !introduces(name, node) && someContainIdentifier(name, node.body);
		case 'TryStatement':
			return containsIdentifier(name, node.block) ||
				containsIdentifier(name, node.handler) ||
				containsIdentifier(name, node.finalizer);
		case 'CatchClause':
			return !introduces(name, node.param) && containsIdentifier(name, node.body);
		case 'SwitchStatement':
			return containsIdentifier(name, node.discriminant) || someContainIdentifier(name, node.cases);
		case 'SwitchCase':
			return containsIdentifier(name, node.test) || someContainIdentifier(name, node.consequent);
		case 'LabeledStatement':
			return containsIdentifier(name, node.body);
		case 'DebuggerStatement':
			return false;
		case 'EmptyStatement':
			return false;

		// Assignment / Declaration
		case 'AssignmentPattern':
			return containsIdentifier(name, node.left) ||
				containsIdentifier(name, node.right);
		case 'VariableDeclarator':
			if (node.id.type !== 'Identifier') {
				return containsIdentifier(name, node.id) ||
					containsIdentifier(name, node.init);
			}
			return containsIdentifier(name, node.init);
		case 'ObjectPattern':
			return node.properties.some(prop =>
				prop.type === 'Property' && prop.value.type !== 'Identifier' && containsIdentifier(name, prop.value)
			);
		case 'FunctionDeclaration':
			if (node.params.some(param => param.type !== 'Identifier' && containsIdentifier(name, param))) {
				return true;
			}
			return !introduces(name, node) && containsIdentifier(name, node.body);
		case 'ArrayPattern':
			return node.elements.some(item => {
				return item && item.type !== 'Identifier' && containsIdentifier(name, item);
			});
		case 'VariableDeclaration':
			return someContainIdentifier(name, node.declarations);
		case 'RestElement':
			return false;

		// Classes
		case 'ClassDeclaration':
			return !introduces(name, node) && (
				containsIdentifier(name, node.superClass) ||
				containsIdentifier(name, node.body)
			);
		case 'ClassExpression':
			return containsIdentifier(name, node.superClass) ||
				containsIdentifier(name, node.body);
		case 'ClassBody':
			return someContainIdentifier(name, node.body);
		case 'MethodDefinition':
			return containsIdentifier(name, node.value);
		case 'Super':
			return false;

		// Import / export
		case 'ImportDeclaration':
			return false;
		case 'ExportDefaultDeclaration':
			return containsIdentifier(name, node.declaration);
		case 'ExportNamedDeclaration':
			return containsIdentifier(name, node.declaration);

		// JSX
		case 'JSXIdentifier':
			return node.name === name;
		case 'JSXElement':
			return containsIdentifier(name, node.openingElement) ||
				someContainIdentifier(name, node.children);
		case 'JSXOpeningElement':
			return containsIdentifier(name, node.name) ||
				someContainIdentifier(name, node.attributes);
		case 'JSXExpressionContainer':
			return containsIdentifier(name, node.expression);
		case 'JSXSpreadAttribute':
			return containsIdentifier(name, node.argument);
		case 'JSXAttribute':
			return containsIdentifier(name, node.value);

		default:
			return false;
	}
}

function someContainIdentifier(name, array) {
	return Array.isArray(array) && array.some(item => {
		return containsIdentifier(name, item);
	});
}

module.exports = {
	containsIdentifier,
	someContainIdentifier
};
