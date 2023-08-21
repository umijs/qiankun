const postcss = require('postcss');
const utils = require('../../utils');

module.exports = function getNodeData(node, expectedOrder) {
	const nodeData = {
		node,
	};

	if (utils.isProperty(node)) {
		const { prop } = node;
		let unprefixedPropName = postcss.vendor.unprefixed(prop);

		// Hack to allow -moz-osx-font-smoothing to be understood
		// just like -webkit-font-smoothing
		if (unprefixedPropName.indexOf('osx-') === 0) {
			unprefixedPropName = unprefixedPropName.slice(4);
		}

		nodeData.name = prop;
		nodeData.unprefixedName = unprefixedPropName;
		nodeData.orderData = expectedOrder[unprefixedPropName];
	}

	return nodeData;
};
