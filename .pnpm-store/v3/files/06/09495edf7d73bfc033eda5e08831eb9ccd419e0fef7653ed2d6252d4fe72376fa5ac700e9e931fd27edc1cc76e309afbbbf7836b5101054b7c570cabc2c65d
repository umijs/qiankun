const stylelint = require('stylelint');
const _ = require('lodash');
const postcss = require('postcss');
const postcssSorting = require('postcss-sorting');
const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');
const utils = require('../../utils');

const ruleName = utils.namespace('properties-alphabetical-order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(actual, options, context) {
	context = context || {};

	return function(root, result) {
		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual,
				possible: _.isBoolean,
			},
			{
				actual: options,
				possible: {
					disableFix: _.isBoolean,
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		const disableFix = _.get(options, ['disableFix'], false);

		if (context.fix && !disableFix) {
			postcssSorting({ 'properties-order': 'alphabetical' })(root);

			return;
		}

		const processedParents = [];

		root.walk(function processRulesAndAtrules(input) {
			const node = utils.getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `utils.getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (utils.isRuleWithNodes(node)) {
				checkNode(node, result);
			}
		});
	};
}

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;

function checkNode(node, result) {
	const allPropData = [];

	node.each(function processEveryNode(child) {
		if (child.type !== 'decl') {
			return;
		}

		const { prop } = child;

		if (!utils.isStandardSyntaxProperty(prop)) {
			return;
		}

		if (utils.isCustomProperty(prop)) {
			return;
		}

		let unprefixedPropName = postcss.vendor.unprefixed(prop);

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedPropName.indexOf('osx-') === 0) {
			unprefixedPropName = unprefixedPropName.slice(4);
		}

		const propData = {
			name: prop,
			unprefixedName: unprefixedPropName,
			index: allPropData.length,
			node: child,
		};

		const previousPropData = _.last(allPropData);

		allPropData.push(propData);

		// Skip first decl
		if (!previousPropData) {
			return;
		}

		const isCorrectOrder = checkAlphabeticalOrder(previousPropData, propData);

		if (isCorrectOrder) {
			return;
		}

		stylelint.utils.report({
			message: messages.expected(propData.name, previousPropData.name),
			node: child,
			result,
			ruleName,
		});
	});
}
