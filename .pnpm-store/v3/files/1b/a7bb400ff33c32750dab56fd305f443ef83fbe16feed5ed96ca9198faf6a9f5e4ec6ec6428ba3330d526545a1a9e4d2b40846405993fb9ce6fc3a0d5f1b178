'use strict';
const path = require('path');
const importModules = require('import-modules');

module.exports = {
	rules: importModules(path.resolve(__dirname, 'rules'), {camelize: false}),
	configs: {
		recommended: {
			env: {
				es6: true
			},
			parserOptions: {
				ecmaVersion: 2019,
				sourceType: 'module'
			},
			plugins: [
				'unicorn'
			],
			rules: {
				'unicorn/catch-error-name': 'error',
				'unicorn/custom-error-definition': 'off',
				'unicorn/error-message': 'error',
				'unicorn/escape-case': 'error',
				'unicorn/explicit-length-check': 'error',
				'unicorn/filename-case': 'error',
				'unicorn/import-index': 'error',
				'unicorn/new-for-builtins': 'error',
				'unicorn/no-abusive-eslint-disable': 'error',
				'unicorn/no-array-instanceof': 'error',
				'unicorn/no-console-spaces': 'error',
				'unicorn/no-fn-reference-in-iterator': 'off',
				'unicorn/no-for-loop': 'error',
				'unicorn/no-hex-escape': 'error',
				'unicorn/no-new-buffer': 'error',
				'unicorn/no-process-exit': 'error',
				'unicorn/no-unreadable-array-destructuring': 'error',
				'unicorn/no-unsafe-regex': 'off',
				'unicorn/no-unused-properties': 'off',
				'unicorn/no-zero-fractions': 'error',
				'unicorn/number-literal-case': 'error',
				'unicorn/prefer-add-event-listener': 'error',
				'unicorn/prefer-exponentiation-operator': 'error',
				'unicorn/prefer-includes': 'error',
				'unicorn/prefer-node-append': 'error',
				'unicorn/prefer-node-remove': 'error',
				'unicorn/prefer-query-selector': 'error',
				'unicorn/prefer-spread': 'error',
				'unicorn/prefer-starts-ends-with': 'error',
				'unicorn/prefer-text-content': 'error',
				'unicorn/prefer-type-error': 'error',
				'unicorn/prevent-abbreviations': 'error',
				'unicorn/regex-shorthand': 'error',
				'unicorn/throw-new-error': 'error'
			}
		}
	}
};
