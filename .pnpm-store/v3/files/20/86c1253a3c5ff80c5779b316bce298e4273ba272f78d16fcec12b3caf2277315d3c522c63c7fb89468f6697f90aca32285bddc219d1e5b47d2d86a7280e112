'use strict';

const stylelintConfigPrettier = require('./index');
const stylelint = require('stylelint');
const { resolve } = require('path');

function check(path) {
	const resolvedPath = resolve(process.cwd(), path || '');

	return stylelint
		.createLinter()
		.getConfigForFile(resolvedPath)
		.then((config) => {
			const prettierRules = stylelintConfigPrettier.rules;
			const configRules = config.config.rules;
			const conflictingRules = [];

			Object.keys(prettierRules).forEach((rule) => {
				if (
					configRules.hasOwnProperty(rule) &&
					configRules[rule] !== null &&
					configRules[rule][0] !== prettierRules[rule]
				) {
					conflictingRules.push(rule);
				}
			});

			return conflictingRules.length ? conflictingRules : null;
		});
}

exports.check = check;
