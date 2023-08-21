'use strict';
const getDocsUrl = require('./utils/get-docs-url');

const forbiddenIdentifierNames = new Map([
	['getElementById', 'querySelector'],
	['getElementsByClassName', 'querySelectorAll'],
	['getElementsByTagName', 'querySelectorAll']
]);

const getReplacementForId = value => `#${value}`;
const getReplacementForClass = value => value.match(/\S+/g).map(e => `.${e}`).join('');
const getQuotedReplacement = (node, value) => {
	const leftQuote = node.raw.charAt(0);
	const rightQuote = node.raw.charAt(node.raw.length - 1);
	return `${leftQuote}${value}${rightQuote}`;
};

const getLiteralFix = (fixer, node, identifierName) => {
	let replacement = node.raw;
	if (identifierName === 'getElementById') {
		replacement = getQuotedReplacement(node, getReplacementForId(node.value));
	}

	if (identifierName === 'getElementsByClassName') {
		replacement = getQuotedReplacement(node, getReplacementForClass(node.value));
	}

	return [fixer.replaceText(node, replacement)];
};

const getTemplateLiteralFix = (fixer, node, identifierName) => {
	const fix = [fixer.insertTextAfter(node, '`'), fixer.insertTextBefore(node, '`')];

	node.quasis.forEach(templateElement => {
		if (identifierName === 'getElementById') {
			fix.push(fixer.replaceText(templateElement, getReplacementForId(templateElement.value.cooked)));
		}

		if (identifierName === 'getElementsByClassName') {
			fix.push(fixer.replaceText(templateElement, getReplacementForClass(templateElement.value.cooked)));
		}
	});

	return fix;
};

const canBeFixed = node => {
	if (node.type === 'Literal') {
		return node.value === null || Boolean(node.value.trim());
	}

	if (node.type === 'TemplateLiteral') {
		return node.expressions.length === 0 &&
			node.quasis.some(templateElement => templateElement.value.cooked.trim());
	}

	return false;
};

const hasValue = node => {
	if (node.type === 'Literal') {
		return node.value;
	}

	return true;
};

const fix = (node, identifierName, preferedSelector) => {
	const nodeToBeFixed = node.arguments[0];
	if (identifierName === 'getElementsByTagName' || !hasValue(nodeToBeFixed)) {
		return fixer => fixer.replaceText(node.callee.property, preferedSelector);
	}

	const getArgumentFix = nodeToBeFixed.type === 'Literal' ? getLiteralFix : getTemplateLiteralFix;
	return fixer => [
		...getArgumentFix(fixer, nodeToBeFixed, identifierName),
		fixer.replaceText(node.callee.property, preferedSelector)
	];
};

const create = context => {
	return {
		CallExpression(node) {
			const {callee: {property, type}} = node;
			if (!property || type !== 'MemberExpression') {
				return;
			}

			const identifierName = property.name;
			const preferedSelector = forbiddenIdentifierNames.get(identifierName);
			if (!preferedSelector) {
				return;
			}

			const report = {
				node,
				message: `Prefer \`${preferedSelector}\` over \`${identifierName}\`.`
			};

			if (canBeFixed(node.arguments[0])) {
				report.fix = fix(node, identifierName, preferedSelector);
			}

			context.report(report);
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
