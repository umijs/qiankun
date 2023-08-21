const stylelint = require('stylelint');
const _ = require('lodash');

module.exports = function checkOrder(firstNodeData, secondNodeData, allNodesData, sharedInfo) {
	const firstNodeIsUnspecified = !firstNodeData.expectedPosition;
	const secondNodeIsUnspecified = !secondNodeData.expectedPosition;

	// If both nodes have their position
	if (!firstNodeIsUnspecified && !secondNodeIsUnspecified) {
		return firstNodeData.expectedPosition <= secondNodeData.expectedPosition;
	}

	if (firstNodeIsUnspecified && !secondNodeIsUnspecified) {
		// If first node is unspecified, look for a specified node before it to
		// compare to the current node
		const priorSpecifiedNodeData = _.findLast(allNodesData.slice(0, -1), d =>
			Boolean(d.expectedPosition)
		);

		if (
			priorSpecifiedNodeData &&
			priorSpecifiedNodeData.expectedPosition &&
			priorSpecifiedNodeData.expectedPosition > secondNodeData.expectedPosition
		) {
			if (sharedInfo.isFixEnabled) {
				sharedInfo.shouldFix = true;

				// Don't go further, fix will be applied
				return;
			}

			stylelint.utils.report({
				message: sharedInfo.messages.expected(
					secondNodeData.description,
					priorSpecifiedNodeData.description
				),
				node: secondNodeData.node,
				result: sharedInfo.result,
				ruleName: sharedInfo.ruleName,
			});

			return true; // avoid logging another warning
		}
	}

	if (firstNodeIsUnspecified && secondNodeIsUnspecified) {
		return true;
	}

	const { unspecified } = sharedInfo;

	if (unspecified === 'ignore' && (firstNodeIsUnspecified || secondNodeIsUnspecified)) {
		return true;
	}

	if (unspecified === 'top' && firstNodeIsUnspecified) {
		return true;
	}

	if (unspecified === 'top' && secondNodeIsUnspecified) {
		return false;
	}

	if (unspecified === 'bottom' && secondNodeIsUnspecified) {
		return true;
	}

	if (unspecified === 'bottom' && firstNodeIsUnspecified) {
		return false;
	}
};
