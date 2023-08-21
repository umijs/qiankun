'use strict';
const reservedWords = require('reserved-words');
const resolveVariableName = require('./resolve-variable-name');

const indexifyName = (name, index) => name + '_'.repeat(index);

const scopeHasArgumentsSpecial = scope => {
	while (scope) {
		if (scope.taints.get('arguments')) {
			return true;
		}

		scope = scope.upper;
	}

	return false;
};

const someScopeHasVariableName = (name, scopes) => scopes.some(scope => resolveVariableName(name, scope));

const someScopeIsStrict = scopes => scopes.some(scope => scope.isStrict);

const nameCollidesWithArgumentsSpecial = (name, scopes, isStrict) => {
	if (name !== 'arguments') {
		return false;
	}

	return isStrict || scopes.some(scopeHasArgumentsSpecial);
};

const isSafeName = (name, scopes, ecmaVersion, isStrict) => {
	ecmaVersion = Math.min(6, ecmaVersion); // 6 is the latest version understood by `reservedWords`

	return !someScopeHasVariableName(name, scopes) &&
		!reservedWords.check(name, ecmaVersion, isStrict) &&
		!nameCollidesWithArgumentsSpecial(name, scopes, isStrict);
};

const alwaysTrue = () => true;

/**
 * Rule-specific name check function
 *
 * @callback isSafe
 * @param {string} indexifiedName - The generated candidate name.
 * @param {Scope[]} scopes - The same list of scopes you pass to `avoidCapture`.
 * @return {boolean} - `true` if the `indexifiedName` is ok.
 */

/**
 * Generates a unique name prefixed with `name` such that:
 * - it is not defined in any of the `scopes`,
 * - it is not a reserved word,
 * - it is not `arguments` in strict scopes (where `arguments` is not allowed),
 * - it does not collide with the actual `arguments` (which is always defined in function scopes).
 *
 * Useful when you want to rename a variable (or create a new variable)
 * while being sure not to shadow any other variables in the code.
 *
 * @param {string} name - The desired name for a new variable.
 * @param {Scope[]} scopes - The list of scopes the new variable will be referenced in.
 * @param {number} ecmaVersion - The language version, get it from `context.parserOptions.ecmaVersion`.
 * @param {isSafe} [isSafe] - Rule-specific name check function.
 * @returns {string} - Either `name` as is, or a string like `${name}_` suffixed with undescores to make the name unique.
 */
module.exports = (name, scopes, ecmaVersion, isSafe = alwaysTrue) => {
	const isStrict = someScopeIsStrict(scopes);

	let index = 0;
	let indexifiedName = indexifyName(name, index);
	while (!isSafeName(indexifiedName, scopes, ecmaVersion, isStrict) || !isSafe(indexifiedName, scopes)) {
		index++;
		indexifiedName = indexifyName(name, index);
	}

	return indexifiedName;
};
