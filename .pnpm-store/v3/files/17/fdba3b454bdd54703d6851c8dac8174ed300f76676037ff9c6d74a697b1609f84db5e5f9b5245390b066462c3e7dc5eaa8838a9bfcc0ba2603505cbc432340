const postcss = require('postcss');
const _ = require('lodash');
const checkAlphabeticalOrder = require('../checkAlphabeticalOrder');

module.exports = function checkOrder({ firstPropData, secondPropData, allPropData, unspecified }) {
	function report(result, firstNode = firstPropData, secondNode = secondPropData) {
		return {
			result,
			firstNode,
			secondNode,
		};
	}

	if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
		// If first property has no prefix and second property has prefix
		if (
			!postcss.vendor.prefix(firstPropData.name).length &&
			postcss.vendor.prefix(secondPropData.name).length
		) {
			return report(false);
		}

		return report(true);
	}

	const firstPropIsUnspecified = !firstPropData.orderData;
	const secondPropIsUnspecified = !secondPropData.orderData;

	// Check actual known properties
	if (!firstPropIsUnspecified && !secondPropIsUnspecified) {
		return report(
			firstPropData.orderData.expectedPosition <= secondPropData.orderData.expectedPosition
		);
	}

	if (firstPropIsUnspecified && !secondPropIsUnspecified) {
		// If first prop is unspecified, look for a specified prop before it to
		// compare to the current prop
		const priorSpecifiedPropData = _.findLast(allPropData.slice(0, -1), d => Boolean(d.orderData));

		if (
			priorSpecifiedPropData &&
			priorSpecifiedPropData.orderData &&
			priorSpecifiedPropData.orderData.expectedPosition > secondPropData.orderData.expectedPosition
		) {
			return report(false, priorSpecifiedPropData, secondPropData);
		}
	}

	// Now deal with unspecified props
	// Starting with bottomAlphabetical as it requires more specific conditionals
	if (unspecified === 'bottomAlphabetical' && !firstPropIsUnspecified && secondPropIsUnspecified) {
		return report(true);
	}

	if (unspecified === 'bottomAlphabetical' && firstPropIsUnspecified && secondPropIsUnspecified) {
		if (checkAlphabeticalOrder(firstPropData, secondPropData)) {
			return report(true);
		}

		return report(false);
	}

	if (unspecified === 'bottomAlphabetical' && firstPropIsUnspecified) {
		return report(false);
	}

	if (firstPropIsUnspecified && secondPropIsUnspecified) {
		return report(true);
	}

	if (unspecified === 'ignore' && (firstPropIsUnspecified || secondPropIsUnspecified)) {
		return report(true);
	}

	if (unspecified === 'top' && firstPropIsUnspecified) {
		return report(true);
	}

	if (unspecified === 'top' && secondPropIsUnspecified) {
		return report(false);
	}

	if (unspecified === 'bottom' && secondPropIsUnspecified) {
		return report(true);
	}

	if (unspecified === 'bottom' && firstPropIsUnspecified) {
		return report(false);
	}
};
