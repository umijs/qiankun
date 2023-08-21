'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const MESSAGE_ZERO_FRACTION = 'Don\'t use a zero fraction in the number.';
const MESSAGE_DANGLING_DOT = 'Don\'t use a dangling dot in the number.';

// Groups:
// 1. Integer part
// 2. Dangling dot or dot with zeroes
// 3. Dot with digits except last zeroes
// 4. Scientific notation
const RE_DANGLINGDOT_OR_ZERO_FRACTIONS = /^([+-]?\d*)(?:(\.0*)|(\.\d*[1-9])0+)(e[+-]?\d+)?$/; // TODO: Possibly use named capture groups when targeting Node.js 10

const create = context => {
	return {
		Literal: node => {
			if (typeof node.value !== 'number') {
				return;
			}

			const match = RE_DANGLINGDOT_OR_ZERO_FRACTIONS.exec(node.raw);
			if (match === null) {
				return;
			}

			const [, integerPart, dotAndZeroes, dotAndDigits, scientificNotationSuffix] = match;
			const isDanglingDot = dotAndZeroes === '.';

			context.report({
				node,
				message: isDanglingDot ? MESSAGE_DANGLING_DOT : MESSAGE_ZERO_FRACTION,
				fix: fixer => {
					let wantedString = dotAndZeroes === undefined ? integerPart + dotAndDigits : integerPart;

					if (scientificNotationSuffix !== undefined) {
						wantedString += scientificNotationSuffix;
					}

					return fixer.replaceText(node, wantedString);
				}
			});
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
