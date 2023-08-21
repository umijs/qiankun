'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const enforceNew = new Set([
	'Object',
	'Array',
	'ArrayBuffer',
	'DataView',
	'Date',
	'Error',
	'Float32Array',
	'Float64Array',
	'Function',
	'Int8Array',
	'Int16Array',
	'Int32Array',
	'Map',
	'WeakMap',
	'Set',
	'WeakSet',
	'Promise',
	'RegExp',
	'Uint8Array',
	'Uint16Array',
	'Uint32Array',
	'Uint8ClampedArray'
]);

const disallowNew = new Set([
	'Boolean',
	'Number',
	'String',
	'Symbol'
]);

const create = context => {
	return {
		CallExpression: node => {
			const {name} = node.callee;

			if (enforceNew.has(name)) {
				context.report({
					node,
					message: `Use \`new ${name}()\` instead of \`${name}()\`.`,
					fix: fixer => fixer.insertTextBefore(node, 'new ')
				});
			}
		},
		NewExpression: node => {
			const {name} = node.callee;

			if (disallowNew.has(name)) {
				context.report({
					node,
					message: `Use \`${name}()\` instead of \`new ${name}()\`.`,
					fix: fixer => fixer.removeRange([
						node.range[0],
						node.callee.range[0]
					])
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
