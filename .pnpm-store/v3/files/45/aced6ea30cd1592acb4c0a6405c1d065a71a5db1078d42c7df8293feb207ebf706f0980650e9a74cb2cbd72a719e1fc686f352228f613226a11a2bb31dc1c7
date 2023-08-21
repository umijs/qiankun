'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const isLiteralValue = value => node => node && node.type === 'Literal' && node.value === value;
const isLiteralZero = isLiteralValue(0);
const isLiteralOne = isLiteralValue(1);

const isIdentifierWithName = (node, name) => node && node.type === 'Identifier' && node.name === name;

const getIndexIdentifierName = forStatement => {
	const {init: variableDeclaration} = forStatement;

	if (!variableDeclaration || variableDeclaration.type !== 'VariableDeclaration') {
		return;
	}

	if (variableDeclaration.declarations.length !== 1) {
		return;
	}

	const [variableDeclarator] = variableDeclaration.declarations;

	if (!isLiteralZero(variableDeclarator.init)) {
		return;
	}

	if (variableDeclarator.id.type !== 'Identifier') {
		return;
	}

	return variableDeclarator.id.name;
};

const getStrictComparisonOperands = binaryExpression => {
	if (binaryExpression.operator === '<') {
		return {
			lesser: binaryExpression.left,
			greater: binaryExpression.right
		};
	}

	if (binaryExpression.operator === '>') {
		return {
			lesser: binaryExpression.right,
			greater: binaryExpression.left
		};
	}
};

const getArrayIdentifierNameFromBinaryExpression = (binaryExpression, indexIdentifierName) => {
	const operands = getStrictComparisonOperands(binaryExpression);

	if (!operands) {
		return;
	}

	const {lesser, greater} = operands;

	if (!isIdentifierWithName(lesser, indexIdentifierName)) {
		return;
	}

	if (greater.type !== 'MemberExpression') {
		return;
	}

	if (greater.object.type !== 'Identifier' || greater.property.type !== 'Identifier') {
		return;
	}

	if (greater.property.name !== 'length') {
		return;
	}

	return greater.object.name;
};

const getArrayIdentifierName = (forStatement, indexIdentifierName) => {
	const {test} = forStatement;

	if (!test || test.type !== 'BinaryExpression') {
		return;
	}

	return getArrayIdentifierNameFromBinaryExpression(test, indexIdentifierName);
};

const isMatchingMemberExpression = (memberExpression, objectIdentifierName, propertyIdentifierName) => {
	if (!memberExpression || memberExpression.type !== 'MemberExpression') {
		return false;
	}

	const {object, property} = memberExpression;

	return isIdentifierWithName(object, objectIdentifierName) &&
		isIdentifierWithName(property, propertyIdentifierName);
};

const getElementIdentifierInfo = (forStatement, arrayIdentifierName, indexIdentifierName) => {
	const {body} = forStatement;

	if (!body ||
		body.type !== 'BlockStatement'
	) {
		return;
	}

	const [elementVariableDeclaration] = body.body;

	if (!elementVariableDeclaration ||
		elementVariableDeclaration.type !== 'VariableDeclaration'
	) {
		return;
	}

	if (elementVariableDeclaration.declarations.length !== 1) {
		return;
	}

	const [elementVariableDeclarator] = elementVariableDeclaration.declarations;

	if (elementVariableDeclarator.id.type !== 'Identifier') {
		return;
	}

	if (!isMatchingMemberExpression(elementVariableDeclarator.init, arrayIdentifierName, indexIdentifierName)) {
		return;
	}

	return {
		elementVariableDeclaration,
		elementIdentifierName: elementVariableDeclarator.id.name
	};
};

const isLiteralOnePlusIdentifierWithName = (node, identifierName) => {
	if (node && node.type === 'BinaryExpression' && node.operator === '+') {
		return (isIdentifierWithName(node.left, identifierName) && isLiteralOne(node.right)) ||
			(isIdentifierWithName(node.right, identifierName) && isLiteralOne(node.left));
	}

	return false;
};

const checkUpdateExpression = (forStatement, indexIdentifierName) => {
	const {update} = forStatement;

	if (!update) {
		return false;
	}

	if (update.type === 'UpdateExpression') {
		return update.operator === '++' && isIdentifierWithName(update.argument, indexIdentifierName);
	}

	if (update.type === 'AssignmentExpression' && isIdentifierWithName(update.left, indexIdentifierName)) {
		if (update.operator === '+=') {
			return isLiteralOne(update.right);
		}

		if (update.operator === '=') {
			return isLiteralOnePlusIdentifierWithName(update.right, indexIdentifierName);
		}
	}

	return false;
};

