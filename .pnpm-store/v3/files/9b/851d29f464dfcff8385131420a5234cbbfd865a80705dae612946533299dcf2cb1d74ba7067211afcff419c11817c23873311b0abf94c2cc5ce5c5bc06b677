'use strict';
const path = require('path');
const pkg = require('../../package');

const repoUrl = 'https://github.com/sindresorhus/eslint-plugin-unicorn';

module.exports = filename => {
	const ruleName = path.basename(filename, '.js');
	return `${repoUrl}/blob/v${pkg.version}/docs/rules/${ruleName}.md`;
};
