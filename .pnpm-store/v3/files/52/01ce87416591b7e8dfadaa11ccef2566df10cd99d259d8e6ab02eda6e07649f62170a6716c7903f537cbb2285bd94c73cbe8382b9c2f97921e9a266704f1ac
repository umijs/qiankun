const postcss = require('postcss');

module.exports = function checkAlphabeticalOrder(firstPropData, secondPropData) {
	// If unprefixed prop names are the same, compare the prefixed versions
	if (firstPropData.unprefixedName === secondPropData.unprefixedName) {
		// If first property has no prefix and second property has prefix
		if (
			!postcss.vendor.prefix(firstPropData.name).length &&
			postcss.vendor.prefix(secondPropData.name).length
		) {
			return false;
		}

		return true;
	}

	return firstPropData.unprefixedName < secondPropData.unprefixedName;
};