const getRemovalRange = (node, sourceCode) => {
	const nodeText = sourceCode.getText(node);
	const {line} = sourceCode.getLocFromIndex(node.range[0]);
	const lineText = sourceCode.lines[line - 1];

	const isOnlyNodeOnItsLine = lineText.trim() === nodeText;
	if (isOnlyNodeOnItsLine) {
		return [
			sourceCode.getIndexFromLoc({line, column: 0}),
			sourceCode.getIndexFromLoc({line: line + 1, column: 0})
		];
	}

	return node.range;
};

const resolveIdentifierName = (name, scope) => {
	while (scope) {
		const variable = scope.set.get(name);

		if (variable) {
			return variable;
		}

		scope = scope.upper;
	}

	return undefined;
};

const scopeContains = (ancestor, descendant) => {
	while (descendant) {
		if (descendant === ancestor) {
			return true;
		}

		descendant = descendant.upper;
	}

	return false;
};

const nodeContains = (ancestor, descendant) => {
	while (descendant) {
		if (descendant === ancestor) {
			return true;
		}

		descendant = descendant.parent;
	}

	return false;
};

const isIndexVariableUsedElsewhereInTheLoopBody = (indexVariable, bodyScope) => {
	const inBodyReferences = indexVariable.references.filter(reference => scopeContains(bodyScope, reference.from));

	// One reference in the body would be the one in the element variable declaration like `const el = arr[i]`.
	// Any reference besides that should retain the index variable.
	return inBodyReferences.length > 1;
};

const isIndexVariableAssignedToInTheLoopBody = (indexVariable, bodyScope) => {
	return indexVariable.references
		.filter(reference => scopeContains(bodyScope, reference.from))
		.some(inBodyReference => inBodyReference.isWrite());
};

const someVariablesLeakOutOfTheLoop = (forStatement, variables, forScope) => {
	return variables.some(variable => {
		return !variable.references.every(reference => {
			return scopeContains(forScope, reference.from) ||
				nodeContains(forStatement, reference.identifier);
		});
	});
};

const create = context => {
	const sourceCode = context.getSourceCode();
	const {scopeManager} = sourceCode;

	return {
		ForStatement(node) {
			const indexIdentifierName = getIndexIdentifierName(node);

			if (!indexIdentifierName) {
				return;
			}

			const arrayIdentifierName = getArrayIdentifierName(node, indexIdentifierName);

			if (!arrayIdentifierName) {
				return;
			}

			if (!checkUpdateExpression(node, indexIdentifierName)) {
				return;
			}

			const elementIdentifierInfo = getElementIdentifierInfo(node, arrayIdentifierName, indexIdentifierName);

			if (!elementIdentifierInfo) {
				return;
			}

			const {elementIdentifierName, elementVariableDeclaration} = elementIdentifierInfo;

			const problem = {
				node,
				message: 'Use a `for-of` loop instead of this `for` loop.'
			};

			const forScope = scopeManager.acquire(node);
			const bodyScope = scopeManager.acquire(node.body);

			const indexVariable = resolveIdentifierName(indexIdentifierName, bodyScope);
			const elementVariable = resolveIdentifierName(elementIdentifierName, bodyScope);

			const shouldFix = !someVariablesLeakOutOfTheLoop(node, [indexVariable, elementVariable], forScope) &&
				!isIndexVariableAssignedToInTheLoopBody(indexVariable, bodyScope);

			if (shouldFix) {
				problem.fix = fixer => {
					const shouldGenerateIndex = isIndexVariableUsedElsewhereInTheLoopBody(indexVariable, bodyScope);

					const index = indexIdentifierName;
					const element = elementIdentifierName;
					const array = arrayIdentifierName;

					const replacement = shouldGenerateIndex ?
						`const [${index}, ${element}] of ${array}.entries()` :
						`const ${element} of ${array}`;

					return [
						fixer.replaceTextRange([
							node.init.range[0],
							node.update.range[1]
						], replacement),

						fixer.removeRange(getRemovalRange(elementVariableDeclaration, sourceCode))
					];
				};
			}

			context.report(problem);
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
