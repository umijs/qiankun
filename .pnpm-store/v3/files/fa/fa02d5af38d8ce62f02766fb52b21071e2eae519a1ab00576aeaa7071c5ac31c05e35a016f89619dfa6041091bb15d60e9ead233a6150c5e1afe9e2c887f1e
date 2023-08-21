'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const getDeclaratorOrPropertyValue = declaratorOrProperty => {
	return declaratorOrProperty.init || declaratorOrProperty.value;
};

const isMemberExpressionCall = memberExpression => {
	return memberExpression.parent &&
		memberExpression.parent.type === 'CallExpression' &&
		memberExpression.parent.callee === memberExpression;
};

const isMemberExpressionAssignment = memberExpression => {
	return memberExpression.parent &&
		memberExpression.parent.type === 'AssignmentExpression';
};

const isMemberExpressionComputedBeyondPrediction = memberExpression => {
	return memberExpression.computed &&
		(memberExpression.property.type !== 'Literal');
};

const specialProtoPropertyKey = {
	type: 'Identifier',
	name: '__proto__'
};

const propertyKeysEqual = (keyA, keyB) => {
	if (keyA.type === 'Identifier') {
		if (keyB.type === 'Identifier') {
			return keyA.name === keyB.name;
		}

		if (keyB.type === 'Literal') {
			return keyA.name === keyB.value;
		}
	}

	if (keyA.type === 'Literal') {
		if (keyB.type === 'Identifier') {
			return keyA.value === keyB.name;
		}

		if (keyB.type === 'Literal') {
			return keyA.value === keyB.value;
		}
	}

	return false;
};

const objectPatternMatchesObjectExprPropertyKey = (pattern, key) => {
	return pattern.properties.some(property => {
		if (property.type === 'ExperimentalRestProperty') {
			return true;
		}

		return propertyKeysEqual(property.key, key);
	});
};

const isLeafDeclaratorOrProperty = declaratorOrProperty => {
	const value = getDeclaratorOrPropertyValue(declaratorOrProperty);

	if (!value) {
		return true;
	}

	if (value.type !== 'ObjectExpression') {
		return true;
	}

	return false;
};

const isUnusedVariable = variable => {
	const hasReadRef = variable.references.some(ref => ref.isRead());
	return !hasReadRef;
};

const create = context => {
	const getPropertyDisplayName = property => {
		if (property.key.type === 'Identifier') {
			return property.key.name;
		}

		if (property.key.type === 'Literal') {
			return property.key.value;
		}

		return context.getSource(property.key);
	};

	const checkProperty = (property, references, path) => {
		if (references.length === 0) {
			context.report({
				node: property,
				message: 'Property `{{name}}` is defined but never used.',
				data: {
					name: getPropertyDisplayName(property)
				}
			});
			return;
		}

		checkObject(property, references, path);
	};

	const checkProperties = (objectExpression, references, path = []) => {
		objectExpression.properties.forEach(property => {
			const {key} = property;

			if (!key) {
				return;
			}

			if (propertyKeysEqual(key, specialProtoPropertyKey)) {
				return;
			}

			const nextPath = path.concat(key);

			const nextReferences = references
				.map(reference => {
					const {parent} = reference.identifier;

					if (reference.init) {
						if (
							parent.type === 'VariableDeclarator' &&
							parent.parent.type === 'VariableDeclaration' &&
							parent.parent.parent.type === 'ExportNamedDeclaration'
						) {
							return {identifier: parent};
						}

						return null;
					}

					if (parent.type === 'MemberExpression') {
						if (
							isMemberExpressionAssignment(parent) ||
							isMemberExpressionCall(parent) ||
							isMemberExpressionComputedBeyondPrediction(parent) ||
							propertyKeysEqual(parent.property, key)
						) {
							return {identifier: parent};
						}

						return null;
					}

					if (
						parent.type === 'VariableDeclarator' &&
						parent.id.type === 'ObjectPattern'
					) {
						if (objectPatternMatchesObjectExprPropertyKey(parent.id, key)) {
							return {identifier: parent};
						}

						return null;
					}

					if (
						parent.type === 'AssignmentExpression' &&
						parent.left.type === 'ObjectPattern'
					) {
						if (objectPatternMatchesObjectExprPropertyKey(parent.left, key)) {
							return {identifier: parent};
						}

						return null;
					}

					return reference;
				})
				.filter(Boolean);

			checkProperty(property, nextReferences, nextPath);
		});
	};

	const checkObject = (declaratorOrProperty, references, path) => {
		if (isLeafDeclaratorOrProperty(declaratorOrProperty)) {
			return;
		}

		const value = getDeclaratorOrPropertyValue(declaratorOrProperty);

		checkProperties(value, references, path);
	};

	const checkVariable = variable => {
		if (variable.defs.length !== 1) {
			return;
		}

		if (isUnusedVariable(variable)) {
			return;
		}

		const [definition] = variable.defs;

		checkObject(definition.node, variable.references);
	};

	const checkVariables = scope => {
		scope.variables.forEach(checkVariable);
	};

	const checkChildScopes = scope => {
		scope.childScopes.forEach(checkScope);
	};

	const checkScope = scope => {
		if (scope.type === 'global') {
			return checkChildScopes(scope);
		}

		checkVariables(scope);

		return checkChildScopes(scope);
	};

	return {
		'Program:exit'() {
			checkScope(context.getScope());
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
