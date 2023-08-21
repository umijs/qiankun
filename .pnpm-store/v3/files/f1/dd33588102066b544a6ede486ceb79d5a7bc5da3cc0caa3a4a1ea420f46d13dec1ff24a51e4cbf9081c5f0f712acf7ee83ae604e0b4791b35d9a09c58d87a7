const stylelint = require('stylelint');
const postcss = require('postcss');
const postcssSorting = require('postcss-sorting');
const utils = require('../../utils');
const checkEmptyLineBefore = require('./checkEmptyLineBefore');
const checkOrder = require('./checkOrder');
const getNodeData = require('./getNodeData');
const createFlatOrder = require('./createFlatOrder');

module.exports = function checkNode(node, sharedInfo, originalNode) {
	// First, check order
	const allPropData = getAllPropData(node);
	const propsCount = node.nodes.filter(item => utils.isProperty(item)).length;

	if (!sharedInfo.isFixEnabled) {
		allPropData.forEach(checkEveryPropForOrder);
	}

	if (sharedInfo.isFixEnabled) {
		let shouldFixOrder = false;

		allPropData.forEach(function checkEveryPropForOrder2(propData, index) {
			// Skip first decl
			if (index === 0) {
				return;
			}

			// return early if we know there is a violation and auto fix should be applied
			if (shouldFixOrder) {
				return;
			}

			const previousPropData = allPropData[index - 1];

			const checkedOrder = checkOrder({
				firstPropData: previousPropData,
				secondPropData: propData,
				unspecified: sharedInfo.unspecified,
				allPropData: allPropData.slice(0, index),
			});

			if (!checkedOrder.isCorrect) {
				shouldFixOrder = true;
			}
		});

		if (shouldFixOrder) {
			const sortingOptions = {
				'properties-order': createFlatOrder(sharedInfo.expectation),
				'unspecified-properties-position':
					sharedInfo.unspecified === 'ignore' ? 'bottom' : sharedInfo.unspecified,
			};

			// creating PostCSS Root node with current node as a child,
			// so PostCSS Sorting can process it
			const tempRoot = postcss.root({ nodes: [originalNode] });

			postcssSorting(sortingOptions)(tempRoot);

			const allPropData2 = getAllPropData(node);

			allPropData2.forEach(checkEveryPropForOrder);
		}
	}

	// Second, check emptyLineBefore
	sharedInfo.lastKnownSeparatedGroup = 1;

	const allNodesData = node.nodes.map(function collectDataForEveryNode(child) {
		return getNodeData(child, sharedInfo.expectedOrder);
	});

	allNodesData.forEach(function checkEveryPropForEmptyLine(nodeData, index) {
		let previousNodeData = allNodesData[index - 1];

		// if previous node is shared-line comment, use second previous node
		if (
			previousNodeData &&
			previousNodeData.node.type === 'comment' &&
			previousNodeData.node.raw('before').indexOf('\n') === -1
		) {
			previousNodeData = allNodesData[index - 2];
		}

		// skip first decl
		if (!previousNodeData) {
			return;
		}

		// previous node should be a standard declaration
		if (!utils.isProperty(previousNodeData.node)) {
			return;
		}

		checkEmptyLineBefore(previousNodeData, nodeData, sharedInfo, propsCount);
	});

	function checkEveryPropForOrder(propData, index, listOfProps) {
		// Skip first decl
		if (index === 0) {
			return;
		}

		const previousPropData = listOfProps[index - 1];

		const checkedOrder = checkOrder({
			firstPropData: previousPropData,
			secondPropData: propData,
			unspecified: sharedInfo.unspecified,
			allPropData: listOfProps.slice(0, index),
		});

		if (!checkedOrder.isCorrect) {
			const { orderData } = checkedOrder.secondNode;

			stylelint.utils.report({
				message: sharedInfo.messages.expected(
					checkedOrder.secondNode.name,
					checkedOrder.firstNode.name,
					orderData && orderData.groupName
				),
				node: checkedOrder.secondNode.node,
				result: sharedInfo.result,
				ruleName: sharedInfo.ruleName,
			});
		}
	}

	function getAllPropData(inputNode) {
		return inputNode.nodes
			.filter(item => utils.isProperty(item))
			.map(item => getNodeData(item, sharedInfo.expectedOrder));
	}
};
