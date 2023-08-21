const stylelint = require('stylelint');
const _ = require('lodash');
const addEmptyLineBefore = require('./addEmptyLineBefore');
const hasEmptyLineBefore = require('./hasEmptyLineBefore');
const removeEmptyLinesBefore = require('./removeEmptyLinesBefore');

module.exports = function checkEmptyLineBefore(
	firstPropData,
	secondPropData,
	sharedInfo,
	propsCount
) {
	const firstPropIsUnspecified = !firstPropData.orderData;
	const secondPropIsUnspecified = !secondPropData.orderData;

	// Check newlines between groups
	const firstPropSeparatedGroup = !firstPropIsUnspecified
		? firstPropData.orderData.separatedGroup
		: sharedInfo.lastKnownSeparatedGroup;
	const secondPropSeparatedGroup = !secondPropIsUnspecified
		? secondPropData.orderData.separatedGroup
		: sharedInfo.lastKnownSeparatedGroup;

	sharedInfo.lastKnownSeparatedGroup = secondPropSeparatedGroup;

	const betweenGroupsInSpecified =
		firstPropSeparatedGroup !== secondPropSeparatedGroup && !secondPropIsUnspecified;
	const startOfUnspecifiedGroup = !firstPropIsUnspecified && secondPropIsUnspecified;

	// Line threshold logic
	const belowEmptyLineThreshold = propsCount < sharedInfo.emptyLineMinimumPropertyThreshold;

	if (betweenGroupsInSpecified || startOfUnspecifiedGroup) {
		// Get an array of just the property groups, remove any solo properties
		const groups = _.reject(sharedInfo.expectation, _.isString);

		const emptyLineBefore = !startOfUnspecifiedGroup
			? // secondProp seperatedGroups start at 2 so we minus 2 to get the
			  // 1st item from our groups array
			  _.get(groups[secondPropSeparatedGroup - 2], 'emptyLineBefore')
			: sharedInfo.emptyLineBeforeUnspecified;

		// Threshold logic
		const emptyLineThresholdInsertLines =
			!belowEmptyLineThreshold && emptyLineBefore === 'threshold';
		const emptyLineThresholdRemoveLines =
			belowEmptyLineThreshold && emptyLineBefore === 'threshold';

		if (
			!hasEmptyLineBefore(secondPropData.node) &&
			(emptyLineBefore === 'always' || emptyLineThresholdInsertLines)
		) {
			if (sharedInfo.isFixEnabled) {
				addEmptyLineBefore(secondPropData.node, sharedInfo.context.newline);
			} else {
				stylelint.utils.report({
					message: sharedInfo.messages.expectedEmptyLineBefore(secondPropData.name),
					node: secondPropData.node,
					result: sharedInfo.result,
					ruleName: sharedInfo.ruleName,
				});
			}
		} else if (
			hasEmptyLineBefore(secondPropData.node) &&
			(emptyLineBefore === 'never' || emptyLineThresholdRemoveLines)
		) {
			if (sharedInfo.isFixEnabled) {
				removeEmptyLinesBefore(secondPropData.node, sharedInfo.context.newline);
			} else {
				stylelint.utils.report({
					message: sharedInfo.messages.rejectedEmptyLineBefore(secondPropData.name),
					node: secondPropData.node,
					result: sharedInfo.result,
					ruleName: sharedInfo.ruleName,
				});
			}
		}
	}

	// Check newlines between properties inside a group
	if (
		!firstPropIsUnspecified &&
		!secondPropIsUnspecified &&
		firstPropData.orderData.groupPosition === secondPropData.orderData.groupPosition
	) {
		const noEmptyLineBefore = secondPropData.orderData.noEmptyLineBeforeInsideGroup;

		if (hasEmptyLineBefore(secondPropData.node) && noEmptyLineBefore) {
			if (sharedInfo.isFixEnabled) {
				removeEmptyLinesBefore(secondPropData.node, sharedInfo.context.newline);
			} else {
				stylelint.utils.report({
					message: sharedInfo.messages.rejectedEmptyLineBefore(secondPropData.name),
					node: secondPropData.node,
					result: sharedInfo.result,
					ruleName: sharedInfo.ruleName,
				});
			}
		}
	}
};
