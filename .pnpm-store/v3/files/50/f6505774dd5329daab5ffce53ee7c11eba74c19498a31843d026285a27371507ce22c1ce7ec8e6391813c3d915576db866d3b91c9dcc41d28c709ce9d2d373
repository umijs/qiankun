const _ = require('lodash');
const getDescription = require('./getDescription');

module.exports = function createExpectedOrder(input) {
	const order = {};
	let expectedPosition = 0;

	input.forEach(item => {
		expectedPosition += 1;

		if ((_.isString(item) && item !== 'at-rules' && item !== 'rules') || item === 'less-mixins') {
			order[item] = {
				expectedPosition,
				description: getDescription(item),
			};
		}

		if (item === 'rules' || item.type === 'rule') {
			// Convert 'rules' into extended pattern
			if (item === 'rules') {
				item = {
					type: 'rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				expectedPosition,
				description: getDescription(item),
			};

			if (item.selector) {
				nodeData.selector = item.selector;

				if (_.isString(item.selector)) {
					nodeData.selector = new RegExp(item.selector);
				}
			}

			order[item.type].push(nodeData);
		}

		if (item === 'at-rules' || item.type === 'at-rule') {
			// Convert 'at-rules' into extended pattern
			if (item === 'at-rules') {
				item = {
					type: 'at-rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				expectedPosition,
				description: getDescription(item),
			};

			if (item.name) {
				nodeData.name = item.name;
			}

			if (item.parameter) {
				nodeData.parameter = item.parameter;

				if (_.isString(item.parameter)) {
					nodeData.parameter = new RegExp(item.parameter);
				}
			}

			if (!_.isUndefined(item.hasBlock)) {
				nodeData.hasBlock = item.hasBlock;
			}

			order[item.type].push(nodeData);
		}
	});

	return order;
};
